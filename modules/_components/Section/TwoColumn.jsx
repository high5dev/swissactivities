import StaticImage from "../../Image";
import { Section } from "./index";
import classNames from "classnames";

export const SectionTwoColumn = ({
  classNameChildren,
  image,
  media,
  children,
  reverse,
  push,
  md,
  ...rest
}) => {
  return (
    <Section
      {...rest}
      classNameInner={classNames("xl:gap-32 lg:gap-20", {
        "lg:grid lg:grid-cols-2 lg:items-center": !md,
        "md:grid md:grid-cols-2 md:items-center md:gap-12": md,
      })}
    >
      {image ? (
        <div
          className={classNames(`image-wrapper relative -mx-4`, {
            "lg:col-start-2 lg:row-start-1 lg:mx-0 lg:h-full lg:overflow-hidden lg:rounded-lg":
              !md,
            "md:col-start-2 md:row-start-1 md:mx-0 md:h-full md:overflow-hidden md:rounded-lg":
              md,
          })}
        >
          <StaticImage
            src={image.url}
            alt={image.caption}
            width={1000}
            height={700}
            layout="responsive"
            priority
            q="100"
          />
        </div>
      ) : (
        media
      )}
      <div
        className={classNames(`section flow-text w-full w-full rounded-lg`, {
          [classNameChildren]: classNameChildren,
          "lg:col-start-2": reverse && !md,
          "lg:col-start-1": !reverse && !md,
          "lg:!pt-0": !push && !md,
          "lg:row-start-1 lg:pb-0": !md,
          "md:col-start-2": reverse && md,
          "md:col-start-1": !reverse && md,
          "md:!pt-0": !push && md,
          "md:row-start-1 md:pb-0": md,
        })}
      >
        {children}
      </div>
    </Section>
  );
};
