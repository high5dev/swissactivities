import React, { useState } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import {
  BsChevronCompactDown,
  BsChevronCompactUp,
  BsDot
} from "react-icons/bs";

import Icon from "../../../Icon";
import Usps from "../../../Usps";

import CheckIcon from "../../../../public/assets/check.svg";
import CancelIcon from "../../../../public/assets/cancel.svg";
import PlusIcon from "../../../../public/assets/plus.svg";

import styles from "./styles.module.scss";

const Accordion = ({ title, children, id }) => {
  const [isOpen, setOpen] = useState(true);

  return (
    <div className={classnames(styles.accordion, { [styles.open]: isOpen })}>
      <span id={id} className={styles.accordionAnchor} />
      <div
        className={classnames(styles.accordionTitle, { [styles.open]: isOpen })}
        onClick={() => {
          setOpen(!isOpen);
        }}
      >
        <h2>{title}</h2>

        <Icon
          color="#002F49"
          icon={isOpen ? <BsChevronCompactUp /> : <BsChevronCompactDown />}
        />
      </div>
      <div
        className={classnames(styles.accordionBody, { [styles.open]: isOpen })}
      >
        {children}
      </div>
    </div>
  );
};

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

const OfferCardDetails = ({ details, startingDate }) => {
  const { t, locale } = useI18n();
  return (
    <div className={styles.detailsCard}>
      <div className={styles.detailsItem}>
        <Usps usps={details?.usps} startingDate={startingDate} attributes={details.attribute_values} />
      </div>
      {!!details.info.benefits?.length && (
        <Accordion title={t("activity.tabs.includes")}>
          <Includes benefits={details.info.benefits} />
        </Accordion>
      )}
      <Accordion title={t("activity.tabs.highlights")}>
        <Highlights highlights={details.info.highlights} />
      </Accordion>
    </div>
  );
};

export default OfferCardDetails;
