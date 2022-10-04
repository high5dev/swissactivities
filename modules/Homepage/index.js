import React, {useState, useEffect} from "react";
import Script from "next/script";
import { BsArrowRightShort } from "react-icons/bs";
import { HiArrowNarrowDown } from "react-icons/hi";
import Link from "next/link";
import classnames from "classnames";
import orderBy from "lodash/orderBy";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import Layout from "../_components/Layout";
import StaticImage from "../Image";
import styles from "./styles.module.scss";
import { getPageUrls } from "../../services/contentServices";
import { useI18n } from "next-localization";
import Typed from 'react-typed';
import Button from '../Button';
import SwiperCore, { Controller } from 'swiper';

import { Swiper, SwiperSlide } from "swiper/react";
import SearchBar from "../_components/SearchBar";

const Homepage = (props) => {
  SwiperCore.use([Controller]);

  const {
    types,
    algolia,
    locations,
    activities,
    menu
  } = props;

  const sortedLocations = orderBy(locations, ["numActivities"], ["desc"]);
  const { t, locale } = useI18n();
  const [selectedLoc, setLocation] = useState(sortedLocations[0]);
  const [controlledSwiper, setControlledSwiper] = useState(null);
  const [activeEl, setActiveEl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const bgImageUrl = '/assets/homepagepic.webp';
  const money = '/assets/home/money.svg';
  const payment = '/assets/home/payment.svg';
  const support = '/assets/home/support.svg';
  const fees = '/assets/home/fees.svg';

  const features = [
    {text: 'step1', img: money},
    {text: 'step2', img: payment},
    {text: 'step3', img: support},
    {text: 'step4', img: fees}
  ]

  const urls = getPageUrls("homepage");
  const activitiesURLs = getPageUrls("activities");
  const meta = {
    title: t("pages.home.title"),
    desc: t("pages.home.description"),
    locale: locale(),
    image: bgImageUrl,
  };

  const handleResize = React.useCallback(() => {
    setIsMobile( window.innerWidth <= 768 ? true : false )
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    document.body.parentElement.style.overflow = 'unset';
  }, [handleResize])

  return (
    <Layout meta={meta} pageUrls={urls} algolia={algolia} disableLinksBlock pageType="homepage" menu={menu}>
      <section className={styles.sectionHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.homeHeroBannerVideo}>
            <StaticImage
              className={styles.homeHeroBannerVideo}
              src={bgImageUrl}
              alt="Swiss Activities"
              layout="fill"
              objectFit="cover"
              quality={40}
              priority
            />
          </div>
          <div className={styles.headerOverlay} />
          <div className="container">
            <div className={styles.banner}>
              <h1 className={styles.headTitle}><span>{t("home.title")}</span>
                <span className={styles.typedContainer}>
                  <Typed
                      className={styles.typed}
                      strings={types.map(type => type.title)}
                      typeSpeed={100}
                      backSpeed={40}
                      loop
                  />
                </span>

              </h1>
              <p className={styles.subTitle}>{t("home.newSubTitle")}</p>
              <HiArrowNarrowDown className={styles.HiArrowNarrowDown}/>

              <SearchBar meta={meta} />

            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionFeatures}>
        <h2 className={styles.sectionHeading}>{t("home.reviewTitle")}</h2>
        <div id="ReviewsWidget" className={styles.reviewsWidget}></div>
        <Script src="https://widget.reviews.co.uk/elements/style.css" id="reviewsStyles" strategy="beforeInteractive"/>
        <Script src="https://widget.reviews.co.uk/elements/dist.js" id="reviews" strategy="afterInteractive" onLoad={() => {
          new ReviewsWidget('#ReviewsWidget', {
              store: 'www.swissactivities.com',
              widget: 'social-proof',
              options: {
                  perspective: 30,
                  card_amount: 7
              }
          });
        }} />

      </section>

      {selectedLoc && (
        <section className={styles.sectionLocations + ' section-locations'}>
          <div className={styles.sectionHeader}>
            <div className="container" style={{ display: "block" }}>
              <h2 className={styles.sectionHeading}>{t("discover.region")}</h2>
              <Swiper
                  controller={{ control: controlledSwiper }}
                  spaceBetween={20}
                  slidesPerView={5}
                  className="carousel"
                  onSlideChange={() => null}
                  onSwiper={setControlledSwiper}
                  breakpoints={{
                    320: {
                      width: 240,
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    640: {
                      width: 240,
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                  }}
              >

                {sortedLocations.map((el, index) => (
                  <SwiperSlide
                    key={`location-item-${el.id}`}
                    className={classnames("home-location-item", {
                      active: selectedLoc && selectedLoc.id === el.id,
                    })}
                    onClick={() => {
                      if(index !== 0 && activeEl !== el.id && isMobile) {
                        controlledSwiper.slideNext()
                        setActiveEl(el.id)
                      }
                      setLocation(el);
                    }}
                  >
                    {el.title}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className={styles.sectionBody}>
            <div className="container home-location-content">
              <div className="location-image">
                <StaticImage
                  src={selectedLoc.teaser_image.url}
                  alt={selectedLoc.teaser_image.caption}
                  width={672}
                  height={507}
                  layout="responsive"
                />
              </div>
              <div className="location-detail">
                <h3>
                  <Link href={selectedLoc.urls[locale()]}>
                    {selectedLoc.title}
                  </Link>
                </h3>
                <div className={styles.description}>
                  <ReactMarkdown
                    plugins={[gfm]}
                  >
                  {selectedLoc.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <section className={styles.sectionDiscover}>
        <div
          className="container fade-in discover-container"
          style={{ display: "block" }}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeading}>{t("discover.title")}</h2>
          </div>
          <div className={styles.sectionBody}>
            {orderBy(types, ["numActivities"], ["desc"])
              .slice(0, 2)
              .map((el) => (
                <Link passHref href={el.urls[locale()]} key={el.id}>
                  <a className="item col-6">
                    <StaticImage
                      src={el.teaser_image.url}
                      alt={el.teaser_image.caption}
                      width={750}
                      height={420}
                      layout="responsive"
                    />
                    <div className="item-black-overlay" />
                    <div className="item-description">
                      <h3>{el.title}</h3>
                      <span>
                        <ActivitiesCounter count={el.numActivities} />
                      </span>
                    </div>
                  </a>
                </Link>
              ))}
            {orderBy(types, ["numActivities"], ["desc"])
              .slice(2, 5)
              .map((el) => (
                <Link passHref href={el.urls[locale()]} key={el.id}>
                  <a className="item col-4">
                    <StaticImage
                      src={el.teaser_image.url}
                      alt={el.teaser_image.caption}
                      width={860}
                      height={560}
                      layout="responsive"
                    />
                    <div className="item-black-overlay" />
                    <div className="item-description">
                      <h3>{el.title}</h3>
                      <span>
                        <ActivitiesCounter count={el.numActivities} />
                      </span>
                    </div>
                  </a>
                </Link>
              ))}
          </div>
            {isMobile && (
                <div className={styles.sectionMobileBody}>

                    <div className="mobile-view">
                        {orderBy(types, ["numActivities"], ["desc"]).map((el) => (
                            <Link passHref href={el.urls[locale()]} key={el.id}>
                                <a className="item">
                                    <StaticImage
                                        src={el.teaser_image.url}
                                        alt={el.teaser_image.caption}
                                        width={560}
                                        height={560}
                                        layout="responsive"
                                    />
                                    <div className="item-red-overlay" />
                                    <div className="item-black-overlay" />
                                    <div className="item-description">
                                        <h3>{el.title}</h3>
                                        <span>
                          <ActivitiesCounter count={el.numActivities} />
                        </span>
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </div>

                </div>
            )}

        </div>
      </section>

      <section className={styles.sectionTopActivities}>
        <div
          className="container fade-in topActivities-container"
          style={{ display: "block" }}
        >
          <div className={styles.sectionHeader}>
            <h2>{t("topActivities.title")}</h2>
            <Link passHref href={activitiesURLs[locale()]}>
              <a>
                {t("filter.viewAll")} <BsArrowRightShort />
              </a>
            </Link>
          </div>
          <div className={styles.sectionBody}>
            {activities.map((el) => (
              <div key={el.id} className={styles.item}>
                <Link passHref href={el.urls[locale()]}>
                  <a>
                    <StaticImage
                      src={el.teaser_image.url}
                      alt={el.teaser_image.caption}
                      width={566}
                      height={560}
                      layout="responsive"
                    />
                  </a>
                </Link>
                <div className={styles.itemDescription}>
                  <h3>
                    <Link passHref href={el.urls[locale()]}>
                      <a>{el.info.title}</a>
                    </Link>
                  </h3>
                  <span>
                    {el.info.teaser.slice(0, 150)} {"..."}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {isMobile && (
              <div className={styles.sectionMobileBody}>
                  <div className="mobile-view">
                      {activities.map((el) => (
                          <div key={el.id} className={styles.item}>
                              <Link passHref href={el.urls[locale()]}>
                                  <a>
                                      <StaticImage
                                          src={el.teaser_image.url}
                                          alt={el.teaser_image.caption}
                                          width={560}
                                          height={560}
                                          layout="responsive"
                                      />
                                  </a>
                              </Link>
                              <div className={styles.itemDescription}>
                                  <h3>
                                      <Link passHref href={el.urls[locale()]}>
                                          <a>{el.info.title}</a>
                                      </Link>
                                  </h3>
                                  <span>
                        {el.info.teaser.slice(0, 150)} {"..."}
                      </span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

        </div>
      </section>

    </Layout>
  );
};

function ActivitiesCounter({ count }) {
  const { t } = useI18n();

  return (
    <>
      {count} {t(count === 1 ? "filter.activity" : "filter.activities")}
    </>
  );
}

export default Homepage;
