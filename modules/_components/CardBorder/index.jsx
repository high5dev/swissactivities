import classNames from "classnames";

export const CardBorder = ({ children, className }) => {
  return (
    <div
      className={classNames(
        `flex w-full flex-col items-center rounded-lg border border border-solid border-gray-200 p-4 lg:p-6 xl:p-8`,
        { [className]: className }
      )}
    >
      {children}
    </div>
  );
};
