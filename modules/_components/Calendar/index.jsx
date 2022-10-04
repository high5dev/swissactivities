import { Calendar as ReactCalendar } from "react-calendar";
import styles from "./styles.module.scss";
import { DateService } from "../../../utils";
import classNames from "classnames";
import { useEffect, useState } from "react";

export const Calendar = ({
  value,
  locale,
  handleSelectBookingDate,
  disableCalendarTile,
  availableDates,
  getAvailableDates,
}) => {
  const [bookingDate, setDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(bookingDate).getMonth()
  );
  const [calendarYear, setCalendarYear] = useState(
    new Date(bookingDate).getFullYear()
  );

  const convertDate = (date) => {
    return new Date(date).toLocaleDateString().split(".").reverse().join("-");
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  useEffect(() => {
    getAvailableDates(calendarYear, calendarMonth);
  }, [calendarMonth]);

  return (
    <ReactCalendar
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
      value={availableDates[convertDate(value)] ? value : null}
      minDetail="month"
      calendarType="ISO 8601"
      onChange={handleSelectBookingDate}
      className={classNames(styles.reactCalendar, "lg:hidden")}
      tileDisabled={disableCalendarTile}
      locale={locale?.replace("_", "-")}
      tileContent={({ date, view }) => {
        const price = availableDates?.[DateService.formatDate(date)]?.price;

        return price && <div className={styles.tilePrice}>{price}</div>;
      }}
    />
  );
};
