import classNames from "classnames";

export const Skeleton = ({ amount = 2, size = "sm" }) => {
  return (
    <div className={`space-y-2`}>
      {Array.from({ length: amount }).map((item, index) => {
        return (
          <div
            key={`skeleton-${index}`}
            className={classNames(`h-16 animate-pulse rounded-lg bg-gray-200`, {
              "h-8": size === "xs",
              "h-16": size === "sm",
              "h-24": size === "md",
              "h-32": size === "lg",
            })}
          />
        );
      })}
    </div>
  );
};
