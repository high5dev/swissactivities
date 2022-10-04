import React from "react";
import classnames from "classnames";
import Link from "next/link";
import { useI18n } from "next-localization";

import { getPageUrl } from "../../services/contentServices";
import Button from "../Button";

import styles from "./styles.module.scss";

const EmptyBucket = () => {
  const { t, locale } = useI18n();

  return (
    <div className={classnames("container", styles.empty)}>
      <h2 className={styles.title}>{t("favorites.empty")}</h2>
      <Link href={getPageUrl("activities", locale())}>
        <Button title={t("favorites.continue")} onClick={() => {}} customStyle={styles.button}/>
      </Link>
    </div>
  );
};

export default EmptyBucket;
