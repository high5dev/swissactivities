import { useI18n } from "next-localization";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { DateService } from "../../../utils";
import { useEffect, useState } from "react";
import { useBookingStore } from "../../../store/bookingStore";
import classNames from "classnames";
import { Button } from "../Button";
import { LoaderScreen } from "../Loader/LoaderScreen";
import { scrollToTarget } from "../../../utils/scrollToTarget";
import axios from "axios";
import dynamic from "next/dynamic";
import { Card } from "../Card";
import { dataLayerSend } from "../../../utils/dataLayerSend";
import { Skeleton } from "../Skeleton";
import { toISO } from "../../../utils/dates/toISO";

const DynamicCalendar = dynamic(() =>
  import("react-calendar").then((mod) => mod.Calendar, {
    ssr: false,
    // eslint-disable-next-line react/display-name
    loading: () => (
      <div
        className={`h-[300px] w-full animate-pulse rounded-lg bg-gray-200`}
      />
    ),
  })
);

const CLASS_ARROW =
  "w-full h-full flex items-center justify-center text-xs flex h-12 w-12 items-center justify-center";

export const Calendar = ({ activity, type, bookable, bookableDate }) => {
  const { locale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const bookingActivity = useBookingStore((state) => state.activity);
  const date = useBookingStore((state) => state.date);
  const dateFormat = useBookingStore((state) => state.dateFormat);
  const dates = useBookingStore((state) => state.dates);
  const formattedDates = useBookingStore((state) => state.formattedDates);
  const isCalendarLoading = useBookingStore((state) => state.isCalendarLoading);
  const isCalendarOpen = useBookingStore((state) => state.isCalendarOpen);
  const isLoading = useBookingStore((state) => state.isLoading);
  const isLoaded = useBookingStore((state) => state.isLoaded);
  const isModal = type === "modal";
  const isBasket = type === "basket";
  const isSelected = useBookingStore((state) => state.isSelected);
  const isSkeleton = useBookingStore((state) => state.isSkeleton);
  const level = useBookingStore((state) => state.level);
  const setDate = useBookingStore((state) => state.setDate);
  const setDates = useBookingStore((state) => state.setDates);
  const setIs422 = useBookingStore((state) => state.setIs422);
  const setIsLoaded = useBookingStore((state) => state.setIsLoaded);
  const setFormattedDates = useBookingStore((state) => state.setFormattedDates);
  const setIsCalendarLoading = useBookingStore(
    (state) => state.setIsCalendarLoading
  );
  const setIsCalendarOpen = useBookingStore((state) => state.setIsCalendarOpen);
  const setIsSelected = useBookingStore((state) => state.setIsSelected);
  const setLevel = useBookingStore((state) => state.setLevel);

  useEffect(() => {
    let index = 0;

    const getter = async (number) => {
      index++;

      if (index === 5) {
      } else {
        await axios
          .get(
            `${process.env.NEXT_PUBLIC_BOOKINGAPI_HOST}/activities/${
              activity.summary.activityId
            }/monthly-availabilities?year=${new Date().getFullYear()}&month=${number}`
          )
          .then((resp) => {
            if (
              Object.entries(resp.data).every((item) => item[1].price === null)
            ) {
              if (12 >= number && 12 >= number) {
                getter(number + 1);
              }
            } else {
              setDates(resp.data);
              const nextDateKey = Object.values(resp.data).findIndex(
                (e) => e.price
              );
              const nextDate = new Date(Object.keys(resp.data)[nextDateKey]);
              if (!isBasket) {
                setDate(new Date(toISO(nextDate)));
              }
              setIsLoaded(true);
            }
          });
      }
    };

    ((isSelected &&
      activity?.summary?.activityId &&
      dates.length === 0 &&
      bookable) ||
      isBasket) &&
      getter(
        bookable === "today" || bookable === "tomorrow"
          ? new Date().getMonth() + 1
          : new Date(bookableDate).getMonth() + 1
      );

    setMounted(true);
  }, [bookingActivity]);

  useEffect(() => {
    const obj = {};
    Object.entries(dates).map(([k, v]) => {
      if (v.price) {
        obj[k] = v;
      }
    });

    setFormattedDates(obj);
    !isSelected &&
      Object.keys(obj)[0] &&
      setDate(new Date(Object.keys(obj)[0]));
  }, [dates]);

  const disableCalendarTile = ({ date, view }) => {
    const formattedDate = DateService.formatDate(date);
    return (
      formattedDates &&
      view === "month" &&
      !Object.keys(formattedDates).includes(formattedDate)
    );
  };

  const navigateMonth = async (next = true) => {
    let newMonth = date.getMonth() + 1;
    let newYear = date.getFullYear();

    if (next) {
      if (newMonth === 12) {
        newMonth = 1;
        newYear = newYear + 1;
      } else {
        newMonth = newMonth + 1;
      }
    } else {
      if (newMonth === 1) {
        newMonth = 12;
        newYear = newYear - 1;
      } else {
        newMonth = newMonth - 1;
      }
    }
    // console.log(date);
    // console.log(newMonth);
    // console.log(newYear);

    await axios
      .get(
        `${process.env.NEXT_PUBLIC_BOOKINGAPI_HOST}/activities/${activity.summary.activityId}/monthly-availabilities?year=${newYear}&month=${newMonth}`
      )
      .then((resp) => {
        const somethingAvailable = Object.values(resp.data).some(
          (e) => e.price
        );
        const availableDates = Object.entries(resp.data).filter(
          ([k, v]) => v.price
        );
        // console.log(resp.data);
        // console.log(availableDates);
        if (somethingAvailable) {
          setDate(new Date(availableDates[0][0]));
          setDates(resp.data);
          setIs422(false);
        }

        setIsCalendarLoading(false);
      });
  };

  return isSkeleton && !isLoaded ? (
    <Skeleton amount={1} size="lg" />
  ) : (
    <Card
      className={classNames(`relative overflow-hidden rounded-lg lg:!px-4`, {
        "!pointer-events-none !opacity-50": isLoading,
        "!py-0 lg:hover:shadow-md": !isCalendarOpen,
        "!pt-0": isCalendarOpen,
        "-mt-6": !isBasket,
        "!shadow-none lg:!px-0": isBasket,
      })}
    >
      <>
        {isCalendarLoading && <LoaderScreen />}
        {isSelected && (
          <div className={`-mx-4 lg:-mx-4`}>
            <Button
              type="transparent"
              as="div"
              className={classNames(
                `w-full items-center justify-between hover:!border-white hover:!bg-white`,
                {
                  "lg:!pr-4 lg:!pl-3": !isBasket,
                  "lg:!px-8": isBasket,
                }
              )}
              onClick={() => {
                /* !isCalendarOpen && scrollToTarget( `#booking-calendar`, document.querySelector("[data-booking]") ); */
                setIsCalendarOpen(!isCalendarOpen);
              }}
            >
              <span className={`flex items-center justify-center`}>
                <FaCalendarAlt className={`mr-2`} />
                {date.toLocaleDateString(locale().replace("_", "-"), {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {isCalendarOpen ? <FaChevronUp /> : <FaChevronDown />}
            </Button>
          </div>
        )}
        {mounted && (
          <DynamicCalendar
            className={classNames(
              `booking !mt-0 !rounded-lg !border !border-solid !border-gray-200`,
              {
                "cant-back":
                  new Date().getMonth() >= date.getMonth() &&
                  new Date().getFullYear() >= date.getFullYear(),
                "!mt-2": isCalendarOpen && isSelected,
                hidden: !isCalendarOpen,
              }
            )}
            view="month"
            activeStartDate={new Date(date.getFullYear(), date.getMonth(), 1)}
            prev2Label={null}
            prevLabel={
              <div
                className={classNames(CLASS_ARROW, {
                  "text-black/10":
                    new Date().getMonth() >= date.getMonth() &&
                    new Date().getFullYear() >= date.getFullYear(),
                })}
                role="button"
                onClick={() => {
                  setIsCalendarLoading(true);
                  navigateMonth(false);
                }}
              >
                <FaArrowLeft />
              </div>
            }
            next2Label={null}
            nextLabel={
              <div
                className={CLASS_ARROW}
                role="button"
                onClick={() => {
                  setIsCalendarLoading(true);
                  navigateMonth();
                }}
              >
                <FaArrowRight />
              </div>
            }
            minDetail="month"
            calendarType="ISO 8601"
            locale={locale()?.replace("_", "-")}
            value={
              formattedDates.length >= 1 && Object.keys(formattedDates)[0]
                ? new Date(Object.keys(formattedDates)[0])
                : new Date()
            }
            tileClassName={({ view, date }) => {
              let base = "flex flex-col font-semibold !text-sm !leading-normal";
              const formattedDate = DateService.formatDate(date);
              if (
                Object.values(formattedDates).length >= 1 &&
                view === "month"
              ) {
                if (Object.keys(formattedDates).includes(formattedDate)) {
                  let cls;

                  if (dateFormat === formattedDate) {
                    cls = "!text-white !bg-primary hover:!bg-dark";
                  } else {
                    cls = "!bg-emerald-200 hover:!bg-emerald-300";
                  }
                  return `${base} ${cls}`;
                }
                if (!Object.keys(dates).includes(formattedDate)) {
                  return `${base} invisible`;
                }
              } else {
                return `${base}`;
              }
            }}
            tileDisabled={disableCalendarTile}
            onClickDay={(value) => {
              dataLayerSend({
                event: "date_selected",
                cart_id: localStorage?.getItem?.("cartId"),
                item_name: activity?.info?.title,
                value: dates?.[DateService.formatDate(value)]?.price,
                currency: dates?.[DateService.formatDate(value)]?.price
                  .replace(/\d+/g, "")
                  .trim(),
              });
              setDate(value);
              setIsSelected(true);
              setIsCalendarOpen(false);
              setIs422(false);
              if (level === 1) {
                setLevel(2);
              }
              setTimeout(() => {
                scrollToTarget(
                  `#booking-flow`,
                  document.querySelector("[data-booking]")
                );
              }, 10);
            }}
          />
        )}
      </>
    </Card>
  );
};
