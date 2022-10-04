import React from "react";
import { getPageUrl } from "../../../services/contentServices";

import Button from "../../Button";
import Image from "../../Image";
import styles from "./styles.module.scss";
import { useI18n } from "next-localization";
import Link from "next/link";

const NotBookable = ({ scrollToForm }) => {
  const { t, locale } = useI18n();

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <Image src="/assets/activity/map.svg" alt="notbookable" width="72" height="64"/>
        <p className={styles.title}>{t("activity.widget.notBookable")}</p>
      </div>
      <Link href={getPageUrl("activities", locale())} passHref>
        <Button
          title={t("activity.widget.discover")}
          component="a"
          customStyle={styles.discoverButton}
        />
      </Link>
      <p className={styles.help}>
        {t("activity.widget.help")}{" "}
        <span onClick={scrollToForm}>{t("activity.widget.helpLink")}</span>
      </p>
    </div>
  );
};
export default NotBookable;
