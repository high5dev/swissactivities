import React from "react";
import { useI18n } from "next-localization";

import StaticImage from "../../Image";
import styles from "./styles.module.scss";

const iconList = {
  clock: "clock.svg",
};

const Usp = ({
  usp,
  uspDate
}) => {
  const { t, locale } = useI18n();
  const bookNowItem = usp;

  const getUspLabel = usp => {
    if(!usp) return {};
    const translationItem =
      usp.translations &&
      usp.translations.find(translation => translation.locale === locale());

    const label = translationItem ? translationItem.label : usp.label;

    return label;
  };

  const label = getUspLabel(bookNowItem)

  return (
    <div className={styles.usp} key={bookNowItem.key}>
      <StaticImage
        src={`/assets/activity/${iconList[bookNowItem.icon_name]}`}
        alt={bookNowItem.icon_name}
        width={26}
        height={26}
        layout="fixed"
      />
      <span className={styles.uspDescriptionBlock}>
        <span className={styles.uspLabel}>
          {label}
          <span className={styles.uspDate}>
            {uspDate}
          </span>
        </span>
      </span>
    </div>
  );
};

export default Usp;
