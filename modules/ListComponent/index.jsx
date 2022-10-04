import React, { useEffect, useState } from "react";
import truncate from "lodash/truncate";
import Link from "next/link";
import moment from "moment";
import styles from "./styles.module.scss";
import StaticImage from "../Image";
import { useI18n } from "next-localization";
import { Swiper, SwiperSlide } from "swiper/react";
import Usp from "./Usp";

export const ExternalLink = ({href, isMobile, children}) => (
  <Link href={href} passHref={true}>
    {isMobile ?
      <a className={styles.listItemContainerLink}>{children}</a> :
      <a className={styles.listItemContainerLink} rel="noreferrer noopener" target="_blank">{children}</a>
    }
  </Link>
)

const frontendlabelId = 18;

const ListComponent = ({ activity, isMobile, typeColors = {}, highPriority }) => {
  const [matches, setMatches] = useState();
  const { price, nextAvailable} = activity;
  const { t, locale } = useI18n();

  useEffect(() => {
    const mediaMatch = window.matchMedia("(max-width: 512px)");
    setMatches(mediaMatch.matches);

    const handler = (e) => setMatches(e.matches);
    mediaMatch.addListener(handler);
    return () => mediaMatch.removeListener(handler);
  }, []);

  const detailsUrl = activity.urls[locale()];

  const frontendlabel = activity.attribute_values.find(value => Number(value.attribute?.id) === frontendlabelId) || activity.type;
  const bookNowUsp = activity.usps.find(el => el.key === "book_now");

  return (
    <div className={styles.listItemWrap}>
      <ExternalLink isMobile={isMobile} href={detailsUrl}>
        <div  className={styles.listItemContainer}>
          <div className={styles.listItemHeader}>
            <div className={styles.types}>
              {frontendlabel && <li style={{backgroundColor:  typeColors[frontendlabel.value || frontendlabel.title]}}>{frontendlabel.value || frontendlabel.title}</li>}
            </div>
            <div className={styles.gallery + ' search-gallery'}>
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                className="carousel"
                allowSlideNext={false}
                allowSlidePrev={false}
              >
                {activity.gallery && activity.gallery.map((el, index) => {
                  return(
                    <SwiperSlide key={'swipe ' + index}>
                      <StaticImage
                        src={el.url}
                        alt={'alt'}
                        width={470}
                        height={400}
                        layout="responsive"
                        quality={40}
                        priority={highPriority && index === 0}
                      />
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </div>
          <div className={styles.listItemBody}>
            <div className={styles.types}>
              {frontendlabel && <li style={{backgroundColor:  typeColors[frontendlabel.value || frontendlabel.title]}}>{frontendlabel.value || frontendlabel.title}</li>}
            </div>
            <h2 className={styles.title}>
              {activity.info.title}
            </h2>
            <div className={styles.shortDescription}>
              {truncate(activity.info.teaser, {
                length: 170,
              })}
            </div>
            {/*<div className={styles.attributes}>*/}
            {/*  {activity.attribute_values.filter(({attribute}) => attribute && allowedAttribues.includes(Number(attribute.id))).map((el, index) => {*/}
            {/*    return (*/}
            {/*      <li*/}
            {/*        key={`attribute-${index}`}*/}
            {/*        style={{color: '#'+Math.random().toString(16).slice(-6)}}*/}
            {/*      >*/}
            {/*        {el.value}*/}
            {/*      </li>*/}
            {/*    );*/}
            {/*  })}*/}
            {/*</div>*/}

            <div className={styles.listItemFooter}>
              <div className={styles.leftBlock}>
                {bookNowUsp && <Usp
                  usp={bookNowUsp}
                  uspDate={
                    nextAvailable
                      ? moment(nextAvailable).format("DD.MM.YYYY")
                      : "N/A"
                  }
                />}
              </div>
              <div className={styles.rightBlock}>
                <span className={styles.from}>{t('search.card.from')}</span>
                 <span className={styles.currency}>
                  {price ? price.startingPrice.currency : "N/A"}{' '}{price ? parseFloat(price.startingPrice.amount) : ""}
                </span>
                <span className={styles.person}>{t('search.card.person')}</span>
              </div>
            </div>
          </div>
        </div>
      </ExternalLink>
    </div>
  );
};

export default ListComponent;
