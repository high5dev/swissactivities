import { Text } from "../Text";
import { FaCheckCircle } from "react-icons/fa";
import classNames from "classnames";
import { forwardRef } from "react";

const Base = (
  { className, title, isValid, children, classNameCircle, row, rowFull },
  ref
) => {
  return (
    <label
      ref={ref}
      className={classNames(`relative flex`, className, {
        "flex-col lg:flex-row lg:items-center": row,
        "items-center justify-between": rowFull,
        "flex-col": !row && !rowFull,
        "is-valid": isValid,
      })}
    >
      {title && (
        <Text
          as="span"
          size="sm"
          className={classNames(`mb-0.5 mr-auto text-gray-700`, {
            "mr-12 inline-block min-w-[150px]": row,
          })}
        >
          {title}
        </Text>
      )}
      <span
        className={classNames(`relative`, {
          "w-full": !rowFull,
        })}
      >
        {children}
        {isValid && (
          <FaCheckCircle
            className={classNames(
              `absolute right-4 top-1/2 -translate-y-1/2 text-green-600`,
              classNameCircle
            )}
          />
        )}
      </span>
    </label>
  );
};

export default forwardRef(Base);
