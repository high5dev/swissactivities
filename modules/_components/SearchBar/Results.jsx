import React from "react";
import classNames from "classnames";
import {
  Configure,
  connectHits,
  connectStateResults,
  Index,
} from "react-instantsearch-dom";
import { Hit } from "./Hit";
import { FaList, FaMapPin, FaMapSigns, FaSnowboarding } from "react-icons/fa";
import { Hits } from "./Hits";
import { useI18n } from "next-localization";
import SeeAllResults from "./SeeAllResults";
import Suggestions from "./Suggestions";

const Results = ({ isHeader, meta }) => {
  const { t } = useI18n();

  const IndexResults = connectStateResults(
    ({ searchResults, children }) =>
      searchResults && searchResults.nbHits !== 0 && children
  );

  const CustomHits = connectHits(Hits);

  return (
    <div
      id="search-results"
      className={classNames(
        "space-y-6 overflow-y-auto overflow-x-hidden bg-white lg:absolute lg:left-[-4px] lg:-bottom-3 lg:grid lg:hidden lg:w-[calc(100%+8px)] lg:min-w-[900px] lg:translate-y-full lg:transform lg:grid-cols-3 lg:space-y-0 lg:divide-x lg:divide-solid lg:divide-gray-200 lg:rounded-lg lg:border lg:border-solid lg:border-gray-200 lg:shadow-lg xl:min-w-[1000px]",
        {
          "lg:left-1/2 lg:w-screen lg:max-w-screen-md lg:-translate-x-1/2 xl:max-w-screen-lg":
            isHeader,
        }
      )}
    >
      <Suggestions />
      <Index
        indexName={`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}_ACTIVITIES_popularity_desc`}
      >
        <Configure
          hitsPerPage={6}
          filters={`locale: ${meta.locale} AND priceNumber > 0`}
        />
        <IndexResults>
          <CustomHits
            hitComponent={Hit}
            title={t("filter.activities")}
            icon={<FaSnowboarding />}
            type={"activity"}
          />
        </IndexResults>
      </Index>

      <Index
        indexName={`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}_LISTINGS`}
      >
        <Configure hitsPerPage={6} filters={`locale: ${meta.locale}`} />
        <IndexResults>
          <CustomHits
            hitComponent={Hit}
            title={t("search.listing")}
            icon={<FaMapSigns />}
          />
        </IndexResults>
      </Index>

      <div
        style={{
          borderTop: "none",
          borderBottom: "none",
        }}
      >
        <Index
          indexName={`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}_CATEGORIES`}
          indexId="cat_location"
        >
          <Configure
            hitsPerPage={4}
            filters={`locale:${meta.locale} AND type:location`}
          />
          <IndexResults>
            <CustomHits
              hitComponent={Hit}
              title={t("filter.location")}
              icon={<FaMapPin />}
            />
          </IndexResults>
        </Index>
        <Index
          indexName={`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}_CATEGORIES`}
          indexId="cat_type"
        >
          <Configure
            hitsPerPage={4}
            filters={`locale:${meta.locale} AND type:type`}
          />
          <IndexResults>
            <CustomHits
              hitComponent={Hit}
              title={t("booking.category")}
              icon={<FaList />}
            />
          </IndexResults>
        </Index>
      </div>
      <div className={"col-span-3 hidden w-full !border-none lg:block"}>
        <SeeAllResults meta={meta} />
      </div>
    </div>
  );
};

export default React.memo(Results);
