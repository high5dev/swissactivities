import React, { useState } from "react";
import { useI18n } from "next-localization";
import classnames from "classnames";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import {
  BsChevronCompactDown,
  BsChevronCompactUp,
  BsDot
} from "react-icons/bs";

import Icon from "../../../Icon";
import Usps, { attributesMapping } from "../../../Usps";

import CheckIcon from "../../../../public/assets/check.svg";
import CancelIcon from "../../../../public/assets/cancel.svg";
import PlusIcon from "../../../../public/assets/plus.svg";

import styles from "./styles.module.scss";

const Includes = ({ benefits }) => {
  return benefits.map((el, index) => (
    <div key={`includes-${index}`} className={styles.row}>
      <div className={styles.includedIconWrapper}>
        {el.type === "included" ? (
          <CheckIcon className={styles.icon} />
        ) : el.type === "offered" ? (
          <PlusIcon className={styles.icon} />
        ) : (
          <CancelIcon className={styles.icon} />
        )}
      </div>
      <ReactMarkdown plugins={[gfm]} className={styles.includesText}>
        {el.text}
      </ReactMarkdown>
    </div>
  ));
};

const Highlights = ({ highlights }) => {
  return highlights.map((el, index) => (
    <div className={styles.row} key={"highlight " + index}>
      <BsDot size={24} color="#828282" className={styles.icon} />
      <ReactMarkdown
        key={`highlight-${index}`}
        className={styles.highlightText}
        plugins={[gfm]}
      >
        {el.text}
      </ReactMarkdown>
    </div>
  ));
};

const CardDetailsColumn = ({ children, title, numberOfElements }) => {
  const { t, locale } = useI18n();
  const [viewAll, setViewAll] = useState(false);
  const toggleViewAll = () => {
    setViewAll(prev => !prev);
  };

  const rowsLimit = viewAll ? undefined : 4;

  return (
    <div className={styles.column}>
      <p className={styles.title}> {title} </p>
      {children(rowsLimit)}
      {numberOfElements > 4 && (
        <p
          className={classnames(styles.viewAll, { [styles.active]: !viewAll })}
          onClick={toggleViewAll}
        >
          {!viewAll
            ? t("offerCard.details.viewAll")
            : t("offerCard.details.showLess")}
        </p>
      )}
    </div>
  );
};

const OfferCardDetails = ({ details, startingDate, containerClassName }) => {
  const { t, locale } = useI18n();

  const tourArtId = 7;

  const tourartAttributes = details.attribute_values.filter(
    ({ attribute }) => attribute && Number(attribute.id) === tourArtId
  );

  const translationTitleKey =
    tourartAttributes[0] && attributesMapping[tourartAttributes[0].id];

  const title = translationTitleKey
    ? t(`attributes.${translationTitleKey}`)
    : t("activity.offer");

  return (
    <div
      className={
        containerClassName || classnames(styles.container, "container")
      }
    >
      <div className={classnames("container-new", styles.detailsCard)}>
        <div className={styles.column}>
          <p className={styles.title}>{t("activity.uspTitle", { title })}</p>
          <Usps
            usps={details?.usps}
            attributes={details.attribute_values}
            startingDate={startingDate}
          />
        </div>
        {!!details.info.benefits?.length && (
          <CardDetailsColumn
            title={t("activity.tabs.includes")}
            numberOfElements={details.info.benefits.length}
          >
            {rowsLimit => {
              return (
                <Includes
                  benefits={details.info.benefits.slice(0, rowsLimit)}
                />
              );
            }}
          </CardDetailsColumn>
        )}
        <CardDetailsColumn
          title={t("activity.tabs.highlights")}
          numberOfElements={details.info.highlights?.length}
        >
          {rowsLimit => {
            return (
              <Highlights
                highlights={details.info.highlights?.slice(0, rowsLimit)}
              />
            );
          }}
        </CardDetailsColumn>
      </div>
    </div>
  );
};

export default OfferCardDetails;
