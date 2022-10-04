import React from "react";
import classnames from "classnames";
import { BsPlus, BsDash } from "react-icons/bs";
import Select from "react-select";

import Button from "../../Button";
import styles from "./styles.module.scss";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#ff385c" : "white",
    color: state.isSelected ? "white" : "#3B3B3B",
    padding: "9px 11px",
    borderBottom: "1px solid #ECECEC",
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: "#3b3b3b",
    boxShadow: "none",
    "&:focus, &:hover": {
      borderColor: "#3b3b3b",
      boxShadow: "0 0 0 1px #9f9f9f",
    },
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
};

const OfferItem = ({
  offer,
  active,
  onOfferSelect,
  onTimeSelect,
  isSingleOffer,
  selectedTime,
  handleOfferConfirm = () => {},
  t,
}) => {
  const { description, offerLabel: title } = offer;
  const isAllDay = offer.availabilities[0]?.isAllDay;

  const handleOfferSelect = (e) => {
    if (active && !isAllDay) return;
    e.stopPropagation();
    e.preventDefault();

    onOfferSelect(offer);
  };

  const handleTimeSelect = (e) => {
    onTimeSelect(e.availability);
  };

  const handleMobileTimeSelect = (e) => {
    const timeItem = offer.availabilities?.find(
      (availabilty) => availabilty.timeslot === e.target.value
    );
    onTimeSelect(timeItem || null);
  };

  const getMinPrice = () => {
    const discountHalfFare = "sbb_half_fare"

    const paidTickets = offer.ticketCategories.filter((ticket) => ticket.price?.amount && Number(ticket.price.amount));
    if(!paidTickets.length) return 0;

    const adultTickets = paidTickets.filter(ticket => ticket.audience === "adults");

    const halfFare = adultTickets.filter(ticket => ticket.discountType === discountHalfFare).map(ticket => Number(ticket.price.amount));

    if(halfFare.length) {
      return Math.min(...halfFare)
    }


    if(adultTickets.length) {
      const adults = adultTickets.map(ticket => Number(ticket.price.amount));

      return Math.min(...adults)
    }

    const single = paidTickets.filter(ticket => !ticket.occupancy || ticket.occupancy === 1).map(ticket => Number(ticket.price.amount));

    if(single.length) {
      return Math.min(...single)
    }

    return Math.min(...paidTickets.map(ticket => Number(ticket.price.amount)))
  }

  const currency =
    (offer.ticketCategories[0] && offer.ticketCategories[0].price?.currency) ||
    "CHF";

  const minPrice = getMinPrice();

  return (
    <div
      className={classnames(styles.offerItem, { [styles.active]: active })}
      onClick={handleOfferSelect}
    >
      <label className={styles.checkBoxLabel}>
        <div className={styles.checkBoxLeft}>
          <div className={styles.checkBoxLabelContent}>
            <span className={styles.checkBoxTitle}>{title}</span>
            {active && (
              <span className={styles.checkBoxDescription}>{description}</span>
            )}
          </div>
        </div>
        <div className={styles.priceBox}>
          <span className={styles.offerPrice}>
            <p>{t("activity.widget.from")}</p>
            <p className={styles.offerPriceValue}>{!!minPrice && currency} {minPrice ? minPrice.toFixed(2) : t("activity.widget.priceFree")}</p>
          </span>
          <button
            className={classnames(styles.openButton, {
              [styles.active]: active,
            })}
          >
            {active ? <BsDash /> : <BsPlus />}
          </button>
        </div>
      </label>
      {(active || isSingleOffer) && !isAllDay && (
        <div className={styles.timeContainer}>
          <p className={styles.timeTitle}>
            {t("activity.widget.offerTimeSelect")}
          </p>
          <Select
            onChange={handleTimeSelect}
            className={styles.timeSelect}
            isSearchable={false}
            value={{
              value: selectedTime?.timeslot,
              label: selectedTime?.timeslot,
            }}
            options={offer.availabilities.map((availability) => ({
              value: availability.timeslot,
              label: availability.timeslot,
              availability,
            }))}
            styles={customStyles}
          />
          <select
            value={selectedTime?.timeslot}
            className={classnames(styles.timeSelect, styles.mobile)}
            onChange={handleMobileTimeSelect}
          >
            {offer.availabilities.map((availability) => (
              <option key={availability.availabilityId}>
                {availability.timeslot}
              </option>
            ))}
          </select>
        </div>
      )}
      {active && (
        <div className={styles.offerButtonWrapper}>
        <Button
        title={t("activity.widget.offerSelect")}
        onClick={handleOfferConfirm}
        subStyle="btn-submit-offers"
        customStyle={classnames(
          { [styles.disabledOfferSubmit]: !selectedTime },
        )}
        disabled={!selectedTime}
        />
        </div>
      )}
    </div>
  );
};

export default OfferItem;
