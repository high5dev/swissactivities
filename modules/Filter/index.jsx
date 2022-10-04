import React, { useCallback, useState } from "react";
import cx from 'classnames';
import {
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";

import { FiSliders } from "react-icons/fi";
import slice from "lodash/slice";
import FilterTreeView from "./FilterTreeView";

import Button from "../../modules/Button";
import styles from "./styles.module.scss";
import { useI18n } from "next-localization";

const NUM_LOCATIONS = 3;

const Accordion = ({ title, content, disabled, open = true }) => {
  const [isOpen, setOpen] = useState(open);

  const handleClick = useCallback(() => {
    if (!disabled) {
      setOpen(!isOpen);
    }
  }, [setOpen, isOpen, disabled]);

  const headerClasses = cx(
    styles.searchHeader,
    disabled && styles.disabled,
  );

  return (
    <div className={styles.searchField}>
      <div className={headerClasses} onClick={handleClick}>
        <span className={styles.searchTitle}>
          {title}
        </span>
        <span className={styles.collapseIcon}>
          {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </span>
      </div>
      {isOpen && <div className={styles.searchContent}>{content}</div>}
    </div>
  );
};

const Filter = (props) => {
  const {
    id,
    type,
    types,
    goToPage,
    location,
    locations,
    customStyle,
    showMobileButton,
  } = props;

  const { t } = useI18n();
  const [isAbbr, setAbbr] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const filteredLocations = isAbbr ? slice(locations, 0, NUM_LOCATIONS) : locations;
  const filterClasses = cx(styles.filterContainer, showFilters && styles.visible);
  const filterButtonClasses = cx(
    'mobile-filter-button',
    styles.filterButton,
    (showFilters || !showMobileButton) && styles.hidden,
  );
  const handleCloseFiltersClick = useCallback(() => {
    setShowFilters(false);
  }, [setShowFilters])

  const handleShowFiltersClick = useCallback(() => {
    setShowFilters(true);
  }, [setShowFilters]);

  return (
    <>
      <div id={id} style={customStyle} className={filterClasses}>
          <Accordion
            title={t("filter.location")}
            content={
              <>
                <FilterTreeView
                  selected={location}
                  goToPage={goToPage}
                  data={filteredLocations}
                />
                {locations.length > NUM_LOCATIONS && (
                  <div className={styles.abbr} onClick={() => setAbbr(!isAbbr)}>
                    {isAbbr ? t("filter.viewAll") : t("filter.hide")}
                  </div>
                )}
              </>
            }
          />
          {types && (
            <Accordion
              disabled
              title={t("filter.activities")}
              content={
                <FilterTreeView
                  data={types}
                  selected={type}
                  isReverse={true}
                  goToPage={goToPage}
                />
              }
            />
          )}
        <Button
          onClick={handleCloseFiltersClick}
          customStyle={styles.applyBtn}
          title={t("filter.apply")}
        />
      </div>

      <Button
        icon={<FiSliders />}
        title={t("filter.filter")}
        onClick={handleShowFiltersClick}
        customStyle={filterButtonClasses}
      />
    </>
  );
};

export default Filter;
