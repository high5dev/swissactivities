import { BsExclamationCircle, BsTag } from "react-icons/bs";
import classNames from "classnames";
import { IoWarningOutline } from "react-icons/io5";

export const Toast = ({
  className,
  children,
  ticket,
  text,
  warning,
  inline,
}) => {
  return (
    <div className={className}>
      <div
        className={classNames(
          `relative grid max-w-max items-center overflow-hidden rounded-md`,
          {
            "border border-solid border-sky-100 bg-sky-50": !warning && !inline,
            "bg-rose-50": warning && !inline,
            "grid-cols-[50px,1fr] py-2 pr-3": !inline,
            "grid-cols-[20px,1fr] py-0.5": inline,
          }
        )}
      >
        <div>
          <span
            className={classNames(
              `absolute top-0 left-0 flex h-full items-center justify-center text-sky-700`,
              {
                "color-info": !warning && !inline,
                "color-warning": warning && !inline,
                "mr-3 px-3": !inline,
                "text-[14px]": inline,
              }
            )}
          >
            {ticket ? (
              <BsTag />
            ) : warning ? (
              <IoWarningOutline />
            ) : (
              <BsExclamationCircle />
            )}
          </span>
        </div>
        <span
          className={classNames(
            `!text-[10px] font-medium leading-snug text-sky-900 lg:!text-xs`,
            {
              "text-sky-900": !warning,
              "text-rose-900": warning,
            }
          )}
        >
          {text || children}
        </span>
      </div>
    </div>
  );
};

export default Toast;
