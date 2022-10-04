import { useBookingStore } from "../../../store/bookingStore";
import { useEffect, useRef, useState } from "react";
import { Text } from "../Text";
import { useI18n } from "next-localization";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import classNames from "classnames";
import { queryOfferById } from "../../../services/contentServices";
import { Select } from "../Form/Select";
import { DateService } from "../../../utils";
import { Ticket } from "./Ticket";
import { Summary } from "./Summary";
import { Loader } from "../Loader";
import { scrollToTarget } from "../../../utils/scrollToTarget";
import Toast from "../Toast";
import { axiosInstance } from "../../../services";
import { Skeleton } from "../Skeleton";
import { mappedTicket } from "./utils/mappedTicket";
import { isObject } from "lodash";
import { Card } from "../Card";
import { Cancellable } from "./Cancellable";
import PaymentMethods from "../PaymentMethods";
import { useThrottle } from "../../../hooks/useThrottle";
import { toISO } from "../../../utils/dates/toISO";
import { dataLayerSend } from "../../../utils/dataLayerSend";

export const Flow = ({ activity, type }) => {
  const { t, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [sortedTickets, setSortedTickets] = useState({});
  const axios = axiosInstance;
  const data = useBookingStore((state) => state.data);
  const date = useBookingStore((state) => state.date);
  const dateFormat = useBookingStore((state) => state.dateFormat);
  const dates = useBookingStore((state) => state.dates);
  const isBasket = type === "basket";
  const isBasketBooking = useBookingStore((state) => state.isBasket);
  const isCancellable = useBookingStore((state) => state.isCancellable);
  const isLoaded = useBookingStore((state) => state.isLoaded);
  const isLoadingBooking = useBookingStore((state) => state.isLoading);
  const isModal = type === "modal";
  const isRequest = useBookingStore((state) => state.isRequest);
  const isSelected = useBookingStore((state) => state.isSelected);
  const isSkeleton = useBookingStore((state) => state.isSkeleton);
  const level = useBookingStore((state) => state.level);
  const offers = useBookingStore((state) => state.offers);
  const openReservation = useBookingStore((state) => state.openReservation);
  const openReservationLoaded = useBookingStore(
    (state) => state.openReservationLoaded
  );
  const reservationIdNew = useBookingStore((state) => state.reservationIdNew);
  const selectedOffer = useBookingStore((state) => state.selectedOffer);
  const setData = useBookingStore((state) => state.setData);
  const setIsCalendarOpen = useBookingStore((state) => state.setIsCalendarOpen);
  const setIsCancellable = useBookingStore((state) => state.setIsCancellable);
  const setIsRequest = useBookingStore((state) => state.setIsRequest);
  const setIsSkeleton = useBookingStore((state) => state.setIsSkeleton);
  const setLevel = useBookingStore((state) => state.setLevel);
  const setOffers = useBookingStore((state) => state.setOffers);
  const setOpenReservationLoaded = useBookingStore(
    (state) => state.setOpenReservationLoaded
  );
  const setSelectedOffer = useBookingStore((state) => state.setSelectedOffer);
  const setTickets = useBookingStore((state) => state.setTickets);

  const hasTickets =
    selectedOffer &&
    data?.tickets &&
    Object.values(data.tickets).filter((e) => e >= 1).length >= 1;

  const invokeDebounced = useThrottle(() => {
    const getOffers = async () => {
      setIsRequest(true);
      setIsLoading(true);

      await axios
        .get(
          `${process.env.NEXT_PUBLIC_BOOKINGAPI_HOST}/activities/${activity.summary.activityId}/availabilities`,
          {
            params: {
              locale: locale(),
              startsAfter: DateService.formatDate(new Date()),
              untilEndOfDay: dateFormat,
              limit: 50,
            },
          }
        )
        .then((resp) => {
          formatAvailabilities(resp.data).then((d) => {
            // console.log(d);

            setOffers(d);
            !selectedOffer?.offerId && setIsCalendarOpen(false);

            if (isBasket) {
              const offer = d.find(
                (e) =>
                  e.offerId ===
                  (!openReservationLoaded ? openReservation : selectedOffer)
                    .offerId
              );
              setSortedTickets(sortTickets(offer));

              if (!openReservationLoaded) {
                let ticketsAmount = 0;
                const tickets = {};
                const ticketsLabel = {};

                openReservation.ticketReservations.map((item) => {
                  const amount = item.guests.length;
                  tickets[item.ticketCategory.ticketCategoryId] = amount;
                  ticketsAmount = ticketsAmount + amount;
                });

                const startsAt = openReservation.startsAt;
                const availability =
                  d[0].availabilities.find(
                    (item) => item.timeslot === formatTime(startsAt)
                  ) || d[0].availabilities[0];

                Object.entries(tickets).map(([k, v]) => {
                  const ticket = offer.ticketCategories.find(
                    (e) => e.ticketCategoryId === Number(k)
                  );

                  ticketsLabel[mappedTicket(ticket)] = v;
                });

                setTickets(ticketsAmount);
                setData({
                  ...data,
                  tickets,
                  ticketsLabel,
                  offer: offer.offerLabel,
                  total: Number(openReservation?.totalPrice?.amount),
                  time: {
                    id: availability.availabilityId,
                    label: availability.timeslot,
                  },
                });
                setSelectedOffer(offer);
                setOpenReservationLoaded(true);
              } else {
                setOffer(offer);
              }
            }

            if (!isBasket) {
              if (selectedOffer?.offerId) {
                const offer = d.find(
                  (item) => item.offerId === selectedOffer?.offerId
                );
                setOffer(offer);
              } else if (d.length === 1) {
                setOffer(d[0]);
                setLevel(3);
              }
            }

            setIsLoading(false);
            setIsRequest(false);
            setIsSkeleton(false);
          });
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    };

    if (
      ((isSelected && !isRequest && isModal && !isBasketBooking) ||
        (isBasket && reservationIdNew === "")) &&
      !isLoadingBooking &&
      isLoaded &&
      level >= 2
    ) {
      getOffers();
    }
  }, 500);

  useEffect(invokeDebounced, [
    invokeDebounced,
    activity?.summary?.activityId,
    isSelected,
    date,
    isLoaded,
    dates,
    data.time?.id,
    selectedOffer,
  ]);

  const setOffer = (offer) => {
    setIsCancellable(offer?.availabilities.some((e) => e?.cancellableUntil));
    setData({
      ...data,
      offer: offer?.offerLabel,
      time: getTime(offer),
    });
    const tickets = sortTickets(offer);
    setSortedTickets(tickets);
    setSelectedOffer(offer);
    setTicketState(offer, true, tickets);
  };

  const formatAvailabilities = (offers) => {
    if (!offers) {
      return [];
    }
    const offersList = offers.map(formatOfferItem);

    return Promise.all(offersList);
  };

  const formatTime = (startDate) => {
    const d = toISO(startDate);
    const hours = d.getHours() + 2;
    const minutes = d.getMinutes();
    return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
  };

  const formatOfferItem = async (offer) => {
    offer.availabilities
      .sort((a, b) => Date.parse(a.startsAt) > Date.parse(b.startsAt))
      .forEach((availability) => {
        availability.timeslot = formatTime(availability.startsAt);
      });

    try {
      const contentOffer = await queryOfferById(offer.contentApiOfferId);

      if (contentOffer) {
        const translation = contentOffer.data.offer?.translations?.find(
          (translation) => translation.locale === locale()
        );
        const offerLabel =
          (translation && translation.label) ||
          contentOffer.data.offer?.label ||
          offer.offerLabel;
        const description =
          translation?.description ||
          contentOffer.data.offer?.description ||
          "";

        return { ...offer, offerLabel, description };
      }
    } catch (e) {
      console.log("widget err==", e);
    }

    return offer;
  };

  const getTime = (offer) => {
    return {
      id:
        data?.time?.label &&
        offer?.availabilities &&
        offer?.availabilities
          .map((item) => item.timeslot)
          .includes(data?.time.label)
          ? offer?.availabilities.find(
              (item) => item.timeslot === data?.time.label
            ).availabilityId
          : offer?.availabilities?.[0].availabilityId,
      label:
        data?.time?.label &&
        offer?.availabilities &&
        offer?.availabilities
          .map((item) => item.timeslot)
          .includes(data?.time.label)
          ? offer?.availabilities.find(
              (item) => item.timeslot === data?.time.label
            ).timeslot
          : offer?.availabilities?.[0].timeslot,
    };
  };

  const sortTickets = (offer) => {
    const availabilityId = getTime(offer).id;

    let filteredTickets =
      offer?.ticketCategories &&
      Object.values(offer.ticketCategories)
        .map((item) => {
          return (
            offer?.availabilities
              .find((e) => e.availabilityId === availabilityId)
              ?.ticketCategoryIds.includes(item.ticketCategoryId) && item
          );
        })
        .filter((x) => x);

    return filteredTickets?.sort((a, b) =>
      a.label.formatted.localeCompare(b.label.formatted, undefined, {
        numeric: true,
      })
    );
  };

  const setTicketData = (d) => {
    const ticket = d.ticket;
    const initialTicket =
      ticket?.occupancy > 1 && ticket?.maxOccupancy !== null
        ? ticket.occupancy
        : 1;

    setTickets(initialTicket);
    setData({
      offer: d.offer,
      time: d.time,
      total: Number(
        ticket?.occupancy && ticket.maxOccupancy !== null
          ? ticket?.price?.amount * ticket.occupancy
          : ticket?.price?.amount
      ),
      ticketsLabel: {
        [mappedTicket(ticket)]: initialTicket,
      },
      tickets: {
        [ticket?.ticketCategoryId]: initialTicket,
      },
    });
  };

  const setTicketState = (offer, time = true, tickets = sortedTickets) => {
    let t = tickets;

    if (data.ticketsLabel && t.length >= 1) {
      const mappedTickets = {};
      let mappedTicketsLabels = [];
      let newTotal = 0;

      Object.entries(data.ticketsLabel).map(([k, v]) => {
        const id = k.split("_");
        const audience = id[0];
        const discount = id[1] === "null" ? null : id[1];
        const occupancyType = id[2];
        const occupancy = Number(id[3]);

        const o = t.find(
          (item) =>
            item?.label?.audience === audience &&
            item?.label?.discount === discount &&
            item?.occupancyType === occupancyType &&
            item?.occupancy === occupancy
        );

        mappedTicketsLabels.push(mappedTicket(o));

        newTotal = newTotal + Number(o?.price?.amount * v);
        mappedTickets[o?.ticketCategoryId] = v;
      });

      // console.log(Object.keys(data.ticketsLabel).toString());
      // console.log(mappedTicketsLabels.toString());
      // console.log(mappedTickets);

      if (
        Object.keys(data.ticketsLabel).toString() ===
        mappedTicketsLabels.toString()
      ) {
        setData({
          ...data,
          ...(time ? { time: isObject(time) ? time : getTime(offer) } : {}),
          offer: offer?.offerLabel,
          total: newTotal,
          tickets: mappedTickets,
        });
      } else {
        setTicketData({
          ticket: sortTickets(offer, getTime(offer))[0],
          offer: offer?.offerLabel,
          ...(time ? { time: isObject(time) ? time : getTime(offer) } : {}),
        });
      }
    }
  };

  return isSelected && level >= 2 ? (
    <div
      className={classNames(`relative lg:pb-0`, {
        "mt-6 pb-9": !isBasket,
        "mt-2": isBasket,
      })}
    >
      <div>
        {isSkeleton ? (
          <Skeleton amount={4} />
        ) : (
          <div className={`relative space-y-6`}>
            <div className={`space-y-3`}>
              {activity?.attribute_values
                ?.filter((e) => e.id === "168" || e.id === "171")
                .map((item) => {
                  return (
                    item.value && (
                      <Toast key={`attribute-${item.id}`}>{item.value}</Toast>
                    )
                  );
                })}
              {Object.values(offers)
                .sort((a, b) =>
                  a.offerLabel.localeCompare(b.offerLabel, undefined, {
                    numeric: true,
                  })
                )
                .map((item, index) => {
                  const id = item.offerId;
                  const selected = selectedOffer?.offerId === id;

                  return (
                    <Card
                      id={`offer-${id}`}
                      role="button"
                      onClick={() => {
                        if (!selected) {
                          setSelectedOffer(item);
                          setTimeout(() => {
                            scrollToTarget(
                              `#offer-${id}`,
                              isBasket
                                ? window
                                : document.querySelector("[data-booking]")
                            );
                          }, 10);
                          setIsCalendarOpen(false);
                          if (level <= 2) {
                            setLevel(3);
                          }
                          const nextData =
                            window?.__NEXT_DATA__?.props?.pageProps;
                          dataLayerSend({
                            event: "offer_selection",
                            cart_id: localStorage?.getItem?.("cartId"),
                            item_name: nextData?.activity?.info?.title.trim(),
                            id: nextData?.activity?.id,
                            location_id: locale().replace("_CH", "-ch"),
                            value:
                              nextData?.startingPrice?.startingPrice?.amount,
                            currency:
                              nextData?.startingPrice?.startingPrice?.currency,
                          });
                        }
                      }}
                      key={`offer-${item.offerId}`}
                      className={classNames("!py-4 lg:!px-4 lg:!py-5", {
                        "cursor-pointer border-gray-200 lg:hover:shadow-md":
                          !selected,
                        "border-primary": false,
                        "!bg-white": isModal,
                        "mx-0 !rounded-lg !border !border-solid !border-gray-100":
                          isBasket,
                      })}
                    >
                      <div
                        className={classNames(
                          `grid grid-cols-[1fr,auto] items-center gap-2`,
                          {
                            "!pointer-events-none !opacity-50":
                              isLoadingBooking,
                          }
                        )}
                      >
                        <div
                          className={`mr-2 flex flex-col text-[14px] text-black`}
                        >
                          <span>{item.offerLabel}</span>
                          {item?.description && (
                            <span
                              className={`mt-1.5 text-[12px] leading-snug text-gray-500`}
                            >
                              {item.description}
                            </span>
                          )}
                        </div>
                        <div className={`flex items-center justify-between`}>
                          <div
                            className={classNames(
                              `flex h-6 w-6 items-center justify-center justify-self-end bg-white text-primary`,
                              {
                                "rounded-full": isLoading,
                                rounded: !isLoading,
                              }
                            )}
                          >
                            {!selected ? (
                              <FaChevronDown />
                            ) : (
                              <span className={`flex text-sm`}>
                                {isLoading ? <Loader /> : <FaCheck />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {selected && (
                        <div
                          className={classNames({
                            "!pointer-events-none !opacity-50":
                              isLoadingBooking,
                          })}
                        >
                          {!item.availabilities[0]?.isAllDay && (
                            <div
                              className={`mt-4 mb-1 flex flex-wrap items-end justify-between`}
                            >
                              <div className={`inline-flex w-full flex-col`}>
                                {
                                  <Select
                                    rowFull
                                    title={`${t(
                                      "activity.widget.offerTimeSelect"
                                    )}:`}
                                    options={selectedOffer.availabilities.map(
                                      (availability) => ({
                                        value: availability.availabilityId,
                                        label: availability.timeslot,
                                        availability,
                                      })
                                    )}
                                    onChange={(e) => {
                                      const slot =
                                        selectedOffer.availabilities.find(
                                          (item) =>
                                            item.availabilityId ===
                                            e.target.value
                                        ).timeslot;
                                      const timeData = {
                                        id: e.target.value,
                                        label: slot,
                                      };
                                      setData({
                                        ...data,
                                        time: timeData,
                                      });
                                      const tickets =
                                        sortTickets(selectedOffer);

                                      setSortedTickets(tickets);
                                      setTicketState(
                                        selectedOffer,
                                        timeData,
                                        tickets
                                      );
                                    }}
                                    selected={data?.time?.id}
                                  />
                                }
                              </div>
                            </div>
                          )}
                          <div className={`flex flex-col space-y-2`}>
                            <div>
                              {sortedTickets?.length >= 1 && (
                                <div className={`space-y-2`}>
                                  {sortedTickets.map((item) => {
                                    return (
                                      <Ticket
                                        activity={activity}
                                        className={`first:mt-4`}
                                        key={`ticketCat-${item?.ticketCategoryId}`}
                                        item={item}
                                      />
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            {data.total > 0 && !selectedOffer && !isModal && (
                              <div className={`!mt-4`}>
                                <div className={`flex justify-between `}>
                                  <Text size="md">
                                    {t("activity.widget.totalPrice")}
                                  </Text>
                                  <Text size="md">
                                    {offers[0]?.ticketCategories[0].price
                                      ?.currency +
                                      " " +
                                      data.total.toFixed(2)}
                                  </Text>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {!isBasket && (
                        <>
                          {(selected || (index === 0 && !hasTickets)) && (
                            <Summary
                              className={classNames(`lg:hidden`, {
                                "mt-4": selected,
                              })}
                              activity={activity}
                              type="total"
                              checkout
                            />
                          )}
                          {selected && isCancellable && (
                            <>
                              <div
                                className={classNames(`lg:hidden`, {
                                  "mt-4": hasTickets,
                                  "mt-1": !hasTickets,
                                })}
                              >
                                <Cancellable />
                              </div>
                              <div className={`mt-4 lg:hidden`}>
                                <PaymentMethods />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </Card>
                  );
                })}
            </div>
            {!isModal && selectedOffer && (
              <Summary
                activity={activity}
                checkout={isBasket}
                type={isBasket ? "inlineBasket" : "inline"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;
};
