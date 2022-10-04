import classNames from "classnames";

export const Textarea = ({ className, ...rest }) => {
  return (
    <textarea
      {...rest}
      className={classNames(
        `form-textarea rounded-lg border border-solid border-gray-300 text-sm text-black focus:ring-0`,
        className
      )}
    />
  );
};
