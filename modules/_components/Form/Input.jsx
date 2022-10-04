import classNames from "classnames";
import Base from "./Base";

export const Input = ({ className, title, errors, value, row, rowFull, ...rest }) => {
  const isValid = value && !errors;

  return (
    <Base title={title} isValid={isValid} row={row} rowFull={rowFull}>
      <input
        {...rest}
        value={value}
        className={classNames(
          `form-input text-base w-full rounded-lg border border-solid border-gray-300 text-sm text-black focus:ring-0`,
          { "border-green-600 focus:border-green-600": isValid },
          className
        )}
      />
    </Base>
  );
};
