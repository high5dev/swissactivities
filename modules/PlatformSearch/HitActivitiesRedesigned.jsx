import React, { useCallback } from "react";
import { Highlight } from "react-instantsearch-dom";
import { useI18n } from "next-localization";
import StaticImage from "../Image";
import styles from "./hitActivityRedesigned.module.scss";

const allowedAttributes = [9, 7, 16];

function noop() {}

const HitActivities = (props) => {
  const {
    hit,
    onClick,
    focusHandler = noop,
    showAttributes = true
  } = props;

	const { t } = useI18n();
	const price = hit?.price?.startingPrice?.amount ? `${hit.price.startingPrice.currency} ${parseFloat(hit.price.startingPrice.amount)}` : "N/A";
  const attrs = showAttributes && hit.attribute_values.filter((attr) => (
    attr.attribute && allowedAttributes.includes(Number(attr.attribute.id || 0))
  ));

  const handleClick = useCallback(() => {
    onClick(hit.url);
  }, [hit.url, onClick]);

	return (
		<div className={styles.container} onClick={handleClick}>
			<div className={styles.activity}>
				<div className={styles.teaserImage} onClick={focusHandler}>
					<StaticImage
            width="220"
            height="220"
            alt={hit.title}
            layout="responsive"
            src={hit.teaser_image || ''}
          />
				</div>
				<div className={styles.body}>
					<div className={styles.body__main}>
						<div className={styles.title}>
							<Highlight hit={hit} attribute="title" />
						</div>
						<div className={styles.attributes}>
							{attrs && attrs.map((attr) => (
								<span key={attr.id}>{attr.value}</span>
							))}
						</div>
					</div>
          <div className={styles.footer}>
            <div className={styles.teaser}><Highlight hit={hit} attribute="teaser" /></div>
            <div className={styles.info}>
              <div className={styles.info__price}>
                <div className={styles.priceFrom}>{t("search.card.from")}</div>
                <div className={styles.priceValue}>{price}</div>
                <span className={styles.person}>{t('search.card.person')}</span>
              </div>
            </div>
          </div>
				</div>
			</div>
		</div>
	);
};

export default HitActivities;
