import React from "react";
import classnames from 'classnames';
import styles from './styles.module.scss';

const ContactUsInputField = ({title, name, value, onInput, placeholder, errors}) => {
  return (
    <label className={classnames(styles.inputRow, {[styles.error]: errors[name]})}>
      <span className={styles.inputLabel}>{title}*</span>
      <input
        className={styles.inputField}
        name={name}
        value={value}
        onInput={onInput}
        placeholder={placeholder}
      />
    </label>
  );
};

export default ContactUsInputField;
