import classNames from "classnames";

export const Icon = ({icon, className}) => {
    return (
        <span
            className={classNames(
                `flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg text-primary`,
                className
            )}
        >
      {icon}
    </span>
    );
};
