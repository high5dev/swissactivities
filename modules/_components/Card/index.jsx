import classNames from "classnames";

export const Card = ({ children, className, id, padding = true, ...rest }) => {
  return (
    <div
      {...rest}
      id={id}
      className={classNames(
        "borer-solid -mx-[calc(1rem+4px)] overflow-hidden rounded-none border border-gray-200 bg-white font-medium shadow transition duration-100 ease-in lg:m-0 lg:rounded-lg",
        className,
        {
          "px-5 py-6 lg:p-6": padding,
        }
      )}
    >
      {children}
    </div>
  );
};
