import React from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import styles from "./styles.module.scss";
import Layout from "../_components/Layout";
import Tabs from "../Tabs";
import StaticImage from "../Image";
import Breadcrumbs from "../Listing/Breadcrumbs";
import ScrollProgressBar from "./ScrollProgressBar";
import RatingHeader from "../RatingHeader";
import HeadFilterSection from "./HeadFilterSection";

export default function ListingWrapper({
  listing,
  algolia,
  pageType,
  listingActivities,
  meta,
  pageUrls,
  children,
  home,
  breadcrumbs,
  menu
}) {
  const { t, locale } = useI18n();


  const itemToSave = {
    id: listing.id,
    info: listing.info,
    urls: listing.urls,
    teaser_image: listing.teaser_image,
    type: listing.type,
    rating: listing.rating,
    usps: listing.usps,
    attribute_values: listing.attribute_values,
    location: listing.location
  }

  return (
    <Layout isSearchPage={true} {...{ meta, listing, pageUrls, pageType, algolia, menu }}>
      {/*<ScrollProgressBar />*/}
      <section className={styles.sectionHeader}>
      <div className={classnames("container-new", styles.breadcrumbs)}>
        <Breadcrumbs breadcrumbs={breadcrumbs} isMobile/>
      </div>
        <div className={styles.sectionHead}>
          <HeadFilterSection alt={listing.teaser_image?.alternativeText || listing.teaser_image?.caption} image={listing.teaser_image?.url}>
            <div className="container listing-header">
              <div className={styles.sectionHeadBack}>
                {listing.teaser_image && (
                    <StaticImage
                        src={listing.teaser_image.url}
                        alt={listing.teaser_image.alternativeText || listing.teaser_image.caption}
                        width={672}
                        height={400}
                        layout="fixed"
                    />
                )}
              </div>
              <div className={styles.sectionHeadDetail}>
                <RatingHeader
                  title={listing.info.title}
                  rating={listing.rating}
                  shareUrl={listing.shareUrl}
                  itemToSave={itemToSave}
                  favoriteLocalstorageKey="savedListings"
                  className={classnames(styles.header, styles.headerDesktop)}
                />
                <div className={styles.sectionSubTitle}>
                  {listing.teaser_image && (
                      <div className={styles.mobileTeaserImage}>
                        <StaticImage
                            src={listing.teaser_image.url}
                            alt={listing.teaser_image.caption}
                            width={400}
                            height={256}
                            layout="responsive"
                            priority
                            q="30"
                        />
                      </div>
                  )}
                </div>
                <RatingHeader
                  title={listing.info.title}
                  rating={listing.rating}
                  shareUrl={listing.shareUrl}
                  itemToSave={itemToSave}
                  mobileBody
                  favoriteLocalstorageKey="savedListings"
                  className={classnames(styles.header, styles.headerMobile)}
                />
                <div className={styles.info}>
                  <ReactMarkdown
                  plugins={[gfm]}
                  // eslint-disable-next-line
                  children={listing.info.teaser}
                  />
                </div>
              </div>
            </div>
          </HeadFilterSection>
        </div>
      </section>
      <section>
        {/*(!home || !!listingActivities.length) && (
          <div className="container">
            <div className={styles.navigationTabs}>
              <Link href={listing.urls[locale()]} passHref>
                <a className={home ? styles.active : ''}>{t('pages.listing.overview')}</a>
              </Link>
              <Link href={listing.offerUrls[locale()]} passHref>
                <a className={!home ? styles.active : ''}>{t('pages.listing.toursTickets')}</a>
              </Link>
            </div>
          </div>
        )*/}
        {children}
      </section>
    </Layout>
  );
}
