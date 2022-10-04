import React from 'react';
import styles from './styles.module.scss';

const Checkbox = ({label, onAction, value, currentRefinement = []}) => {
  return (
    <div className={styles.checkBoxContainer}>
      <input className={styles.checkBox} type="checkbox" defaultChecked={value || currentRefinement.includes(label)} onClick={onAction} />
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default Checkbox;
