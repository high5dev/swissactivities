import React from "react";
import { useI18n } from "next-localization";

import Image from "../../Image";
import Button from "../../Button";

import styles from "./styles.module.scss";

const ContactThankYou = ({onClose}) => {
  const { t, locale } = useI18n();

  const handleClick = () => {
    onClose();
  };
  return (
    <div className={styles.container}>
      <div className={styles.titleImage}>
        <Image src="/assets/contact.svg" alt="contact" width="80px" height="80px" />
      </div>
      <h2 className={styles.title}>{t("contactThankYou.title")}</h2>
      <p className={styles.subTitle}>{t("contactThankYou.subTitle")}</p>
      <Button
        onClick={handleClick}
        customStyle={styles.submitButton}
        title={t("contactThankYou.gotIt")}
      />
    </div>
  );
};

export default ContactThankYou;
