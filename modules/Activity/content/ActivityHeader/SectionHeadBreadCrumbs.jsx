import React, { useMemo, useEffect } from "react";
import Link from "next/link";
import types from "prop-types";
import {useI18n} from "next-localization";
import styles from "./styles.module.scss";
import BreadcrumbsGSD from '../../../BreadcrumbsGSD';
import { getPageUrl } from "../../../../services/contentServices";

const SectionHeadBreadCrumbs = ({ breadcrumbs, isMobile }) => {
  const { t, locale } = useI18n();
  const currentLocale = locale();
  const data = useMemo(() => ([
    {
      title: t('menu.switzerland'),
      url: getPageUrl('activities', currentLocale),
    },
    ...breadcrumbs.map((b) => ({
      title: b.title,
      url: b.urls[currentLocale],
    })),
  ]), [breadcrumbs, currentLocale, t]);

  useEffect(() => {
    const sLeft = document.getElementById('breadcrumb')
    sLeft.scrollLeft = 1000;
  }, [])

  return (
    <>
      <BreadcrumbsGSD items={data} />
      <div id={'breadcrumb'} className={styles.breadcrumb + ' breadcrumb'}>
          {data.map((item, index) => (
              <Link key={item.url} href={item.url}>
                <a className="text">{item.title} <span className="unicode-arrrow">{'\u203A'}</span></a>
              </Link>
          ))}
      </div>
    </>
  );
};
SectionHeadBreadCrumbs.propTypes = {
  breadcrumbs: types.arrayOf(
    types.shape({
      title: types.string.isRequired,
      urls: types.objectOf(
        types.string.isRequired,
      ),
    }),
  ).isRequired,
};

export default SectionHeadBreadCrumbs;
