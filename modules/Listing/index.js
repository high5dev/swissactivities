import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classnames from "classnames";
import { debounce } from "lodash";
import { useI18n } from "next-localization";
import { BsChevronCompactDown, BsX, BsListUl } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import Layout from "../_components/Layout";
import StaticImage from "../Image";
import Icon from "../Icon";
import ScrollProgressBar from "./ScrollProgressBar";
import ListingMedia from "./ListingMedia";
import ListingMarkdown from "./ListingMarkdown";
import ListingImage from "./ListingImage";
import Button from "../Button";
import ListingWrapper from "../ListingWrapper";
import Tabs from "../Tabs";
import EmailSubscription from "../Activity/content/EmailSubscription";
import { useSearchContext } from "../../hooks/useSearchContext";

import UspSection from "./UspSection";
import Offers from "./Offers";
import RelatedArticles from "./RelatedArticles";

import styles from "./styles.module.scss";
import {SkiResort} from "../_components/SkiResort";

export default function Listing({
  listing,
  headings,
  algolia,
  pageType,
  breadcrumbs,
  skiresortInfo,
  offers,
  relatedArticles,
  menu
}) {
  const observerRef = useRef(null);
  const playerObserverRef = useRef(null);
  const contentSectionRef = useRef(null);
  const offersContainerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [isInited, setInited] = useState(false);
  const [isPlayerActive, setPlayerActive] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [isMobile, setMobile] = useState(false);
  const [cta, setCTA] = useState(false);
  const [stickyButton, setStickyButton] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");
  const [activeParent, setActiveParent] = useState("");
  const [savedEntries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState("activities");
  const { t, locale } = useI18n();
  const router = useRouter();

  const callbackFunction = (entries, cObserver) => {
    const entriesStatus = entries.reduce((acc, item) => {
      acc[item.target.id] = item.isIntersecting;
      return acc;
    }, {});

    setEntries((oldValue) => {
      return { ...oldValue, ...entriesStatus };
    });
  };

  const playerInView = (entries, cObserver) => {
    entries.forEach((entrie) => {
      if (entrie.isIntersecting) {
        setPlayerActive(true);
        cObserver.disconnect();
      }
    });
  };

  const handleScroll = () => {
    const contentBounding =
      contentSectionRef?.current?.getBoundingClientRect();
    const offersContainerBoundings =
      offersContainerRef &&
      offersContainerRef.current &&
      offersContainerRef.current.getBoundingClientRect();

    const topThreshold = -100;

    if (contentBounding && contentBounding.top < topThreshold) {
      return setCTA(true);
    } else {
      if(cta) setCTA(false);
    }
    if (
      offersContainerBoundings &&
      offersContainerBoundings.top < topThreshold
    ) {
      return setStickyButton(true);
    }
    setCTA(false);
    setStickyButton(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const options = { root: null, rootMargin: "5px", threshold: 1.0, delay: 250 };
  const getObserver = () => {
    if (!mounted) return null;

    if (observerRef.current === null && IntersectionObserver) {
      observerRef.current = new IntersectionObserver(callbackFunction, options);
    }
    return observerRef.current;
  };

  const handleMobileTopbarClick = () => {
    if (isMobile) {
      document.documentElement.style.overflow = "hidden";
    }
    setMobileNav(true);
  };
  const handleMobileNavClose = () => {
    if (isMobile) {
      document.documentElement.style.overflow = "unset";
    }
    setMobileNav(false);
  };

  useEffect(() => {
    if (!isMobile) {
      setMobileNav(false);
      document.documentElement.style.overflow = "unset";
    }
  }, [isMobile]);

  const pageUrls = listing.urls;
  const meta = {
    title: listing.info.title,
    desc: listing.info.meta_description,
    locale: locale(),
    image: listing.teaser_image?.url,
  };

  const checkActiveHeading = (entriesList) => {
    const firstActiveHeading = headings.find(
      (headingItem) => entriesList[headingItem.anchor]
    );

    if (firstActiveHeading) {
      setActiveHeading(firstActiveHeading.anchor);
      setActiveParent(firstActiveHeading.parent || firstActiveHeading.anchor);
      setInited(true);
    }
  };

  const debounceActiveHeading = useCallback(debounce(checkActiveHeading, 200), [
    headings,
  ]);

  useEffect(() => {
    debounceActiveHeading(savedEntries);
  }, [savedEntries, isInited, debounceActiveHeading]);

  useEffect(() => {
    setEntries([]);
  }, [headings]);

  const handleResize = () => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setMobile(mediaQuery.matches);
  };

  useEffect(() => {
    setMounted(true);
    playerObserverRef.current = new IntersectionObserver(playerInView);

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isHaveOffers = useMemo(() => {
    if (listing.type === "blog_post") {
      return listing.activities;
    }
    if (offers.topActivities?.length) {
      return true;
    }

    return Object.keys(offers).some(
      (offersKey) => offers[offersKey]?.activities?.length
    );
  }, [offers]);

  const activeHeadingItem = headings.find(
    (headingElement) => headingElement.anchor === activeHeading
  );

  const setObserver = (ref) => {
    if (ref && !isPlayerActive && playerObserverRef.current)
      playerObserverRef.current.observe(ref);
  };

  const tabsList = useMemo(() => {
    const tabs = [
      {
        title: t("pages.listing.article"),
        id: "article",
      },
    ];

    if (isHaveOffers) {
      tabs.unshift({
        title: t("pages.listing.activities"),
        id: "activities",
      });
    }

    if (skiresortInfo) {
      tabs.unshift({
        title: t("skiresortInfo.title"),
        id: "skiresort-info",
      });
    }

    if (relatedArticles?.length) {
      tabs.push({
        title: t("pages.listing.related"),
        id: "related",
      });
    }

    return tabs;
  }, [listing]);

  const handleViewAll = () => {
    const searchParams = {};
    router.replace("/s/?", undefined, {
      scroll: false,
    });
  };

  return (
    <ListingWrapper
      {...{ meta, pageUrls, algolia, pageType, skiresortInfo, menu }}
      listing={listing}
      listingActivities={listing.activities}
      breadcrumbs={breadcrumbs}
      home
    >
      <section className={styles.listingSection}>
        <div
          className={classnames(styles.stickyNav, {
            [styles.isActive]: stickyButton,
          })}
        >
          <div className={classnames(`container-new xs-m-x`, {[styles.tabsContainer]: skiresortInfo})}>
            <Tabs
              tabs={tabsList}
              activeTab={activeTab}
              className={styles.tabsContainer}
              onChange={setActiveTab}
            />
            <div className={styles.viewAllStickyWrapper}>
              <Button
                title={t("pages.listing.viewAllActivities")}
                onClick={handleViewAll}
                outline={!isMobile}
                customStyle={styles.viewAllButton}
              />
            </div>
          </div>
        </div>

        {skiresortInfo && (
          <section style={{}}>
            <div className="container-new">
              <i className={styles.anchor} id="skiresort-info" />
              <SkiResort region={skiresortInfo} />
            </div>
          </section>
        )}

        <div className="container-new column xs-m-x">
          <UspSection />
        </div>

        {isHaveOffers && (
          <div className={styles.offersContainer} ref={offersContainerRef}>
            <i className={styles.anchor} id="activities" />
            <Offers
              offers={offers}
              blogActivities={listing.activities}
              isMobile={isMobile}
              type={listing.type}
              title={listing.info?.title_frontend}
            />
          </div>
        )}

        <div className="container-new column ">
          <i className={styles.anchor} id="article" />
          <h2 className={styles.articleTitle}>{t("pages.listing.article")}</h2>
          <div className={styles.listingContentSection} ref={contentSectionRef}>
            <div className={classnames(styles.mobileTopBar, {[styles.fixedTopBar]: mobileNav})}>
              <div
                className={styles.mobileTopBarTitle}
                onClick={handleMobileTopbarClick}
              >
                <BsListUl size={22} className={styles.icon} />{" "}
                {t("pages.listing.tableOfContent")}
              </div>
              {mobileNav && (
                <div className={styles.mobileNavTopbar}>
                  <button
                    onClick={handleMobileNavClose}
                    className={styles.closeButton}
                  >
                    <Icon icon={<BsX />} />
                  </button>
                </div>
              )}
            </div>
            <div
              className={classnames(styles.listingTreeView, {
                [styles.mobileListingTreeViewOpened]: mobileNav,
              })}
            >
              <div className={styles.tableOfContetTitleWrapper}>
                <div className={styles.tableOfContentTitle}>
                  <BsListUl size={22} className={styles.icon} />{" "}
                  {t("pages.listing.tableOfContent")}
                </div>
              </div>
              <ul
                className={styles.listingHeading}
                onClick={handleMobileNavClose}
              >
                {headings.map((headingElement) => {
                  const isSubHeading = headingElement.level !== 2;
                  if (isSubHeading && activeParent !== headingElement.parent) {
                    return null;
                  }

                  return (
                    <li
                      className={classnames(
                        styles.listingHeadingElement,
                        styles[`level-${headingElement.level}`],
                        {
                          [styles.activeHeadingElement]:
                            activeHeading === headingElement.anchor,
                        }
                      )}
                      key={headingElement.anchor + headingElement.level}
                    >
                      <a href={`#${headingElement.anchor}`}>
                        {headingElement.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* <div className={styles.mobileTopBar}>
              <BsChevronCompactDown />
              <span
                onClick={handleMobileTopbarClick}
                className={styles.mobileHeading}
              >
                {(activeHeadingItem && activeHeadingItem.text) ||
                  (headings[0] && headings[0].text)}
              </span>
            </div>
            <div className={styles.mobileTopBar}
              onClick={handleMobileTopbarClick}>
              <BsListUl size={22} className={styles.icon} />{" "}
              {t("pages.listing.tableOfContent")}
            </div>
            */}

            <div className={styles.listingContent}>
              {listing.content_blocks.map((el, i) => (
                <>
                  {el.youtube_url && (
                    <div ref={setObserver}>
                      {isPlayerActive && (
                        <ListingMedia mediaLink={el.youtube_url} />
                      )}
                    </div>
                  )}
                  {el.text && (
                    <ListingMarkdown text={el.text} observer={getObserver()} />
                  )}
                  {el.pictures && el.pictures.length > 0 && (
                    <div className={styles.images}>
                      <ListingImage
                        pictures={el.pictures}
                        isMobile={isMobile}
                      />
                    </div>
                  )}
                  {i === 2 && (
                    <EmailSubscription className={styles.emailcontainer} />
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
        <i className={styles.anchor} id="related" />

        <RelatedArticles articles={relatedArticles} isMobile={isMobile} />
      </section>
    </ListingWrapper>
  );
}
