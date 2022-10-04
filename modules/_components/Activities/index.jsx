import { Text } from "../Text";
import React, { useEffect, useMemo, useState } from "react";
import { useI18n } from "next-localization";
import { Tag } from "../Tag";
import { Helmet } from "react-helmet";
import { Section } from "../Section";
import { Activity } from "../Activity";
import Button from "../Button";
import { scrollToTarget } from "../../../utils/scrollToTarget";
import { getPageUrl } from "../../../services/contentServices";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { Booking } from "../Booking";
import { useBookingStore } from "../../../store/bookingStore";

export const Activities = ({ title, listing, offers }) => {
  const { t, locale } = useI18n();
  const [active, setActive] = useState(
    offers.topActivities?.length ? "topActivities" : Object.keys(offers)[0]
  );
  const [offset, setOffset] = useState({});
  const [data, setData] = useState({});
  const activity = useBookingStore((state) => state.activity);
  const date = useBookingStore((state) => state.date);

  useEffect(() => {
    let r = 0;
    let rAmounts = 0;

    offersList.forEach((item) => {
      r =
        r +
        (item?.rating?.average_rating
          ? parseFloat(item?.rating?.average_rating) * item?.rating?.num_ratings
          : 0);

      rAmounts =
        rAmounts +
        (item?.rating?.num_ratings ? parseInt(item?.rating?.num_ratings) : 0);
    });

    setData({
      "@type": "AggregateRating",
      ratingValue: (r / rAmounts).toFixed(1),
      ratingCount: rAmounts,
    });
  }, []);

  const hasOffers = useMemo(() => {
    if (listing.type === "blog_post") {
      return listing.activities.length >= 1;
    }
    if (offers.topActivities?.length) {
      return true;
    }
    return Object.keys(offers).some(
      (offersKey) => offers[offersKey]?.activities?.length
    );
  }, [offers]);

  const offersList = useMemo(() => {
    const sorter = (o) =>
      o.sort(
        (a, b) =>
          b.attribute_values.find((e) => e.id === "21") -
            a.attribute_values.find((e) => e.id === "21") ||
          parseFloat(b.summary?.popularity) -
            parseFloat(a.summary?.popularity) ||
          parseFloat(b.rating?.average_rating) -
            parseFloat(a.rating?.average_rating)
      );

    if (listing.type === "blog_post") {
      return sorter(listing.activities);
    }
    if (active === "topActivities") {
      return sorter(offers[active]);
    }
    return sorter(offers[active].activities);
  }, [active]);

  const handleOffset = () => {
    const current = offset[active] || 4;

    setOffset({
      ...offset,
      [active]: current + 4,
    });
    setTimeout(() => {
      const id = `#activity-${
        offersList.slice(0, offset[active - 1])[current].id
      }`;
      scrollToTarget(id);
    }, 100);
  };

  const handleClick = (id) => {
    setActive(id);
  };

  return (
    hasOffers && (
      <Section id="activities">
        {Number(data.ratingValue) >= 3.5 && (
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(data, null, 2)}
            </script>
          </Helmet>
        )}
        <Text as="h2" size="lg" className={`mb`}>
          {t("pages.listing.offersTitle", { title })}
        </Text>
        <>
          {listing.type !== "point_of_interest" && (
            <div
              className={`swiper-gradient-right relative mb-4 flex w-full max-w-full space-x-4 overflow-auto empty:hidden`}
            >
              {!!offers.topActivities?.length && (
                <Tag
                  active={active === "topActivities"}
                  onClick={() => handleClick("topActivities")}
                >
                  {t("pages.listing.topActivities")}
                </Tag>
              )}
              {Object.values(offers).filter((item) => item.title).length >= 2 &&
                Object.keys(offers).map(
                  (offer, index) =>
                    offer !== "topActivities" && (
                      <Tag
                        active={active === Object.keys(offers)[index]}
                        onClick={() => handleClick(Object.keys(offers)[index])}
                      >
                        {offers[offer].title}
                      </Tag>
                    )
                )}
            </div>
          )}
          <div className={`space-y-6`}>
            {offersList.slice(0, offset[active] || 4).map((item, index) => {
              return (
                <Activity
                  key={item.teaser_image.url}
                  hit={item}
                  highlight={index === 0}
                  more
                  book
                />
              );
            })}
          </div>
          <div className={`mt-8 flex w-full items-center justify-center`}>
            {offersList.length >= 5 &&
            offersList.length > (offset[active] || 4) ? (
              <Button onClick={handleOffset} type="secondary">
                {t("search.viewMore")}
              </Button>
            ) : (
              <Button
                href={getPageUrl("s", locale())}
                type="secondary"
                text={t("filter.viewAll")}
                icon={<FaExternalLinkSquareAlt />}
                reverse
              />
            )}
          </div>
        </>
        {listing && (
          <Booking
            type="modal"
            activity={activity}
            bookable={true}
            bookableDate={date}
          />
        )}
      </Section>
    )
  );
};

export default Activities;
