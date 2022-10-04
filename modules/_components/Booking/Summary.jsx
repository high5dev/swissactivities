import { FaCalendar, FaClock, FaCreditCard, FaTicketAlt } from "react-icons/fa";
import { Text } from "../Text";
import Button from "../Button";
import { useI18n } from "next-localization";
import { useBookingStore } from "../../../store/bookingStore";
import classNames from "classnames";
import { getPageUrl } from "../../../services/contentServices";
import { useRouter } from "next/router";
import { Rating } from "../Rating";
import { scrollToTarget } from "../../../utils/scrollToTarget";
import { Tickets } from "./Tickets";
import { axiosInstance } from "../../../services";
import { TicketName } from "./TicketName";
import { getCart } from "../../../services/bookingServices";
import { BookingButton } from "./Button";
import { useRef } from "react";
import { BottomBar } from "../BottomBar";
import { dataLayerSend } from "../../../utils/dataLayerSend";
import { Cancellable } from "./Cancellable";
import PaymentMethods from "../PaymentMethods";
import { Skeleton } from "../Skeleton";
import { toISO } from "../../../utils/dates/toISO";

export const Summary = ({
  className,
  activity,
  type,
  checkout,
  reservation,
  reservationTime,
  discount,
  total,
  offer,
  isInModal,
  taxes = true,
}) => {
  const { t, locale } = useI18n();
  const ref = useRef(null);
  const axios = axiosInstance;
  const data = useBookingStore((state) => state.data);
  const date = useBookingStore((state) => state.date);
  const isBasket = type === "basket" || type === "basketOpen";
  const isBasketOpen = type === "basketOpen";
  const isBooking = type === "booking";
  const isCheckoutBottom = type === "checkoutBottom";
  const isInline = type === "inline" || type === "inlineBasket";
  const isInlineBasket = type === "inlineBasket";
  const isCancellable = useBookingStore((state) => state.isCancellable);
  const isLoaded = useBookingStore((state) => state.isLoaded);
  const isLoading = useBookingStore((state) => state.isLoading);
  const isModal = type === "modal";
  const isOpen = useBookingStore((state) => state.isOpen);
  const isSelected = useBookingStore((state) => state.isSelected);
  const isSkeleton = useBookingStore((state) => state.isSkeleton);
  const isTotal = type === "total";
  const level = useBookingStore((state) => state.level);
  const offers = useBookingStore((state) => state.offers);
  const openReservationId = useBookingStore((state) => state.openReservationId);
  const router = useRouter();
  const selectedOffer = useBookingStore((state) => state.selectedOffer);
  const setIs422 = useBookingStore((state) => state.setIs422);
  const setIsBasket = useBookingStore((state) => state.setIsBasket);
  const setIsCalendarOpen = useBookingStore((state) => state.setIsCalendarOpen);
  const setIsLoading = useBookingStore((state) => state.setIsLoading);
  const setOpenReservationLoaded = useBookingStore(
    (state) => state.setOpenReservationLoaded
  );
  const setReservation = useBookingStore((state) => state.setReservation);
  const setReservationIdNew = useBookingStore(
    (state) => state.setReservationIdNew
  );
  const tickets = useBookingStore((state) => state.tickets);

  const onReserve = async () => {
    setIsLoading(true);

    let cartId = localStorage.getItem("cartId");
    if (cartId) {
      await getCart(cartId).then((c) => {
        if (c.isAxiosError) {
          cartId = false;
          localStorage.removeItem("cartId");
        }
      });
    }

    const reservation = {
      activityId: activity?.summary?.activityId,
      availabilityId: data.time.id,
      selection: Object.entries(data.tickets)
        .filter(([k, v]) => v >= 1)
        .map(([k, v]) => {
          return {
            ticketCategoryId: Number(k),
            numGuests: v,
          };
        }),
      locale: locale(),
      doCreateCart: !cartId,
      cartId: cartId ? cartId : undefined,
    };

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BOOKINGAPI_HOST}/reservations`,
        reservation
      )
      .then((response) => {
        if (isInline && checkout && !isInModal) {
          setReservationIdNew(response.data.reservationId);
          setOpenReservationLoaded(false);
        } else {
          setReservation(response.data);
          !cartId && localStorage.setItem("cartId", response.data.cart.cartId);
          localStorage.removeItem("bookingId");
          setIsBasket(true);
          dataLayerSend({
            event: "add_to_cart",
            cart_id: response.data.cart.cartId,
            item_name: activity?.info?.title.trim(),
            id: activity?.id,
            location_id: locale().replace("_CH", "-ch"),
            value: response.data.totalPrice.amount,
            currency: response.data.totalPrice.currency,
          });
          router.push(
            `${getPageUrl("basket", locale())}/?cartId=${
              cartId || response.data.cart.cartId
            }`
          );
        }
      })
      .catch((err) => {
        if (err.response.status === 422) {
          console.log(err);
          setIs422(true);
          setIsCalendarOpen(true);
          setIsLoading(false);
          scrollToTarget(
            `#booking-calendar`,
            document.querySelector("[data-booking]")
          );
        }
      });
  };

  const Details = () => {
    return (
      <>
        {isCheckoutBottom && (
          <div className={`my-1.5 h-px w-full bg-gray-300`} />
        )}
        <div
          className={classNames("flex", {
            "flex-col space-y-1.5": !isCheckoutBottom,
          })}
        >
          {[
            {
              icon: <FaTicketAlt />,
              label: t("activity.widget.selectedOffer"),
              text: offer || data.offer,
              condition: !isBasket,
            },
            {
              icon: <FaCalendar />,
              label: t("UI.date"),
              text:
                (isBooking || isBasket) && reservationTime
                  ? toISO(reservationTime, { dateString: true })
                  : toISO(date, { date: true, locale: locale() }),
              condition: true,
            },
            {
              icon: <FaClock />,
              label: t("activity.widget.time"),
              text: time(),
              condition: true,
            },
            {
              icon: <FaTicketAlt />,
              label: t("activity.widget.navTicket"),
              text: (
                <span className={`flex flex-col`}>
                  {reservation?.ticketReservations.map((item) => {
                    return (
                      <span key={item.ticketReservationId}>
                        <TicketName
                          formatted={true}
                          item={item}
                          amount={item.guests.length}
                        />
                      </span>
                    );
                  })}
                </span>
              ),
              condition: isBasketOpen,
            },
            {
              icon: <FaCreditCard />,
              label: t("filter.price"),
              text: total,
              condition: isBasketOpen,
            },
          ].map((item, index) => {
            return (
              item.condition && (
                <Text
                  key={`cart-${index}`}
                  className={classNames(`font-medium text-black`, {
                    "flex gap-4 !text-sm": !isCheckoutBottom,
                    "!flex": isModal,
                  })}
                >
                  <span
                    className={classNames(`flex items-start`, {
                      "min-w-[100px] lg:min-w-[120px]": !isCheckoutBottom,
                    })}
                  >
                    <span className={`flex items-center`}>
                      <span className={`flex text-gray-400 `}>{item.icon}</span>
                      <span className={`ml-2 inline-block text-gray-600`}>
                        {item.label}
                      </span>
                    </span>
                  </span>
                  <span>{item.text}</span>
                </Text>
              )
            );
          })}
        </div>
      </>
    );
  };

  const time = () => {
    const resTime =
      (isBooking || isBasket) && toISO(reservationTime, { time: true });

    return isBooking || isBasket
      ? resTime === "00:00"
        ? t("booking.fullDay")
        : resTime
      : selectedOffer?.availabilities?.[0]?.isAllDay
      ? t("booking.fullDay")
      : data?.time?.label;
  };

  const hasTickets =
    (selectedOffer &&
      data?.tickets &&
      Object.values(data.tickets).filter((e) => e >= 1).length >= 1) ||
    isBasket ||
    isBooking ||
    total;

  const showDetails =
    !isCheckoutBottom && !isTotal && !isInlineBasket && hasTickets;

  return isInline && isSkeleton && !isLoaded ? (
    <Skeleton amount={3} />
  ) : (
    <div
      ref={ref}
      style={{
        boxShadow: isCheckoutBottom
          ? "0px -6px 10px 0 rgba(0,0,0,0.1)"
          : "none",
      }}
      className={classNames({
        "fixed bottom-0 left-0 w-full bg-white px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] lg:hidden":
          isCheckoutBottom,
        "grid grid-cols-2": isModal,
        "z-[101]": !isOpen,
        "z-[110]": isOpen,
        "!hidden": isOpen && isCheckoutBottom && selectedOffer,
        [className]: className,
      })}
    >
      {(isInline || isBooking) && !isInlineBasket && (
        <Text as="h3" className={`mb-2 text-base font-semibold !text-black`}>
          {activity?.info?.title}
        </Text>
      )}
      {showDetails && <Details />}
      <div className={`flex flex-col`}>
        {(isInline || isBooking) && !isInlineBasket && hasTickets && (
          <>
            <div className={`mt-3.5 mb-4 h-px w-full bg-gray-200`} />
            {hasTickets && !isBooking ? (
              <Tickets />
            ) : (
              <div className={`flex flex-col space-y-0.5`}>
                {reservation?.ticketReservations.map((item) => {
                  return (
                    <Text key={item.ticketReservationId}>
                      <TicketName
                        formatted={true}
                        item={item}
                        amount={item.guests.length}
                      />
                    </Text>
                  );
                })}
              </div>
            )}
            <div className={`mt-4 mb-3 h-px w-full bg-gray-200`} />
          </>
        )}
        <div
          className={classNames({
            "grid grid-cols-2":
              !isInline && !isBooking && !isTotal && !isBasket,
            "grid grid-cols-5 gap-3": !isModal && isCheckoutBottom,
            "flex justify-end": isModal,
          })}
        >
          {(hasTickets || isCheckoutBottom) && (
            <div
              className={classNames(`shrink-0`, {
                "col-span-2": isCheckoutBottom,
                "grid grid-cols-2":
                  isInline || isBooking || isTotal || isBasket,
              })}
            >
              <Text
                className={classNames(`truncate font-medium text-gray-500`, {
                  "mb-0.5 !flex !flex-col !text-xs": isCheckoutBottom,
                })}
              >
                {isCheckoutBottom ? (
                  isSelected && hasTickets ? (
                    <span className={`truncate font-semibold text-black`}>
                      {data.offer}
                    </span>
                  ) : (
                    <span className={`flex flex-col`}>
                      <span className={`!text-base !font-semibold !text-black`}>
                        {`${t("search.card.from")} ${
                          activity?.summary?.startingPrice?.formatted
                        }`}
                      </span>
                      <Rating hit={activity} type="sm" minRating={4} />
                    </span>
                  )
                ) : (
                  !isBasket && (
                    <span className={`text-gray-600`}>
                      {t("activity.widget.totalPrice")}
                    </span>
                  )
                )}
                {isCheckoutBottom && isSelected && hasTickets && (
                  <span className={`flex flex-col`}>
                    <span>
                      {date.toLocaleDateString("en-GB").replaceAll("/", ".") +
                        ", " +
                        time()}
                    </span>
                    <span>
                      {tickets +
                        " " +
                        (tickets === 1
                          ? t("booking.ticket")
                          : t("activity.widget.navTicket"))}
                    </span>
                  </span>
                )}
              </Text>
              {!isCheckoutBottom && !isBasket && (
                <Text
                  size="md"
                  className={classNames(
                    `self-end justify-self-end font-semibold`,
                    {
                      "text-[16px]": isCheckoutBottom,
                      "justify-self-end": isInline,
                    }
                  )}
                >
                  {isBooking
                    ? `${reservation.totalPrice.currency} ${
                        reservation.totalPrice.amount - discount
                      }`
                    : !isTotal || (isTotal && checkout)
                    ? offers[0]?.ticketCategories[0].price?.currency +
                      " " +
                      data?.total?.toFixed(2).replace(".00", "")
                    : total}
                </Text>
              )}
              {!isCheckoutBottom && !isBasket && taxes && (
                <span className={`text-[11px] font-medium text-green-600`}>
                  {t("activity.widget.priceTaxes")}
                </span>
              )}
            </div>
          )}
          {isCancellable && !isBooking && !isTotal && !isBasket && (
            <div
              className={classNames(`hidden lg:block`, {
                "mt-5": hasTickets,
                "mt-2": !hasTickets,
              })}
            >
              <Cancellable />
            </div>
          )}
          {((!isInline && !isBooking && !isTotal && !isBasket) || checkout) && (
            <div
              className={classNames(`grid gap-1`, {
                "col-span-3": isCheckoutBottom,
              })}
            >
              {!isCheckoutBottom && (
                <div
                  className={classNames(`hidden lg:block`, {
                    "mt-4": level >= 2 && offers?.length >= 1 && data?.time?.id,
                    "mt-2": !data?.time?.id,
                  })}
                >
                  <PaymentMethods />
                </div>
              )}
              {isOpen || openReservationId !== "" ? (
                <BottomBar
                  className={classNames(`lg:!static lg:!p-0 lg:!shadow-none`, {
                    "!static !p-0 !shadow-none": isInlineBasket,
                  })}
                >
                  <Button
                    type={
                      level === 4 &&
                      data?.tickets &&
                      Object.values(data.tickets).length >= 1 &&
                      Object.values(data.tickets).filter((e) => e >= 1)
                        .length >= 1
                        ? "primary"
                        : "instruction"
                    }
                    onClick={
                      isSelected && selectedOffer
                        ? onReserve
                        : () => {
                            scrollToTarget(
                              `#booking-calendar`,
                              document.querySelector("[data-booking]")
                            );
                          }
                    }
                    loading={isLoading}
                    disabled={tickets === 0}
                    className={classNames("w-full !font-bold", {
                      "!text-sm": isCheckoutBottom,
                      "!max-h-[52px]": !isCheckoutBottom,
                      "!hidden lg:!block":
                        !isBasket && !isCheckoutBottom && !checkout,
                      "pointer-events-none": isLoading,
                      "lg:mt-6": !isBasket,
                      "mt-6": isInlineBasket,
                    })}
                  >
                    {isInline && checkout && !isInModal
                      ? t("pages.basket.update")
                      : isCheckoutBottom
                      ? isSelected && !isOpen
                        ? t("activity.widget.adjust")
                        : t("activity.widget.basket")
                      : level === 1
                      ? t("activity.widget.titleDate")
                      : level === 2
                      ? t("activity.widget.titleTime")
                      : level === 3
                      ? t("activity.widget.titleTickets")
                      : t("activity.widget.basketAdd")}
                  </Button>
                </BottomBar>
              ) : (
                <BookingButton />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
