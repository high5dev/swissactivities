import React, { useEffect, useRef } from 'react';

import StaticImage from '../Image';
import styles from './styles.module.scss';
import Button from '../Button';
import CustomInput from '../Input/CustomInput';
import { useI18n } from 'next-localization';

const GlobalSearch = (props) => {
  const { t } = useI18n();
  const inputRef = useRef(null);

  useEffect(() => {
    const { current } = inputRef;

    if (!current) {
      return;
    }
    const handleNativeFocus = (e) => {
      e.preventDefault();
      current.blur();
      window.dispatchEvent(new Event('triggerSearchArea'));
    }
    current.addEventListener('focus', handleNativeFocus, true);

    return () => {
      current.removeEventListener('focus', handleNativeFocus, true);
    };
  }, [inputRef]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.globalSearch}>
        <div className={`search-item ${styles.searchContainerWrapper}`}>
          <CustomInput
            {...props}
            type="search"
            inputRef={inputRef}
            className={styles.searchInputElement}
            placeholder={`${t('search.searchActivity')}`}
          />
          <div className={`search-item left-radius ${styles.searchInputContainer}`}></div>
        </div>
        <div className="search-button">
          <Button
            customStyle="global-search-icon"
            icon={
              <StaticImage
                alt="search"
                height={24}
                layout="fixed"
                src="/assets/search/search.svg"
                width={22}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
