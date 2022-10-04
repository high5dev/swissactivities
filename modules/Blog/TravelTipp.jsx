import React from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";

import { getPageUrls } from "../../services/contentServices";
import Image from "../Image";
import CardWrapper from "../CardWrapper";
import LinkWrapper from "./LinkWrapper";

import styles from "./styles.module.scss";

const headerBgImage = "/assets/search/freizeitaktivitaeten.webp";

const TravelTipp = ({ listing, small, destination, className, column }) => {
  const { t, locale } = useI18n();

  return (
    <LinkWrapper
      href={listing.urls[locale()] || "/"}
      className={classnames(styles.travelTipp, className, {
        [styles.small]: small,
        [styles.column]: column,
        [styles.destination]: destination,
      })}
      key={listing.key}
    >
      <CardWrapper>
        <div className={styles.imageWrapper}>
          {listing.teaser_image && (
            <Image
              className={styles.itemPreview}
              src={listing.teaser_image.url}
              alt={listing.teaser_image.caption}
              layout="fill"
            />
          )}
        </div>
        <div className={styles.description}>
          <h3 className={styles.title}>{listing.info.title}</h3>
          <span className={styles.date}>
            {new Date(listing.published_at).toLocaleDateString(
              locale().replace("_", "-"),
              {
                month: "long",
                year: "numeric",
                day: "2-digit"
              }
            )}
          </span>
        </div>
      </CardWrapper>
    </LinkWrapper>
  );
};

export default TravelTipp;
