import React, { useMemo } from "react";
import { useI18n } from "next-localization";

import styles from "./styles.module.scss";
import Button from "../../Button";

const Ticket = ({ ticket, onUpdate, value = 0 }) => {
  const { t } = useI18n();
  const { occupancy, maxOccupancy, label } = ticket;

  const addTicket = () => {
    const isMinAmount = ticket.occupancyType !== 'fixed' && value < (occupancy - 1);
    const amount = isMinAmount ? occupancy : value + 1;

    if (maxOccupancy) {
      return handleTicketsUpdate(Math.min(amount, maxOccupancy));
    }
    handleTicketsUpdate(amount);
  };

  const removeTicket = () => {
    const isMinAmount = ticket.occupancyType !== 'fixed' && value === occupancy;
    const amount = isMinAmount ? 0 : value - 1;
    handleTicketsUpdate(Math.max(amount, 0));
  };

  const handleTicketsUpdate = amount => {
    const ticketObject = {
      ticket,
      amount
    };
    onUpdate(ticketObject);
  };

  const ticketLabel = useMemo(() => {
    const result = [label.discount || label.audience || label.formatted];

    if (occupancy > 1) {
      if (!maxOccupancy) {
        result.push(t('booking.ticketOccupancy', { occupancy }));
      } else {
        result.push(t('booking.ticketMaxOccupancy', { occupancy }));
      }
    }
    return result.join(' ');
  }, [occupancy, maxOccupancy, t, label]);

  return (
    <div className={styles.ticket}>
      <div className={styles.ticketDescription}>
        <span className={styles.ticketDescriptionLeft}>
          <div className={styles.ticketLabel}>
            <span>{ticketLabel}</span>
            {label.ageRestriction && (
              <p className={styles.additionalInfo}>
                <span>{label.ageRestriction}</span>
              </p>
            )}
          </div>
        </span>
        <span className={styles.price}>{ticket.price && `${ticket.price.currency} ${parseFloat(ticket.price.amount).toFixed(2)}`}</span>
      </div>
      <div className={styles.ticketAmountBox}>
        <Button
          title="-"
          onClick={removeTicket}
          customStyle={styles.amountButton}
          disabled={!value}
        />
        <span className={styles.ticketAmount}>{value || 0}</span>
        <Button
          title="+"
          onClick={addTicket}
          customStyle={styles.amountButton}
        />
      </div>
    </div>
  );
};

export default Ticket;
