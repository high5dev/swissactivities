import React, { useState, useEffect } from "react";
import classnames from "classnames";
import dynamic from "next/dynamic";
import Calendar from "react-calendar";
import { BsChat } from "react-icons/bs";

import styles from "./styles.module.scss";

import Button from "../../Button";
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
    getTotal
  } = props;

  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectBookingDate = async (e) => {
    onSelectDate(e);
  };

  const handleTicketsSubmit = () => {
    onTicketsSubmit();
  };

  const isTicketSelected = Object.keys(props.tickets).some(ticketId => props.tickets[ticketId] && props.tickets[ticketId].amount);

  return (
    <div className={classnames(styles.widgetBody, {[styles.basket]: currentStep === 3})}>
     {currentStep < 3 && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.bookingBody}>
        {currentStep === 0 && (
          <div>
            {isMounted && (
              <Calendar
                view="month"
                next2Label={null}
                prev2Label={null}
                minDetail="month"
                value={props.bookingDate}
                calendarType="ISO 8601"
                onChange={handleSelectBookingDate}
                className={styles.reactCalendar}
                tileDisabled={disableCalendarTile}
                locale={locale.replace("_", "-")}
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
            customStyle={classnames(
              styles.submitButton,
              {
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
