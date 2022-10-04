import Layout from "../../_components/Layout";
import { useI18n } from "next-localization";
import Main from "./Main";
import { ActivityHeader } from "./ActivityHeader";
import Accordions from "./Accordions";
import SimilarActivities from "./SimilarActivities";
import { EmailSubscription } from "../../_components/EmailSubscription";
import { Map } from "../../_components/Map";
import Tabs from "../../_components/Tabs";
import React, { useEffect } from "react";
import ProductGoogleStructuredData from "./ProductGSD";
import { Booking } from "../../_components/Booking";
import { Summary } from "../../_components/Booking/Summary";
import { Voucher } from "../../_components/Voucher";
import { disableBodyLock } from "../../../utils/bodylock";
import { useBookingStore } from "../../../store/bookingStore";
import { dataLayerSend } from "../../../utils/dataLayerSend";
import { Text } from "../../_components/Text";
import { Rating } from "../../_components/Rating";
import { BookingButton } from "../../_components/Booking/Button";
import * as services from "../../../services/contentServices";
import { getStaticPaths } from "../../../utils/paths/getStaticPaths";
import * as reviewsServices from "../../../services/reviewsServices";
import {
  getDatesOnce,
  getMappingsOnce,
} from "../../../services/bookingServices";
import { isToday } from "../../../utils/dates/isToday";
import { isTomorrow } from "../../../utils/dates/isTomorrow";
import { niceDate } from "../../../utils/dates/niceDate";
import { getParams } from "../../../services/contentServices";
import * as bookingServices from "../../../services/bookingServices";
import { findPage } from "../../../utils/paths/findPage";

export const Activity = ({
  activity,
  summary,
  breadcrumbs,
  similarActivities,
  menu,
  bookable,
  bookableDate,
  prices,
  startingPrice,
}) => {
  const { t, locale } = useI18n();
  const reset = useBookingStore((state) => state.reset);

  const meta = {
    title: activity.info.title,
    desc: activity.info.teaser,
    locale: locale(),
    image: activity.teaser_image.url,
    id: activity.id,
  };

  const pageUrls = activity.hrefs;

  useEffect(() => {
    reset(new Date(bookableDate));
    disableBodyLock(true);

    dataLayerSend({
      event: "view_item",
      item_name: activity?.info?.title.trim(),
      id: activity?.id,
      location_id: locale().replace("_CH", "-ch"),
      value: activity?.summary?.minPrice?.amount,
      currency: activity?.summary?.minPrice?.currency,
    });
  }, []);

  return (
    <Layout {...{ meta, pageUrls, menu }}>
      <ProductGoogleStructuredData summary={summary} activity={activity} />
      <ActivityHeader
        similarActivities={similarActivities}
        activity={activity}
        breadcrumbs={breadcrumbs}
        tag="span"
      />
      <section className={`lg:pt-0`}>
        <Main
          bookable={bookable}
          bookableDate={bookableDate}
          startingPrice={startingPrice}
          activity={activity}
          similarActivities={similarActivities}
          breadcrumbs={breadcrumbs}
        />
      </section>
      <section className={`section container-tw`}>
        <div className={`mb hidden lg:block`}>
          <Tabs activity={activity} />
        </div>
        <div
          className={`lg:!mx-auto lg:grid lg:grid-cols-6 lg:gap-16 xl:grid-cols-4`}
        >
          <div className={`!-mx-4 lg:col-span-4 lg:mx-0 xl:col-span-3`}>
            <Accordions activity={activity} prices={prices} />
          </div>
          <div
            className={`hidden space-y-6 lg:col-span-2 lg:block xl:col-span-1`}
          >
            <Map activity={activity} prices={prices} />
            {bookable && (
              <div className={`top-[calc(var(--h-header)+2rem)] lg:sticky`}>
                <div className={`mb-5 space-y-2`}>
                  <Text as="h2" size="md" className={`!text-base`}>
                    {activity.info.title}
                  </Text>
                  <Rating
                    hit={{
                      rating: parseFloat(activity?.rating?.average_rating),
                      ratingAmount: activity?.rating?.num_ratings,
                    }}
                  />
                </div>
                <BookingButton
                  text={`${t("booking.booknow")}${
                    activity?.summary?.startingPrice?.formatted
                      ? " - " +
                        t("search.card.from") +
                        " " +
                        activity?.summary?.startingPrice?.formatted
                      : ""
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </section>
      <Voucher className={`mt-6 w-full lg:hidden`} type="transparent" />
      {!!similarActivities?.length && (
        <section className={`section container-tw`}>
          <SimilarActivities activities={similarActivities} />
        </section>
      )}
      <div className={`section section-last`}>
        <EmailSubscription />
      </div>
      <Booking
        bookable={bookable}
        bookableDate={bookableDate}
        type="modal"
        activity={activity}
      />
      {bookable && <Summary type="checkoutBottom" activity={activity} />}
    </Layout>
  );
};

export const activityStaticProps = async ({ params, fs }) => {
  const pages = await services.getPages(fs);
  const path = params.path[0]
    .replace("/en-ch/", "")
    .replace("/fr-ch/", "")
    .replace("/it-ch/", "");
  let page = findPage(path, pages);

  const parameters = await getParams(fs, page.locale);
  const nextPrices = await bookingServices.getPricesOnce();
  const activitySummaries = await bookingServices.getActivitySummariesOnce();
  const bookableDates = await bookingServices.getDatesOnce();
  const apiIdsMapping = await bookingServices.getMappingsOnce();

  const activity = await services.getActivityDetails(
    fs,
    page.activityId,
    page.locale
  );
  const rating = await reviewsServices.getReviewsRatingsByIdsArray(fs, [
    activity.id,
  ]);
  const location =
    activity.location && activity.location.id
      ? await services.getActivityLocationDetails(
          fs,
          activity.location.id,
          page.locale
        )
      : null;
  const type =
    activity.type && activity.type.id
      ? await services.getActivityTypeDetails(fs, activity.type.id, page.locale)
      : null;
  const breadcrumbs = await services.getActivityBreadcrumbs(
    fs,
    activity,
    page.locale
  );
  const mappedId =
    Object.keys(apiIdsMapping.contentApiIds).find(
      (el) => apiIdsMapping.contentApiIds[el] === parseInt(page.activityId)
    ) || null;
  const startingPrice =
    nextPrices.find(
      (priceObject) => priceObject.activityId === parseInt(mappedId)
    ) || null;
  const summary =
    activitySummaries.find(
      ({ activityId }) => activityId === parseInt(mappedId)
    ) || null;
  const availableDates = [];
  const activities = await services.getActivities(fs, page.locale);

  const similarSupplierActivities = [];
  const similarTypeLocationActivities = [];
  const similarLocationActivities = [];
  const similarTypeActivities = [];

  for (var i = 0; i < activities.length; i++) {
    if (similarSupplierActivities.length >= 4) {
      break;
    }

    if (activities[i].id === activity.id) {
      continue;
    }

    if (
      activities[i].supplier &&
      activities[i].supplier.id === activity.supplier?.id
    ) {
      similarSupplierActivities.push(activities[i]);
      continue;
    }

    if (
      activities[i].type &&
      activities[i].location &&
      activities[i].type.id === activity.type?.id &&
      activities[i].location.id === activity.location?.id
    ) {
      similarTypeLocationActivities.push(activities[i]);
      continue;
    }

    if (
      activities[i].location &&
      activities[i].location.id === activity.location?.id
    ) {
      similarLocationActivities.push(activities[i]);
      continue;
    }

    if (activities[i].type && activities[i].type.id === activity.type?.id) {
      similarTypeActivities.push(activities[i]);
    }
  }

  const similarActivities = [
    ...similarSupplierActivities,
    ...similarTypeLocationActivities,
    ...similarLocationActivities,
    ...similarTypeActivities,
  ];
  const similarActivitiesRatings =
    await reviewsServices.getReviewsRatingsByIdsArray(
      fs,
      similarActivities.slice(0, 4).map((activity) => activity.id)
    );

  const idsMapping = (await getMappingsOnce()).contentApiIds;
  const dates = await getDatesOnce();

  const getActivityDates = (capiId) => {
    const bapiId = Object.keys(idsMapping).find(
      (capiIdKey) => idsMapping[capiIdKey] === parseInt(capiId)
    );
    if (!bapiId) {
      return [];
    }

    return Object.entries(dates)
      .filter(([_, ids]) => ids.includes(parseInt(bapiId)))
      .map(([date]) => date);
  };

  for (const [date, activityIds] of Object.entries(bookableDates)) {
    if (activityIds.includes(Number(mappedId))) {
      availableDates.push(date);
    }
  }

  let availDate;

  if (availableDates.some((d) => isToday(new Date(d)))) {
    availDate = "today";
  } else if (availableDates.some((d) => isTomorrow(new Date(d)))) {
    availDate = "tomorrow";
  } else if (availableDates.length >= 1) {
    availDate = niceDate({
      date: availableDates[0],
      locale: page.locale,
    });
  } else {
    availDate = false;
  }

  return {
    props: {
      ...parameters,
      bookable: availDate,
      bookableDate: availableDates[0] || null,
      activity: {
        ...activity,
        rating: (rating && rating[0]) || null,
        location,
        type,
      },
      breadcrumbs,
      summary,
      startingPrice,
      prices: nextPrices,
      mappedId,
      similarActivities: similarActivities
        .filter((e) => e.summary)
        .slice(0, 4)
        .map((simActvitity) => {
          const mappedId =
            Object.keys(apiIdsMapping.contentApiIds).find(
              (el) =>
                apiIdsMapping.contentApiIds[el] === parseInt(simActvitity.id)
            ) || null;
          const startingDate = Object.entries(bookableDates).find((entry) =>
            entry[1].includes(Number(mappedId))
          );
          return {
            ...simActvitity,
            availability: getActivityDates(simActvitity.id).splice(0, 2),
            type:
              simActvitity.attribute_values?.find(
                (attributeValue) => Number(attributeValue.attribute?.id) === 18 // Frontendlabel type has id 18
              ) ||
              simActvitity.type ||
              null,
            rating:
              similarActivitiesRatings.find(
                ({ sku }) => Number(sku) === Number(simActvitity.id)
              ) || null,
            summary:
              activitySummaries.find(
                ({ contentApiActivityId }) =>
                  Number(contentApiActivityId) === Number(simActvitity.id)
              ) || null,
            startingDate: (startingDate && startingDate[0]) || null,
            mappedId,
          };
        }),
      key: activity.id,
    },
  };
};

export const activityStaticPaths = async (fs, locale = "de_CH") => {
  return await getStaticPaths(fs, locale, "activity");
};
