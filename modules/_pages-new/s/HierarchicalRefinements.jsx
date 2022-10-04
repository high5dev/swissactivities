import { connectHierarchicalMenu } from "react-instantsearch-dom";
import { RefinementHeader } from "./RefinementHeader";
import { RefinementCheckbox } from "./RefinementCheckbox";
import classNames from "classnames";

const Refinements = ({ items, refine, icon, title, header = true }) => {
  return (
    items.length >= 1 && (
      <div>
        {header && <RefinementHeader title={title} icon={icon} />}
        <ul className={`relative space-y-2`}>
          {!header && (
            <span
              className={`absolute left-2 h-[calc(100%-9px)] w-[2px] rounded-full bg-gray-300`}
            />
          )}
          {items.map((item) => {
            return (
              item.count >= 1 && [
                <div
                  key={item.value}
                  className={classNames(`relative`, { "pl-8": !header })}
                >
                  {!header && (
                    <span
                      className={`absolute left-2 top-1/2 h-[2px] w-4 -translate-y-1/2 rounded-full bg-gray-300`}
                    />
                  )}
                  <RefinementCheckbox item={item} refine={refine} radio />
                </div>,
                item.items && item.items.length >= 2 && (
                  <Refinements
                    items={item.items}
                    refine={refine}
                    header={false}
                  />
                ),
              ]
            );
          })}
        </ul>
      </div>
    )
  );
};

export const HierarchicalRefinements = connectHierarchicalMenu(Refinements);
