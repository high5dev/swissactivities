import { Text } from "../Text";
import classNames from "classnames";
import StaticImage from "../../Image";
import { Summary } from "./Summary";
import Button from "../Button";
import {
  FaArrowDown,
  FaRegClock,
  FaRegEdit,
  FaRegTrashAlt,
} from "react-icons/fa";
import { Card } from "../Card";
import {
  deleteReservation,
  newCart,
  updateCart,
} from "../../../services/bookingServices";
import { useI18n } from "next-localization";
import { useState } from "react";
import { Booking } from "./index";
import { DateService } from "../../../utils";
import { useBookingStore } from "../../../store/bookingStore";
import { Countdown } from "../Countdown";
import { Cancellable } from "./Cancellable";
import { scrollToTarget } from "../../../utils/scrollToTarget";
import { waitForElement } from "../../../utils/waitForElement";

export const Activity = ({
  item,
  cart,
  reservations,
  removeCb,
  newCartCb,
  widget,
  size,
}) => {
  const { t, locale } = useI18n();
  const isSm = size === "sm";
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bookedDate = DateService.formatDate(
    new Date(item.reservation.startsAt)
  );
  const openReservationId = useBookingStore((state) => state.openReservationId);
  const resId = item.reservation.reservationId;
  const reset = useBookingStore((state) => state.reset);
  const setDate = useBookingStore((state) => state.setDate);
  const setIsCalendarOpen = useBookingStore((state) => state.setIsCalendarOpen);
  const setIsSelected = useBookingStore((state) => state.setIsSelected);
  const setIsLoaded = useBookingStore((state) => state.setIsLoaded);
  const setLevel = useBookingStore((state) => state.setLevel);
  const setOpenReservation = useBookingStore(
    (state) => state.setOpenReservation
  );
  const setOpenReservationId = useBookingStore(
    (state) => state.setOpenReservationId
  );
  const setOpenReservationLoaded = useBookingStore(
    (state) => state.setOpenReservationLoaded
  );

  const removeFromCart = async (reservation) => {
    const newRes = reservations.filter((x) => x !== reservation);

    await deleteReservation(reservation);

    if (newRes.length >= 1) {
      updateCart(cart.cartId, {
        reservationIds: reservations.filter((x) => x !== reservation),
      }).then(() => {
        removeCb();
      });
    } else {
      newCart(locale()).then((data) => {
        newCartCb(data);
      });
    }
  };

  const clickEdit = async (value) => {
    setIsEdit(value);
    setOpenReservationId(openReservationId === resId ? "" : resId);
    setOpenReservationLoaded(false);

    if (openReservationId !== resId) {
      setOpenReservation(item.reservation);
      reset();
      setIsLoaded(true);
      setLevel(4);
      setIsSelected(true);
      setIsCalendarOpen(false);
      setDate(new Date(item.reservation.endsAt));

      await waitForElement(`#payment-methods`);
      scrollToTarget(`#booking-calendar`);
    }
  };

  return (
    <Card
      role={isSm ? "button" : undefined}
      onClick={isSm ? () => setIsOpen(!isOpen) : () => {}}
      className={classNames({
        "group !mx-0 cursor-pointer !border-none !p-0 !shadow-none": isSm,
      })}
    >
      {!widget && (
        <div
          style={{ borderLeft: "none", borderRight: "none", borderTop: "none" }}
          className={`-mx-4 -mt-6 mb-4 flex items-center border border-solid border-sky-100 bg-sky-50 px-4 py-2 text-xs text-sky-700 lg:-mx-6 lg:mb-6 lg:text-sm`}
        >
          <FaRegClock />
          <span className={`ml-3`}>
            {t("pages.basket.hold")}{" "}
            <Countdown item={item.reservation.expiresAt} />
          </span>
        </div>
      )}
      <div
        className={classNames({
          "mb-1 grid grid-cols-[50px,1fr] gap-4 sm:mb-0 sm:grid-cols-1": !isSm,
        })}
      >
        {!isSm && (
          <div
            className={`!h-[50px] overflow-hidden overflow-hidden rounded-lg sm:hidden`}
          >
            <StaticImage
              src={item.activity?.teaser_image?.url}
              width={50}
              height={50}
            />
          </div>
        )}
        <div>
          <Text
            as="h2"
            size={!isSm && "md2"}
            className={classNames(`flex font-semibold !text-black`, {
              "sm:mb-4": !isSm,
              "mb-1.5 grid grid-cols-[auto,1fr] gap-2": isSm,
              "mt-1": !isSm && item.reservation?.cancellableUntil,
            })}
          >
            {isSm && (
              <FaArrowDown
                className={classNames(
                  `relative top-1 flex text-gray-500 transition duration-100 ease-in lg:group-hover:text-primary`,
                  {
                    "rotate-180": isOpen,
                  }
                )}
              />
            )}
            <span>
              {locale() === "de_CH"
                ? item.activity?.info?.title
                : item.activity?.translations.find((e) => e.locale === locale())
                    .info.title}
            </span>
          </Text>
        </div>
      </div>
      <div
        className={classNames(`grid gap-8`, {
          "sm:grid-cols-[100px,1fr]": !isSm,
        })}
      >
        {!isSm && (
          <div
            className={`hidden !h-[100px] overflow-hidden rounded-lg sm:block`}
          >
            <StaticImage
              src={item.activity?.teaser_image?.url}
              width={100}
              height={100}
            />
          </div>
        )}
        <div className={`space-y-2`}>
          <div className={`space-y-0.5`}>
            <Summary
              type={isSm ? (isOpen ? "basketOpen" : "basket") : "booking"}
              offer={item.reservation.ticketReservations[0].offer.label}
              reservation={item.reservation}
              reservationTime={item.reservation.startsAt}
              total={item.reservation.totalPrice.formatted}
              discount={0}
              taxes={false}
            />
            {!isSm && item.reservation?.cancellableUntil && (
              <div className={`!mt-1`}>
                <Cancellable inline date={item.reservation?.cancellableUntil} />
              </div>
            )}
          </div>
          {!widget && (
            <div className={`flex justify-end gap-2`}>
              <Button
                type="danger"
                icon={<FaRegTrashAlt />}
                text={t("pages.basket.delete")}
                onClick={() => removeFromCart(resId)}
              />
              <Button
                type="transparent"
                icon={<FaRegEdit />}
                text={
                  openReservationId === resId
                    ? t("pages.basket.cancel")
                    : t("pages.basket.edit")
                }
                onClick={() => clickEdit(!isEdit)}
              />
            </div>
          )}
        </div>
      </div>
      {openReservationId === resId && !isSm && (
        <div className={`mt-4`}>
          <Booking
            activity={item.activity}
            bookable={bookedDate}
            bookableDate={bookedDate}
            type="basket"
          />
        </div>
      )}
    </Card>
  );
};
