import { Swiper, SwiperSlide } from "swiper/react";
import { useRef, useState } from "react";
import Button from "../../_primitives/Button";
import { Activity } from "../Activity";
import classNames from "classnames";

export const SliderGrid = ({
  activities,
  loop = true,
  navClasses,
  items,
  activity,
}) => {
  const swiper = useRef(null);
  const [unlock, setUnlock] = useState(false);

  return (activities && activities.length >= 1) ||
    (items && items.length >= 1) ? (
    <div className={`relative -mr-4 sm:-mx-0`}>
      <div
        className={classNames(
          `absolute right-4 -top-12 grid max-w-max grid-cols-2 gap-4 lg:-top-14`,
          navClasses
        )}
      >
        {unlock &&
          [
            {
              onClick: () => swiper.current.swiper.slidePrev(),
              className: "swiper-button-prev-default",
            },
            {
              onClick: () => swiper.current.swiper.slideNext(),
              className: "swiper-button-next-default",
            },
          ].map((item) => {
            return (
              <Button
                role="button"
                as="div"
                onClick={item.onClick}
                key={item.className}
                className={item.className}
              />
            );
          })}
      </div>
      <Swiper
        ref={swiper}
        className={`swiper-default swiper-top-nav pb-1 px-[2px]`}
        slidesPerView={1.5}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
          1440: {
            slidesPerView: 5,
          },
        }}
        spaceBetween={16}
        loop={loop}
        watchOverflow={true}
        onUnlock={() => {
          setUnlock(true);
        }}
        onLock={() => {
          setUnlock(false);
        }}
      >
        {activities
          ? activities.map((item, index) => {
              return (
                <SwiperSlide className={`!h-auto`} key={`activity-${index}`}>
                  <Activity
                    activity={activity}
                    className={`h-[calc(100%-2px)] `}
                    hit={item}
                    type="sm"
                    passHref
                  />
                </SwiperSlide>
              );
            })
          : items.map((item, index) => {
              return (
                <SwiperSlide className={`!h-auto`} key={`item-${index}`}>
                  {item}
                </SwiperSlide>
              );
            })}
      </Swiper>
    </div>
  ) : null;
};
