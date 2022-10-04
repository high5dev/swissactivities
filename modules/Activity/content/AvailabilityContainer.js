import React, { useCallback, useState } from "react";
import { useI18n } from "next-localization";
import classnames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageGallery from "react-image-gallery";

import Button from "../../Button";
import BookingWidget from "../../BookingWidget";
import StaticImage from "../../Image";
import styles from "../styles.module.scss";
import Modal from "../../Modal";
import Usps, { attributesMapping } from "../../Usps";
import UspsSection from "./UspsSection";
import ActivityHeader, { Header } from "./ActivityHeader";
import MapView, { GimmickMap } from "../../MapView";
import RatingLine from "../../RatingLine";

const ImageGalleryItem = (props) => {
  return (
    <StaticImage
      src={props.original}
      alt={props.alt}
      layout="responsive"
      quality={60}
      loading={props.index === 0 ? "eager" : "lazy"}
      width={650}
      height={400}
    />
  );
};

const ImageGalleryThumb = (props) => {
  return (
    <div className={styles.galleryThumbnailInner}>
      <StaticImage
        src={props.original}
        alt={props.alt}
        quality={40}
        layout="responsive"
        width={380}
        height={280}
      />
    </div>
  );
};

export const getUnixDate = (unixTime) => {
  const date = new Date(unixTime * 1000);
  return (
    ("0" + date.getDate()).slice(-2) +
    "." +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "." +
    date.getFullYear()
  );
};

const AvailabilityContainer = ({
  activity,
  breadcrumbs,
  weather,
  availabilitiesList,
  isWidgetActive,
  setWidgetActive,
  widgetRef,
  isMobile,
  onOpenMapListView,
  uspTitle,
  ...props
}) => {
  const { t } = useI18n();
  // const rating = 5;
  const { mappedId, page, availableDates } = props;

  const tourArtId = 7;
  const tourartAttributes = activity.attribute_values.filter(
    ({ attribute }) => attribute && Number(attribute.id) === tourArtId
  );
  const translationTitleKey =
    tourartAttributes[0] && attributesMapping[tourartAttributes[0].id];
  const title = translationTitleKey
    ? t(`attributes.${translationTitleKey}`)
    : t("activity.offer");

  return (
    <section className={styles.sectionBody} id="availability">
      <div
        className={classnames(
          "activity-container",
          styles.availabilityContainer
        )}
      >
        <div className={styles.availability}>
          <div className={styles.gallery}>
            <div className={styles.slider + " activity-mobile-slider"}>
              {isMobile ? (
                <Swiper
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  className="carousel"
                  allowSlideNext={true}
                  allowSlidePrev={true}
                >
                  {activity.gallery &&
                    activity.gallery.map((el, index) => {
                      return (
                        <SwiperSlide key={"swipe " + index}>
                          <div className={styles.background}>
                            <StaticImage
                              src={el.url}
                              alt={"alt"}
                              width={400}
                              height={328}
                              layout="responsive"
                              quality={40}
                              priority={index === 0}
                            />
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              ) : (
                <>
                  {typeof isMobile === "boolean" ? (
                    <ImageGallery
                      items={activity.gallery.map((img, idx) => {
                        return {
                          alt: img.caption || activity.info.title,
                          index: idx,
                          original: img.url,
                          thumbnail: img.url,
                          thumbnailClass: styles.galleryThumbnail,
                        };
                      })}
                      renderThumbInner={ImageGalleryThumb}
                      renderItem={ImageGalleryItem}
                      useBrowserFullscreen={false}
                      showPlayButton={false}
                      showFullscreenButton={false}
                    />
                  ) : null}
                </>
              )}
            </div>
          </div>

          <div ref={widgetRef} className={`${styles.calendar}`}>
            <div className={styles.contentTopBlock}>
              <h2>{t("activity.uspTitle", { title })}</h2>
              <p>{activity.info.teaser}</p>
            </div>

            {!isMobile && (
              <div className={styles.middleBlock}>
                <h3>{t("activity.advantage.title")}</h3>
                <UspsSection
                  usps={activity.usps}
                  attributes={activity.attribute_values}
                  getUspDate={props.getUspDate}
                  bookNow={props.bookNow}
                />
              </div>
            )}

            <div className={styles.bottomBlock}>
              <div className={styles.bookingBlock}>
                <div className={styles.rightBlock}>
                  <span className={styles.from}>{t("search.card.from")}</span>
                  <span className={styles.currency}>
                    {props.startingPrice
                      ? props.startingPrice.startingPrice.currency
                      : "N/A"}{" "}
                    {props.startingPrice
                      ? parseFloat(props.startingPrice.startingPrice.amount)
                      : ""}
                  </span>
                  <span className={styles.person}>
                    {t("search.card.person")}
                  </span>
                </div>
                <Button
                  title={t("activity.booknow")}
                  onClick={props.bookNow}
                  customStyle={styles.bookingNow}
                />
              </div>
            </div>
          </div>

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
              {props.widgetComponent}
            </Modal>
          )}
        </div>
        <div className={styles.availabilityForm}>
          <Button
            title={"Check availability"}
            onClick={() => console.log("book now")}
            customStyle="check-availability"
          />
          <div className={styles.detail}>
            This tour was booked from more than <span>253 people</span>.
          </div>
        </div>
      </div>

      {/* isMobile &&

                <MainHeader
                  activity={activity}
                  isMobileBody
                  isMobile={isMobile}
                />
                 */}

      {/* <Modal
                open={props.openWeatherModal}
                onClose={props.handleOpenWeatherModal}
                classes={{
                    modal: styles.modal,
                    modalContainer: styles.modalContainer,
                }}
            >
                <div className={styles.weather}>
                {weather && weather.daily?.map((item, index) => {
                    const mintemp = item.temp.min - 273
                    const maxtemp = item.temp.max - 273

                    return (
                        <div key={'div ' + index} className={"content " + styles.weatherContent}>
                            <p>{getUnixDate(item.dt)}</p>
                            <StaticImage src={`/assets/weather/${ item.weather[0].icon.replace('d','n')}.png`} width="50" height="50" alt=""/>
                            <p className={styles.temp}>
                                <span className={styles.maxtemp}> {Math.ceil(maxtemp) } </span> /
                                <span className={styles.mintemp}> {Math.ceil(mintemp)} </span> °C
                            </p>
                        </div>
                    )
                })}
                </div>
            </Modal> */}
    </section>
  );
};

export default AvailabilityContainer;
