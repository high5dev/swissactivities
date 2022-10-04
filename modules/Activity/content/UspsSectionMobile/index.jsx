import React, { useEffect } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";

import ControlButtons from "../ControlButtons";
import Usps from "../../../Usps";
import styles from "./styles.module.scss";

//attribute_value id to translation key
export const attributesMapping = {
  "17": "combiOffer",
  "18": "transport",
  "21": "tickets",
  "22": "rent",
  "23": "selfGuided",
  "24": "guidedPrivate",
  "25": "guidedGroup",
  "33": "course"
};

const UspsSection = ({
  teaserText = "",
  isSearchPage = false,
  attributes,
  activity,
  ...props
}) => {
  const { t, locale } = useI18n();
  const tourArtId = 7;
  const tourartAttributes = attributes.filter(
    ({ attribute }) => attribute && Number(attribute.id) === tourArtId
  );

  const translationTitleKey =
    tourartAttributes[0] && attributesMapping[tourartAttributes[0].id];

  const title = translationTitleKey
    ? t(`attributes.${translationTitleKey}`)
    : t("activity.offer");

  return (
    <div className={styles.uspsSection}>
      <div
        className={classnames(styles.content, {
          [styles.contentSearchPage]: isSearchPage
        })}
      >
        <p className={styles.title}>{t("activity.uspTitle", {title})}</p>
        {teaserText && <p className={styles.teaser}>{teaserText}</p>}
        <h3>{t('activity.advantage.title')}</h3>
        <Usps {...props} uspClassName={styles.usp} darkText isMobile />
      </div>
      <ControlButtons activity={activity} />
    </div>
  );
};

export default UspsSection;
