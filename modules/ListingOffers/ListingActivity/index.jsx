import React from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import Link from "next/link";
import Button from "../../../modules/Button";
import { formatLocaleForUrl, defaultLocale } from "../../../lib/i18n";
import StaticImage from "../../Image";
import moment from "moment";
import styles from "./styles.module.scss";

import {BiHeart} from "react-icons/bi";

const ListingActivityComponent = ({ activity, className, titleColors, isOffscreen="false" }) => {
  const { t, locale } = useI18n();

  // const customizeStyle = () => {
  //   if (
  //     activity.teaser_image.width >
  //     (activity.teaser_image.height * 251) / 165
  //   ) {
  //     return { height: "100%", width: "auto", maxWidth: "none" };
  //   }
  //
  //   return {
  //     height: "auto",
  //     width: "100%",
  //     maxWidth: "none",
  //     maxHeight: "none"
  //   };
  // };

  const detailsHref = activity.url ||
    (defaultLocale === locale()
      ? `/${activity.info?.slug}/`
      : `/${formatLocaleForUrl(locale())}/${activity.info?.slug}/`);

  const bookingDate = new Date(activity.bookDate);

  return (
    <Link href={detailsHref}>
      <div className={classnames(styles.activityContainer, className)}>
          <div className={styles.activityItemHeaderWrap}>
              <BiHeart className={styles.like} size={30}/>
              <div className={styles.activityItemHeader}>
                      <a className={styles.activityImage}>
                          {activity.teaser_image && <StaticImage
                              src={activity.teaser_image.url || activity.teaser_image}
                              // style={customizeStyle()}
                              alt={
                                  activity.teaser_image.caption ||
                                  activity.teaser_image.alternativeText ||
                                  activity.teaser_image_alt_text ||
                                  "alt-Text"
                              }
                              width={470}
                              height={400}
                              layout="responsive"
                              quality={60}
                              priority={!isOffscreen}
                          />}
                      </a>
                  <div className={styles.activityType}>
                    {activity.type && (
                      <button
                        style={{ backgroundColor: titleColors[activity.type.title] }}
                        className={styles.tag}
                      >
                        {activity.type.title || activity.type.value}
                      </button>
                    )}
                  </div>
              </div>
          </div>
        <div className={styles.activityDetail}>
          <div className={styles.activityTitle}>{activity.info?.title}</div>

          <div className={styles.activityFooter}>
                  <a className={styles.bookDate}>
                      <StaticImage
                          src={`/assets/activity/clock.svg`}
                          alt={"book"}
                          width={26}
                          height={26}
                          layout="fixed"
                      />
                      <Button
                          title={
                              activity.bookDate
                                  ? t("pages.listing.booknow", {
                                      date: moment(bookingDate).format("DD.MM.YYYY")
                                  })
                                  : t("activity.booknow")
                          }
                          customStyle={styles.bookNow}
                      />
                  </a>
              {activity.rating && activity.rating.num_ratings > 4 && <div className={styles.rating}>
                  <div>
                      <div className={styles.ratingLine}>
                          <StaticImage src="/assets/stars.png" width={100} height={23} alt="review"/>
                          <span className={styles.ratingGrayLine}></span>
                          <span style={{width: `${(activity.rating.average_rating/5) * 100}%`}} className={styles.ratingYellowLine}></span>
                      </div>
                      <span>{Number(activity.rating.average_rating).toFixed(1)} ({activity.rating.num_ratings})</span>
                  </div>
              </div>}

              {activity.price && (
                  <div className={styles.rightBlock}>
                      <span className={styles.from}>{t('search.card.from')}</span>
                      <span className={styles.currency}>
                        {activity.price ? activity.price.currency : "N/A"}{' '}{activity.price ? Number(activity.price.amount) : ""}
                      </span>
                      <span className={styles.person}>{t('search.card.person')}</span>
                  </div>
              )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingActivityComponent;
