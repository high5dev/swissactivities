import React from "react";
import classnames from "classnames";
import Select from "../../Select";

import styles from "./styles.module.scss";
import Base from "./Base";
import classNames from "classnames";

const SelectWithValidation = ({
  value,
  containerClassName,
  title,
  containerRef,
  errors,
  row,
  ...props
}) => {
  const isValid = value && !errors;
  return (
    <Base
      className={classnames([containerClassName, styles.inputBox])}
      classNameCircle={`!right-10`}
      ref={containerRef}
      title={title}
      isValid={isValid}
      row={row}
    >
      <div
        className={classNames(
          `text-base max-w-full rounded-lg border border-solid border-gray-300 text-sm text-black focus:ring-0`,
          { "border-green-600 focus:border-green-600": isValid }
        )}
      >
        <Select value={value} {...props} />
      </div>
    </Base>
  );
};

export default SelectWithValidation;
