import { connectHits } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';
import { useI18n } from 'next-localization';
import Link from 'next/link';
import StaticImage from "../Image";
import styles from './styles.module.scss';

const ListingsRedesigned = (({hits= [], focusHandler}) => {
    const { t } = useI18n();

    if (!hits.length) {
        return '';
    }

    const getDescriptionAttribute = (hit) => {
        const match = hit._highlightResult;
        if (match.teaser?.matchLevel === "full") {
            return "teaser";
        } else if (match.text?.some(({text}) => text.matchLevel === "full")) {
            const highlightedIndex = match.text?.map(({text}) => text.matchLevel).indexOf("full")
            return `text[${highlightedIndex}].text`;
        }
        return "teaser";
    }

    return (
        <div className={styles.container}>
            <h3>{t('listing.title')}</h3>
            {hits.map(hit =>
                    <Link key={hit.objectID} href={hit.url}>
                        <div onClick={focusHandler}>
                            <div className={styles.block}>
                                <StaticImage src={hit.teaser_image || ' '} width="516" height="215" alt={hit.title} layout="fixed"/>
                                <div className={styles.title}>
                                    <Highlight hit={hit} attribute="title"/>
                                </div>
                            </div>
                            <div className={styles.description}>
                                <Highlight hit={hit} attribute={getDescriptionAttribute(hit)} />
                            </div>
                        </div>
                    </Link>
            )}
        </div>
    )
});

export default connectHits(ListingsRedesigned);
