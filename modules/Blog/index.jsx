import React from "react";
import classnames from "classnames";
import Link from "next/link";
import { useI18n } from "next-localization";

import { getPageUrls } from "../../services/contentServices";
import Layout from "../_components/Layout";
import Image from "../Image";
import MobileCollapsableWrapper from "../MobileCollapsableWrapper";
import HeadFilterSection from "../ListingWrapper/HeadFilterSection";
import BlogSection from "./BlogSection";
import LinkWrapper from "./LinkWrapper";
import TravelTipp from "./TravelTipp";
import CardWrapper from "../CardWrapper";

import styles from "./styles.module.scss";

const headerBgImage = "/assets/search/freizeitaktivitaeten.webp";

const Blog = ({
  pointsOfInterest = [],
  destinations = [],
  blogPosts = [],
  insiderTipps = [],
  algolia,
  page,
  menu
}) => {
  const { t, locale } = useI18n();
  const urls = getPageUrls("blog");

  const meta = {
    title: t("blog.title"),
    desc: t("blog.description"),
    locale: locale()
  };

  return (
    <Layout
      pageUrls={urls}
      meta={meta}
      isSearchPage={true}
      pageType={page.type}
      algolia={algolia}
      menu={menu}
    >
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <HeadFilterSection
            image={headerBgImage}
            className={classnames("container", styles.headerContent)}
          >
            <div className={styles.headerImage}>
              <Image
                src={headerBgImage}
                alt="header-background"
                layout="fill"
              />
            </div>

            <div className={styles.headerDescription}>
              <h1 className={styles.title}> {t("blog.title")} </h1>
              <MobileCollapsableWrapper>
                <p>{t("blog.description")}</p>
              </MobileCollapsableWrapper>
            </div>
          </HeadFilterSection>
        </div>
        <div className={classnames("container", styles.content)}>
          {!!pointsOfInterest.length && (
            <BlogSection
              title={t("blog.pointOfInterest")}
              description={t("blog.pointOfInterestDescription")}
              contentClassName={styles.pointOfInterestContainer}
            >
              {pointsOfInterest.map(listing => (
                <CardWrapper
                  className={styles.pointOfInterestWrapper}
                  key={listing.key}
                >
                  <LinkWrapper
                    href={listing.urls[locale()] || "/"}
                    className={styles.pointOfInterest}
                  >
                    <div className={styles.imageWrapper}>
                      {listing.teaser_image && (
                        <Image
                          className={styles.itemPreview}
                          src={listing.teaser_image.url}
                          alt={listing.teaser_image.caption}
                          width="370"
                          height="185"
                          layout="responsive"
                        />
                      )}
                    </div>
                    <div className={styles.textPart}>
                      <div className={styles.description}>
                        <h3 className={styles.pointTitle}>
                          {listing.info.title}
                        </h3>
                        <p className={styles.pointTeaser}>
                          {listing.info.meta_description}
                        </p>
                      </div>
                    </div>
                  </LinkWrapper>
                </CardWrapper>
              ))}
            </BlogSection>
          )}

          {!!destinations.length && (
            <BlogSection
              title={t("blog.destinations")}
              description={t("blog.destinationsDescription")}
              contentClassName={classnames(
                styles.pointOfInterestContainer,
                styles.destinationContainer
              )}
            >
              {destinations.map(listing => (
                <TravelTipp listing={listing} destination small key={listing.key} />
              ))}
            </BlogSection>
          )}

          {!!blogPosts.length && (
            <BlogSection
              title={t("blog.insiderBlog")}
              description={t("blog.insiderBlogDescription")}
              contentClassName={styles.pointOfInterestContainer}
            >
              <div className={styles.insiderBlog}>
                <div className={styles.insiderBlogLeft}>
                  <LinkWrapper
                    href={blogPosts[0].urls[locale()]}
                    className={styles.insiderBlogTitleItem}
                  >
                    <div className={styles.blogTitleItemHeader}>
                      <h2 className={styles.title}>
                        {blogPosts[0].info.title}
                      </h2>
                      <p>{blogPosts[0].info.teaser}</p>
                    </div>
                    <div className={styles.insiderImage}>
                      <Image
                        src={blogPosts[0].teaser_image.url}
                        layout="fill"
                        alt="blog-alt"
                      />
                    </div>
                  </LinkWrapper>
                </div>
                <p className={styles.recentArticles}>
                  {t("blog.recentArticles")}
                </p>
                <div className={styles.insiderBlogRight}>
                  {blogPosts.slice(1, 5).map(listing => (
                    <TravelTipp listing={listing} column key={listing.key} />
                  ))}
                </div>
              </div>
            </BlogSection>
          )}

          {!!insiderTipps.length && (
            <BlogSection
              title={t("blog.travelTipp")}
              description={t("blog.travelTippDescription")}
              contentClassName={styles.pointOfInterestContainer}
            >
              {insiderTipps.map(listing => (
                <TravelTipp listing={listing} key={listing.key} />
              ))}
            </BlogSection>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
