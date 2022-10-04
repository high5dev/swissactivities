import { useState, useEffect } from 'react';
import { connectHits } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';
import { useI18n } from 'next-localization';
import StaticImage from "../Image";
import styles from './source.module.scss';

const initialState = {
	locations: [],
	types: [],
	location_types: [],
}

const FilterRedesigned = (props) => {
	const {
		hits,
		onClick,
		limit = 10,
		searchValue,
		currentRefinement,
	} = props;

	const { t } = useI18n();
	const [{ locations, types, location_types }, setData] = useState(initialState);

	useEffect(() => {
		let locations = hits.filter(hit => hit.type === 'location').slice(0, limit);
		let types = hits.filter(hit => hit.type === 'type').slice(0, limit);
		const location_types = hits.filter(hit => hit.type === 'location_type').slice(0, limit);

		if (currentRefinement.length) {
			const locationActivitiesCount = locations?.reduce((acc, nextValue) => acc + nextValue.numActivities, 0);
			const typeActivitiesCount = types?.reduce((acc, nextValue) => acc + nextValue.numActivities, 0);

			if (locationActivitiesCount < typeActivitiesCount) {
				locations = [];
			} else if (typeActivitiesCount < locationActivitiesCount) {
				types = [];
			}
		}
		setData({locations, types, location_types});
	}, [hits, setData]);

	return (
		<div className={styles.container}>

			<div className={styles.content}>
				{locations.map((location) => (
					<Item key={location.objectID} prop={location} handler={onClick} />
				))}

				{types.map((type) => (
					<Item key={type.objectID} prop={type} handler={onClick} />
				))}

				{location_types.map((location_type) => (
					<Item key={location_type.objectID} prop={location_type} handler={onClick} />
				))}
			</div>
			<h2 className={styles.footer}>
				<span>{t('category.searchFor')}</span>
				<span className={styles.searchResult}>{searchValue}</span>
			</h2>
		</div>
	)
};

const Item = ({ prop, handler }) => {
	const source = prop.icon_name
		? `/assets/icons/${prop?.icon_name}.svg`
		: '/assets/activities/map-pin-black.svg';

	return (
		<div className={styles.item} onClick={() => handler(prop)}>
			<div className={styles.image}>
				<StaticImage
					src={source}
					width={30}
					height={30}
					layout="fixed"
					alt="location"
				/>
			</div>
			<Highlight hit={prop} attribute="title"/>
			<div>{prop.numActivities}</div>
		</div>
	);
};

export default connectHits(FilterRedesigned);
