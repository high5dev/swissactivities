import React, { useState, useEffect, useCallback, useMemo } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import Link from "next/link";
import ReactGallery from "react-image-gallery";

import Image from "../../Image";

import styles from "./styles.module.scss";

const Article = ({ article }) => {
  const { t, locale } = useI18n();

  return (
    <Link href={article.urls[locale()]}>
      <div key={article.id} className={styles.article}>
        <div className={styles.preview}>
          {article.teaser_image && (
            <Image
              src={article.teaser_image.url}
              alt={article.teaser_image.alternativeText}
              width="300px"
              height="120px"
            />
          )}
        </div>
        <div className={styles.articleDescription}>
          <p className={styles.title}>{article.info.title}</p>
          <p className={styles.activities}>
            {article.activities.length} {t("pages.listing.activities")}
          </p>
        </div>
      </div>
    </Link>
  );
};

const RelatedArticles = ({ articles, isMobile }) => {
  const { t, locale } = useI18n();

  return (
    <div className={styles.relatedSection}>
      <div className="container-new column">
        <h2 className={styles.sectionTitle}>{t("pages.listing.related")}</h2>
        <div className={styles.relatedContainer}>
          {isMobile ? (
            <ReactGallery
              items={articles}
              useBrowserFullscreen={false}
              showPlayButton={false}
              showThumbnails={false}
              showFullscreenButton={false}
              dynamicHeight={true}
              renderItem={(article) => (
                <Article key={article.id} article={article} />
              )}
            />
          ) : (
            articles.map((article) => (
              <Article key={article.id} article={article} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedArticles;
