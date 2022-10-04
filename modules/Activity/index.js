import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useI18n } from "next-localization";
import Layout from "../_components/Layout";
import MapView, { GimmickMap } from "../MapView";
import BookingWidget from "../BookingWidgetActivity";
import ActivityHeader from "./content/ActivityHeader";
import StickyHeader from "./StickyHeader";
import Tabs from "../_components/Tabs";
import ContactForm from "../ContactUs/ContactForm";
import Accordions from "./Accordions";
import ProductGoogleStructuredData from "./ProductGSD";
import styles from "./styles.module.scss";
import Main from "./Main";
import Modal from "../Modal";
import SimilarActivities from "./SimilarActivities";
import { EmailSubscription } from "../_components/EmailSubscription";
import { Text } from "../_components/Text";
import { SkiResort } from "../_components/SkiResort";
import classNames from "classnames";

// const weatherKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

const Activity = (props) => {
  const {
    activity,
    page,
    path,
    availabilitiesList,
    algolia,
    summary,
    breadcrumbs,
    similarActivities,
    availabilityNew,
    menu,
  } = props;

  const formRef = useRef(null);
  const widgetRef = useRef(null);
  const mobileWidgetRef = useRef(null);
  const mobileWidgetScrollRef = useRef(null);
  const stickyRef = useRef(false);
  const { t, locale } = useI18n();

  const [isWidgetActive, setWidgetActive] = useState(false);
  const [isSticky, setSticky] = useState(false);
  // const [weather, setWeather] = useState('');
  const [isVisibleMapList, setVisibleMap] = useState(false);
  const [isMobile, setIsMobile] = useState(null);
  // const [openWeatherModal, setOpenWeatherModal] = useState(false);
  const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);
  const [firstAvailableDateNumber, setFirstAvailableDateNumber] = useState(0);
  const [isOpenAttraction, setOpenAttraction] = useState(false);
  const [currentMonthAvailableDates, setCurrentMonthAvailableDates] = useState(
    []
  );

  // const handleOpenWeatherModal = () => setOpenWeatherModal(!openWeatherModal);

  const getAvailableDates = useCallback(async () => {
    let index = 1;
    const getter = async (number) => {
      const date = new Date().getMonth() + number;

      await axios
        .get(
          `${process.env.NEXT_PUBLIC_BOOKINGAPI_HOST}/activities/${
            activity.summary.activityId
          }/monthly-availabilities?year=${new Date().getFullYear()}&month=${date}`
        )
        .then((resp) => {
          if (
            Object.entries(resp.data).every((item) => item[1].price === null)
          ) {
            index++;
            if (12 >= date && 6 >= index) {
              getter(index);
            }
          } else {
            setCurrentMonthAvailableDates(resp.data);
          }
        });
    };

    activity?.summary?.activityId && (await getter(1));
  }, []);

  useEffect(() => {
    if (activity.summary) getAvailableDates();
  }, [activity]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.body.setAttribute("class", "activity-page");

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.removeAttribute("class");
    };
  }, []);

  useEffect(() => {
    if (!isMobile && isWidgetActive) {
      document.querySelector("html").style.cssText = "overflow-y: hidden";
    } else {
      document.querySelector("html").removeAttribute("style");
    }

    if (isMobile && isWidgetActive) {
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      if (!isMobile) {
        document.querySelector("html").removeAttribute("style");
      }
    };
  }, [isWidgetActive, isMobile]);

  // useEffect(() => {
  //   const loadWeather = async () => {
  //     const lat = activity.meeting_points[0].latitude;
  //     const lon = activity.meeting_points[0].longitude;
  //     const host = process.env.NEXT_PUBLIC_OPENWEATHER_HOST;
  //
  //     const resp = await axios.get(`${host}/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=${page.locale.substring(0, 2)}&appid=${weatherKey}`);
  //     setWeather(resp.data)
  //   }
  //
  //   loadWeather();
  // }, []);

  useEffect(() => {
    let isHaveAvailableOffer = false;
    const today = new Date();

    const isHaveTicketsAttribute = activity.attribute_values.find(
      (attributeValue) =>
        attributeValue.value === "Tickets" &&
        Number(attributeValue.attribute.id) === 7
    );

    const availabilitiesListCutoff = availabilitiesList
      .map((availability) => {
        const filteredAvailabilities = availability.availabilities.filter(
          ({ cutoff }) => {
            return today.getTime() < new Date(cutoff).getTime();
          }
        );

        if (filteredAvailabilities.length) {
          isHaveAvailableOffer = true;

          return {
            ...availability,
            availabilities: filteredAvailabilities,
          };
        }

        return null;
      })
      .filter((item) => item);

    if (availabilitiesListCutoff.length === 0) {
      setFirstAvailableDateNumber((prev) => prev + 1);
    }

    if (availabilitiesListCutoff.length > 0 && isHaveTicketsAttribute) {
      setOpenAttraction(true);
    }

    setFilteredAvailabilities(availabilitiesListCutoff);
  }, [availabilitiesList]);

  const handleScroll = () => {
    const isMobileCurrent = window.matchMedia("(max-width: 512px)").matches; // the scroll listener doesn't have access to the component state

    if (isMobileCurrent) {
      const isWidgetVisible =
        document.getElementById("booking-widget") &&
        !checkVisible(document.getElementById("booking-widget"));

      function checkVisible(elm) {
        const rect = elm.getBoundingClientRect();
        const viewHeight = Math.max(
          document.documentElement.clientHeight,
          window.innerHeight
        );

        return !(rect.bottom < 80 || rect.top - viewHeight >= -60);
      }

      setSticky(isWidgetVisible);
    } else {
      const aboutContainer = document?.getElementById("about");
      const boundingContentBlocks = aboutContainer?.getBoundingClientRect();
      const isMobileWidgetVisible = boundingContentBlocks?.top < 0;

      if (isMobileWidgetVisible) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    }
  };

  const bookNow = () => {
    //widgetRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setWidgetActive(!isWidgetActive);
    if (isMobile) {
      scrollToMobileWidget();
    }
  };

  const scrollToMobileWidget = () => {
    mobileWidgetScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const meta = {
    title: activity.info.title,
    desc: activity.info.teaser,
    locale: locale(),
    image: activity.teaser_image.url,
    id: activity.id,
  };

  const handleGA = () => {
    dataLayer.push({
      event: "view_item",
      ecommerce: {
        items: [
          {
            item_name: activity.info.title,
            item_id: activity.id, // id of the item if exists, if not, do not add this line to the code
            price: 0, //should be a number NOT a string
            item_region: activity.location.title, // It should take region name. example
            item_category: activity.type.title, // Category of the activity. Example is here
          },
        ],
      },
    });
  };

  useEffect(() => {
    handleGA();

    function handleResize() {
      setIsMobile(window.matchMedia("(max-width: 512px)").matches);
    }

    window.addEventListener("resize", handleResize);

    handleResize(); //init call
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onOpenMapListView = (e) => {
    setVisibleMap(!isVisibleMapList);
  };

  const getUspDate = () => {
    const firstAvailableDate = new Date(
      props.availableDates[firstAvailableDateNumber]
    );
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    today.setUTCHours(0, 0, 0, 0);

    const dateDiff = firstAvailableDate.getTime() - today.getTime();

    if (dateDiff < oneDay) return t("filter.today");
    if (dateDiff === oneDay) return t("filter.tomorrow");

    const currentDay = today.getUTCDay();

    const maxDayNumber = 7;
    if (dateDiff > oneDay && dateDiff <= (maxDayNumber - currentDay) * oneDay) {
      return ` ${firstAvailableDate.toLocaleDateString(
        locale().replace("_", "-"),
        {
          weekday: "long",
        }
      )}`;
    }

    return firstAvailableDate.toLocaleDateString(locale().replace("_", "-"), {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const scrollToForm = () => {
    formRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const widgetComponent = (
    <BookingWidget
      currentMonthAvailableDates={currentMonthAvailableDates}
      availabilitiesList={filteredAvailabilities}
      mappedId={props.mappedId}
      availableDates={props.availableDates}
      isActive={isWidgetActive}
      setWidgetState={setWidgetActive}
      activity={activity}
      firstAvailableDate={props.availableDates[firstAvailableDateNumber]}
      firstAvailableDateObject={
        new Date(props.availableDates[firstAvailableDateNumber])
      }
      scrollToForm={scrollToForm}
      mobileWidgetScrollRef={mobileWidgetScrollRef}
      isMobile={isMobile}
      locale={page.locale}
      t={t}
    />
  );

  return (
    <Layout
      isSearchPage={true}
      pageUrls={activity.urls}
      pageType={props.page.type}
      menu={menu}
      {...{ isMobile, meta, algolia }}
    >
      <ProductGoogleStructuredData summary={summary} activity={activity} />
      <ActivityHeader
        activity={activity}
        isMobile={isMobile}
        breadcrumbs={breadcrumbs}
        tag="span"
      />
      {!Object.entries(currentMonthAvailableDates).every(
        (item) => item[1].price === null
      ) && (
        <StickyHeader
          activity={activity}
          locale={path[0]}
          bookNow={bookNow}
          price={props.startingPrice}
          open={isSticky}
        />
      )}
      {/*
        <AvailabilityContainer
        widgetComponent={widgetComponent}
        availabilitiesList={availabilitiesList}
        activity={activity}
        // weather={weather}
        // openWeatherModal={openWeatherModal}
        // handleOpenWeatherModal={handleOpenWeatherModal}
        isWidgetActive={isWidgetActive}
        setWidgetActive={setWidgetActive}
        widgetRef={widgetRef}
        isMobile={isMobile}
        onOpenMapListView={onOpenMapListView}
        getUspDate={getUspDate}
        bookNow={bookNow}
        {...props}
      />
      */}
      <Main
        activity={activity}
        getUspDate={getUspDate}
        bookNow={bookNow}
        currentMonthAvailableDates={currentMonthAvailableDates}
        startingPrice={props.startingPrice}
        isOpenAttraction={isOpenAttraction}
        isMobile={isMobile}
        widgetComponent={widgetComponent}
        mobileWidgetRef={mobileWidgetRef}
      />
      {!isMobile && (
        <Modal
          open={isWidgetActive}
          onClose={() => setWidgetActive(false)}
          classes={{
            modal: styles.widgetModal,
            modalContainer: styles.widgetModalContainer,
            root: styles.widgetModalRoot,
          }}
        >
          {widgetComponent}
        </Modal>
      )}
      {activity.skiresortInfo && (
        <section className={`mt-6 md:mt-8 lg:mt-10 xl:mt-12`}>
          <SkiResort region={activity.skiresortInfo} />
        </section>
      )}
      <section className={`md:mt-6 lg:mt-12 xl:mt-16`}>
        <Tabs activity={activity} />
      </section>
      <section className={styles.sectionBody} id="contents-two">
        <div className="activity-container">
          <div className="col-8-activity content-bar">
            <Accordions
              activity={activity}
              isMobile={isMobile}
              onOpenMapListView={onOpenMapListView}
              mobileWidgetRef={mobileWidgetRef}
              widgetComponent={widgetComponent}
            />
          </div>

          <div className="col-4 right-sidebar">
            {!isMobile && typeof isMobile === "boolean" && (
              <div className={styles.sidePan} id="subscribe">
                <div className="map-wrap">
                  <GimmickMap
                    t={t}
                    isMobile={isMobile}
                    mapVisible={isVisibleMapList}
                    switchHandler={onOpenMapListView}
                  >
                    <MapView
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBcKGk6X9qCfWICi9RmPCebhCwm4NnTP0E&v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={
                        <div id="map" style={{ height: `100%` }} />
                      }
                      mapElement={<div style={{ height: `100%` }} />}
                      onClick={() => console.log("Click Map")}
                      hideMapView={onOpenMapListView}
                      type="activity"
                      activity={{
                        ...activity,
                        price: props.prices.find(
                          (price) =>
                            price.contentApiActivityId === parseInt(activity.id)
                        ),
                      }}
                      t={t}
                      isWidgetActive={isWidgetActive}
                      setWidgetActive={setWidgetActive}
                      isMobile={isMobile}
                      destination={activity.meeting_points[0]}
                    />
                  </GimmickMap>
                </div>

                <div className={styles.panBody} ref={formRef}>
                  <ContactForm pageTitle={activity.info.title}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {isMobile && (
        <>
          <GimmickMap
            t={t}
            isMobile={isMobile}
            mapVisible={isVisibleMapList}
            switchHandler={onOpenMapListView}
          >
            <MapView
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBcKGk6X9qCfWICi9RmPCebhCwm4NnTP0E&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div id="map" style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              onClick={() => console.log("Click Map")}
              hideMapView={onOpenMapListView}
              type="activity"
              activity={{
                ...activity,
                price: props.prices.find(
                  (price) =>
                    price.contentApiActivityId === parseInt(activity.id)
                ),
              }}
              t={t}
              isWidgetActive={isWidgetActive}
              setWidgetActive={setWidgetActive}
              isMobile={isMobile}
              destination={activity.meeting_points[0]}
            />
          </GimmickMap>
          <div className={classNames(styles.mobileContactForm, 'hidden lg:block')}>
            <div className={styles.panBody} ref={formRef}>
              <ContactForm pageTitle={activity.info.title} />
            </div>
          </div>
        </>
      )}
      {!!similarActivities?.length && (
        <section className={`container-tw`}>
          <SimilarActivities activities={similarActivities} />
        </section>
      )}
      <div className={`my-12 lg:my-16 xl:my-20`}>
        <EmailSubscription/>
      </div>
    </Layout>
  );
};

export default Activity;
