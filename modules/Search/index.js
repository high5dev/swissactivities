import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import chunk from "lodash/chunk";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import orderBy from "lodash/orderBy";
import concat from "lodash/concat";
import cx from 'classnames';
import { Swiper, SwiperSlide } from "swiper/react";

import moment from "moment";
import Link from "next/link";
import {
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
// import Flickity from 'react-flickity-component'

import styles from "./styles.module.scss";
import Layout from "../_components/Layout";
import ListComponent from "../ListComponent";
import ActivityComponent from "../ActivityComponent";
import MapListView from "../MapListView";
import Filter from "../Filter";

import ContactPopup from "../ContactPopup";
// import Tag from "../Tag";
import { findType } from "../../lib/functions";
import StaticImage from "../Image";

import {
  getLocationTypeUrl,
  getPageUrl,
  getPageUrls,
} from "../../services/contentServices";
import { defaultLocale, locales } from "../../lib/i18n";
import { getNextAvailable, getAvailableDates } from "../../lib/functions";
import { useI18n } from "next-localization";
import NavigationBreadcrumbs from "./NavigationBreadcrumbs";
import FaqGoogleStructuredData from "./FaqGSD";
import CategoryDetails from "./CategoryDetails";
import SubTitle from "./SubTitle";
import { getArray } from "../../utils";
import HeadFilterSection from "../ListingWrapper/HeadFilterSection";
import {dataLayerSend} from "../../utils/dataLayerSend";


export const NUM_ACTIVITIES_PER_PAGE = 24;

const Accordion = ({ question, answer, id }) => {
  const answerClasses = cx('accordionTab-content', styles.answerContainer);

  return (
    <div className="accordionTab">
      <input type="radio" id={`chck${id}`} name="radio" />
      <label className="accordionTab-label" htmlFor={`chck${id}`}>
        <h2 className={styles.questionTitle}>{question}</h2>
      </label>
      <div className={answerClasses}>{answer}</div>
    </div>
  );
};

const Activities = (props) => {
  const {
    activities,
    location,
    type,
    locations,
    types,
    prices,
    dates,
    total,
    pageNum,
    page,
    algolia,
    typeColors,
    menu,
  } = props;
  const current = pageNum - 1;
  const { t, locale } = useI18n();
  const [search, setSearch] = useState("");
  const [isVisibleMapList, setVisibleMap] = useState(false);
  const [filterValues, setFilterValues] = useState([]);
  const [activityArray, setActivities] = useState(activities);
  const [view, setView] = useState("list");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const filterButtonTargetRef = useRef(null);
  const [showMobileFiltersButton, setShowMobileFiltersButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [allowSwipe, setAllowSwipe] = useState(false);
  const [titleColors, setTitleColors] = useState([]);

  // Controls [isMobile] state. Sets it to true in case screen width less or equal 512px
  // Controls [allowSwipe] state. If screen smaller than 1408px, allows categories swipe.
  const handleResize = useCallback(() => {
    const isCurrentlyMobile = window.innerWidth <= 512;

    if (isCurrentlyMobile !== isMobile) {
      setIsMobile(isCurrentlyMobile);
    }

    const isSmallScreen = window.innerWidth <= 1408;
    if (isSmallScreen && !allowSwipe) {
      setAllowSwipe(true);
    }
    if (!isSmallScreen && allowSwipe) {
      setAllowSwipe(false);
    }
  }, [isMobile, allowSwipe])

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Controls [showMobileFiltersButton] state. Sets it to true in case page has scrolled further
  // than Categories section ([filterButtonTargetRef.current] element)
  useEffect(() => {
    const { current } = filterButtonTargetRef;

    if (!isMobile) {
      setShowMobileFiltersButton(false);
    }
    const listenScroll = () => {
      const aboveTheScreen = current.offsetTop <= window.scrollY;
      setShowMobileFiltersButton(isMobile && aboveTheScreen);
    };
    window.addEventListener('scroll', listenScroll);

    return () => {
      window.removeEventListener('scroll', listenScroll);
    };
  }, [setShowMobileFiltersButton, isMobile, filterButtonTargetRef]);

  useEffect(() => {
    if (startDate && endDate && moment(startDate) < moment(endDate)) {
      const array = getAvailableDates(dates, startDate, endDate);
      setActivities(activities.filter((el) => array.includes(parseInt(el.id))));
    } else {
      setActivities(activities);
    }
  }, [activities, startDate, endDate]);

  useEffect(() => {
    console.log(activities);

    dataLayerSend({
      event: "view_item_list",
      items: activities.map((item) => {
        return {
          item_name: item?.info?.title.trim(),
          id: item?.id,
          location_id: locale().replace("_CH", "-ch"),
          value: item?.summary?.minPrice?.amount,
          currency: item?.summary?.minPrice?.currency,
        };
      }),
    });
  }, []);

  const goTo = (index) => {
    let temp = cloneDeep(props.path);
    let pageNum = temp.pop();
    const regExp = /[a-zA-Z]/g;
    if (
      pageNum === "404" ||
      pageNum === "500" ||
      regExp.test(pageNum) ||
      pageNum.includes("/")
    ) {
      temp = props.path;
    }

    let pagePath = "/" + temp.join("/") + "/";
    if (index > 0) {
      pagePath += `${index + 1}/`;
    }

    return pagePath;
  };

  const generatePagination = () => {
    const totalCounts = Math.ceil(total / NUM_ACTIVITIES_PER_PAGE);

    return (
      <div className="pagination-container">
        <ul className="pagination">
          <li className={`prev${pageNum === 1 ? " disabled" : ""}`}>
            <Link href={goTo(pageNum === 1 ? 0 : current - 1)} passHref>
              <a>
                <BsChevronLeft />
              </a>
            </Link>
          </li>
          {totalCounts < 5 ? (
            <>
              {Array.from(new Array(totalCounts)).map((_, index) => (
                <li
                  key={index}
                  className={index === current ? "active" : ""}
                >
                  <Link href={goTo(index)} passHref>
                    <a>{index + 1}</a>
                  </Link>
                </li>
              ))}
            </>
          ) : current < 2 ? (
            <>
              {Array.from(new Array(5)).map((_, index) => (
                <li
                  key={index}
                  className={index === current ? "active" : ""}
                >
                  <Link href={goTo(index)} passHref>
                    <a>{index + 1}</a>
                  </Link>
                </li>
              ))}
            </>
          ) : current > 1 && current < totalCounts - 3 ? (
            <>
              {Array.from(new Array(5)).map((_, index) => (
                <li
                  key={index}
                  className={index === 2 ? "active" : ""}
                >
                  <Link href={goTo(index + current - 2)} passHref>
                    <a>{index + current - 1}</a>
                  </Link>
                </li>
              ))}
            </>
          ) : (
            current > totalCounts - 4 && (
              <>
                {Array.from(new Array(5)).map((_, index) => (
                  <li
                    key={index}
                    className={
                      index === current - totalCounts + 5 ? "active" : ""
                    }
                  >
                    <Link href={goTo(index + totalCounts - 5)} passHref>
                      <a>{index + totalCounts - 4}</a>
                    </Link>
                  </li>
                ))}
              </>
            )
          )}
          <li className={`next${pageNum === totalCounts ? " disabled" : ""}`}>
            <Link href={goTo(pageNum === totalCounts ? current : current + 1)} passHref>
              <a>
                <BsChevronRight />
              </a>
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const onOpenMapListView = () => {
    setVisibleMap(!isVisibleMapList);
  };

  const filterByValues = (values) => {
    const temp = [...filterValues];
    if (temp.filter((el) => isEqual(el, values)).length > 0) {
      setFilterValues(temp.filter((el) => !isEqual(el, values)));
    } else {
      temp.push(values);
      setFilterValues(temp);
    }

    if (temp.length < 1) {
      setActivities(activities);
      return;
    }

    const filteredPrices = prices.filter((el) => {
      let flag = false;
      temp.forEach((value) => {
        flag =
          flag ||
          (parseFloat(el.startingPrice.amount) > value[0] &&
            parseFloat(el.startingPrice.amount) < value[1]);
      });
      return flag;
    });
    const filteredActivities = activities.filter((el) =>
      filteredPrices.find(
        (price) => price.contentApiActivityId === parseInt(el.id)
      )
    );
    setActivities(filteredActivities);
  };

  let pageUrls = [];
  if (type && location) {
    for (const locale of locales.concat(defaultLocale)) {
      pageUrls[locale] = getLocationTypeUrl(location, type, locale);
    }
  } else if (type) {
    pageUrls = type.urls;
  } else if (location) {
    pageUrls = location.urls;
  } else {
    pageUrls = getPageUrls("activities");
  }

  const goToPage = (data, linkType) => {
    if (location && linkType === "type") {
      return getLocationTypeUrl(location, data, locale());
    } else if (type && linkType === "location") {
      return getLocationTypeUrl(data, type, locale());
    } else {
      return data.urls[locale()];
    }
  };

  const locationTitle = location ? location.title : t("menu.switzerland");

  // A meta suffix could be "ChildLocationParentType" or "ChildType"
  let metaTranslationSuffix = '';
  if (location) {
    metaTranslationSuffix += (location.parent ? 'Child' : 'Parent') + 'Location';
  }
  if (type) {
    metaTranslationSuffix += (type.parent ? 'Child' : 'Parent') + 'Type';
  }

  const metaTranslationParams = {
    locationTitle,
    typeTitle: type ? type.title : '',
  };

  let metaTitle = t('pages.activities.title' + metaTranslationSuffix, metaTranslationParams);
  let metaDescription = t('pages.activities.description' + metaTranslationSuffix, metaTranslationParams);
  if (pageNum > 1) {
    metaTitle = `${metaTitle} | ${t('search.pageNum', {num: pageNum})}`;
    metaDescription = `${t('search.pageNum', {num: pageNum})} - ${metaDescription}`;
  }

  let pageTitle = t("menu.switzerland");
  let headerBgImage = "/assets/search/freizeitaktivitaeten.webp";
  if (location && !type) {
    pageTitle = location.title;
    headerBgImage = location.teaser_image.url;
  } else if (!location && type) {
    pageTitle = type.title;
    headerBgImage = type.teaser_image.url;
  } else if (location && type) {
    pageTitle = `${type.title} | ${location.title}`;
    headerBgImage = type.teaser_image.url;
  }

  const meta = {
    title: metaTitle,
    desc: metaDescription,
    locale: locale(),
    image: headerBgImage,
  };

  const renderFixedFilter = () => {
    return (
      <div className={styles.sectionTypes}>
        <div className={styles.tagsbar}>
          <Swiper
            spaceBetween={20}
            slidesPerView={5}
            className="carousel"
            allowSlideNext={allowSwipe}
            allowSlidePrev={allowSwipe}
            breakpoints={{
              320: {
                width: 240,
                slidesPerView: 1,
                spaceBetween: 10,
              },
              // when window width is >= 640px
              640: {
                width: 260,
                slidesPerView: 1,
                spaceBetween: 10,
              },
            }}
          >
            {orderBy(types, ["numActivities"], ["desc"]).map((el) => (
              <SwiperSlide
                className={`tag-element medium ${
                  type && el.id === type.id ? "active" : ""
                }`}
                key={el.id}
              >
                <Link href={goToPage(el, "type")} passHref scroll={false}>
                  <a className={cx('Tag', 'search-tag', {
                    [styles.activeCategoryLink]: type && el.id === type.id,
                  })}>
                    <div className="tag-icon">
                      <StaticImage
                        src={`/assets/search/${el.id}.svg`}
                        alt={el.title}
                        width={30}
                        height={30}
                        layout="fixed"
                      />
                    </div>
                    <div className="tag-title">{`${el.title}`}</div>
                  </a>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={styles.btnGroup}>
          {/*<Button*/}
          {/*  iconStyle={true}*/}
          {/*  active={view === "grid"}*/}
          {/*  icon={<Icon color={view === 'grid' ? "#003049" : "#C4C4C4"} icon={<BsFillGrid3X3GapFill />} />}*/}
          {/*  onClick={() => setView("grid")}*/}
          {/*  customStyle="search-icon"*/}
          {/*/>*/}
          {/*<Button*/}
          {/*  iconStyle={true}*/}
          {/*  active={view === "list"}*/}
          {/*  icon={<Icon color={view === 'list' ? "#003049" : "#C4C4C4"} icon={<FaList />} />}*/}
          {/*  onClick={() => setView("list")}*/}
          {/*  customStyle="search-icon"*/}
          {/*/>*/}
        </div>
      </div>
    );
  };

  let faqs = [];

  if (page.type !== 'location-type') {
    if (location) {
      faqs = concat(faqs, location.faq);
    }
    if (type) {
      faqs = concat(faqs, type.faq);
    }
  }
  const filterData = {};

  const hasItem = useCallback((item, target) => (
    item && (item.id === target?.id || (item?.children || []).some((it) => hasItem(it, target)))
  ), []);

  if (page?.type === 'location' || page?.type === 'location-type') {
    filterData.type = type;
    filterData.types = types.filter((t) => (
      !type || hasItem(t, type)
    ));
    filterData.location = location;
    filterData.locations = locations.filter((loc) => (
      !location || hasItem(loc, location)
    ));
  } else {
    filterData.type = type;
    filterData.types = types;
    filterData.location = location;
    filterData.locations = locations;
  }
  const stType = !type ? null : {
    ...type,
    url: type.urls[locale()],
    related: getArray(types)
      .filter((t) => type?.id !== t.id)
      .slice(0, 3)
      .map((relatedType) => ({
        title: relatedType.title,
        url: relatedType.urls[locale()],
      })),
  };
  const stLocation = !location ? null : {
    ...location,
    url: location.urls[locale()],
  };
  if (stType?.parent?.id) {
    const stTypeParent = types.find(({ id }) => id === stType.parent.id);
    stTypeParent.url = stTypeParent.urls[locale()];
    stType.parent = stTypeParent;
  }
  return (
    <Layout
      meta={meta}
      type={type}
      isSearchPage
      algolia={algolia}
      pageNum={pageNum}
      location={location}
      pageUrls={pageUrls}
      pageType={props.page.type}
      menu={menu}
    >
      <section className={styles.sectionHeader}>
        <div className={styles.sectionHead}>
          <HeadFilterSection image={headerBgImage} alt={pageTitle}>
            <CategoryDetails
                title={pageTitle}
                pageNum={pageNum}
                image={headerBgImage}
                rootRef={filterButtonTargetRef}
                activitiesAmount={activities.length}
                subTitle={
                  <SubTitle
                      type={stType}
                      location={stLocation}
                      description={meta?.desc}
                      activitiesAmount={location?.numActivities || activities.length}
                  />
                }
            />
          </HeadFilterSection>
        </div>
      </section>
      <section className={styles.activitiesSection}>
        <div className="container">{renderFixedFilter()}</div>

        <NavigationBreadcrumbs
          goToPage={goToPage}
          location={location}
          locations={locations}
          pageType={page?.type}
        />

        <div
          className="container search-container"
          style={{ position: "relative" }}
        >
          <Filter
            goToPage={goToPage}
            showMobileButton={showMobileFiltersButton}
            {...filterData}
          />

          <div className={styles.activitiesContainer}>
            {/* <div className={styles.tagArea}>
              {(slug) && <span>{t("filter.filter")}</span>}
              {location && <Tag title={<span>{t("filter.location")}: {location.title}</span>}
                                size="medium"
                                active={false}
                                closable={true}
                                clickable={true}
                                customStyle={{ borderRadius: 8, border: '1px solid #E5E5E5', padding: '6px 10px', fontSize: 14, lineHeight: '21px', textTransform: 'capitalize' }}
                                onClick={removeLocationFilter}
              />}
              {type && <Tag title={<span>{t("filter.type")}: {type.title}</span>}
                            size="medium"
                            active={false}
                            closable={true}
                            clickable={true}
                            customStyle={{ borderRadius: 8, border: '1px solid #E5E5E5', padding: '6px 10px', fontSize: 14, lineHeight: '21px', textTransform: 'capitalize' }}
                            onClick={removeTypeFilter}
              />}
              {filterValues.map((el, index) => (
              el !== 0 && <Tag title={<span>{index === 0 ? "Min:" : "Max"} {el}</span>}
                              size="medium"
                              active={false}
                              closable={true}
                              clickable={true}
                              customStyle={{ borderRadius: 8, border: '1px solid #E5E5E5', padding: '6px 10px', fontSize: 14, lineHeight: '21px', textTransform: 'capitalize' }}
                              onClick={() => removeValueFilter(index)}
              />
              ))}
            </div> */}

            {activityArray.length > 0 ? (
              view === "list" ? (
                activityArray.map((el, index) => {
                return (
                  <>
                  {index === 2 && <div className={styles.contactBlock}>
                    <ContactPopup pageTitle={metaTitle}/>
                  </div>}
                  <ListComponent
                    once={el.once}
                    key={`listItem-${index}`}
                    id={el.uniqueId}
                    count={index + 1}
                    activity={{
                      ...el,
                      type: el.type ? findType(types, el.type.id) : null,
                    }}
                    typeColors={typeColors}
                    isMobile={isMobile}
                    highPriority={index === 0}
                  />
                  </>
                ) })
              ) : (
                view === "grid" &&
                chunk(activityArray, 3).map((parent, index) => (
                  <div className="activity" key={index}>
                    {parent.map((el, index) => (
                      <ActivityComponent
                        once={el.once}
                        key={index}
                        id={el.uniqueId}
                        count={index + 1}
                        activity={{
                          ...el,
                          type: el.type ? findType(types, el.type.id) : null,
                        }}
                        price={prices.find(
                          (price) =>
                            price.contentApiActivityId === parseInt(el.id)
                        )}
                      />
                    ))}
                  </div>
                ))
              )
            ) : (
              <div className={styles.noActivities}>
                {t("search.noActivities")}
              </div>
            )}
            {total > NUM_ACTIVITIES_PER_PAGE &&
              filterValues.length < 1 &&
              generatePagination()}
          </div>
        </div>
      </section>
      {faqs.length > 0 && pageNum === 1 && (
        <section className={styles.faqSection}>
          <div className="container faq-container">
            <div className={styles.faqContent}>
              <h2 className={styles.title}>FAQ {(location || type).title}</h2>
              <div className={styles.body}>
                {faqs.map((faq, index) => {
                  return (
                    <Accordion
                      key={`faq-${index}`}
                      id={`faq-${index}`}
                      question={faq.question}
                      answer={
                        <ReactMarkdown
                          plugins={[gfm]}
                          // eslint-disable-next-line
                          children={faq.answer}
                        />
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <FaqGoogleStructuredData faqs={faqs} />
        </section>
      )}
      {isVisibleMapList && (
        <MapListView
          selectedLocation={location}
          selectedType={type}
          locations={locations}
          types={types}
          hideMapView={onOpenMapListView}
          activities={activities}
          prices={prices}
        />
      )}
    </Layout>
  );
};

export default Activities;
