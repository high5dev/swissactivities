import React from "react";
import styles from "../styles.module.scss";
import {Swiper, SwiperSlide} from "swiper/react";
import StaticImage from "../../Image";
import { getUnixDate } from "./AvailabilityContainer";

const Weather = ({weather, isMobile= false, showDate = true, showDesc = true }) => {

    // temp Formula  Kalvin − 273.15 = 25.85°C

    return (
        <div className={styles.weather + ' weather'}>
            <Swiper
                navigation={true}
                spaceBetween={0}
                slidesPerView={1}
                className="carousel"
                allowSlideNext={true}
                allowSlidePrev={true}
            >
                {weather && weather.daily?.map((item, index) => {
                    const mintemp = item.temp.min - 273
                    const maxtemp = item.temp.max - 273

                    return (
                        <SwiperSlide key={index}>
                            <div className={"content " + styles.weatherContent}>
                                {showDate && <p>{getUnixDate(item.dt)}</p>}
                                {item.weather[0].icon && <StaticImage src={`/assets/weather/${isMobile ? item.weather[0].icon : item.weather[0].icon.replace('d','n')}.png`} width="50" height="50" alt=""/>}
                                {showDesc &&
                                <div className={styles.desc}>{item.weather[0].description}
                                    <p className={styles.temp}>
                                        <span className={styles.maxtemp}> {Math.ceil(maxtemp) } </span> /
                                        <span className={styles.mintemp}> {Math.ceil(mintemp)} </span> °C
                                    </p>
                                </div>}
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    );
};

export default Weather;
