import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "next-localization";
import { BsCalendar, BsPerson, BsSearch } from "react-icons/bs";
import Calendar, { VirtualCalendar } from "./Calendar";
import { Input } from "../Input";
import Modal from "../../Modal";
import styles from "./styles.module.scss";

const SearchBoxMobile = (props) => {
  const {
    value,
    popover,
    filters,
    onChange,
    onKeyDown,
    currentDate,
    onFilterChange,
    inputContainerRef,
    dateRefinementHandler,
  } = props;

  const { t } = useI18n();
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const inputFieldRef = useRef(null);

  useEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [inputFieldRef]);

  const openCalendar = () => {
    setCalendarOpen(true);
  };
  const closeCalendar = () => {
    setCalendarOpen(false);
  };

  const date = currentDate ? new Date(currentDate) : new Date();
  const dateValue = date.toLocaleDateString('en-CH', {
    year: 'numeric',
    month: 'short',
    day: "numeric",
  });
  return (
    <div className={styles.searchBox}>
      <div className={styles.searchBoxContent}>
        <Input
          value={value}
          popover={popover}
          filters={filters}
          onKeyDown={onKeyDown}
          inputHandler={onChange}
          inputFieldRef={inputFieldRef}
          onFilterChange={onFilterChange}
          className={styles.searchWrapper}
          inputClassName={styles.searchInput}
          inputContainerRef={inputContainerRef}
          placeholder={t("placeholder.search")}
          icon={
            <BsSearch className={styles.icon} />
          }
        />
        <div className={styles.options}>
          <div className={styles.optionsSection} onClick={openCalendar}>
            <BsCalendar className={styles.icon} />
            <span className={styles.optionsContent}>{dateValue}</span>
          </div>
          <div className={styles.optionsSection}>
            <BsPerson className={styles.icon} />
            <span className={styles.optionsContent}>2 adults</span>
          </div>
        </div>
      </div>

      <Modal
        open={isCalendarOpen}
        onClose={closeCalendar}
        classes={{
          modal: styles.calendarModal,
          modalContainer: styles.calendarModalContainer,
        }}
      >
        <div className={styles.calendarContainer}>
          <Calendar
            close={closeCalendar}
            defaultRefinement={currentDate}
            setRefinement={dateRefinementHandler}
          />
          <VirtualCalendar defaultRefinement={currentDate} />
        </div>
      </Modal>
    </div>
  );
};

export default SearchBoxMobile;
