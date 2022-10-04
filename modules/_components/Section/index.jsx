import classNames from "classnames";

export const Section = ({
  style,
  className,
  classNameInner,
  children,
  first,
  last,
  flush,
  flushAlt,
  center,
  column,
  row,
  bg,
  pb,
  section = true,
}) => {
  return (
    <section
      style={style}
      className={classNames({
        "mt-header": first,
        "!pt-0 lg:!pt-16": flush,
        "!mt-0": flushAlt,
        section: section,
        "pb-10 md:pb-12 lg:pb-16 xl:pb-20 2xl:pb-24": pb,
        "section-last": last,
        "mt-8 pb-10 sm:mt-10 sm:pb-12 md:mt-12 md:pb-12 lg:mt-16 lg:pb-16 xl:mt-20 xl:pb-20 2xl:mt-24 2xl:pb-24":
          bg,
        [bg]: bg,
        [className]: className,
      })}
    >
      <div
        className={classNames("container-tw", {
          "flex flex-col items-center justify-center text-center": center,
          "space-y-8 md:space-y-10 lg:space-y-12": row,
          "grid-co grid": column,
          [classNameInner]: classNameInner,
        })}
      >
        {children}
      </div>
    </section>
  );
};
