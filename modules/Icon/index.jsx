import React from 'react';
import { IconContext } from 'react-icons';
import styles from './styles.module.scss';

const Icon = ({ color, className, icon }) => {
  return (
    <IconContext.Provider value={{ color, className }}>
      <div className={styles.icon}>
        {icon}
      </div>
    </IconContext.Provider>
  )
};

export default Icon;
