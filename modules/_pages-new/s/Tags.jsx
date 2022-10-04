import { connectHierarchicalMenu } from "react-instantsearch-dom";
import { FaTimes } from "react-icons/fa";
import React from "react";
import classNames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
SwiperCore.use([Navigation]);

const TAG =
  "inline-block text-blue bg-white font-medium flex items-center rounded-full text-xs border-2 border-blue px-3 py-1.5 whitespace-nowrap cursor-pointer transition duration-100 ease-in hover:bg-blue hover:text-white lg:text-sm";

export const Tags = connectHierarchicalMenu(({ items, refine }) => {
  return (
    <div className={classNames(`relative overflow-x-auto`)}>
      <div className={classNames(`search-swiper flex`)}>
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={"auto"}
          cssMode
          breakpoints={{
            1024: {
              allowTouchMove: false,
              slidesPerGroup: 2,
            },
          }}
          spaceBetween={10}
        >
          {items.map((item) => {
            return [
              <SwiperSlide key={item.value} className={`max-w-max`}>
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    refine(item.value);
                  }}
                  className={classNames(TAG, "border-solid", {
                    "!bg-blue !text-white": item.isRefined,
                  })}
                >
                  {item.label}
                  {item.isRefined && <FaTimes className={`ml-2`} />}
                </button>
              </SwiperSlide>,
              item.items &&
                item.items.map((itemNested) => {
                  return (
                    <SwiperSlide key={itemNested.value} className={`max-w-max`}>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          refine(itemNested.value);
                        }}
                        className={classNames(TAG, "border-dashed", {
                          "!bg-blue !text-white": itemNested.isRefined,
                        })}
                      >
                        {itemNested.label}
                        {itemNested.isRefined && (
                          <FaTimes className={`ml-2`} />
                        )}
                      </button>
                    </SwiperSlide>
                  );
                }),
            ];
          })}
        </Swiper>
      </div>
    </div>
  );
});

export default React.memo(Tags);
