import React from "react";
import classnames from "classnames";
import { FaCheckCircle } from "react-icons/fa";
import Select from "../Select";

import styles from "./styles.module.scss";

const SelectWithValidation = ({
  value,
  containerClassName,
  title,
  containerRef,
  errors,
  ...props
}) => {
  const isValid = value && !errors;
  return (
    <label className={classnames([containerClassName, styles.inputBox])} ref={containerRef}>
      <p className={styles.title}>
        {title}{props.required && "*"}
      </p>
      <div
        className={classnames([
          styles.inputContainer,
          {
            [styles.inputContainerValid]: isValid,
            [styles.inputContainerError]: errors,
          }
        ])}
      >
        <Select
        value={value}
        {...props}
        />

        {isValid && (
          <FaCheckCircle className={classnames(styles.validationIcon, styles.selectValidationIcon)} color="#219653" />
        )}
      </div>
    </label>
  );
};

export default SelectWithValidation;
