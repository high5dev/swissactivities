import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import StaticImage from "../../Image";
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

export const Slider = ({
  images,
  className,
  classNameGallery,
  hideGallery,
  layout = "responsive",
  priority,
}) => {
  const swiper = useRef(null);
  const swiperThumb = useRef(null);
  const [isGallery, setIsGallery] = useState(false);

  useEffect(() => {
    if (hideGallery) {
      resizer();

      window.addEventListener("resize", resizer);

      return () => window.removeEventListener("resize", resizer);
    }
  }, []);

  const resizer = () => {
    window.innerWidth < hideGallery ? setIsGallery(false) : setIsGallery(true);
  };

  return (
    <div className={`relative`}>
      {images && [
        <div className={`swiper-default relative`} key={"slider-1"}>
          <Swiper
            ref={swiper}
            className={classNames(`image-wrapper w-full rounded-lg`, {
              [className]: className,
            })}
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={(s) =>
              isGallery && swiperThumb.current.swiper.slideTo(s.activeIndex)
            }
          >
            {images &&
              images.map((el, index) => {
                return (
                  <SwiperSlide key={"swipe " + index}>
                    <StaticImage
                      src={el.url}
                      alt={"alt"}
                      width={800}
                      height={656}
                      layout={layout}
                      quality={70}
                      priority={priority && index === 0}
                    />
                  </SwiperSlide>
                );
              })}
          </Swiper>
          {images.length >= 2 &&
            [
              {
                className: "swiper-button-prev",
                ref: () => swiper.current.swiper.slidePrev(),
              },
              {
                className: "swiper-button-next",
                ref: () => swiper.current.swiper.slideNext(),
              },
            ].map((item) => {
              return (
                <div
                  role="button"
                  key={item.className}
                  className={classNames(item.className, '!hidden lg:!flex')}
                  onClick={item.ref}
                />
              );
            })}
        </div>,
        isGallery && images.length >= 2 && (
          <Swiper
            className={classNames(`mt-4`, {
              [classNameGallery]: classNameGallery,
            })}
            slidesPerView={4}
            spaceBetween={12}
            ref={swiperThumb}
            onSlideChange={(s) => swiper.current.swiper.slideTo(s.activeIndex)}
            key={"slider-2"}
          >
            {images.map((el, index) => {
              return (
                <SwiperSlide key={"swipe " + index}>
                  <StaticImage
                    onClick={() => swiper.current.swiper.slideTo(index)}
                    className={`rounded-lg`}
                    src={el.url}
                    alt={""}
                    width={400}
                    height={328}
                    layout="responsive"
                    quality={40}
                    priority={priority && index <= 4}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ),
      ]}
    </div>
  );
};
