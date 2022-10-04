import React, { useState, useEffect } from "react";
import { useI18n } from "next-localization";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import Button from "../../../_components/Button";

const ControlButtons = ({ favoriteLocalstorageKey, itemToSave, className }) => {
  const { t } = useI18n();
  const [isFavorite, setFavorite] = useState(false);

  useEffect(() => {
    if (window?.localStorage) {
      const savedActivitiesList = JSON.parse(
        window.localStorage.getItem(favoriteLocalstorageKey)
      );

      if (savedActivitiesList?.length) {
        const isSaved = savedActivitiesList.find(
          (act) => act.id === activity.id
        );

        setFavorite(!!isSaved);
      }
    }
  }, []);

  const toggleActivity = () => {
    if (window?.localStorage) {
      try {
        const savedActvities = JSON.parse(
          localStorage.getItem(favoriteLocalstorageKey)
        );
        if (savedActvities?.length && isFavorite) {
          setFavorite(false);

          return localStorage.setItem(
            favoriteLocalstorageKey,
            JSON.stringify(
              savedActvities.filter((act) => act.id !== itemToSave.id)
            )
          );
        }

        saveActivity(itemToSave || []);
      } catch (e) {
        console.log("remove err =", e);
      }
    }
  };

  const saveActivity = (savedActvities) => {
    if (savedActvities) {
      if (!savedActvities.find((act) => act.id === itemToSave.id)) {
        savedActvities.push(itemToSave);
      }

      localStorage.setItem(
        favoriteLocalstorageKey,
        JSON.stringify(savedActvities)
      );
    } else {
      localStorage.setItem(
        favoriteLocalstorageKey,
        JSON.stringify([itemToSave])
      );
    }

    setFavorite(true);
  };

  return (
    <Button
      type="secondary"
      icon={isFavorite ? <BsHeartFill /> : <BsHeart />}
      text={!isFavorite && t("activity.save")}
      onClick={toggleActivity}
    />
  );
};

export default ControlButtons;
