import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";

import StaticImage from "../Image";
import Loading from "../Loading";

import styles from "./styles.module.scss";

const BookingInfoCard = ({ activity, reservation, reservationTime }) => {
  const { t, locale } = useI18n();
  const [activityText, setActivityText] = useState({});

  const findByLocale = element => {
    return element.locale === locale();
  };

  useEffect(() => {
    if(activity) {
      const activityTranslation =
      activity && activity.translations.find(findByLocale);
      const activityLocationT =
      activity && activity.location.translations.find(findByLocale);
      const activityTypeT =
      activity && activity.type.translations.find(findByLocale);

      const activityTitle =
      (activityTranslation && activityTranslation.info.title) ||
      activity.info.title;
      const activityRegion =
      (activityLocationT && activityLocationT.title) || activity.location.title;
      const activityCategory =
      (activityTypeT && activityTypeT.title) || activity.type.title;

      setActivityText({
        title: activityTitle,
        region: activityRegion,
        category: activityCategory
      });
    }
  }, [activity]);

  const ticketsDescription =
  reservation && (reservation.description ||
  reservation.reservations[0].description);

  return (
    <div className={styles.summaryContainer}>
      <h1 className={styles.summaryHeader}>
      {t("booking.youBook")}
      </h1>
        <div className={styles.summaryBody}>
          <div className={styles.summaryDetail}>
            <div className={styles.avatar}>
            {reservation && (
              <StaticImage
                width={600}
                height={400}
                layout="responsive"
                quality={70}
                src={
                  activity?.teaser_image &&
                  (activity.teaser_image.formats?.medium?.url ||
                    activity.teaser_image.url)
                }
              />
            )}
            </div>
            <div>
              <b className={styles.activityNameTitle}>{activityText && activityText.title}</b>
            </div>
            <div>
              <span>{t("booking.date")}</span>
              <span>
                {reservationTime &&
                  reservationTime.toLocaleDateString("ch", {
                    weekday: "long",
                    month: "long",
                    day: "2-digit",
                    year: "numeric"
                  })}
              </span>
            </div>
            <div>
              <span>{t("booking.time")}</span>
              <span>{t("booking.fullDay")}</span>
            </div>
            <div>
              <span>{t("booking.ticket")}</span>
              <span className={styles.ticketList}>
                {ticketsDescription}
              </span>
            </div>
            <div>
              <span>{t("booking.region")}</span>{" "}
              <span>{activityText && activityText.region}</span>
            </div>
            <div>
              <span>{t("booking.category")}</span>{" "}
              <span>{activityText && activityText.category}</span>
            </div>
          </div>
          <div className={styles.summaryTotal}>
            <span>{t("booking.total")}</span>
            <span>{reservation?.totalPrice?.currency || "CHF"} {reservation ? parseFloat(reservation.totalPrice.amount) : "00.00"}</span>
          </div>
        </div>
        {(!reservation || !activity) && <Loading
          type="spin"
          color="#8b8b8b"
          width="100px"
          height="100px"
          className={styles.loader}/>}
    </div>
  );
};

export default BookingInfoCard;
