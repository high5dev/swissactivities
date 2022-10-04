import React from "react";
import classNames from "classnames";
import { useI18n } from "next-localization";
import { ActivityAttributes } from "../ActivityAttributes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getClusterId } from "../../../utils";
import Button from "../../_primitives/Button";
import { Button as B } from "../../_components/Button";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Benefit } from "../Benefit";
import { Text } from "../Text";
import StaticImage from "../../Image";
import { isObject } from "lodash";
import {
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaThumbsUp,
} from "react-icons/fa";
import Usps from "../Usps";
import { scrollToTarget } from "../../../utils/scrollToTarget";
import { BookingButton } from "../Booking/Button";

export const Activity = ({
  hit,
  type,
  passHref,
  className,
  activity,
  more,
  highlight,
  book,
}) => {
  const { t, locale } = useI18n();
  const [prevZ, setPrevZ] = useState("");
  const [target, setTarget] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const isSm = type === "sm";
  const isActivity = activity || hit?.type?.value || hit?.type?.color;

  const url = isActivity ? hit.hrefs[locale()] : hit?.href || hit?.url;
  const tag = isActivity
    ? hit?.type?.value ||
      hit?.type?.title ||
      hit.attribute_values[hit.attribute_values.length - 1].value
    : hit?.type;
  const title = isActivity ? hit?.info?.title : hit?.title;
  const teaser = isActivity ? hit?.info?.teaser : hit?.teaser;
  const price = isActivity ? hit?.summary?.minPrice?.amount : hit.price;
  const priceFormat = isActivity
    ? hit?.price?.formatted || hit?.summary?.minPrice?.formatted
    : hit?.price?.startingPrice?.formatted;

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const clusterId = hit._geoLoc && getClusterId(hit);

  useEffect(() => {
    setTarget(window.innerWidth > 768 ? "_blank" : "_self");
  }, []);

  const setActivity = () => {
    if (!isActivity) {
      const parentEl =
        document.querySelector(`.marker-${hit.activity.id}`)?.parentElement ||
        document.querySelector(`.marker-${clusterId}`)?.parentElement;

      setPrevZ(parentEl?.style.zIndex);

      [hit.activity.id, clusterId].forEach((item) => {
        document
          .querySelector(`.marker-${item}`)
          ?.classList.add("!bg-primary", "!text-white");
      });

      if (parentEl) {
        parentEl.style.zIndex = "9999999";
      }
    }
  };

  const resetActivity = () => {
    if (!isActivity) {
      const parentEl =
        document.querySelector(`.marker-${hit.activity.id}`)?.parentElement ||
        document.querySelector(`.marker-${clusterId}`)?.parentElement;

      if (parentEl) {
        parentEl.style.zIndex = prevZ;
      }

      [hit.activity.id, clusterId].forEach((item) => {
        document
          .querySelector(`.marker-${item}`)
          ?.classList.remove("!bg-primary", "!text-white");
      });
    }
  };

  const Img = () => {
    return (
      <StaticImage
        className={classNames("w-full object-cover transition duration-200", {
          "md:group-hover:scale-110": !isActivity,
        })}
        width={300}
        height={isSm ? 120 : 300}
        src={hit.teaser_image?.url ? hit.teaser_image?.url : hit.teaser_image}
        alt={title}
        q={75}
      />
    );
  };

  const Btn = ({ className }) => {
    return (
      <div className={className}>
        {book && hit.bookDate ? (
          <BookingButton text={t("booking.booknow")} activity={hit} />
        ) : (
          <B href={url} type="primary" className={`font-bold`}>
            {t("booking.booknow")}
          </B>
        )}
      </div>
    );
  };

  // eslint-disable-next-line react/display-name
  const Element = React.forwardRef(({ onClick, href, item }, ref) => {
    const column = "relative text-sm px-4 py-6 lg:p-8";
    const columnInner = "space-y-1.5";
    const columnSeperator =
      "absolute top-0 w-full left-0 h-px bg-gray-200 lg:left-0 lg:h-full lg:w-px";
    const ColumnTitle = ({ text }) => {
      return (
        <Text as="h2" size="md" className={`mb-5`}>
          {text}
        </Text>
      );
    };

    return (
      <div className={classNames("relative", className)}>
        <Button
          id={`activity-${hit.id}`}
          as="div"
          href={href}
          ref={ref}
          target={target}
          onMouseEnter={isSm && !isActivity ? setActivity : undefined}
          onMouseLeave={isSm && !isActivity ? resetActivity : undefined}
          className={classNames(
            `group inline-block grid h-full w-full overflow-hidden rounded-lg border border-solid border-gray-200 bg-white p-0 text-left transition duration-200`,
            {
              "md:grid-cols-[180px,1fr]": !isSm,
              "grid-rows-[120px,1fr]": isSm,
              "hover:shadow-md": !isActivity || (isActivity && isSm),
              "!rounded-b-none": isOpen,
              "!border-blue": highlight,
            }
          )}
        >
          {highlight && (
            <span
              className={`absolute right-0 top-0 z-10 flex items-center rounded-bl-lg rounded-tr-lg border border-solid border-blue bg-gray-100 py-2 px-4 text-xs font-semibold uppercase text-blue`}
            >
              <FaThumbsUp className={`relative -top-px mr-1.5 text-sm`} />
              {t("activity.recommendation")}
            </span>
          )}
          <div
            className={classNames(
              "image-wrapper relative flex h-full w-full flex-col overflow-hidden",
              {
                "h-[150px] !gap-12 md:h-auto md:h-full": !isSm,
                "h-[120px] md:h-auto": isSm,
              }
            )}
          >
            <Img />
          </div>
          <div
            className={classNames("z-10 -mt-8 flex flex-col p-5", {
              "md:mt-0 md:grid md:grid-cols-[1fr,100px] md:gap-8": !isSm,
              "md:grid-cols-[1fr,100px]": !isSm && !more,
              "md:grid-cols-[1fr,150px]": !isSm && more,
            })}
          >
            <div className={`flex flex-col`}>
              {!isObject(tag) && (
                <span
                  className={
                    "mb-1.5 inline-block max-w-max rounded-full bg-light px-2.5 py-1 text-xs font-semibold uppercase text-primary"
                  }
                >
                  {tag}
                </span>
              )}
              <span
                className={classNames(
                  "mt-3 font-semibold !leading-snug text-black md:mt-1",
                  {
                    "text-lg": !isSm,
                    "text-base": isSm,
                  }
                )}
              >
                {title}
              </span>
              {!isSm && (
                <>
                  <Text className={`mt-2 max-w-screen-md lg:mt-3`}>
                    {teaser}{" "}
                    <div
                      className={`inline-block cursor-pointer items-center underline transition duration-100 ease-in hover:text-black`}
                    >
                      {book && (
                        <Link href={url || ""} passHref>
                          <a
                            className={`text-gray-600 duration-100 ease-in hover:text-black`}
                          >
                            {t("offerCard.moreDetails")}
                            <FaExternalLinkAlt className={`ml-1 text-[11px]`} />
                          </a>
                        </Link>
                      )}
                      {more && !book && (
                        <span
                          onClick={() => {
                            setIsOpen(!isOpen);
                            setTimeout(() => {
                              scrollToTarget(`#activity-details-${hit.id}`);
                            }, 100);
                          }}
                          role="button"
                        >
                          {isOpen ? (
                            <>
                              {t("offerCard.lessDetails")}
                              <FaChevronUp className={`ml-1 text-[11px]`} />
                            </>
                          ) : (
                            <>
                              {t("offerCard.moreDetails")}
                              <FaChevronDown className={`ml-1 text-[11px]`} />
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </Text>
                </>
              )}
              {!isSm && (
                <div className={`mt-8 hidden md:block`}>
                  <ActivityAttributes hit={hit} attributes={!more} />
                  {more && hit.summary && (
                    <Usps
                      className={`mt-2`}
                      type="sm"
                      map={false}
                      activity={hit}
                    />
                  )}
                </div>
              )}
            </div>
            <div
              className={classNames(`relative flex h-full justify-between`, {
                "mt-4 md:mt-0": !isSm,
                "mt-2 items-end": isSm,
              })}
            >
              {!isSm ? (
                <div className={`md:hidden`}>
                  <ActivityAttributes hit={hit} attributes={!more} />
                  {more && hit.summary && (
                    <Usps
                      className={`mt-4`}
                      type="sm"
                      simple={true}
                      map={false}
                      activity={hit}
                    />
                  )}
                </div>
              ) : (
                <ActivityAttributes hit={hit} type="sm" />
              )}
              {price && (
                <div
                  className={`mt-auto ml-8 flex flex-col justify-between lg:ml-0`}
                >
                  <div className={`w-full`}>
                    <span
                      className={`text-xs font-medium text-black text-gray-600`}
                    >
                      {t("search.card.from")}
                      <span
                        className={classNames(
                          `flex items-center text-lg font-semibold text-black`,
                          {
                            "lg:text-xl": !isSm,
                          }
                        )}
                      >
                        {priceFormat}
                      </span>
                      {t("search.card.person")}
                    </span>
                  </div>
                  {more && <Btn className={`mt-4 !hidden md:!flex`} />}
                </div>
              )}
            </div>
            {more && <Btn className={`mt-4 md:!hidden`} />}
          </div>
        </Button>
        {isActivity && isOpen && !isSm && (
          <div
            id={`activity-details-${hit.id}`}
            className={`relative -top-px w-full rounded-b-lg border border-solid border-gray-200 bg-gray-50 lg:grid lg:grid-cols-2`}
          >
            <div className={column}>
              <ColumnTitle text={t("activity.tabs.includes")} />
              <ul className={columnInner}>
                {hit.info.benefits.map(
                  (el, index) =>
                    (el.type === "included" || el.type === "offered") && (
                      <Benefit key={`${el.text}-${index}`} item={el} />
                    )
                )}
              </ul>
            </div>
            <div className={column}>
              <div className={columnSeperator} />
              <ColumnTitle text={t("activity.tabs.highlights")} />
              <ul className={classNames(columnInner, "list-disc pl-4")}>
                {hit.info.highlights.map((el, index) => (
                  <li key={"highlight " + index}>
                    <ReactMarkdown key={`highlight-${index}`} plugins={[gfm]}>
                      {el.text}
                    </ReactMarkdown>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  });

  return isActivity && !passHref ? (
    <Element />
  ) : url || passHref ? (
    <Link href={url || ""} passHref>
      <Element />
    </Link>
  ) : null;
};
