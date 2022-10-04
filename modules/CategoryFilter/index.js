import { useState, useEffect } from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import Checkbox from "../Checkbox";
import styles from './styles.module.scss'
import { CategoriesService } from "../../utils";

const CategoryFilter = connectRefinementList((props) => {
	const {
		items,
		refine,
		header,
		labels,
		isMobile,
		attribute,
		openedCategory,
		refinementHandler,
		currentRefinement,
		defaultRefinement,
		handleOpenCategory,
	} = props;

	const [itemsFiltered, setItemsFiltered] = useState([]);
	const [open, setOpen] = useState(false);

	const refineHandler = (value) => {
		refine(value)

		if (typeof refinementHandler === 'function') {
			refinementHandler(prevState => ({...prevState, [attribute]: value}))
		}
	}

	const handleExpand = () => {
		if (!open) {
			setOpen(true)
			handleOpenCategory(header)
		} else {
			setOpen(false)
			handleOpenCategory('')
		}
	}

	useEffect(() => {
		if (openedCategory !== header) {
			setOpen(false)
		}
	}, [openedCategory])

	useEffect(() => {
		setItemsFiltered(
			labels
				? items.filter(item => labels[header].indexOf(item.label) >= 0)
				: items
		)
	}, [items])

	useEffect(() => {
		if (currentRefinement !== defaultRefinement) {
			refine('');
		}
	}, [defaultRefinement])

	if (!itemsFiltered.length) {
		return '';
	}
	return (
		<div className={styles.container}>
			<div className={styles.title} onClick={handleExpand}>
				<h1>{header}</h1>
			</div>
			<div className={styles.actions}>
				{itemsFiltered.map((item) => (
					<Checkbox
						key={item.value}
						label={item.label}
						onAction={() => refineHandler(item.value)}
						currentRefinement={currentRefinement}
					/>
				))}
			</div>
		</div>
	)
})

export const Categories = ({ algolia, refinementHandler, currentRefinement, openedCategory, handleOpenCategory, isMobile, isMapOpen }) => {
	const [labels, setLabels] = useState({});
	useEffect(() => {
		setLabels(
			CategoriesService.getLabels(algolia.activityAttributes)
		)
	}, [])

	if (!Object.keys(labels).length) {
		return '';
	}
	return (
		<>
			{Object.keys(labels).map((item) => (
				<CategoryFilter
					key={item}
					attribute="labels"
					showMore
					showMoreLimit={50}
					header={item}
					defaultRefinement={currentRefinement.labels}
					{...{labels, refinementHandler, openedCategory, handleOpenCategory, isMobile, isMapOpen}}
				/>
      ))}
		</>
	)
}

export default CategoryFilter;
// Algolia needs virtual components to keep refinements on dismount
export const VirtualCategoryFilter = connectRefinementList(() => null)
