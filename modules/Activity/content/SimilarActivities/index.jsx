import React, { useState, useCallback, useMemo } from "react";
import { useI18n } from "next-localization";

import OfferCard from "../../../OfferCard";
import OfferCardDetails from "../OfferCardDetails";

import styles from "./styles.module.scss";

const SimilarActivities = ({ activities, notitle }) => {
  const { t, locale } = useI18n();
  const [activeDetails, setActiveDetails] = useState(null);

  const getTypesColor = useCallback(() => {
    let typeColors = {}

    activities.forEach((activity) => {
      if(!typeColors[activity.type.title]){
        typeColors[activity.type.title] = '#'+Math.random().toString(16).slice(-6)
      }
    });

    return typeColors;
  }, [activities]);

  const typesColor = useMemo(getTypesColor, [activities]);

  const getUspDate = (startingDate) => {
    if(!startingDate) return null;

    const firstAvailableDate = new Date(
      startingDate
    );
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    today.setUTCHours(0, 0, 0, 0);
    const dateDiff = firstAvailableDate.getTime() - today.getTime();

    if (dateDiff < oneDay) return t("filter.today");
    if (dateDiff === oneDay) return t("filter.tomorrow");

    const currentDay = today.getUTCDay();

    const maxDayNumber = 7;
    if (dateDiff > oneDay && dateDiff <= (maxDayNumber - currentDay) * oneDay) {
      return ` ${firstAvailableDate.toLocaleDateString(
        locale().replace("_", "-"),
        {
          weekday: "long"
        }
      )}`;
    }

    return firstAvailableDate.toLocaleDateString(locale().replace("_", "-"), {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div>
      <div className="activity-container">
        <div className={styles.similarActivitiesSection}>
          {!notitle && <h2 className={styles.title}>{t("activity.similarActivities")}</h2>}
          <div className={styles.similarActivitiesListWrapper}>
            <div className={styles.similarActivitiesList}>
              {activities.map(activity => {
                const startingDate = getUspDate(activity.startingDate);
                return (
                  <OfferCard
                  activity={activity}
                  className={styles.similarActivity}
                  titleColors={typesColor}
                  key={activity.id}
                  isOffscreen={true}
                  isActive={activity.id === activeDetails?.id}
                  onDetails={setActiveDetails}
                  startingDate={startingDate}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
      {activeDetails && <OfferCardDetails details={activeDetails} startingDate={getUspDate(activeDetails.startingDate)} />}
    </div>
  );
};

export default SimilarActivities;
