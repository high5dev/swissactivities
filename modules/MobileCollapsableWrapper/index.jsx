import React, { useState } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import { BsChevronCompactDown } from "react-icons/bs";

import styles from "./styles.module.scss";

const MobileCollapsableWrapper = ({ children, className, buttonClassName }) => {
  const [isInitial, setInitial] = useState(true);
  const [isCollapsed, setCollapsed] = useState(true);
  const { t, locale } = useI18n();

  const toggle = () => {
    setCollapsed(state => !state);
    setInitial(false)
  };

  return (
    <div
      className={classnames(styles.collapsable, className, {
        [styles.collapsed]: !isInitial && isCollapsed,
        [styles.open]: !isInitial && !isCollapsed
      })}
    >
      {children}
      <button
        className={classnames(styles.viewButton, buttonClassName, {
          [styles.collapsed]: !isInitial && isCollapsed,
          [styles.open]: !isInitial && !isCollapsed
        })}
        onClick={toggle}
      >
        <BsChevronCompactDown/>
      </button>
    </div>
  );
};

export default MobileCollapsableWrapper;
