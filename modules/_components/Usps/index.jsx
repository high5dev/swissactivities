import { useI18n } from "next-localization";
import classNames from "classnames";
import React from "react";
import { Text } from "../Text";
import { DateService } from "../../../utils";
import StaticImage from "../../Image";
import { Map } from "../Map";
import {
  FaExternalLinkAlt,
  FaMapPin,
  FaMoneyBillAlt,
  FaRegCalendarAlt,
  FaRegClock,
  FaRegFileAlt,
  FaRegMinusSquare,
  FaRegTimesCircle,
  FaTicketAlt,
} from "react-icons/fa";
import { BookingButton } from "../Booking/Button";

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
  duration: "/activity/clock.svg",
  mobileTicket: "/activity/smartphone.svg",
  confirmation: "/activity/full_day_ticket.svg",
  queue: "/activity/skip_the_line.svg",
  cancel: "/activity/protection.svg",
  online: "/activity/lightning.svg",
  meetingPoint: "/activity/map.svg",
  bookable: "/activity/full_day_ticket.svg",
  payment: "/listing/payment.svg",
  discount: "/activity/discount.svg",
};

const Usps = ({
  type,
  className,
  activity,
  ids,
  map = true,
  label = true,
  simple = false,
  single = false,
}) => {
  const { t, locale } = useI18n();
  let isRow = type === "row";
  let isColumn = type === "column";
  const isFull = type === "full";
  const isSm = type === "sm";
  const isAllday = !ids && activity.summary.durations.includes("all-day");
  const isRestech = !ids && activity.summary.resTech;
  const isCancellable = !ids && activity.summary.cancellation;
  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const today = activity?.availability?.includes(
    DateService.formatDate(todayDate)
  );
  const tomorrow = activity?.availability?.includes(
    DateService.formatDate(tomorrowDate)
  );

  const durationList = () => {
    const durations = activity.summary.durations;

    return activity.summary.durations.length === 1
      ? activity.summary.durations[0] === "all-day"
        ? t("usp.allDay")
        : activity.summary.durations[0]
      : durations.join(", ").replace(/,(?!.*,)/gim, ` ${t("usps.or")}`) +
          (isAllday ? ` + ${t("usp.allDay")}` : "");
  };

  const durationTitle = isAllday
    ? t("usps.duration.titleAllDay")
    : t("usps.duration.title");
  const durationDescription = isAllday
    ? t("usps.duration.durationAllDay", {
        val: 1,
      })
    : t(
        activity?.summary?.durations[0] >= 2 ||
          activity?.summary?.durations.length > 2
          ? "usps.duration.durations"
          : "usps.duration.duration",
        {
          val: !ids && durationList(),
        }
      );
  const bookableDuration = t("usps.bookable.description", {
    val:
      today && !tomorrow
        ? t("filter.today")
        : !today && tomorrow
        ? t("filter.tomorrow")
        : `${t("filter.today")} + ${t("filter.tomorrow")}`,
  });

  const discounts = () => {
    let string = "";
    activity?.summary?.discount.map((item, index) => {
      string +=
        item[locale()] +
        (activity?.summary?.discount.length !== index + 1 ? ", " : "");
    });
    return string;
  };

  const data = !ids
    ? [
        {
          id: "duration",
          condition: true,
          title: durationTitle,
          description: durationDescription,
          titleSingle: durationTitle + ": " + durationDescription,
          icon: <FaRegCalendarAlt />,
        },
        {
          id: "mobileTicket",
          condition: isRestech,
          icon: <FaTicketAlt />,
        },
        {
          id: "confirmation",
          condition: isRestech,
          icon: <FaRegFileAlt />,
        },
        {
          id: "queue",
          condition:
            isRestech && activity.attribute_values.find((e) => e.id === "21"),
          icon: <FaRegMinusSquare />,
        },
        {
          id: "meetingPoint",
          condition:
            (activity.meeting_points[0]?.info?.address ||
              activity.meeting_points[0]?.info[0]?.address) &&
            map,
          title: t(`usps.meetingPoint.title`),
          description:
            activity.meeting_points[0]?.info?.address ||
            activity.meeting_points[0]?.info[0]?.address,
          external: true,
          icon: <FaMapPin />,
          clickable: "map",
        },
        {
          id: "bookable",
          condition: today || tomorrow,
          description: bookableDuration,
          icon: <FaRegClock />,
          titleSingle: bookableDuration,
        },
        {
          id: "discount",
          condition: activity?.summary?.discount.length,
          icon: <FaMoneyBillAlt />,
          description: discounts(),
          titleSingle: `${t("usps.discount.title")}: ${discounts()}`,
          clickable: "booking",
        },
        {
          id: "cancel",
          condition: isCancellable,
          icon: <FaRegTimesCircle />,
          titleSingle: t("usps.cancel.title"),
        },
      ]
    : false;

  if (data) {
    let dataIndex = 0;
    data.forEach((item) => {
      if (item.condition) {
        dataIndex++;
      }
    });

    simple = dataIndex >= 7;
    label = dataIndex <= 6;
    isRow = !isSm && dataIndex >= 7;
    single = dataIndex >= 7;
  }

  const Usp = ({
    description,
    icon,
    title,
    external,
    titleSingle,
    iconSingle,
    clickable,
  }) => {
    return (
      <div
        role={clickable && "button"}
        className={classNames(`flex flex-col items-start`, {
          "lg:rounded-lg lg:border lg:border-dashed lg:border-slate-300 lg:bg-slate-50 lg:p-4":
            !simple && !isSm,
          "!text-sm !font-medium !text-gray-600": isSm,
          "group cursor-pointer duration-100 ease-in hover:border-slate-400":
            clickable && !isSm,
        })}
      >
        <div
          className={classNames(`!grid`, {
            "grid-cols-[50px,1fr] ": !isSm,
            "grid-cols-[auto,1fr] ": isSm,
          })}
        >
          {type === "sm" ? (
            <div className={`mt-0.5`}>{iconSingle}</div>
          ) : (
            <div className={`flex h-[24px] w-[24px]`}>
              <StaticImage src={`/assets/${icon}`} width={24} height={24} />
            </div>
          )}
          <div
            className={classNames(`block font-medium text-black`, {
              "-ml-3": !isSm,
              "ml-2": isSm,
            })}
          >
            {title && (
              <div role="button" className={`flex items-center`}>
                <Text
                  className={classNames(`!font-semibold !text-black`, {
                    "!text-sm !font-medium !text-gray-600": isSm,
                  })}
                >
                  {isSm || single ? titleSingle || description || title : title}
                </Text>
                {external && (
                  <FaExternalLinkAlt
                    className={`ml-2 flex text-xs text-gray-500 transition duration-100 ease-in`}
                  />
                )}
              </div>
            )}
            {description && label && type !== "sm" && (
              <Text
                className={classNames(`lg:mt-0.5 lg:block`, {
                  "cursor-pointer group-hover:underline": clickable,
                })}
              >
                {description}
              </Text>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={classNames({
        "flex flex-wrap gap-y-4 gap-x-8 lg:space-y-0": !isFull && !isSm,
        "flex flex-wrap gap-y-2 gap-x-6 lg:space-y-0": isSm,
        "flex max-w-max flex-col space-y-2": isRow || isColumn,
        "lg:grid lg:grid-cols-2 lg:gap-y-6 lg:gap-x-6 lg:space-y-0":
          isColumn && !isRow,
        [className]: className,
      })}
    >
      {ids
        ? ids.map((item) => {
            return (
              <Usp
                key={item}
                icon={iconList[item]}
                title={t(`usps.${item}.title`)}
                description={t(`usps.${item}.description`)}
              />
            );
          })
        : data.map((item) => {
            const TheUsp = () => (
              <Usp
                key={item.id}
                icon={iconList[item.id]}
                title={item.title || t(`usps.${item.id}.title`)}
                description={
                  item.description || t(`usps.${item.id}.description`)
                }
                external={item.external}
                titleSingle={item.titleSingle}
                iconSingle={item.icon}
                clickable={item.clickable}
              />
            );

            if (!item.condition) {
              return null;
            }

            return item.clickable === "booking" ? (
              !isSm ? (
                <BookingButton bare>
                  <TheUsp />
                </BookingButton>
              ) : (
                <TheUsp />
              )
            ) : item.clickable === "map" ? (
              <Map activity={activity}>
                <TheUsp />
              </Map>
            ) : (
              !item.clickable && <TheUsp />
            );
          })}
    </div>
  );
};

export default React.memo(Usps);
