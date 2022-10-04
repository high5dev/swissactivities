import React, { useState, useEffect, useCallback, useMemo } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import ReactGallery from "react-image-gallery";

import OfferCardDetails from "../../Activity/content/OfferCardDetails";
import OfferCard from "../../OfferCard";
import Button from "../../Button";

import styles from "./styles.module.scss";

const Arrow = () => {
  return (
    <svg
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.25 16.5L8.75 9L1.25 1.5"
        stroke="#002F49"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const RightArrow = (onClick, disabled) => {
  if (disabled) {
    return null;
  }
  return (
    <button className={styles.rightArrow} onClick={onClick} disabled={disabled}>
      <Arrow />
    </button>
  );
};
const LeftArrow = (onClick, disabled) => {
  if (disabled) {
    return null;
  }
  return (
    <button className={styles.leftArrow} onClick={onClick} disabled={disabled}>
      <Arrow />
    </button>
  );
};

const CarouselWrapper = ({ children, isActive }) => {
  const [isActivated, setActivated] = useState(isActive);
  useEffect(() => {
    if (isActive && !isActivated) {
      setActivated(true);
    }
  }, [isActive]);

  return (
    <div
      className={classnames(
        styles.carouselWrapper,
        isActive ? "container-new" : styles.hidden
      )}
    >
      {isActivated ? children : null}
    </div>
  );
};

const Offers = ({ title, offers, isMobile, type, blogActivities }) => {
  const { t, locale } = useI18n();
  const [activeOffer, setActiveOffer] = useState(null);
  const [activeTab, setActiveTab] = useState(offers.topActivities?.length ? "topActivities" : Object.keys(offers)[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [animationState, setAnimationState] = useState(0);

  const getUspDate = (startingDate) => {
    if (!startingDate) return null;

    const firstAvailableDate = new Date(startingDate);
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

  const handlePage = (pageNum) => {
    setAnimationState(1);
  };

  const handleTransition = (e) => {
    if (animationState === 1) {
      setAnimationState(2);
      setCurrentPage(currentPage ? 0 : 1);
    }
    if (animationState === 2) {
      setAnimationState(0);
    }
  };

  const offersList = useMemo(() => {
    if(type==="blog_post"){
      return blogActivities;
    }
    if (activeTab === "topActivities") {
      return offers[activeTab];
    }
    return offers[activeTab].activities;
  }, [activeTab]);

  const handleTabClick = (id) => {
    setActiveTab(id);
    setCurrentPage(0);
  };

  return (
    <div className={styles.offersSection}>
      <div className="container-new column">
        <div className={styles.offersTitleSection}>
          <h2 className={styles.title}>
            {t("pages.listing.offersTitle", { title })}
          </h2>
          <div className={styles.buttons}>
            <Button
              title={
                isMobile
                  ? t("pages.listing.viewAll")
                  : t("pages.listing.viewAllActivities")
              }
              onClick={() => {}}
              outline
              customStyle={styles.button}
            />
          </div>
        </div>
        {type !== "point_of_interest" && (<div className={styles.tags}>
        {!!offers.topActivities?.length && <Button
            title={t("pages.listing.topActivities")}
            onClick={() => handleTabClick("topActivities")}
            customStyle={classnames(styles.tag, {
              [styles.activeTag]: activeTab === "topActivities",
            })}
          />}
          {Object.keys(offers).map(
            (offerCategoryId) =>
              offerCategoryId !== "topActivities" && (
                <Button
                  key={offerCategoryId}
                  title={offers[offerCategoryId].title}
                  onClick={() => handleTabClick(offerCategoryId)}
                  customStyle={classnames(styles.tag, {
                    [styles.activeTag]: offerCategoryId === activeTab,
                  })}
                />
              )
          )}
        </div>)}

        {isMobile ? (
          <div className={styles.offersContainer}>
            <ReactGallery
              items={offersList}
              useBrowserFullscreen={false}
              showPlayButton={false}
              showThumbnails={false}
              showFullscreenButton={false}
              dynamicHeight={true}
              renderLeftNav={LeftArrow}
              renderRightNav={RightArrow}
              renderItem={(offer) => (
                <OfferCard
                  key={offer.id}
                  activity={offer}
                  isActive={activeOffer?.id === offer.id}
                  onDetails={setActiveOffer}
                  startingDate={offer.startingDate}
                  className={styles.offerCard}
                />
              )}
            />
          </div>
        ) : offersList.length < 4 ? (
          <div className={styles.offersLine}>
            <div className={styles.offersContainer}>
              {offersList.map((offer) => (
                <OfferCard
                  key={offer.id}
                  activity={offer}
                  isActive={activeOffer?.id === offer.id}
                  onDetails={setActiveOffer}
                  startingDate={offer.startingDate}
                  className={styles.offerCard}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.offersLine}>
            {LeftArrow(() => handlePage(0), currentPage < 1)}
            {RightArrow(() => handlePage(1), currentPage === 1)}
            <div
              className={classnames(styles.offersContainer, {
                [styles.secondPage]: currentPage === 1,
                [styles.offerTransition]: animationState === 1,
                [styles.offerTransitionShow]: animationState === 2,
              })}
              onAnimationEnd={handleTransition}
            >
              <CarouselWrapper isActive={currentPage < 1}>
                {offersList &&
                  offersList.slice(0, 4).map((offer) => {
                    return (
                      <OfferCard
                        key={offer.id}
                        activity={offer}
                        isActive={activeOffer?.id === offer.id}
                        onDetails={setActiveOffer}
                        startingDate={offer.startingDate}
                        className={styles.offerCard}
                      />
                    );
                  })}
              </CarouselWrapper>
              <CarouselWrapper isActive={currentPage === 1}>
                {offersList &&
                  offersList.slice(4, 8).map((offer) => {
                    return (
                      <OfferCard
                        key={offer.id}
                        activity={offer}
                        isActive={activeOffer?.id === offer.id}
                        onDetails={setActiveOffer}
                        startingDate={offer.startingDate}
                        className={styles.offerCard}
                      />
                    );
                  })}
              </CarouselWrapper>
            </div>
          </div>
        )}
      </div>
      {activeOffer && (
        <OfferCardDetails
          details={activeOffer}
          containerClassName={styles.detailsContainer}
        />
      )}
    </div>
  );
};

export default Offers;
