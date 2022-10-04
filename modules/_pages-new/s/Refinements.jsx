import { connectRefinementList, RatingMenu } from "react-instantsearch-dom";
import React from "react";
import { RefinementCheckbox } from "./RefinementCheckbox";
import { RefinementHeader } from "./RefinementHeader";

const Refinements = connectRefinementList(
  ({ items, refine, icon, title, attribute }) => {
    return (
      items.length >= 1 && (
        <div>
          <RefinementHeader title={title} icon={icon} />
          <ul className={`space-y-2`}>
            {attribute === "ratingRounded" ? (
              <RatingMenu
                attribute={attribute}
                translations={{
                  ratingLabel: "und höher",
                }}
              />
            ) : (
              items.map((item) => {
                return (
                  item.count >= 1 && (
                    <RefinementCheckbox
                      key={item.value}
                      item={item}
                      refine={refine}
                    />
                  )
                );
              })
            )}
          </ul>
        </div>
      )
    );
  }
);

export default React.memo(Refinements);
