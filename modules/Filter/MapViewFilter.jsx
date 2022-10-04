import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { FiSliders } from "react-icons/fi";
import Checkbox from "../../modules/Checkbox";
import Button from "../../modules/Button";
import slice from "lodash/slice";
import orderBy from "lodash/orderBy";

import FilterTreeView from "./FilterTreeView";
import Scrollbar from "react-perfect-scrollbar";

import styles from './styles.module.scss';
import {useI18n} from "next-localization";

const Accordian = ({title, content}) => {
  const [isOpen, setOpen] = useState(true);
  return (
    <div className={styles.searchField}>
      <div className={styles.searchHeader} onClick={() => setOpen(!isOpen)}>
        {<span className={styles.searchTitle}>{title}</span>}
        <span className={styles.collapseIcon}>{isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}</span>
      </div>
      {isOpen && <div className={styles.searchContent}>
        {content}
      </div>}
    </div>
  )
}

const Filter = (props) => {
  const {t} = useI18n();
  const [isAbbr, setAbbr] = useState(true);
  const [showMobileFilter, setMobileFilter] = useState(false);
  const {top, customStyle, id, location, type, locations, types} = props;
  const filterByValues = (values) => {
    props.filterByValues(values);
  }

  const filteredLocations = locations.filter(l => l.numActivities > 0);

  const renderSearchFields = () => {
    return (
      <>
        <div className={styles.searchField} id="mapViewHeader">
          <span className={styles.searchTitle}>{t("filter.filterBy")}:</span>
        </div>
        <div className="mobile-filter-sidebar-header">
          <span>{t("filter.filterBy")}:</span>
          <i onClick={() => setMobileFilter(false)}><AiOutlineClose/></i>
        </div>
        <Accordian
          title={t("filter.location")}
          content={
            <>
              <FilterTreeView data={!isAbbr ? orderBy(filteredLocations, ['numActivities'], ['desc']) : slice(orderBy(filteredLocations, ['numActivities'], ['desc']), 0, 5)} selected={location} />
              {filteredLocations.length > 5 && <div className={styles.abbr} onClick={() => setAbbr(!isAbbr)}>
                {isAbbr ? t("filter.viewAll") : t("filter.hide")}
              </div>}
            </>
          }
        />
        <Accordian
          title={t("filter.pricerange")}
          content={
            <>
              <Checkbox label="0 - 50" onAction={() => filterByValues([0, 50])} />
              <Checkbox label="51 - 100" onAction={() => filterByValues([51, 100])} />
              <Checkbox label="101 - 250" onAction={() => filterByValues([101, 250])} />
              <Checkbox label="251 - 500" onAction={() => filterByValues([251, 500])} />
              <Checkbox label={`${t("activity.from")} 501`} onAction={() => filterByValues([501, 1250])} />
            </>
          }
        />
        {types && <Accordian
          title={t("filter.activities")}
          content={
            <FilterTreeView data={types} selected={type} isReverse={true} />
          }
        />}
        <Accordian
          title={t("filter.suitableFor.title")}
          content={
            <>
              <Checkbox label={t("filter.suitableFor.crowds")} onAction={() => filterByValues([0, 50])} />
              <Checkbox label={t("filter.suitableFor.safety")} onAction={() => filterByValues([51, 100])} />
              <Checkbox label={t("filter.suitableFor.excellence")} onAction={() => filterByValues([101, 250])} />
              <Checkbox label={t("filter.suitableFor.forKid")} onAction={() => filterByValues([251, 500])} />
              <Checkbox label={t("filter.suitableFor.virtual")} onAction={() => filterByValues([501, 1250])} />
            </>
          }
        />
      </>
    );
  };

  return (
    <>
      <div className={styles.filterContainer} style={{ ...customStyle, transform: showMobileFilter ? 'translateX(0%)' : '' }} id={id}>
        <Scrollbar>
          {renderSearchFields()}  
        </Scrollbar>
      </div>
      <Button
        title={t("filter.filter")}
        icon={<FiSliders />}
        onClick={() => setMobileFilter(true)}
        customStyle="mobile-filter-button"
        id="mapFilterButton"
      />
    </>
  );
};

export default Filter;
