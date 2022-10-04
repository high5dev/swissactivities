import React from "react";
import classnames from "classnames";
import Link from "next/link";
import { useI18n } from "next-localization";
import { FiPlus, FiMinus } from "react-icons/fi";
import RatingLine from "../RatingLine";
import Icon from "../Icon";
import Image from "../Image";
import Button from "../Button";
import MobileDetails from "../Activity/content/OfferCardDetailsMobile";

import styles from "./styles.module.scss";

const OfferCard = props => {
  const { t, locale } = useI18n();
  const { activity, isActive, onDetails, startingDate, className } = props;

  const handleDetailsClick = e => {
    e.preventDefault();
    if (!isActive) {
      return onDetails(activity);
    }
    onDetails(null);
  };

  const getDurationValue = () => {
    const durations = activity?.summary?.durations;
    if (durations && durations.length) {
      if (durations.length === 1) {
        return durations[0] === "all-day" ? durations[0] : durations[0]+'h';
      }

      const sortedDurations = durations.sort((a, b) => a - b);
      const maxDuration = sortedDurations[sortedDurations.length - 1];
      return `${sortedDurations[0]}h - ${maxDuration}${
        maxDuration === "all-day" ? "" : "h"
      }`;
    }
  };

  const getPopularity = () => {
    const popularity = activity?.summary?.popularity;
    if (!popularity || popularity < 5) {
      return null;
    }

    if (popularity < 20) {
      return 20;
    }

    if (popularity < 50) {
      return 50;
    }

    if (popularity < 100) {
      return 100;
    }

    return 200;
  };

  const popularityUSP = getPopularity();
  const startingPrice = activity?.summary?.startingPrice;
  return (
    <div className={classnames(styles.OfferCard, className)}>
      <div className={styles.preview}>
        <Image
          alt={
            activity.teaser_image.caption ||
            activity.teaser_image.alternativeText ||
            activity.teaser_image_alt_text ||
            "offer"
          }
          src={activity.teaser_image.url}
          layout="responsive"
          height={100}
          width={320}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.activityType}>
          {activity.type && (
            <button
              style={{ backgroundColor: activity.type.color }}
              className={styles.tag}
            >
              {activity.type.title || activity.type.value}
            </button>
          )}
        </div>
        <p className={styles.title}>{activity.info.title}</p>
        <RatingLine rating={activity.rating} />
        <ul className={styles.usps}>
          <li className={styles.usp}>
            <Image
              src="/assets/icons/free_cancellation.svg"
              width="20"
              height="20"
              layout="fixed"
            />
            <span className={styles.uspText}>
              {t("offerCard.duration")}: {getDurationValue()}{" "}
            </span>
          </li>
          {popularityUSP && (
            <li className={styles.usp}>
              <Image
                src="/assets/icons/handshake.svg"
                width="20"
                height="20"
                layout="fixed"
              />
              <span className={styles.uspText}>
                {t("offerCard.booked")}: {popularityUSP} {t("offerCard.people")}
              </span>
            </li>
          )}
        </ul>
        <div className={styles.row}>
          {startingPrice && (
            <p className={styles.price}>
              <p className={styles.priceTitle}>{t("offerCard.price")}</p>
              <p className={styles.priceValue}>{startingPrice?.formatted}</p>
            </p>
          )}
          <Link href={activity.urls[locale()]}>
            <Button
              title={t("offerCard.bookNow")}
              onClick={() => {}}
              customStyle={styles.bookNow}
            />
          </Link>
        </div>
      </div>
      <div
        className={classnames(styles.detailsFooter, {
          [styles.activeFooter]: isActive
        })}
      >
        {isActive && <MobileDetails details={activity} startingDate={startingDate}/>}
        <div onClick={handleDetailsClick} className={styles.detailsControll}>
          {!isActive ? (
            <span className={styles.detailsTitle}>
              <span>{t("offerCard.moreDetails")}</span>
              <span>
                <Icon
                  icon={<FiPlus />}
                  className={styles.detailsIcon}
                  color="#002F49"
                />
              </span>
            </span>
          ) : (
            <span className={styles.detailsTitle}>
              <span>{t("offerCard.lessDetails")}</span>
              <span>
                <Icon
                  icon={<FiMinus />}
                  className={styles.detailsIcon}
                  color="#002F49"
                />
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
