import React from "react";

import { BsStarFill, BsGeo } from 'react-icons/bs';
import { AiOutlineEnvironment } from 'react-icons/ai';
import Icon from '../Icon';
import Tag from '../Tag';
import styles from "./styles.module.scss";
import StaticImage from "../Image";
import {useI18n} from "next-localization";

const MapListItem = ({ data, price, isMapElement = false }) => {
  const {t} = useI18n();
  return (
    <div className={styles.mapListItem} style={{ padding: isMapElement ? '0px' : '16px', margin: isMapElement ? '0px' : '8px 0' }}>
      <div className={styles.listItemBody}>
        <div className={styles.itemImage}>
          <StaticImage src={data.teaser_image.url} alt="Activity Image" width={127} height={106} layout="fixed" />
          <div className={styles.favorite}>
            <Tag
              title={<span style={{ display: "flex", alignItems: "center", justifyContent: 'space-around' }}><AiOutlineEnvironment />{data.location ? data.location.title.length > 8 ? `${data.location.title.slice(0, 8)}...` : data.location.title : "Bern"}</span>}
              size="medium"
              active={false}
              closable={false}
              clickable={false}
              customStyle="map-item-tag"
            />
          </div>
        </div>
        <div className={styles.itemDetail}>
          <div className={styles.title}>{data.info.title}</div>
          <div className={styles.footerLeft}>
            <div className={styles.priceData}>
              <div className={styles.rating}>
                <Icon
                  color="#FE504F"
                  icon={<BsStarFill />}
                />
                <b>4,5</b>
                <span>(4)</span>
              </div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.offer}>
              <div>
                {t("activity.from")} <span className={styles.price}>{price ? price.startingPrice.amount : '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapListItem;
