import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { connectSearchBox } from 'react-instantsearch-core';

import SearchBoxMobile from './SearchBoxMobile';
import SearchBoxRegular from './SearchBoxRegular';

const SearchBox = (props) => {
  const {
    refine,
    popover,
    isMobile,
    currentDate,
    onFilterChange,
    categoryFilters,
    onCategorySearch,
    dateRefinementHandler,
  } = props;

  const router = useRouter();
  const inputContainerRef = useRef(null);
  const [value, setValue] = useState(null);
  const [refineValue, setRefineValue] = useState('');
  const [prevRefineValue, setPrevRefineValue] = useState('');

  useEffect(() => {
    if (router.query.searchText && value === null) {
      refine(router.query.searchText);
    }
  }, [router, value, refine]);

  useEffect(() => {
    onCategorySearch(value);
  }, [onCategorySearch, value]);

  useEffect(() => {
    if (refineValue !== prevRefineValue) {
      setPrevRefineValue(refineValue);
      const f = categoryFilters?.[0] || {};

      if (f?.type !== 'searchText' || f?.title !== refineValue) {
        onFilterChange([{
          type: 'searchText',
          title: refineValue,
        }]);
        setValue('');
      }
      refine(refineValue);
    }
  }, [
    setValue,
    refineValue,
    onFilterChange,
    prevRefineValue,
    categoryFilters,
    setPrevRefineValue,
  ]);

  const handleInputChange = useCallback((e) => {
    setValue(e.target.value);
  }, [setValue]);

  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 13 && value) {
      setRefineValue(value);

      if (inputContainerRef?.current) {
        inputContainerRef.current.blur();
      }
    }
  }, [value, setRefineValue, inputContainerRef]);

  const Search = isMobile ? SearchBoxMobile : SearchBoxRegular;

  return (
    <Search
      popover={popover}
      value={value || ''}
      filters={categoryFilters}
      currentDate={currentDate}
      onKeyDown={handleKeyDown}
      onChange={handleInputChange}
      onFilterChange={onFilterChange}
      inputContainerRef={inputContainerRef}
      dateRefinementHandler={dateRefinementHandler}
    />
  );
};

export default connectSearchBox(SearchBox);
