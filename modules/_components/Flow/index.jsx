import classNames from "classnames";

export const Flow = ({ children, className, center }) => {
  return (
    <div
      className={classNames(className, "flow-text", {
        "flex flex-col items-center justify-center text-center": center,
      })}
    >
      {children}
    </div>
  );
};
