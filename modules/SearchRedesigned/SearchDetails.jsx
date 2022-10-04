import React, {useState, useEffect} from 'react';
import { useI18n } from "next-localization";
import CategoryDetails from '../Search/CategoryDetails';
import SubTitle from '../Search/SubTitle';
import useIsMobile from '../../hooks/useIsMobile.hook';
import styles from './styles.module.scss';
const defaultImage = '/assets/search/freizeitaktivitaeten.webp';
import HeadFilterSection from "../ListingWrapper/HeadFilterSection";

const SearchDetails = ({ category }) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [categoryPrev, setCategoryPrev] = useState(null);

  useEffect(() => {
    let timer = setTimeout(() => setCategoryPrev(category), 500)

    return () => {
      clearTimeout(timer)
    }
  }, [category])

  if (isMobile) {
    return null;
  }
  let suffix = [];
  let type = null;
  let location = null;
  let activitiesAmount;
  let title = t('menu.switzerland');
  let image = defaultImage;

  if (category) {
    activitiesAmount = category?.numActivities;

    if (category.type === 'type') {
      type = {
        url: category.url,
        title: category.title,
        parent: category.parent,
        related: category.related,
        teaser_image: category.teaser_image,
        description: category.description[0],
      };
    } else if (category.type === 'location') {
      location = {
        url: category.url,
        title: category.title,
        parent: category.parent,
        related: category.related,
        teaser_image: category.teaser_image,
        description: category.description[0],
      };
    } else if (category.type === 'location_type') {
      type = {
        url: category.nested.type.url,
        title: category.nested.type.title,
        parent: category.nested.type.parent,
        related: category.nested.type.related,
        teaser_image: category.nested.type.teaser_image,
        description: category.description[1],
      };
      location = {
        url: category.nested.location.url,
        title: category.nested.location.title,
        parent: category.parent,
        related: category.related,
        teaser_image: category.nested.location.teaser_image,
        description: category.description[0],
      };
    }
  }
  if (location) {
    title = location.title;
    image = location.teaser_image;
    suffix.push(`${location.parent ? 'Child' : 'Parent'}Location`);
  }
  if (type) {
    title = type.title;
    image = type.teaser_image;
    suffix.push(`${type.parent ? 'Child' : 'Parent'}Type`);
  }
  if (location && type) {
    title = `${type.title} | ${location.title}`;
  }
  const locationTitle = location ? location.title : t('menu.switzerland');
  const params = {
    locationTitle,
    typeTitle: type ? type.title : '',
  };
  let description = t(`page.activities.description${suffix.join('')}`, params);

  return (
    <div className={styles.mainWrap}>
      <HeadFilterSection className={!category ? " " : category === categoryPrev ? 'slideIn' : 'slideOut'} alt={title} image={image || defaultImage}>
        <CategoryDetails
            title={title}
            image={image || defaultImage}
            subTitle={
              <SubTitle
                  type={type}
                  location={location}
                  description={description}
                  activitiesAmount={activitiesAmount}
              />
            }
        />
      </HeadFilterSection>
    </div>
  );
};

export default SearchDetails;
