import React, { useState, useEffect, useCallback, useRef } from "react";
import classnames from "classnames";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { BsX, BsChevronRight, BsCalendar, BsChat } from "react-icons/bs";

import * as bookingServices from "../../services/bookingServices";
import { getPageUrl, queryOfferById } from "../../services/contentServices";
import Button from "../Button";
import PaymentMethods from "../_components/PaymentMethods/";
import Loading from "../Loading";
import BookingWidgetMobile from "./BookingWidgetMobile/";
import WidgetDesktop from "./WidgetDesktop/";
import HintModal from "./HintModal/";

import ErrorModal from "../ErrorModal";
import styles from "./styles.module.scss";
import useSortedTicketCategories from "./useSortedTicketCategories.hook";
import StaticImage from "../Image";
import axios from "axios";
import { DateService } from "../../utils";
import { Calendar } from "../_components/Calendar";

const steps = 4;

const NotBookable = dynamic(() => import("./NotBookable"));

const fromEntries = (iterable) => {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {});
};

const BookingWidget = ({
  activity,
  t,
  isActive,
  setWidgetState,
  availabilitiesList,
  mappedId,
  locale,
  isMobile,
  onClose,
  scrollToForm,
  mobileWidgetScrollRef,
  currentMonthAvailableDates,
}) => {
  const router = useRouter();
  const [currentStep, setStep] = useState(0);
  const [lastVisitedStep, setLastVisitedStep] = useState(0);
  const [isBasketReached, setBasketReached] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookingDate, setDate] = useState(new Date());
  const [activeAvailability, setActiveAvailability] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [activeOffer, setActiveOffer] = useState({});
  const [tickets, setTickets] = useState({});
  const [error, setError] = useState(null);
  const [isBookingActive, setBookingActive] = useState(false);
  const [isHintModalActive, setHintModalActive] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    let index = 1;
    const getter = async (number) => {
      const date = new Date().getMonth() + number;

      await axios
        .get(
          `${process.env.NEXT_PUBLIC_BOOKINGAPI_HOST}/activities/${
            activity.summary.activityId
          }/monthly-availabilities?year=${new Date().getFullYear()}&month=${date}`
        )
        .then((resp) => {
          if (
            Object.entries(resp.data).every((item) => item[1].price === null)
          ) {
            index++;
            if (12 >= date && 6 >= index) {
              getter(index);
            }
          } else {
            setAvailableDates(resp.data);
            //const firstAvailableDate = Object.entries(resp.data).filter(([key, value]) => value.price !== null)?.[0]?.[0].split('-');
            //firstAvailableDate && setDate(new Date(`${firstAvailableDate[1]}/${firstAvailableDate[2]}/${firstAvailableDate[0]}`))
            setLoading(false);
          }
        });
    };

    activity?.summary?.activityId && getter(1);
  }, []);

  const getAvailableDates = useCallback(async (calendarYear, calendarMonth) => {
    setLoading(true);
    const resp = await axios.get(
      `${process.env.NEXT_PUBLIC_BOOKINGAPI_HOST}/activities/${
        activity.summary.activityId
      }/monthly-availabilities?year=${calendarYear}&month=${calendarMonth + 1}`
    );
    setAvailableDates(resp.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      return (firstRender.current = false);
    }
  }, [availableDates, currentMonthAvailableDates]);

  const activeOfferTicketCategories = useSortedTicketCategories(
    activeAvailability?.ticketCategories
  );

  const clearSelectedTickets = (availableTickets) => {
    if (!availableTickets?.length) {
      setTickets({});

      return true;
    }

    let isTicketsListChanged = false;
    const prevSelectedTickets = Object.keys(tickets).filter(
      (ticketId) => tickets[ticketId].amount
    );

    const availableSelectedTickets = availableTickets
      .filter(
        (aTicket) =>
          tickets[aTicket.ticketCategoryId] &&
          tickets[aTicket.ticketCategoryId].amount
      )
      .map((aTicket) => [
        aTicket.ticketCategoryId,
        tickets[aTicket.ticketCategoryId],
      ]);

    if (availableSelectedTickets.length !== prevSelectedTickets.length) {
      isTicketsListChanged = true;
    }

    if (availableSelectedTickets.length) {
      setTickets(fromEntries(availableSelectedTickets));
    } else {
      setTickets({
        [availableTickets[0].ticketCategoryId]: {
          ...availableTickets[0],
          amount: 1,
        },
      });
    }

    return isTicketsListChanged;
  };

  const clearSelected = (newData = [], isInitial) => {
    const prevSelectedOffer = newData?.find(
      (offer) => offer.offerId === activeOffer.offerId
    );
    const prevSelectedTime = prevSelectedOffer?.availabilities?.find(
      ({ timeslot }) => timeslot === activeAvailability?.timeslot
    );

    if (!isInitial && prevSelectedTime) {
      setActiveAvailability(prevSelectedTime);

      goToStep(1);

      return setLoading(false);
    }

    if (newData.length > 0) {
      setActiveOffer(newData[0]);
      setActiveAvailability(newData[0].availabilities[0]);
      clearSelectedTickets(newData[0].ticketCategories);
    } else {
      setActiveOffer({});
      setActiveAvailability(null);
      setTickets({});
    }

    if (!isInitial) {
      goNextStep();
      setLastVisitedStep(1);
    }
  };

  const formatAvailabilities = (offers) => {
    if (!offers) {
      return [];
    }
    const offersList = offers.map(formatOfferItem);

    return Promise.all(offersList);
  };

  const handleGA = () => {
    dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        items: [
          {
            item_name: activity.info.title,
            item_id: activity.id, // id of the item if exists, if not, do not add this line to the code
            price: 0, //should be a number NOT a string
            item_region: activity.location.title, // It should take region name. example
            item_category: activity.type.title, // Category of the activity. Example is here
          },
        ],
      },
    });
  };

  const goNextStep = () => {
    if (steps > currentStep + 1) {
      goToStep(currentStep + 1);
    }
  };

  const goToStep = (step) => {
    setStep(step);

    if (step === 3) {
      setBasketReached(true);
    }

    setLastVisitedStep(Math.max(step, lastVisitedStep));
  };

  const goToLastVisitedStep = () => {
    goToStep(lastVisitedStep);
  };

  const closeError = () => {
    setError(null);
  };

  const formatOfferItem = async (offer) => {
    offer.availabilities
      .sort((a, b) => Date.parse(a.startsAt) > Date.parse(b.startsAt))
      .forEach((availability) => {
        const startDate = new Date(availability.startsAt);
        const time =
          ("0" + startDate.getHours()).slice(-2) +
          ":" +
          ("0" + startDate.getMinutes()).slice(-2);
        availability.timeslot = time;
      });

    try {
      const contentOffer = await queryOfferById(offer.contentApiOfferId);

      if (contentOffer) {
        const translation = contentOffer.data.offer?.translations?.find(
          (translation) => translation.locale === locale
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

  const onSelectBookingDate = async (date, isInitial) => {
    setLoading(true);
    const selectedDate = new Date(date);
    const prevDate = new Date(bookingDate);
    if (selectedDate.getTime() !== prevDate.setHours(0)) {
      setDate(date);
      const formattedData = await handleSelectDate(
        date.toLocaleDateString("en-ca")
      );
      clearSelected(formattedData, isInitial);
    } else {
      currentStep === lastVisitedStep ? goNextStep() : goToLastVisitedStep();
    }

    setLoading(false);

    handleMobileStep(lastVisitedStep === 0 ? 1 : lastVisitedStep);
  };

  const checkAvailability = async () => {
    const ticketIds = Object.keys(tickets)
      .map((id) => Number(id))
      .filter((id) => tickets[id].amount);

    if (!ticketIds.length) {
      return;
    }

    setLoading(true);

    const selection = ticketIds.map((ticketId) => {
      return {
        ticketCategoryId: ticketId,
        numGuests: tickets[ticketId].amount,
      };
    });

    bookingServices
      .postReservations({
        activityId: Number(mappedId),
        availabilityId: activeAvailability.availabilityId,
        locale,
        selection,
      })
      .then((res) => {
        localStorage.setItem("reservationId", res.reservationId);
        //remove prev /booking variables
        localStorage.removeItem("bookingId");

        router.push(
          `${getPageUrl("booking", locale)}/?activityId=${activity.id}`
        );
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectDate = async (date) => {
    const availabilities = await bookingServices.getActualAvailabilities({
      activityId: mappedId,
      untilEndOfDay: date,
      limit: 50,
      locale,
    });

    const formattedData = await formatAvailabilities(availabilities);

    setAvailabilities(formattedData);
    handleGA();

    if (formattedData.length) {
      return formattedData;
    }
  };

  const handleTicketsUpdate = ({ ticket, amount }) => {
    const newTickets = { ...tickets };
    newTickets[ticket.ticketCategoryId] = {
      ...ticket,
      amount: Math.max(amount, 0),
    };
    setTickets(newTickets);
  };

  const getTotal = () => {
    const ticketIds = Object.keys(tickets);
    const totalPrice = ticketIds.reduce(
      (acc, ticketId) =>
        acc + tickets[ticketId].price.amount * tickets[ticketId].amount,
      0
    );
    return totalPrice.toFixed(2);
  };

  const disableCalendarTile = ({ activeStartDate, date, view }) => {
    if (availableDates.length <= 0) return;
    let dateToEqual = new Date(date)
      .toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .reverse()
      .join("-");
    return (
      (view === "month" &&
        date.setHours(0, 0, 0, 0) <= new Date() &&
        !bookingDate) ||
      (!availableDates[dateToEqual]?.price &&
        new Date(dateToEqual).setHours(0, 0, 0, 0) ===
          new Date(date).setHours(0, 0, 0, 0))
    );
  };

  const handleOfferSelect = (offer) => {
    setTickets({});
    setActiveAvailability(null);
    setActiveOffer(offer);
    if (lastVisitedStep > 2) {
      setLastVisitedStep(2);
    }

    if (offer.availabilities) {
      const firstAvailability = offer.availabilities[0];
      setActiveAvailability(firstAvailability);

      if (firstAvailability.ticketCategoryIds[0]) {
        const presetTicket = {
          ...offer.availabilities[0].ticketCategories[0],
          amount: 1,
        };
        setTickets({
          [offer.availabilities[0].ticketCategories[0].ticketCategoryId]:
            presetTicket,
        });
      }
    }
  };

  const handleTimeSelect = (availability) => {
    setActiveAvailability(availability);
    const isTicketsUpdated = clearSelectedTickets(
      availability?.ticketCategories
    );

    if (isTicketsUpdated && lastVisitedStep > 2) {
      setLastVisitedStep(2);
    }
  };

  const handleOfferConfirm = () => {
    if (activeOffer?.offerId && activeAvailability) {
      if (lastVisitedStep === currentStep) {
        goNextStep();
      } else {
        goToLastVisitedStep();
      }
    }
  };

  const handleWidgetActivation = () => {
    if (isActive || isMobile) return;
    setWidgetState(true);
  };

  const handleMobileStep = (step) => {
    setBookingActive(true);
    goToStep(step);
    if (step === 0) {
      mobileWidgetScrollRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleTicketsSubmit = () => {
    goToStep(3);
  };

  const mobileCheckAvailability = () => {
    handleMobileStep(0);
  };

  const firstOffer = activeOffer?.ticketCategories?.[0];
  const currency = firstOffer?.price?.currency || "CHF";

  const getTicketLabel = (ticket) => {
    if (!ticket) return "";
    if (t(`tickets.${ticket.audience}`) && ticket.amount === 1) {
      return t(`tickets.${ticket.audience}`);
    }

    return ticket.label.formatted;
  };

  const getOfferTitle = () => {
    if (!activeAvailability) return t("activity.widget.offers");

    const timeText = activeAvailability.isAllDay
      ? t("activity.widget.alldayTicket")
      : activeAvailability.timeslot;
    return `${activeOffer.offerLabel} ${timeText}`;
  };

  const getTicketNavLabel = () => {
    const ticketIds = Object.keys(tickets);
    const ticketList = ticketIds
      .map((id) => tickets[id])
      .filter((ticket) => ticket.amount);

    if (ticketList.length > 0) {
      return ticketList.map(
        (ticket, i) =>
          `${ticket.amount} ${ticket.label.formatted}${
            ticketList.length !== i + 1 ? ", " : ""
          }`
      );
    }

    return t("activity.widget.titleTickets");
  };

  const getTitle = () => {
    switch (isMobile ? lastVisitedStep : currentStep) {
      case 0:
        return t("activity.widget.titleDate");
        break;
      case 1:
        return t("activity.widget.titleTime");
        break;
      case 2:
        return t("activity.widget.titleParticipants");
        break;
      case 3:
        return t("activity.widget.titleBasket");
        break;

      default:
        return t("activity.widget.title");
    }
  };

  const defaultProps = {
    t,
    locale,
    disableCalendarTile,
    currentStep,
    setStep,
    availabilities,
    activeAvailability,
    activeOffer,
    activeOfferTicketCategories,
    tickets,
    bookingDate,
    onSelectDate: onSelectBookingDate,
    handleOfferSelect,
    handleTimeSelect,
    handleOfferConfirm,
    handleTicketsUpdate,
    onTicketsSubmit: handleTicketsSubmit,
    getTotal,
    currency,
    getAvailableDates,
    availableDates,
    setDate,
  };

  if (
    Object.entries(currentMonthAvailableDates).every(
      (item) => item[1].price === null
    )
  ) {
    return (
      <>
        {onClose && (
          <div className={styles.close} onClick={onClose}>
            <StaticImage src="/assets/cancel.svg" width="20" height="20" />
          </div>
        )}
        <NotBookable scrollToForm={scrollToForm} />
      </>
    );
  }

  return (
    <div
      className={styles.BookingWidgetActivity}
      onClick={handleWidgetActivation}
    >
      <div className={styles.scrollAnchor} ref={mobileWidgetScrollRef} />
      <div className={styles.checkoutHeader} id="booking-widget">
        <h2 className={styles.title}>{getTitle()}</h2>
        <div className={styles.widgetNavigation}>
          <button
            className={classnames(styles.widgetNavItem, {
              [styles.active]: currentStep === 0,
              [styles.inactive]: currentStep !== 0 && currentStep !== 3,
              [styles.widgetNavItemCalendar]: 0 === lastVisitedStep,
            })}
            onClick={() => handleMobileStep(0)}
          >
            <span>
              <BsCalendar className={styles.widgetNavItemIcon} />
              {bookingDate?.toLocaleDateString(locale.replace("_", "-"), {
                month: "long",
                day: "numeric",
                year: "numeric",
              }) || t("activity.widget.navDate")}
            </span>
            <BsChevronRight className={styles.chevron} />
          </button>

          {lastVisitedStep === 0 && (
            <Calendar
              {...defaultProps}
              getAvailableDates={getAvailableDates}
              handleSelectBookingDate={onSelectBookingDate}
            />
          )}
          {lastVisitedStep >= 2 && (
            <button
              className={classnames(styles.widgetNavItem, {
                [styles.active]: currentStep === 1,
                [styles.inactive]: currentStep !== 1 && currentStep !== 3,
              })}
              onClick={() => handleMobileStep(1)}
            >
              <div className={styles.widgetNavItemIcon}>
                <StaticImage
                  src={"/assets/activity/full_day_ticket.svg"}
                  height="20"
                  width="20"
                />
              </div>
              <span className={styles.navSelectedTickets}>
                {getOfferTitle()}
              </span>
              <BsChevronRight className={styles.chevron} />
            </button>
          )}
          {lastVisitedStep >= 2 && (
            <button
              className={classnames(styles.widgetNavItem, {
                [styles.active]: currentStep === 2,
                [styles.inactive]: currentStep !== 2 && currentStep !== 3,
              })}
              onClick={() => handleMobileStep(2)}
            >
              <div className={styles.widgetNavItemIcon}>
                <StaticImage
                  src={"/assets/activity/people.svg"}
                  height="22"
                  width="22"
                />
              </div>
              <span className={styles.navSelectedTickets}>
                {getTicketNavLabel()}
              </span>
              <BsChevronRight className={styles.chevron} />
            </button>
          )}
        </div>
        {isMobile && lastVisitedStep !== 0 && lastVisitedStep !== 3 && (
          <Button
            title={getTitle()}
            onClick={() =>
              handleMobileStep(lastVisitedStep === 0 ? 1 : lastVisitedStep)
            }
            customStyle={styles.checkAvailabilityButton}
          />
        )}
      </div>

      {isMobile ? (
        <div>
          <BookingWidgetMobile
            {...defaultProps}
            setActive={setBookingActive}
            isActive={isBookingActive}
            scrollAnchor={mobileWidgetScrollRef}
          />
        </div>
      ) : (
        <WidgetDesktop {...defaultProps} title={getTitle()} />
      )}

      <div
        className={classnames(styles.calendarFooter, {
          [styles.inactive]: currentStep !== 3 && !isBasketReached,
          [styles.basket]: currentStep === 3,
        })}
      >
        {(currentStep === 3 || (isMobile && isBasketReached)) && (
          <div className={styles.totalWrapper}>
            <div className={styles.totalTeaser}>
              <StaticImage
                src={activity.teaser_image?.url}
                alt="teaser"
                width="250"
                height="250"
                layout="responsive"
                className={styles.totalTeaserImage}
              />
            </div>
            <div className={styles.total}>
              {(!!Object.keys(tickets).filter(
                (ticketId) => tickets[ticketId].amount
              ).length ||
                !isMobile) && (
                <div className={styles.totalLabel}>
                  <div className={styles.selectedTickets}>
                    <p className={styles.mobileTitle}>
                      {t("activity.widget.selectedTickets")}
                    </p>
                    {Object.keys(tickets).map((ticketId) =>
                      tickets[ticketId].amount ? (
                        <p className={styles.totalTickets} key={ticketId}>
                          {tickets[ticketId].amount}{" "}
                          <span className={styles.totalTicketsName}>
                            {getTicketLabel(tickets[ticketId])}
                          </span>{" "}
                          <BsX />{" "}
                          {`${tickets[ticketId].price.currency} ${parseFloat(
                            tickets[ticketId].price.amount
                          ).toFixed(2)}`}
                        </p>
                      ) : null
                    )}
                  </div>
                </div>
              )}
              <div className={styles.totalRow}>
                <div className={styles.mobileInfoCard}>
                  <div className={styles.mobileTitle}>
                    {t("activity.widget.basket")}
                  </div>
                  <p>
                    {t("activity.widget.navDate")}:{" "}
                    {bookingDate.toLocaleDateString(locale.replace("_", "-"), {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className={styles.offerInfo}>
                    <span className={styles.label}>
                      {t("activity.widget.selectedOffer")}:
                    </span>{" "}
                    <span className={styles.value}>
                      {activeOffer.offerLabel}
                    </span>
                  </p>
                  {activeAvailability.timeslot && !activeAvailability.isAllDay && (
                    <p>
                      {t("activity.widget.time")}: {activeAvailability.timeslot}
                    </p>
                  )}
                </div>
                <div className={styles.totalPrice}>
                  <p className={styles.totalValueLabel}>
                    {t("activity.widget.total")}
                  </p>
                  <p className={styles.totalValueLabelMobile}>
                    {t("activity.widget.totalPrice")}
                  </p>
                  <p className={styles.totalValue}>
                    {currency} {getTotal()}
                  </p>
                  <p className={styles.totalTaxes}>
                    {t("activity.widget.priceTaxes")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.bottomButtons}>
          {(isActive || !isMobile) && (
            <div
              className={classnames({
                [styles.basketStepPaymentMethods]: currentStep === 3,
              })}
            >
              <PaymentMethods />
            </div>
          )}

          {(currentStep === 3 || (isMobile && isBasketReached)) && (
            <>
              <div className={styles.checkoutButton}>
                <Button
                  title={t("activity.widget.addToCart")}
                  onClick={checkAvailability}
                  customStyle={styles.checkAvailabilityButton}
                />
              </div>

              <div className={styles.payLaterHint}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: t("activity.widget.reserveHint"),
                  }}
                />
                <p
                  className={styles.learnMore}
                  onClick={() => setHintModalActive(true)}
                >
                  {t("activity.widget.learnMore")}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`container-tw w-full my-6 booking:hidden`}>
        <PaymentMethods />
      </div>

      {isLoading && (
        <Loading
          type="spin"
          color="#8b8b8b"
          width="100px"
          height="100px"
          className={styles.loader}
        />
      )}
      <HintModal
        open={isHintModalActive}
        onClose={() => setHintModalActive(false)}
      />
      <ErrorModal open={!!error} onClose={closeError}>
        {error && error.response && error.response.status === 422 ? (
          <span>
            We are sorry, but this booking was not possible because of to less
            seats. Please choose{" "}
            <a href={activity.urls[locale]}>another date</a> or fewer tickets.
          </span>
        ) : (
          <span>
            We are sorry, but something went wrong. Please try again or contact{" "}
            <a href="mailto:support@swissactivities.com">
              support@swissactivities.com
            </a>
            .
          </span>
        )}
      </ErrorModal>
    </div>
  );
};

export default BookingWidget;
