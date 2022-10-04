import { Calendar as Cal } from "react-calendar";
import { DateService, getSearchParams } from "../../../utils";
import { useEffect, useState } from "react";
import { connectRefinementList } from "react-instantsearch-dom";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import classNames from "classnames";
import { useI18n } from "next-localization";

export default connectRefinementList(({ refine }) => {
  const { t } = useI18n();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [date, setDate] = useState(null);
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const avail = getSearchParams(window.location)?.refinementList
      ?.availability;
    if (avail) {
      setDateString(avail);
      setDate(new Date(avail.split("-")));
    }
  }, []);

  const refineHandler = (dateObject) => {
    const dateString = DateService.formatDate(dateObject);
    refine(dateString);
    setDate(new Date(dateObject));
    setDateString(dateString);
  };

  const resetHandler = () => {
    refine("");
    setDate(null);
    setDateString("");
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      return (
        new Date(date.toDateString()) < new Date(new Date().toDateString())
      );
    }
  };

  return (
    <div className={`rounded-lg bg-blue p-5 font-medium text-white`}>
      {t("filter.pickDate")}
      <div className={`my-4 grid grid-cols-2 gap-4`}>
        {[
          {
            text: t("filter.today"),
            object: today,
          },
          {
            text: t("filter.tomorrow"),
            object: tomorrow,
          },
        ].map((item) => {
          return (
            <button
              onClick={() => refineHandler(item.object)}
              className={classNames(
                "cursor-pointer rounded-lg border-none py-2 text-sm font-medium text-white transition duration-100 ease-in",
                {
                  "bg-white/5 hover:bg-white/10":
                    DateService.formatDate(item.object) !== dateString,
                  "pointer-events-none bg-white/100 text-gray-900":
                    DateService.formatDate(item.object) === dateString,
                }
              )}
              key={item.text}
            >
              {item.text}
            </button>
          );
        })}
      </div>
      <div className={`group`}>
        <div
          className={`relative flex h-10 cursor-pointer items-center overflow-hidden rounded-lg bg-white px-4 text-gray-900`}
        >
          <FaCalendarAlt className={`mr-2`} />
          <span className={`text-span relative top-px`}>
            {dateString || t("activity.selectDate")}
          </span>
          {date && (
            <button
              onClick={resetHandler}
              className={`absolute right-0 top-0 flex h-full w-10 items-center justify-center border-none bg-transparent transition duration-100 ease-in hover:bg-gray-100`}
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div className={`relative`}>
          <div
            className={`lg:pointer-events-none lg:absolute lg:-top-2 lg:z-50 lg:w-[300px] lg:overflow-hidden lg:rounded-lg lg:opacity-0 lg:shadow-lg lg:transition lg:duration-200 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100`}
          >
            <Cal
              value={date}
              prev2Label={null}
              next2Label={null}
              onChange={refineHandler}
              formatShortWeekday={(format, date) =>
                DateService.formatWeekday(date, "d")
              }
              tileDisabled={tileDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
