import React, { useState, useEffect } from "react";
import classnames from "classnames";
import dynamic from "next/dynamic";
import Calendar from "react-calendar";
import { BsX, BsChat } from "react-icons/bs";
import { useI18n } from "next-localization";

import Modal from "../../Modal";
import Button from "../../Button";
import styles from "./styles.module.scss";

const OfferItem = dynamic(() => import("../OfferItem"));
const Ticket = dynamic(() => import("../Ticket"));

const BookingWidgetMobile = props => {
  const { isActive, setActive, disableCalendarTile, currentStep, handleOfferConfirm, onTicketsSubmit, currency, getTotal, scrollAnchor } = props;

  const { t, locale } = useI18n();
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSelectBookingDate = async e => {
    props.onSelectDate(e);
  };

  const handleModalClose = () => {
    props.setActive(false);
    props.setStep(0);
  };

  const handleTimeSelect = time => {
    props.handleTimeSelect(time);
  };

  const handleOfferSubmit = () => {
    handleOfferConfirm()
  };
  const handleTicketsSubmit = () => {
    onTicketsSubmit()
  };

  const isTicketSelected = Object.keys(props.tickets).some(ticketId => props.tickets[ticketId] && props.tickets[ticketId].amount);

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
          modalContainer: styles.modalContainer
        }}
      >
        <div className={styles.modalBody}>
          {isMounted && (
            <Calendar
              view="month"
              next2Label={null}
              prev2Label={null}
              minDetail="month"
              value={props.bookingDate}
              calendarType="ISO 8601"
              onChange={onSelectBookingDate}
              className={styles.reactCalendar}
              tileDisabled={disableCalendarTile}
              locale={locale().replace("_", "-")}
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
          modalContainer: styles.modalContainer
        }}
      >
        <div className={styles.modalBody}>
          <div className={styles.offerItem}>
            {props.availabilities.map(offer => (
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
          modalContainer: styles.modalContainer
        }}
      >
      <div className={styles.bookingBody}>
        {props.activeAvailability && (
          <>
          <h2 className={styles.title}>{t("activity.widget.tickets")}</h2>
          <div className={styles.ticket}>
            {props.activeOfferTicketCategories.map(ticket => (
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
          customStyle={classnames(
            styles.ticketSubmitButton,
            {
            [styles.disabledOfferSubmit]: !isTicketSelected
          })}
        />
      </div>

    </Modal>
    </div>
  );
};

export default BookingWidgetMobile;
