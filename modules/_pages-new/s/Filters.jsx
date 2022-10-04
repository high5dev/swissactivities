import Calendar from "./Calendar";
import {
  FaChild,
  FaFilter,
  FaGlobe,
  FaGripHorizontal,
  FaList,
  FaMapPin,
  FaStar,
  FaTag,
  FaTimes,
  FaWind,
} from "react-icons/fa";
import {
  connectStateResults,
  connectCurrentRefinements,
} from "react-instantsearch-dom";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useI18n } from "next-localization";
import Refinements from "./Refinements";
import orderBy from "lodash/orderBy";
import { HierarchicalRefinements } from "./HierarchicalRefinements";
import { disableBodyLock, enableBodyLock } from "../../../utils/bodylock";
import { useSearchContext } from "../../../hooks/useSearchContext";

const Filters = ({ isMap }) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [calendarKey, setCalendarKey] = useState(1);
  const { isMapListOpen, setIsMapListOpen } = useSearchContext();

  useEffect(() => {
    if (isOpen) {
      setScroll(window.pageYOffset);
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      enableBodyLock();
      document.body.classList.add("is-filter-open");
    } else {
      if (!document.body.classList.contains("is-map-search")) {
        disableBodyLock();
        window.scrollTo(0, scroll);
        document.body.classList.remove("is-filter-open");
      }
    }
  }, [isOpen]);

  const onClickFilters = () => {
    setIsOpen(!isOpen);
  };

  const onClickMap = () => {
    setIsMapListOpen(!isMapListOpen);
  };

  const ResultsButton = connectStateResults(({ searchResults }) => {
    return (
      <button
        key="results"
        onClick={() => {
          setIsOpen(false);
        }}
        className={`w-full rounded-lg border-none bg-primary p-3 text-center text-base font-medium text-white`}
      >
        {searchResults?.nbHits ? searchResults?.nbHits : 0} Resultate anzeigen
      </button>
    );
  });

  const ClearRefinements = connectCurrentRefinements(({ items, refine }) => {
    return (
      items.length >= 1 && (
        <button
          className={`flex h-full items-center justify-center justify-self-end border-none bg-transparent px-4 text-base text-primary`}
          onClick={() => {
            refine(items);
            setCalendarKey((prevState) => prevState + 1);
          }}
        >
          {t("filter.clear")}
        </button>
      )
    );
  });

  return [
    <div
      key="filter-map-button"
      className={classNames(
        `fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 cursor-pointer items-center rounded-full text-sm font-medium text-white shadow-xl sm:bottom-12 sm:text-base`,
        {
          "lg:hidden": !isMap,
        }
      )}
    >
      <div
        role="button"
        className={`flex items-center rounded-full bg-black px-6 py-3 lg:rounded-r-none`}
        onClick={onClickFilters}
      >
        <span className={`mr-3 flex`}>
          {isOpen ? <FaTimes /> : <FaFilter />}
        </span>
        {t("filter.filter")}
      </div>
      <div
        style={{
          borderTop: "none",
          borderBottom: "none",
          borderRight: "none",
        }}
        role="button"
        className={`-ml-px hidden items-center rounded-r-full border-l border-solid border-gray-600 bg-black px-6 py-3 lg:flex`}
        onClick={onClickMap}
      >
        {t("search.list")}
        <span className={`ml-3 flex`}>
          {isMapListOpen ? <FaTimes /> : <FaList />}
        </span>
      </div>
    </div>,
    <div
      key="filters"
      className={classNames({
        hidden: isMap && !isOpen,
        block: (isMap && isOpen) || !isMap,
        "z-[1000]": isMap,
      })}
    >
      <div
        className={classNames(
          "fixed top-0 left-0 z-[10000] grid h-[var(--vh)] w-full grid-rows-[auto,1fr,auto] bg-white",
          {
            block: isOpen,
            hidden: !isOpen,
            "lg:static lg:block lg:h-auto lg:w-auto lg:p-0": !isMap,
            "lg:left-4 lg:top-[calc(var(--h-header)+16px+80px)] lg:flex lg:h-[calc(var(--vh)-var(--h-header)-32px-80px)] lg:max-w-[375px] lg:flex-col lg:overflow-y-auto lg:rounded-lg lg:bg-white lg:p-5":
              isMap,
          }
        )}
      >
        <div className={`grid grid-cols-[1fr,2fr,1fr] items-center lg:hidden`}>
          <div
            role="button"
            onClick={() => {
              setIsOpen(false);
            }}
            className={`flex max-w-max cursor-pointer items-center border-none bg-transparent p-4 text-xl text-black`}
          >
            <FaTimes />
          </div>
          <span className={`justify-self-center text-lg font-medium`}>
            {t("filter.filter")}
          </span>
          <ClearRefinements />
        </div>
        <div
          className={`h-full space-y-8 overflow-y-scroll px-4 pb-8 lg:h-auto lg:overflow-y-visible lg:p-0 lg:pb-0`}
        >
          <Calendar key={calendarKey} attribute={`availability`} />
          {[
            {
              attributes: ["locationH.lvl0", "locationH.lvl1"],
              title: t("filter.location"),
              icon: <FaMapPin />,
              type: "hierarchical",
            },
            {
              attribute: "priceRange",
              title: t("filter.pricerange"),
              icon: <FaTag />,
            },
            {
              attribute: "age",
              title: t("filter.age"),
              icon: <FaChild />,
            },
            {
              attribute: "topics",
              title: t("filter.topic"),
              icon: <FaGripHorizontal />,
            },
            {
              attribute: "season",
              title: t("filter.season"),
              icon: <FaWind />,
            },
            {
              attribute: "lang",
              title: t("filter.lang"),
              icon: <FaGlobe />,
            },
            {
              attribute: "ratingRounded",
              title: t("activity.rating"),
              icon: <FaStar />,
              type: "rating",
            },
          ].map((item) => {
            return item.type === "hierarchical" ? (
              <HierarchicalRefinements
                limit={100}
                key={item.attribute}
                attributes={item.attributes}
                title={item.title}
                icon={item.icon}
                transformItems={(items) => orderBy(items, "label", "asc")}
              />
            ) : (
              <Refinements
                limit={100}
                key={item.attribute}
                attribute={item.attribute}
                title={item.title}
                icon={item.icon}
                transformItems={(items) => orderBy(items, "label", "asc")}
              />
            );
          })}
        </div>
        <div className={`p-4 lg:hidden`}>
          <ResultsButton />
        </div>
      </div>
    </div>,
  ];
};

export default Filters;
