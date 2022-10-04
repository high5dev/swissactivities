import { Swiper, SwiperSlide } from "swiper/react";
import { Rating } from "../Rating";
import { Text } from "../Text";
import { useRef } from "react";
import Button from "../../_primitives/Button";
import classNames from "classnames";

export const Reviews = ({ reviews, navClasses }) => {
  const swiper = useRef(null);

  return (
    <div className={`relative -mr-4 sm:-mx-0`}>
      <div
        className={classNames(
          `absolute right-4 -top-12 grid max-w-max grid-cols-2 gap-2 lg:-top-14`,
          navClasses
        )}
      >
        {[
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
        className={`swiper-default swiper-top-nav px-[2px]`}
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
        loop
      >
        {reviews.map((item) => {
          return (
            <SwiperSlide
              className={`!h-auto`}
              key={item.review}
            >
              <div
                className={`box-border h-full space-y-3 rounded-lg border border-solid border-gray-200 p-6 text-xs`}
              >
                <Text as="p" size="md" className={`truncate`}>
                  {item.reviewer.first_name}
                </Text>
                <div className={`font-medium`}>
                  <Rating rating={item.rating} />
                </div>
                <p className={`block text-gray-600 line-clamp-4`}>
                  {item.review}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
