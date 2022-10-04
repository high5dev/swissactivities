import React, { useEffect, useState } from "react";
import { connectSearchBox } from "react-instantsearch-core";
import { useI18n } from "next-localization";
import { BsX } from "react-icons/bs";
import Calendar from "react-calendar";
import { DateService } from "../../../../utils";
import styles from "./styles.module.scss";

const MobileCalendar = ({
  refine,
  setRefinement,
  currentRefinement,
  defaultRefinement,
  close
}) => {
  const { t } = useI18n();
  const [{ allDates, today, tomorrow }, setButtonState] = useState(
    DateService.initialButtonsState(currentRefinement)
  );
  const [calendar, setCalendar] = useState(false);
  const [date, setDate] = useState(null);

  const calendarHandler = date => {
    const dateCurrent = new Date().toDateString();
    const pickedDate = date.toDateString();
    switch (true) {
      case pickedDate === dateCurrent:
        setButtonState({ ...DateService.initialState, today: true });
        break;
      case pickedDate === DateService.tomorrowDate.toDateString():
        setButtonState({ ...DateService.initialState, tomorrow: true });
        break;
      default:
        setButtonState(DateService.initialState);
    }
    setDate(date);
    refineHandler(date);
    setCalendar(false);
  };

  const refineHandler = date => {
    const refinedDate = date ? DateService.formatDate(date) : date;
    refine(refinedDate);
    setRefinement(refinedDate);
  };

  useEffect(() => {
    if (currentRefinement !== defaultRefinement) {
      refine("");
      setButtonState(DateService.initialButtonsState());
    }
  }, [defaultRefinement]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
      <button
      onClick={close}
      className={styles.closeIcon}>
        <BsX color="#3B3B3B" />
      </button>
        <h2>{t("filter.pickDate")}</h2>
      </div>
      <div>
        <Calendar
          value={date}
          onChange={calendarHandler}
          prev2Label={null}
          next2Label={null}
          className={styles.calendar}
          formatShortWeekday={(format, date) =>
            DateService.formatWeekday(date, "d")
          }
        />
      </div>
    </div>
  );
};

export default connectSearchBox(MobileCalendar);
// Algolia needs virtual components to keep refinements on dismount
export const VirtualCalendar = connectSearchBox(() => null);
