import React from 'react';
import cx from 'classnames';
import { useI18n } from 'next-localization';
import Link from 'next/link';

import styles from './styles.module.scss';
import BreadcrumbsGSD from '../BreadcrumbsGSD';
import { getPageUrl } from '../../services/contentServices';

const allowedTypes = ['location', 'location-type'];

const NavigationBreadcrumbs = (props) => {
  const {
    goToPage,
    pageType,
    location,
    locations,
  } = props;

  const { t, locale } = useI18n();
  const crumbs = [];

  if (!allowedTypes.includes(pageType)) {
    return null;
  }
  const composeBreadcrumbs = (items, target) => {
    if (!Array.isArray(items) || !target) {
      return crumbs;
    }
    return items.some((item) => {
      if (item.id === target.id) {
        crumbs.push(item);
        return true;
      }
      if (Array.isArray(item.children) && item.children.length) {
        const targetInside = composeBreadcrumbs(item.children, target);

        if (targetInside) {
          crumbs.push(item);
          return true;
        }
      }
      return false;
    });
  };
  composeBreadcrumbs(locations, location);

  if (crumbs.length === 0) {
    return null;
  }
  const rootClasses = cx('container', styles.navigationBreadcrumbs);
  const data = [
    {
      url: getPageUrl('activities', locale()),
      title: t('search.navigationBreadcrumbs.root'),
    },
    ...crumbs.reverse().map((item) => ({
      url: goToPage(item, pageType),
      title: item.title,
    })),
  ];

  return (
    <>
      <BreadcrumbsGSD items={data} />

      <div className={rootClasses}>
        {data.map((item, index) => {
          const isLastItem = data.length === index + 1;

          return (
            <span key={item.url} className={styles.navBreadcrumbItem}>
              {isLastItem ? item.title : (
                <Link href={item.url} scroll={false}>
                  <a>{item.title}</a>
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </>
  );
};

export default NavigationBreadcrumbs;
