import React from "react";
import { BsX, BsArrowUpDown } from "react-icons/bs";
import { useI18n } from "next-localization";

import StaticImage from "../../Image";

import styles from "./styles.module.scss";

const MobileOptions = ({
  removeFilter,
  currentRefinement,
  handleFilters,
  handleButtonSliderClick
}) => {
  const { t, locale } = useI18n();

  return (
    <div className={styles.optionsWrapper}>
      <div className={styles.mobileOptions}>
        {/*<button className={styles.mobileOption}>
          <BsArrowUpDown /> <span>{t("search.sort")}</span>
        </button>*/}
        <button className={styles.mobileOption} onClick={handleFilters}>
          <StaticImage
            src="/assets/icons/filters.svg"
            width="24"
            height="24"
            layout="fixed"
          />
          <span>{t("search.filter")}</span>
        </button>
        <button
          className={styles.mobileOption}
          onClick={handleButtonSliderClick}
        >
          <StaticImage
            src="/assets/activities/map-pin-black.svg"
            alt="pin"
            width={24}
            height={24}
            layout="fixed"
          />
          <span>{t("search.map")}</span>
        </button>
      </div>
      <div className={styles.filterList}>
        {currentRefinement &&
          currentRefinement.labels.map(filter => (
            <p className={styles.filterItem} key={filter}>
              {filter}
              <BsX
                color="#fff"
                className={styles.removeFilter}
                onClick={() => removeFilter(filter)}
              />
            </p>
          ))}
      </div>
    </div>
  );
};

export default MobileOptions;
