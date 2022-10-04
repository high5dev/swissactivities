import { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import { BsCalendar, BsSearch } from "react-icons/bs";

import Calendar, { VirtualCalendar } from "../SearchBoxMobile/Calendar";
import { Input } from "../Input";
import styles from "./styles.module.scss";

const SearchBoxRegular = (props) => {
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

  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const { t } = useI18n();
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
  return (
    <div className={styles.searchBox}>
      <h1 className={styles.title}>{t("filter.search")}</h1>

      <p className={styles.description}>{t("search.searchDesc")}</p>
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
        placeholder={t("placeholder.search")}
        inputContainerRef={inputContainerRef}
        icon={
          <BsSearch className={styles.icon} />
        }
      />
      <p className={styles.description}> {t("search.dateInputTitle")}</p>
      <div className={classnames(styles.inputRow, styles.calendarRow)}>
        {!isCalendarOpen ? (
          <div className={styles.dateRow} onClick={openCalendar}>
            <BsCalendar className={styles.icon} />
            <span className={styles.date}>
              {currentDate || t("filter.allDates")}
            </span>
          </div>
        ) : (
          <div className={styles.calendarContainer}>
            <Calendar
              setRefinement={dateRefinementHandler}
              defaultRefinement={currentDate}
              close={closeCalendar}
            />
          </div>
        )}
        <VirtualCalendar defaultRefinement={currentDate} />
      </div>
    </div>
  );
};

export default SearchBoxRegular;
