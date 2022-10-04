import React from "react";
import { useI18n } from "next-localization";

import Image from "../../Image";
import styles from "./styles.module.scss";

const ListingUspSection = () => {
  const { t, locale } = useI18n();

  return (
    <div className={styles.listingUspContainer}>
      <div className={styles.listingUspItem}>
        <div className={styles.icon}>
          <Image height="36px" width="36px" src="/assets/activity/clock.svg" />
        </div>
        <span className={styles.title}>{t("pages.listing.uspBook")}</span>
      </div>
      <div className={styles.listingUspItem}>
        <div className={styles.icon}>
          <Image
            height="44px"
            width="44px"
            src="/assets/activity/smartphone.svg"
          />
        </div>
        <span className={styles.title}>{t("pages.listing.uspMobile")}</span>
      </div>
      <div className={styles.listingUspItem}>
        <div className={styles.icon}>
          <Image
            height="40px"
            width="40px"
            src="/assets/activity/protection.svg"
          />
        </div>
        <span className={styles.title}>
          {t("pages.listing.uspCancelation")}
        </span>
      </div>
      <div className={styles.listingUspItem}>
        <div className={styles.bigIcon}>
          <Image
            height="40px"
            width="130px"
            src="/assets/listing/payment.svg"
          />
        </div>
        <span className={styles.title}>{t("pages.listing.payment")}</span>
      </div>
    </div>
  );
};

export default ListingUspSection;
