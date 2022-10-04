import React from "react";
import { useI18n } from "next-localization";
import classnames from 'classnames';
import Image from "../../../Image";
import styles from "./styles.module.scss";

const bgImageUrl = "/assets/homepagepic.webp";

const campaignList = {
  de_CH: "jWGtV",
  en_CH: "jWGm3",
  it_CH: "jWG0r",
  fr_CH: "jWGeF"
};

const EmailSubscription = ({className}) => {
  const { t, locale } = useI18n();

  return (
    <div className={classnames(styles.emailSubscription, "container", className && className)}>
      <div className={styles.subCard}>
        <form
          action="https://app.getresponse.com/add_subscriber.html"
          acceptCharset="utf-8"
          method="post"
          className={styles.subForm}
        >
          <p className={styles.title}>{t("activity.newsletter.title")}</p>
          <p className={styles.description}>
            {t("activity.newsletter.description")}
          </p>
          <div className={styles.inputBlock}>
            <input
              type="text"
              name="email"
              placeholder={t("activity.newsletter.inputPlaceholder")}
              className={styles.input}
            />
            <input
              type="hidden"
              name="campaign_token"
              value={campaignList[locale()]}
            />
            <input
            type="submit"
            value={t("activity.newsletter.signup")}
            className={styles.submit}
            />
          </div>
        </form>
        <div className={styles.imageWrapper}>
          <Image className={styles.image} src={bgImageUrl} width="600" height="320"/>
        </div>
      </div>
      <p className={styles.hint}>{t("activity.newsletter.hint")}</p>
    </div>
  );
};

export default EmailSubscription;
