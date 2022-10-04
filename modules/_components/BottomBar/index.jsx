import classNames from "classnames";

export const BottomBar = ({ className, children }) => {
  return (
    <div
      style={{ boxShadow: "0px -3px 6px 0 rgba(0,0,0,0.05)" }}
      className={classNames(
        `fixed bottom-0 left-0 z-[20] w-full bg-white px-4 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] sm:pt-4 sm:pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]`,
        {
          [className]: className,
        }
      )}
    >
      {children}
    </div>
  );
};
