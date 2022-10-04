import Usps from "../_components/Usps";
import { useI18n } from "next-localization";
import { attributesMapping } from "../_components/Usps";
import classNames from "classnames";
import Button from "../_components/Button";
import Toast from "../_components/Toast";
import { Text } from "../_components/Text";
import Header from "./Header";
import Content from "../_components/Content";
import { Slider } from "../_components/Slider";
import { Voucher } from "../_components/Voucher";

const CLASS_HEADING = "mb-2";

export const Main = ({
  activity,
  getUspDate,
  bookNow,
  currentMonthAvailableDates,
  startingPrice,
  isOpenAttraction,
  isMobile,
  mobileWidgetRef,
  widgetComponent,
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
      className={`container-tw lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12`}
    >
      <div className={`relative`}>
        {isOpenAttraction && (
          <Toast
            text={t("activity.openAttraction")}
            className={`absolute left-4 top-4 z-10`}
          />
        )}
        <Slider
          images={activity.gallery}
          className={`h-[250px] lg:h-full lg:h-[400px]`}
          classNameGallery={`h-[140px] w-full hidden lg:block`}
          hideGallery={768}
        />
      </div>
      <div className={`lg:hidden`}>
        <Header
          activity={activity}
          isMobile={isMobile}
          widgetComponent={widgetComponent}
          mobileWidgetRef={mobileWidgetRef}
        />
      </div>
      <div className={`mb-4 booking:mt-4 lg:!my-0`}>
        <div>
          <Text as="h2" size="md" className={classNames(CLASS_HEADING)}>
            {t("activity.uspTitle", { title })}
          </Text>
          {activity?.info?.teaser && <Text>{activity.info.teaser}</Text>}
          <Text as="h3" size="md" className={classNames(`mt-6`, CLASS_HEADING)}>
            {t("activity.advantage.title")}
          </Text>
          <Usps
            activity={activity}
            usps={activity.usps}
            attributes={activity.attribute_values}
            getUspDate={getUspDate}
            bookNow={bookNow}
            teaserText={activity.info.teaser}
            price={startingPrice}
            currentMonthAvailableDates={currentMonthAvailableDates}
          />
        </div>
        <div
          style={{
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "none",
          }}
          className={`hidden mt-8 flex-row pt-4 border-t border-solid border-gray-200 items-center grid-cols-3 booking:grid`}
        >
          <div className={`flex flex-col text-sm leading-snug`}>
            <span>{t("search.card.from")}</span>
            <span className={`text-xl font-semibold text-black`}>
              {startingPrice ? startingPrice.startingPrice.currency : "N/A"}
              {startingPrice
                ? parseFloat(startingPrice.startingPrice.amount)
                : ""}
            </span>
            <span>{t("search.card.person")}</span>
          </div>
          <div className={`flex items-center col-span-2`}>
            <Voucher className={`mr-4`} />
            <Button
              text={t("activity.booknow")}
              type="primary"
              className={`w-full !justify-center !items-center !text-center xl:!text-lg`}
              onClick={bookNow}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
