import { CustomMarker } from "react-instantsearch-dom-maps";
import Tippy from "@tippyjs/react";
import { ActivityAttributes } from "../../_components/ActivityAttributes";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import { EffectFade, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";

export const Marker = ({ hit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickedOutside, setClickedOutside] = useState(false);
  const ref = useRef();
  const swiper = useRef(null);

  const handleClickOutside = (e) => {
    if (
      !e.target.classList.contains("swiper-button-next") &&
      !e.target.classList.contains("swiper-button-prev")
    ) {
      if (!e.target.closest(".link") || e.target.classList.contains("link")) {
        if (!ref.current?.contains(e.target)) {
          setIsOpen(false);
        } else {
          setIsOpen(!isOpen);
        }
      }
    }
  };

  const handleTouch = (e) => {
    if (
      !e.target.classList.contains("swiper-button-next") &&
      !e.target.classList.contains("swiper-button-prev")
    ) {
      if (
        isOpen &&
        (!e.target.closest(".link") || e.target.classList.contains("link")) &&
        !e.target.classList.contains("swiper-button-next")
      ) {
        setIsOpen(false);
      }
    }
  };

  const handleClickInside = () => setClickedOutside(false);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("touchstart", handleTouch);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleTouch);
    };
  });

  const Card = ({ item, slider }) => {
    return (
      isOpen && (
        <Link href={item.url} passHref>
          <a
            style={{ outline: "none !important" }}
            target={window.innerWidth > 768 ? "_blank" : "_self"}
            className={classNames(
              `link inline-block w-[200px] overflow-hidden rounded-lg bg-white !outline-none !outline-transparent transition-all duration-200 ease-in focus:!outline-none focus:!outline-transparent sm:w-[250px]`,
              {
                "pointer-events-none": !isOpen,
                "pointer-events-auto": isOpen,
                "fade-in-card": isOpen && !slider,
                "opacity-0": !isOpen && !slider,
                "opacity-100": slider,
                "shadow-xl hover:-translate-y-2": !slider,
              }
            )}
          >
            {item.topics && (
              <span
                className={
                  "absolute right-2 top-2 mb-1.5 inline-block max-w-max rounded-full px-2.5 py-1 text-xs font-semibold uppercase text-primary bg-light"
                }
              >
                {item.topics[0]}
              </span>
            )}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`h-[90px] w-full object-cover sm:h-[150px]`}
                alt={item?.title}
                src={`${item?.teaser_image?.replace(
                  "fra1.digitaloceanspaces.com",
                  "contentapi-swissactivities.imgix.net"
                )}?auto=format,compress&fit=crop&crop=edges&w=250&h=150&q=10`}
              />
            </div>
            <div
              className={`py-3 px-5 text-xs font-medium leading-relaxed text-gray-900 sm:py-4 sm:text-sm`}
            >
              <span
                className={`mb-2 inline-block w-full whitespace-pre-wrap break-words`}
              >
                {item?.title}
              </span>
              <ActivityAttributes hit={item} type="sm" />
            </div>
          </a>
        </Link>
      )
    );
  };

  const Cards = () => {
    return (
      <div
        className={classNames(
          "marker-swiper w-[200px] rounded-lg shadow-xl sm:w-[250px]",
          {
            "fade-in-card pointer-events-auto": isOpen,
            "pointer-events-none opacity-0": !isOpen,
          }
        )}
      >
        <Swiper
          className={`rounded-lg`}
          modules={[EffectFade, Pagination]}
          effect="fade"
          loop={true}
          ref={swiper}
          allowTouchMove={false}
          pagination={{ type: "progressbar" }}
        >
          {Object.values(hit.items).map((item) => {
            return (
              <SwiperSlide
                key={item.activity.id}
                className={`flex h-auto max-w-max`}
              >
                <Card item={item} slider={true} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        {[
          {
            className:
              "swiper-button-prev focus:!outline-none !outline-none !outline-transparent focus:!outline-transparent",
            ref: () => swiper.current.swiper.slidePrev(),
          },
          {
            className:
              "swiper-button-next focus:!outline-none !outline-none !outline-transparent focus:!outline-transparent",
            ref: () => swiper.current.swiper.slideNext(),
          },
        ].map((item) => {
          return (
            <div
              role="button"
              key={item.className}
              className={item.className}
              onClick={item.ref}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <CustomMarker
        classNames={classNames({
          "z-40": isOpen,
        })}
        key={hit?.objectID}
        hit={hit}
        style={{
          zIndex: isOpen ? 999999 : 9,
        }}
      >
        <Tippy
          content={hit.url ? <Card item={hit} /> : <Cards />}
          visible={true}
          boundary={document.querySelector(".ais-GeoSearch")}
          appendTo={document.querySelector(".ais-GeoSearch > div")}
          interactive={true}
        >
          <div
            ref={ref}
            onClick={handleClickInside}
            role="button"
            className={classNames(
              `marker-${
                hit?.activity?.id || hit.id
              } flex cursor-pointer items-center justify-center rounded-full border-2 border-solid border-primary bg-white text-center font-medium text-gray-900 transition ease-in hover:scale-110`,
              {
                "h-9 px-3 text-sm": hit?.activity?.id,
                "pl-0.5": hit.typeIconName,
                "px-3": !hit.typeIconName,
                "h-10 w-10 text-base": !hit?.activity?.id,
              }
            )}
          >
            {hit?.price?.startingPrice?.formatted ? (
              <span className={`flex items-center`}>
                {hit.typeIconName && (
                  <span
                    className={`mr-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/icons/${hit.typeIconName}.svg`}
                      className={`h-5 invert filter`}
                    />
                  </span>
                )}
                {hit?.price?.startingPrice?.formatted}
              </span>
            ) : (
              Object.values(hit?.items).length
            )}
          </div>
        </Tippy>
      </CustomMarker>
    </>
  );
};

export default React.memo(Marker);
