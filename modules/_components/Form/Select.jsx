import classNames from "classnames";
import { useEffect, useState } from "react";
import Base from "./Base";

export const Select = ({
  className,
  options,
  selected,
  onChange,
  title,
  isValid,
  check,
  row,
  rowFull,
  defaultValue = '',
  ...rest
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(selected);
  }, [selected]);

  return (
    <Base
      title={title}
      isValid={check && value !== ""}
      row={row}
      rowFull={rowFull}
      classNameCircle={`!right-10`}
    >
      <select
        {...rest}
        className={classNames(`form-select-sa`, className)}
        value={value}
        onChange={(e) => {
          onChange(e);
          setValue(e.target.value);
        }}
      >
        {options.map((item) => {
          return (
            <option value={item.value} key={`select-${item.value}`}>
              {item.label}
            </option>
          );
        })}
      </select>
    </Base>
  );
};
