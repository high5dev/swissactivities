import classNames from "classnames";

export const Text = ({
  className,
  size,
  children,
  as,
  bold,
  display,
  black,
  gray,
  ...rest
}) => {
  const cls = classNames(className, {
    "text-xl text-black !leading-snug font-bold md:text-2xl lg:text-3xl xl:text-4xl":
      size === "xl",
    "text-black font-semibold text-xl lg:text-2xl ": size === "lg",
    "text-black font-semibold leading-snug": size === "md" || size === "md2",
    "text-lg": size === "md",
    "text-base lg:text-lg": size === "md2",
    "text-sm leading-relaxed text-gray-600 lg:text-[15px] lg:leading-relaxed":
      size === "sm" || !size || display || size === 'xs',
    "!text-xs": size === "xs",
    "lg:!text-base lg:!leading-relaxed": display && (size === "sm" || !size),
    "!text-black": black,
    "!text-gray-500": gray,
    "font-semibold": (size === "sm" || !size) && bold,
  });

  return as === "h1" ? (
    <h1 {...rest} className={cls}>
      {children}
    </h1>
  ) : as === "h2" ? (
    <h2 {...rest} className={cls}>
      {children}
    </h2>
  ) : as === "h3" ? (
    <h3 {...rest} className={cls}>
      {children}
    </h3>
  ) : as === "h4" ? (
    <h4 {...rest} className={cls}>
      {children}
    </h4>
  ) : as === "h5" ? (
    <h5 {...rest} className={cls}>
      {children}
    </h5>
  ) : as === "h6" ? (
    <h6 {...rest} className={cls}>
      {children}
    </h6>
  ) : as === "span" ? (
    <span {...rest} className={cls}>
      {children}
    </span>
  ) : (
    <p {...rest} className={cls}>
      {children}
    </p>
  );
};
