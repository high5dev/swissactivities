import { Activity } from "../../_components/Activity";
import { connectInfiniteHits } from "react-instantsearch-dom";
import { useI18n } from "next-localization";
import React from "react";
import Button from "../../_components/Button";

const Hits = connectInfiniteHits(
  ({ hits, type, refineNext, hasMore, loadMore = true }) => {
    const { t } = useI18n();

    return (
      hits.length >= 1 && (
        <div className={`flex flex-col`}>
          <ul className={`space-y-6`}>
            {hits.map((hit) => (
              <Activity key={hit.objectID} hit={hit} type={type} />
            ))}
          </ul>
          {hasMore && loadMore && (
            <Button
              type="primary"
              className={`mx-auto mt-12`}
              onClick={refineNext}
            >
              {t("search.viewMore")}
            </Button>
          )}
        </div>
      )
    );
  }
);

export default React.memo(Hits);
