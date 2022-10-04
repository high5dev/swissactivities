import React, { useEffect } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";

import StaticImage from "../Image";
import Button from "../Button";

import styles from "./styles.module.scss";
import { FaInfoCircle } from "react-icons/fa";

const Usp = ({ children, icon, iconName, description, className }) => {
  const { t, locale } = useI18n();

  return (
    <div className={classnames(styles.usp, className)}>
      <div className={styles.uspTitle}>
        <StaticImage
          src={icon}
          alt={iconName}
          width={24}
          height={24}
          layout="fixed"
        />
        <span className={styles.uspTitleText}>{children}</span>
        <button className={styles.uspInfoBox}>
          <FaInfoCircle size={32} />
          <span>{description}</span>
        </button>
      </div>
      <span className={styles.uspDescription}>{description}</span>
    </div>
  );
};

export default Usp;
