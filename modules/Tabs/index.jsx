import React, { useState } from "react";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import Link from "next/link";
import styles from "./styles.module.scss";

const Tab = ({ tab, active, onClick }) => {
  const handleClick = () => {
    onClick(tab.id);
  };
  return (
    <Link href={"#" + tab.id}>
      <span
        className={classnames({ [styles.active]: active }, styles.tab)}
        onClick={handleClick}
      >
        <span className={styles.tabContet}>
          <span>{tab.title}</span>
        </span>
      </span>
    </Link>
  );
};

const Tabs = ({ tabs = [], activeTab, onChange, className }) => {
  const { t } = useI18n();
  const handleTabClick = id => {
    onChange(id);
  };

  return (
    <div className={classnames(styles.tabsContainer, className && className)}>
      <div className={styles.line} />
      {tabs.map(tab => (
        <Tab
          tab={tab}
          onClick={handleTabClick}
          active={activeTab === tab.id}
          key={tab.id}
        />
      ))}
    </div>
  );
};

export default Tabs;
