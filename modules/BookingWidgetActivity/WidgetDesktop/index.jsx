import React, { useState, useEffect, useRef, useCallback } from "react";
import classnames from "classnames";
import dynamic from "next/dynamic";
import Calendar from "react-calendar";
import { BsChat } from "react-icons/bs";

import styles from "./styles.module.scss";

import Button from "../../Button";
import {DateService} from "../../../utils";
const OfferItem = dynamic(() => import("../OfferItem"));
const Ticket = dynamic(() => import("../Ticket"));

const WidgetDesktop = (props) => {
  const {
    t,
    isActive,
    locale,
    disableCalendarTile,
    onSelectDate,
    currentStep,
    onTicketsSubmit,
    title,
    currency,
    getTotal,
    bookingDate,
    getAvailableDates,
    availableDates,
  } = props;

  const [isMounted, setMounted] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(bookingDate.getMonth());
  const [calendarYear, setCalendarYear] = useState(bookingDate.getFullYear());
  const calendarRef = useRef(null);
  const calendarButtons =
    calendarRef.current &&
    calendarRef.current.querySelectorAll(".react-calendar__navigation__arrow");

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
      return;
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
      return;
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  useEffect(() => {
    setMounted(true);
  });

  useEffect(() => {
    getAvailableDates(calendarYear, calendarMonth);
  }, [calendarMonth]);

  const handleSelectBookingDate = async (e) => {
    onSelectDate(e);
  };

  const handleTicketsSubmit = () => {
    onTicketsSubmit();
  };

  const isTicketSelected = Object.keys(props.tickets).some(
    (ticketId) => props.tickets[ticketId] && props.tickets[ticketId].amount
  );

  const convertDate = (date) => {
    return new Date(date).toLocaleDateString().split(".").reverse().join("-");
  };

  return (
    <div
      className={classnames(styles.widgetBody, {
        [styles.basket]: currentStep === 3,
      })}
    >
      {currentStep < 3 && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.bookingBody}>
        {currentStep === 0 && (
          <div ref={calendarRef}>
            {isMounted && (
              <Calendar
                view="month"
                next2Label={null}
                nextLabel={
                  <div className={styles.navBtns} onClick={handleNextMonth}>
                    {">"}
                  </div>
                }
                prev2Label={null}
                prevLabel={
                  <div className={styles.navBtns} onClick={handlePrevMonth}>
                    {"<"}
                  </div>
                }
                minDetail="month"
                value={props.bookingDate}
                calendarType="ISO 8601"
                onChange={handleSelectBookingDate}
                className={styles.reactCalendar}
                tileDisabled={disableCalendarTile}
                locale={locale.replace("_", "-")}
                tileContent={({date, view}) => {
                  const price = availableDates[DateService.formatDate(date)]?.price;

                  return price && (
                      <div className={styles.tilePrice}>{price}</div>
                  )
                }}
              />
            )}
          </div>
        )}
        {currentStep === 1 && (
          <>
            <div className={styles.offerItem}>
              {props.availabilities.map((offer) => (
                <OfferItem
                  key={offer.offerId}
                  isSingleOffer={props.availabilities.length === 1}
                  offer={offer}
                  active={props.activeOffer.offerId === offer.offerId}
                  onOfferSelect={props.handleOfferSelect}
                  onTimeSelect={props.handleTimeSelect}
                  selectedTime={props.activeAvailability}
                  handleOfferConfirm={props.handleOfferConfirm}
                  t={t}
                />
              ))}
            </div>
          </>
        )}

        {currentStep === 2 && (
          <div className={styles.ticket}>
            {props.activeOfferTicketCategories.map((ticket) => (
              <Ticket
                ticket={ticket}
                key={ticket.ticketCategoryId}
                onUpdate={props.handleTicketsUpdate}
                value={
                  props.tickets[ticket.ticketCategoryId] &&
                  props.tickets[ticket.ticketCategoryId].amount
                }
              />
            ))}
          </div>
        )}
      </div>
      {currentStep === 2 && (
        <div className={styles.bottomContainer}>
          <div className={styles.totalPrice}>
            <p className={styles.totalValueLabel}>
              {t("activity.widget.total")}
            </p>
            <p className={styles.totalValue}>
              {currency} {getTotal()}
            </p>
          </div>
          <div className={styles.submitTickets}>
            <Button
              onClick={handleTicketsSubmit}
              title={t("activity.widget.done")}
              disabled={!isTicketSelected}
              subStyle="btn-submit-tickets"
              customStyle={classnames(styles.submitButton, {
                [styles.disabledSubmit]: !isTicketSelected,
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetDesktop;
