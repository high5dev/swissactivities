import React, { useState } from "react";
import classnames from "classnames";
import Tooltip from "rc-tooltip";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./styles.module.scss";

const Input = ({
  value,
  onInput,
  className,
  placeholder,
  name,
  type="text",
  title,
  titleIcon,
  tooltipText,
  tooltipId,
  errors,
  required
}) => {
  const isValid = value && !errors;
  return (
    <label className={classnames([className, styles.inputBox])}>
      <p className={styles.title}>
        {title}
        {titleIcon && (
          <Tooltip
            id={tooltipId}
            trigger={["click"]}
            prefixCls="rc-dark rc-tooltip"
            overlay={<span>{tooltipText}</span>}
            align={{ offset: [5, -3] }}
            overlayInnerStyle={{ background: "#000", color: "#fff" }}
          >
            <span aria-describedby={tooltipId}> {titleIcon} </span>
          </Tooltip>
        )}
      </p>
      <div
        className={classnames([
          styles.inputContainer,
          { [styles.inputContainerValid]: isValid }
        ])}
      >
        <input
          className={styles.input}
          type={type}
          placeholder={placeholder}
          value={value}
          onInput={onInput}
          name={name}
          required={required}
        />
        {isValid && (
          <FaCheckCircle className={styles.validationIcon} color="#219653" />
        )}
      </div>
    </label>
  );
};

export default Input;
