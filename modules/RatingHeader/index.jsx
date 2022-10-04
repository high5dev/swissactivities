import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import { BsHeart, BsHeartFill, BsBoxArrowUp } from "react-icons/bs";

import RatingLine from "../RatingLine";
import ShareButtons from "./ShareButtons";
import ControlButtons from "./ControlButtons";
// import Weather from "./Weather";
import styles from "./styles.module.scss";

// const favoriteLocalstorageKey = "savedActivities";
const RatingHeader = ({
  itemId,
  title,
  rating,
  shareUrl,
  provided,
  favoriteLocalstorageKey,
  itemToSave,
  className
}) => {
  const { t, locale } = useI18n();

  return (
    <div className={classnames(styles.mainHeaderContainer, className)}>
      <div className={styles.sectionTitle}>
        <h1>{title}</h1>
      </div>
      <div className={styles.bottom}>
        <div className={styles.sectionSubTitle}>
          {rating && <RatingLine rating={rating} />}
          {provided && (
            <span>
              {t("activity.providedBy")}: {provided}
            </span>
          )}
        </div>

        <ControlButtons
          title={title}
          itemToSave={itemToSave}
          favoriteLocalstorageKey={favoriteLocalstorageKey}
          className={styles.controlWrapper}
          shareUrl={shareUrl}
        />
      </div>
    </div>
  );
};

export default RatingHeader;
