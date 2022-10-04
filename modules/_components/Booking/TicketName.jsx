import { useI18n } from "next-localization";

export const TicketName = ({ item, formatted }) => {
  const { t } = useI18n();

  return formatted
    ? `${item?.description}`
    : `${item?.label?.discount ?? item?.label?.audience}${
        item?.occupancyType === "variable"
          ? ` · ${
              item?.maxOccupancy
                ? `${t("search.card.from")} ${item?.occupancy}`
                : ""
            } ${t("offerCard.people")}`
          : item?.occupancyType === "fixed" && item?.occupancy >= 2
          ? ` · ${item?.occupancy ? `${item?.occupancy}` : ""} ${t(
              "offerCard.people"
            )}`
          : ""
      }${
        (item?.minAge || item?.minAge === 0) && item?.maxAge
          ? ` (${item?.minAge} - ${item?.maxAge})`
          : item?.minAge && !item?.maxAge
          ? ` (${item?.minAge}+)`
          : ""
      }`;
};
