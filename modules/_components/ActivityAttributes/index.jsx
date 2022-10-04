import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { useI18n } from "next-localization";
import { DateService } from "../../../utils";
import classNames from "classnames";
import { Rating } from "../Rating";

export const ActivityAttributes = ({ hit, type, attributes = true }) => {
  const { t } = useI18n();
  const isSm = type === "sm";
  const duration = hit?.activity?.summary || hit?.summary;
  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const today = hit?.availability?.includes(DateService.formatDate(todayDate));
  const tomorrow = hit?.availability?.includes(
    DateService.formatDate(tomorrowDate)
  );

  return (
    <div
      className={classNames({
        "space-y-2.5 text-sm text-gray-600": !isSm,
        "space-y-0.5 text-xs font-medium text-gray-600": isSm,
      })}
    >
      <Rating hit={hit} type={type} />
      {(today || tomorrow) && attributes && (
        <span className={`flex items-center`}>
          <FaRegCalendarAlt className={`mr-2`} />
          {today && !tomorrow
            ? t("filter.today")
            : !today && tomorrow
            ? t("filter.tomorrow")
            : `${t("filter.today")} + ${t("filter.tomorrow")}`}
        </span>
      )}
      {duration?.durations?.length >= 1 && attributes && (
        <span className={`flex items-center`}>
          <FaRegClock className={`mr-2`} />
          {`${t("offerCard.duration")}: 
              ${
                duration.durations[0] === "all-day"
                  ? duration.durations[0]
                  : duration.durations[0] + "h"
              }`}
        </span>
      )}
    </div>
  );
};
