import React, { useState } from "react";
import { BsStarFill } from "react-icons/bs";
import Button from "../../modules/Button";
import Tag from "../../modules/Tag";
import Icon from "../../modules/Icon";
import truncate from "lodash/truncate";
import styles from "./styles.module.scss";
import StaticImage from "../Image";
import { useI18n } from "next-localization";
import Link from "next/link";

const ActivityComponent = ({ activity, price }) => {
  const { t, locale } = useI18n();
  const [isFavor, setFavor] = useState(false);

  const customizeStyle = () => {
    if (
      activity.teaser_image.width >
      (activity.teaser_image.height * 251) / 165
    ) {
      return { height: "100%", width: "auto", maxWidth: "none" };
    }

    return {
      height: "auto",
      width: "100%",
      maxWidth: "none",
      maxHeight: "none",
    };
  };

  const onClickFavor = () => {
    setFavor(!isFavor);
  };

  const detailsHref = activity.urls[locale()];

  return (
    <div className={styles.activityContainer}>
      <div className={styles.activityItemHeader}>
        <Link passHref href={detailsHref}>
          <a>
            <StaticImage
              src={activity.teaser_image.url}
              style={customizeStyle()}
              alt={activity.teaser_image.caption}
              width={258}
              height={172}
              layout="fixed"
            />
          </a>
        </Link>
        {/* <div className={styles.favorite} onClick={onClickFavor}>
          <Icon
            color="#FE504F"
            icon={isFavor ? <BsHeartFill /> : <BsHeart />}
          />
        </div> */}
      </div>
      <div className={styles.activityDetail}>
        <div className={styles.activityTitle}>{activity.info.title}</div>
        <div className={styles.shortDescription}>
          <div className={styles.activityType}>
            {/* {activity.type &&
              <Tag
                title={activity.type.title}
                size="small"
                clickable={false}
                customStyle={{
                  backgroundColor: '#FFE6E6',
                  border: 'none',
                  padding: '6px 10px',
                  color: 'FE504F',
                  fontWeight: 500,
                }}
              />
            } */}
            {activity.type && (
              <Tag
                title={activity.type.title}
                size="small"
                clickable={false}
                customStyle="activity-tag"
              />
            )}
          </div>
          {truncate(activity.info.teaser, {
            length: 110,
          })}{" "}
          <Link passHref href={detailsHref}>
            <a>{t("activity.readmore")}</a>
          </Link>
        </div>
        <div className={styles.activityFooter}>
          <div className={styles.footerLeft}>
            <div className={styles.priceData}>
              <span className={styles.from}>{t("activity.rating")}</span>
              <div className={styles.rating}>
                <Icon color="#FE504F" icon={<BsStarFill />} />
                <b>4,5</b>
                <span>(4)</span>
              </div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.offer}>
              <span className={styles.from}>{t("activity.priceFrom")}</span>
              <div>
                <span className={styles.currency}>
                  {price ? price.startingPrice.currency : "CHF"}
                </span>{" "}
                <span className={styles.price}>
                  {price ? price.startingPrice.amount : "0.00"}
                </span>
              </div>
            </div>
          </div>
          <Link passHref href={detailsHref}>
            <Button
              title={t("activity.booknow")}
              customStyle="grid-book"
              component="a"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityComponent;
