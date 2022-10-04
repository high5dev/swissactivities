import React from "react";
import StaticImage from "../../Image";
import { Text } from "../Text";
import { useI18n } from "next-localization";
import classNames from "classnames";

// eslint-disable-next-line react/display-name
export const ImageCard = React.forwardRef(
  ({ className, onClick, href, item, num, title, text }, ref) => {
    const { t } = useI18n();

    return (
      <a
        href={href}
        ref={ref}
        className={classNames(
          `group relative block h-full min-h-[250px] overflow-hidden rounded-lg`,
          {
            [className]: className,
          }
        )}
      >
        <div className={`image-wrapper h-full`}>
          <StaticImage
            src={item.teaser_image.url}
            alt={item.teaser_image.caption}
            width={750}
            height={420}
            layout="responsive"
          />
        </div>
        <div className="absolute bottom-0 left-0 flex h-1/2 w-full items-end bg-gradient-to-t from-black p-4 md:p-5">
          <div className={`flex flex-col flex-wrap`}>
            <Text
              as="h3"
              size="md"
              className={`mr-4 mt-2 font-semibold !text-white transition duration-100 ease-in group-hover:-translate-y-1`}
            >
              {title || item.title}
            </Text>
            {text && <Text className={`mt-1 !text-gray-300`}>{text}</Text>}
            {num && (
              <span
                className={`mt-2 mt-2 inline-block inline-flex max-w-max rounded-full bg-light px-2 py-1 text-xs font-semibold uppercase text-primary`}
              >
                {item.numActivities}{" "}
                {t(
                  item.numActivities === 1
                    ? "filter.activity"
                    : "filter.activities"
                )}
              </span>
            )}
          </div>
        </div>
      </a>
    );
  }
);
