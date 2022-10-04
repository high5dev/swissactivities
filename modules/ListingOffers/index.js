import React, {useEffect, useState} from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";

import styles from "./styles.module.scss";
import ListingWrapper from "../ListingWrapper";
import ListingActivity from "./ListingActivity";
import StaticImage from "../Image";

export default function ListingOffers({ listing, algolia, listingActivities, menu }) {
  const { t, locale } = useI18n();
  const [isMobile, setIsMobile] = useState(null);

  const pageUrls = listing.offerUrls;

  const meta = {
    title: t("pages.listing.metaTitle",{listingSlug: listing.info.title}),
    desc: t("pages.listing.metaDescription",{listingSlug: listing.info.title}),
    locale: locale(),
    image: listing.teaser_image?.url
  };

  useEffect(() => {

    function handleResize() {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    }

    window.addEventListener("resize", handleResize);

    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTypesColor = () => {
    let typeColors = {}

    listingActivities.forEach((activity) => {
      if(!typeColors[activity.type.title]){
        typeColors[activity.type.title] = '#'+Math.random().toString(16).slice(-6)
      }
    });

    return typeColors;
  }
  const titleColors = getTypesColor();

  const staticUspContent = [
    {
      icon: "/assets/activity/protection.svg",
      text: t("staticUsps.protection")
    },
    {
      icon: "/assets/activity/fast.svg",
      text: t("staticUsps.fast")
    },
  ]

  const getStaticUSPS = () => {
    return (
      <div className={styles.uspsWrap}>
        {staticUspContent.map(usp => (
            <div className={styles.uspsBlock} key={usp.icon}>
              <StaticImage
                  src={usp.icon}
                  alt={"book"}
                  width={40}
                  height={40}
                  layout="fixed"
              />
              <p>{usp.text}</p>
            </div>
        ))}
      </div>
    )
  }

  let count = 0;
  return (
    <ListingWrapper
      {...{ meta, pageUrls, algolia, menu }}
      listing={listing}
      listingActivities={listingActivities}
    >
      <div className={classnames("container", styles.attributesList)}>
        <h2 className={styles.attributesHeading}>{t("pages.listing.mainTitle")}</h2>
          <div className={styles.listingActivities}>
            {listingActivities.map(activity => {
              count += 1
              return (
                  <React.Fragment key={activity.id}>
                    <ListingActivity titleColors={titleColors} activity={activity}/>
                    { count === 4 ? getStaticUSPS() : null}
                  </React.Fragment>
              )
            })}
          </div>
      </div>
    </ListingWrapper>
  );
}
