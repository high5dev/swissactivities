import Usps from "../../_components/Usps";
import { useI18n } from "next-localization";
import { attributesMapping } from "../../_components/Usps";
import classNames from "classnames";
import { Text } from "../../_components/Text";
import Header from "./Header";
import { Slider } from "../../_components/Slider";
import { Voucher } from "../../_components/Voucher";
import { FaSadTear } from "react-icons/fa";
import Breadcrumbs from "../../_components/Breadcrumbs";
import { BookingButton } from "../../_components/Booking/Button";
import React from "react";

const CLASS_HEADING = "mb-1.5 font-semibold lg:mb-2";

export const Main = ({
  activity,
  bookable,
  bookableDate,
  similarActivities,
  breadcrumbs,
}) => {
  const { t } = useI18n();
  const tourArtId = 7;
  const tourArtAttributes = activity.attribute_values.filter(
    ({ attribute }) => attribute && Number(attribute.id) === tourArtId
  );

  const translationTitleKey =
    tourArtAttributes[0] && attributesMapping[tourArtAttributes[0].id];

  const title = translationTitleKey
    ? t(`attributes.${translationTitleKey}`)
    : t("activity.offer");

  return (
    <div
      className={`container-tw xl:20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12`}
    >
      <div className={`relative -mx-4 lg:mx-0`}>
        <Slider
          priority={true}
          images={activity.gallery}
          className={`h-[250px] !rounded-none lg:h-full lg:h-[400px] lg:!rounded-lg`}
          classNameGallery={`h-[140px] w-full hidden h-[max-content] lg:block`}
          hideGallery={768}
        />
      </div>
      <div className={`mt-4 lg:hidden`}>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <Text as="h1" size="xl" className={`inline-block pt-4 lg:hidden`}>
        {activity.info.title}
      </Text>
      <span className={`mt-1 block text-xs text-gray-600 lg:hidden`}>
        {t("activity.providedBy")}: {activity.supplier.name}
      </span>
      <div className={`lg:hidden`}>
        <Header
          bookable={bookable}
          bookableDate={bookableDate}
          activity={activity}
          similarActivities={similarActivities}
        />
      </div>
      <div className={`mt-2 flex flex-col lg:!my-0`}>
        <div>
          <div className={`hidden lg:block`}>
            <Text as="h2" size="md" className={classNames(CLASS_HEADING)}>
              {t("activity.uspTitle", { title })}
            </Text>
            {activity?.info?.teaser && <Text>{activity.info.teaser}</Text>}
          </div>
          {activity.summary && (
            <Usps
              className={`mt-6 lg:mt-8`}
              activity={activity}
              usps={activity.usps}
              type="column"
            />
          )}
        </div>
        <div className={`hidden h-8 w-full lg:block`} />
        <div
          style={{
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "none",
          }}
          className={`mt-auto hidden grid-cols-4 flex-row items-center border-t border-solid border-gray-200 pt-4 lg:grid`}
        >
          {bookable ? (
            <div className={`flex flex-col text-sm leading-snug`}>
              <span>{t("search.card.from")}</span>
              <span className={`text-xl font-semibold text-black`}>
                {activity.summary.startingPrice.formatted}
              </span>
              {activity.summary.showPerPersonSuffix && (
                <span>{t("search.card.person")}</span>
              )}
            </div>
          ) : (
            <Text className={`text-gray-500 col-span-2 mr-4`}>
              {t("activity.widget.notBookable")} <FaSadTear />
            </Text>
          )}
          <div
            className={classNames(`flex items-center`, {
              "col-span-3": bookable,
              "col-span-2": !bookable,
            })}
          >
            <Voucher
              className={classNames("min-w-[175px]", {
                "ml-auto": !bookable,
                "mr-4 !text-sm": bookable,
              })}
            />
            {bookable && <BookingButton />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
