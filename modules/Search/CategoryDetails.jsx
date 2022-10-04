/* eslint-disable */
//TODO

import React from 'react';
import cx from 'classnames';
import gfm from "remark-gfm";
import StaticImage from "../Image";
import MobileCollapsableWrapper from "../MobileCollapsableWrapper";
import styles from './styles.module.scss';
import ReactMarkdown from "react-markdown";
import { useI18n } from "next-localization";

const CategoryDetails = (props) => {
  const {
    image,
    title,
    rootRef,
    subTitle,
    className,
    pageNum = 1,
  } = props;

  const { t } = useI18n();
  const rootClasses = cx(
    'container',
    'background-container',
    styles.categoryDetails,
    className,
  );
  return (
    <div className={rootClasses}>
      <div className={styles.background}>
        <StaticImage
          priority
          alt={title}
          src={image}
          width={569}
          height={340}
          quality={40}
          layout="responsive"
        />
      </div>
      <div className={styles.headerDetail} ref={rootRef}>
        <h1 className={styles.sectionTitle}>
          {title}
          {pageNum !== 1 ? ` - ${t('search.pageNum', { num: pageNum })}` : ""}
        </h1>
        {pageNum === 1 && (
          <div className={styles.sectionSubTitle}>
          <MobileCollapsableWrapper buttonClassName={styles.viewMoreButton}>
            {subTitle}
          </MobileCollapsableWrapper>
          </div>
        )}
        {pageNum === 1 && (
          <div className={styles.support}>
            <ReactMarkdown
              plugins={[gfm]}
              children={t("search.support")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;
