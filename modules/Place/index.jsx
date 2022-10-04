/* eslint-disable */
//TODO remove img
import React from 'react';
import styles from './styles.module.scss';

const Place = ({title, isLast = false}) => {
  return (
    <div className={styles.placeContent} style={{ borderBottom: isLast ? 'none' : '1px solid RGBA(0, 0, 0, 0.1)' }}>
      <div className={styles.icon}>
        <img src="/assets/activities/flag.svg" alt="place icon" />
      </div>
      <div className={styles.title}>
        {title}
      </div>
    </div>
  );
};

export default Place;
