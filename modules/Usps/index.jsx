import React, { useMemo } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import Button from "../Button";
import Usp from "../Usp";

import styles from "./styles.module.scss";

//attribute_value id to translation key
export const attributesMapping = {
  17: "combiOffer",
  18: "transport",
  21: "tickets",
  22: "rent",
  23: "selfGuided",
  24: "guidedPrivate",
  25: "guidedGroup",
  33: "course",
};

const iconList = {
  clock: "clock.svg",
  duration: "duration.svg",
  protection: "protection.svg",
  lightning: "lightning.svg",
  smartphone: "smartphone.svg",
  tag: "tag.svg",
  fast: "fast.svg",
  skip_the_line: "skip_the_line.svg",
  round_trip: "round_trip.svg",
  full_day_ticket: "full_day_ticket.svg",
  discount: "discount.svg",
};

const ctaUsp = [
  "mobile_tickets",
  "discount",
  "no_registration",
  "full_day_ticket",
];

const addPos = (usp) => {
  switch (usp.key) {
    case "book_now":
      return 1;
    case "duration":
      return 2;
    case "discount":
      return 3;
    case "no_registration":
      return 4;
    case "mobile_tickets":
      return 5;
    case "free_cancellation":
      return 6;
    case "instant_confirmation":
      return 7;
    case "skip_the_line":
      return 8;
  }
};

const Usps = ({
  usps,
  getUspDate = () => {},
  bookNow = () => {},
  price,
  isMobile = false,
  isSearchPage = false,
  startingDate,
  darkText = false,
  uspClassName,
  className,
  wrapperClassName,
  currentMonthAvailableDates,
}) => {
  const { t, locale } = useI18n();
  const uspsWithPosition = usps.map((usp) => ({
    ...usp,
    position: addPos(usp),
  }));

  const getUspFields = (usp) => {
    if (!usp) return {};
    const translationItem =
      usp.translations &&
      usp.translations.find((translation) => translation.locale === locale());

    const label = translationItem ? translationItem.label : usp.label;
    const description = translationItem
      ? translationItem.description
      : usp.description;
    const uspFields = { label, description };

    return uspFields;
  };

  const bookNowItem = usps.find((usp) => {
    if (usp) {
      return usp.key === "book_now";
    }
  });

  const bookingAvailable = useMemo(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    if (!currentMonthAvailableDates) return;
    const firstAvailableDate = Object.keys(currentMonthAvailableDates).find(
      (date) => new Date(new Date().setHours(0,0,0,0)) < new Date(date)
    );

    const dateDiff = new Date(firstAvailableDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0);
    if (dateDiff < oneDay) return t("filter.today");
    if (dateDiff === oneDay) return t("filter.tomorrow");
    if (dateDiff > oneDay) return firstAvailableDate;
  }, [currentMonthAvailableDates]);

  const bookNowFields = getUspFields(bookNowItem);
  const bookForDate = bookingAvailable || getUspDate() || startingDate;

  return (
    <div className={classnames(styles.usps, wrapperClassName)}>
      <div
        className={classnames(styles.content, className, {
          [styles.contentSearchPage]: isSearchPage,
          [styles.darkText]: darkText,
        })}
      >
        {isMobile && (
          <div className="cta-block">
            {price ? (
              <div>
                <p>{t("activity.priceFrom")}</p>
                <p className="starting-price">
                  {price.startingPrice.formatted}
                </p>
              </div>
            ) : (
              "N/A"
            )}
            <Button title={t("activity.booknow")} onClick={bookNow} />
          </div>
        )}
        {bookNowItem && bookForDate && (
          <Usp
            key={bookNowItem.key}
            icon={`/assets/activity/${iconList[bookNowItem.icon_name]}`}
            description={bookNowFields.description}
            iconName={bookNowItem.icon_name}
            className={uspClassName}
          >
            <span className={styles.uspLabel}>
              {bookNowFields.label}
              <span className={styles.uspDate} onClick={bookNow}>
                {bookForDate}
              </span>
            </span>
          </Usp>
        )}
        {uspsWithPosition
          ?.sort((a, b) => a.position - b.position)
          .map((usp) => {
            const { label, description } = getUspFields(usp);

            return (
              usp &&
              usp.key !== "book_now" && (
                <Usp
                  key={usp.key}
                  icon={`/assets/activity/${iconList[usp.icon_name]}`}
                  description={description}
                  iconName={usp.icon_name}
                  className={uspClassName}
                >
                  {ctaUsp.includes(usp.key) ? (
                    <span
                      className={classnames(
                        styles.uspLabel,
                        styles.uspLabelCTA
                      )}
                      onClick={bookNow}
                    >
                      {label}
                    </span>
                  ) : (
                    <span className={styles.uspLabel}>{label}</span>
                  )}
                </Usp>
              )
            );
          })}
      </div>
    </div>
  );
};

export default Usps;
