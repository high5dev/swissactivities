import React from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import StaticImage from "../Image";
import styles from "./styles.module.scss";

const RatingLine = ({ rating }) => {
  const { t, locale } = useI18n();

  if (!rating || (rating && rating.num_ratings < 1)) {
    return null;
  }

  return (
    <div className={styles.rating}>
      <div>
        <div className={styles.ratingLine}>
          <StaticImage
            src="/assets/stars.png"
            width={100}
            height={23}
            alt="review"
          />
          <span className={styles.ratingGrayLine}></span>
          <span
            style={{ width: `${(rating.average_rating / 5) * 100}%` }}
            className={styles.ratingYellowLine}
          ></span>
        </div>
        <span>
          {Number(rating.average_rating).toFixed(1)} (
          {rating.num_ratings})
        </span>
      </div>
    </div>
  );
};

export default RatingLine;
