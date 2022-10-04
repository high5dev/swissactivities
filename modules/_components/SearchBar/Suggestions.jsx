import {
  Configure,
  connectStateResults,
  connectHits,
  Index,
} from "react-instantsearch-dom";
import React, { useEffect, useState } from "react";
import { useI18n } from "next-localization";

const Results = connectHits(({ hits, tags }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    if (hits.length === 10) {
      setElements(elements);
    }
  }, [hits]);

  return (
    tags &&
    elements.length === 10 && (
      <div>
        {elements.map((item) => {
          return item.query;
        })}
      </div>
    )
  );
});

const Suggestions = connectStateResults(({ searchResults }) => {
  const { t } = useI18n();

  /*
    const Res = (tags) => {
      return (
        <Index indexName={`prd_ACTIVITIES_query_suggestions`}>
          <Configure hitsPerPage={10} />
          <Results tags={tags} />
        </Index>
      );
    };
     */

  return (
    <>
      {searchResults && searchResults.nbHits === 0 && (
        <div className={`px-5 py-4 lg:px-7`}>
          <span className={`text-base font-medium text-gray-900 `}>
            {t("filter.noResults")}.
          </span>
        </div>
      )}
    </>
  );
});

export default Suggestions;
