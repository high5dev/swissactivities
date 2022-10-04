import { SortBy } from "react-instantsearch-dom";
import { useI18n } from "next-localization";
import classNames from "classnames";

export const Sort = ({ hide }) => {
  const index = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}_ACTIVITIES`;
  const { t } = useI18n();

  return (
    <div
      className={classNames(`flex items-center`, {
        hidden: hide,
      })}
    >
      <span className={`mr-4 font-medium text-gray-900`}>
        {t("filter.sort.index")}:
      </span>
      <SortBy
        defaultRefinement={`${index}_popularity_desc`}
        items={[
          {
            value: `${index}`,
            label: t("filter.sort.relevance"),
          },
          {
            value: `${index}_popularity_desc`,
            label: t("filter.sort.popularityDesc"),
          },
          {
            value: `${index}_rating_desc`,
            label: t("filter.sort.ratingDesc"),
          },
          {
            value: `${index}_price_desc`,
            label: t("filter.sort.priceDesc"),
          },
          {
            value: `${index}_price_asc`,
            label: t("filter.sort.priceAsc"),
          },
        ]}
      />
    </div>
  );
};
