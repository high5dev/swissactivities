import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import dynamic from "next/dynamic";
import Calendar from "react-calendar";
import { BsX, BsChat } from "react-icons/bs";
import { useI18n } from "next-localization";

import Modal from "../../Modal";
import Button from "../../Button";
import styles from "./styles.module.scss";
import {DateService} from "../../../utils";

const OfferItem = dynamic(() => import("../OfferItem"));
const Ticket = dynamic(() => import("../Ticket"));

const BookingWidgetMobile = (props) => {
  const {
    isActive,
    setActive,
    disableCalendarTile,
    currentStep,
    handleOfferConfirm,
    onTicketsSubmit,
    currency,
    getTotal,
    scrollAnchor,
    bookingDate,
    getAvailableDates,
    availableDates,
  } = props;

  const { t, locale } = useI18n();
  const [isMounted, setMounted] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(bookingDate).getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date(bookingDate).getFullYear());
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
    getAvailableDates(calendarYear, calendarMonth);
  }, [calendarMonth]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSelectBookingDate = async (e) => {
    props.onSelectDate(e);
  };

  const handleModalClose = () => {
    setCalendarMonth(new Date().getMonth())
    setCalendarYear(new Date().getFullYear())
    props.setDate(new Date())
    props.setActive(false);
    props.setStep(0);
  };

  const handleTimeSelect = (time) => {
    props.handleTimeSelect(time);
  };

  const handleOfferSubmit = () => {
    handleOfferConfirm();
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
    <div>
      <Modal
        targetView={scrollAnchor}
        open={currentStep === 0 && isActive}
        onClose={handleModalClose}
        withTransition
        title={t("activity.widget.calendarTitle")}
        blockBodyScroll
        classes={{
          modal: styles.modalItem,
          modalContainer: styles.modalContainer,
        }}
      >
        <div className={styles.modalBody}>
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
              value={availableDates[convertDate(props.bookingDate)] ? props.bookingDate : null}
              calendarType="ISO 8601"
              onChange={onSelectBookingDate}
              className={`${styles.reactCalendar} ${styles.reactCalendarMobile}`}
              tileDisabled={disableCalendarTile}
              locale={locale() && locale().replace("_", "-")}
              formatShortWeekday={(loc, date) => `${date}`.substring(0, 1)}
              tileContent={({ date, view }) => {
                const price = availableDates[DateService.formatDate(date)]?.price;

                return price && (
                    <div className={styles.tilePrice}>{price}</div>
                )
              }}
            />
          )}
        </div>
      </Modal>
      <Modal
        targetView={scrollAnchor}
        open={currentStep === 1 && isActive}
        onClose={handleModalClose}
        withTransition
        title={t("activity.widget.mobileWidgetOffersTitle")}
        blockBodyScroll
        classes={{
          modal: styles.modalItem,
          modalContainer: styles.modalContainer,
        }}
      >
        <div className={styles.modalBody}>
          <div className={styles.offerItem}>
            {props.availabilities.map((offer) => (
              <OfferItem
                key={offer.offerId}
                isSingleOffer={props.availabilities.length === 1}
                offer={offer}
                active={props.activeOffer.offerId === offer.offerId}
                onOfferSelect={props.handleOfferSelect}
                onTimeSelect={handleTimeSelect}
                selectedTime={props.activeAvailability}
                handleOfferConfirm={handleOfferSubmit}
                t={t}
              />
            ))}
          </div>
        </div>
      </Modal>
      <Modal
        targetView={scrollAnchor}
        open={currentStep === 2 && isActive}
        onClose={handleModalClose}
        blockBodyScroll
        withTransition
        classes={{
          modal: styles.modalItem,
          modalContainer: styles.modalContainer,
        }}
      >
        <div className={styles.bookingBody}>
          {props.activeAvailability && (
            <>
              <h2 className={styles.title}>{t("activity.widget.tickets")}</h2>
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
            </>
          )}
        </div>
        <div className={styles.offerTicketButton}>
          <div className={styles.totalPrice}>
            <p className={styles.totalValueLabel}>
              {t("activity.widget.total")}
            </p>
            <p className={styles.totalValue}>
              {currency} {getTotal()}
            </p>
          </div>
          <Button
            onClick={handleTicketsSubmit}
            title={t("activity.widget.done")}
            disabled={!isTicketSelected}
            subStyle="btn-submit-tickets"
            customStyle={classnames(styles.ticketSubmitButton, {
              [styles.disabledOfferSubmit]: !isTicketSelected,
            })}
          />
        </div>
      </Modal>
    </div>
  );
};

export default BookingWidgetMobile;
