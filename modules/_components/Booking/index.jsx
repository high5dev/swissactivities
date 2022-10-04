import { Calendar } from "./Calendar";
import { Text } from "../Text";
import { useI18n } from "next-localization";
import Button from "../Button";
import { Flow } from "./Flow";
import { useBookingStore } from "../../../store/bookingStore";
import classNames from "classnames";
import { Summary } from "./Summary";
import { Rating } from "../Rating";
import { scrollToTarget } from "../../../utils/scrollToTarget";
import Toast from "../Toast";
import { BsXLg } from "react-icons/bs";
import { useEffect, useRef } from "react";
import { disableBodyLock, enableBodyLock } from "../../../utils/bodylock";
import { Card } from "../Card";
import { toISO } from "../../../utils/dates/toISO";

export const Booking = ({
  activity,
  type,
  bookable,
  bookableDate,
  flow = true,
}) => {
  const ref = useRef(null);
  const { t } = useI18n();
  const is422 = useBookingStore((state) => state.is422);
  const isBasket = type === "basket";
  const isModal = type === "modal";
  const isOpen = useBookingStore((state) => state.isOpen);
  const isSelected = useBookingStore((state) => state.isSelected);
  const data = useBookingStore((state) => state.data);
  const level = useBookingStore((state) => state.level);
  const scroll = useBookingStore((state) => state.scroll);
  const selectedOffer = useBookingStore((state) => state.selectedOffer);
  const setDate = useBookingStore((state) => state.setDate);
  const setIsCalendarOpen = useBookingStore((state) => state.setIsCalendarOpen);
  const setIsOpen = useBookingStore((state) => state.setIsOpen);
  const setIsSelected = useBookingStore((state) => state.setIsSelected);
  const setScroll = useBookingStore((state) => state.setScroll);

  const show = isOpen && selectedOffer && isModal;

  useEffect(() => {
    // console.log(data);
  }, [data]);

  useEffect(() => {
    if (isOpen && selectedOffer && isModal) {
      const s = window.scrollY;
      setScroll(s);
      enableBodyLock(true);
      document.body.classList.add("!fixed");
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.body.style.top = -s + "px";
      ref.current?.classList?.add("h-full");
    }

    return () => {
      disableBodyLock(true);
      document.body.classList.remove("!fixed");
    };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    disableBodyLock();
    document.documentElement.style.removeProperty("height");
    document.body.classList.remove("!fixed");
    window.scrollTo(0, scroll);
    ref.current?.classList?.remove("h-[calc(100%-82px)]");
  };

  return bookable && isSelected ? (
    <div
      ref={ref}
      data-booking={true}
      className={classNames({
        "fixed left-0 top-0 z-[110] w-full overflow-y-auto overflow-x-hidden bg-gray-50 pb-[calc(env(safe-area-inset-bottom,0px)+3rem)] sm:!h-full lg:w-full lg:bg-black/80 lg:pb-0 lg:backdrop-blur":
          isModal,
        hidden: isModal,
        "z-[100000000]": isModal && isOpen,
        "!block lg:!flex": show,
      })}
    >
      {isModal && (
        <div
          className={classNames("fixed left-0 top-0 flex h-full w-full")}
          onClick={close}
        />
      )}
      <div
        className={classNames({
          "relative z-10 w-full lg:m-auto lg:max-w-[900px] lg:rounded-xl":
            isModal,
        })}
      >
        {isModal && (
          <div
            style={{
              borderRight: "none",
              borderTop: "none",
              borderLeft: "none",
            }}
            className={`grid grid-cols-[1fr,50px] overflow-hidden border-b border-solid border-gray-200 bg-white p-4 lg:p-8`}
          >
            <div>
              <Text size="md2">{activity.info.title}</Text>
              <div
                className={`mt-1.5 flex items-start space-x-1 font-medium text-gray-500`}
              >
                <Rating hit={activity} type="sm" minRating={4} />
                <Text size="sm" className={`relative top-[2px] !text-xs`}>
                  {t("activity.providedBy")}: {activity.supplier.name}
                </Text>
              </div>
            </div>
            <Button
              className={`fixed -top-1 -right-1 z-10 !h-11 !min-h-0 !w-11 !rounded-none !rounded-bl-lg !border !border-solid !border-gray-200 !bg-white lg:relative lg:-top-8 lg:-right-8 lg:!h-12 lg:!w-12 lg:!border-none lg:hover:!bg-gray-50`}
              type="transparent"
              icon={<BsXLg />}
              onClick={close}
            />
          </div>
        )}
        <div
          className={classNames("grid", {
            "w-[350px]": isModal && !selectedOffer,
            "w-full gap-8 lg:grid-cols-2": isModal && selectedOffer,
            "w-[400px]": isModal && !selectedOffer,
            "bg-gray-50 px-4 py-6 lg:p-8": isModal,
          })}
        >
          <div className={"flex flex-col"} id="booking-calendar">
            {is422 && (
              <Toast className={`mb-4`} warning>
                {t("activity.widget.notBookableSeats")}
              </Toast>
            )}
            <Calendar
              activity={activity}
              type={type}
              bookable={bookable}
              bookableDate={bookableDate}
            />
            {!isSelected && !isModal && (
              <Button
                type="primary"
                className={`mt-6 w-full`}
                onClick={() => {
                  setDate(new Date(toISO(bookableDate)));
                  setIsSelected(true);
                  setIsCalendarOpen(false);
                  setTimeout(() => {
                    scrollToTarget(
                      `#booking-flow`,
                      document.querySelector("[data-booking]")
                    );
                  }, 10);
                }}
              >
                {t("activity.widget.titleTime")}
              </Button>
            )}
            {flow && <Flow activity={activity} type={type} />}
          </div>
          {isModal && (
            <>
              <div className={`hidden lg:block`}>
                <Card className={`!sticky !top-6 !bg-white`}>
                  <Summary
                    activity={activity}
                    type="inline"
                    checkout
                    isInModal={isModal}
                  />
                </Card>
              </div>
              {level === 1 && (
                <div className={`lg:hidden`}>
                  <Summary activity={activity} checkout isInModal={isModal} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;
};
