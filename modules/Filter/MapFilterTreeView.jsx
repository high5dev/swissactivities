import React from "react";
import TreeView from "react-treeview";
import classnames from "classnames";

const FilterTreeView = ({ nodes, location, locale, onLocationChange }) => {
  return (
    <div>
      {nodes.map((node, i) => {
        const label = (
          <div
            className={classnames("tree-view_node", {
              active: location === node.slug,
            })}
            onClick={() => onLocationChange(node.slug)}
          >
            <span>
              {`${node.title} (${node.count})`}
            </span>
          </div>
        );
        return node.children.length > 0 ? (
          <TreeView
            key={`${node.slug}-${i}`}
            nodeLabel={label}
            defaultCollapsed={!location || node.slug !== location}
          >
            {node.children.map((child1, j) => {
              const level1 = (
                <div
                  className={classnames("tree-view_node", {
                    active: location === child1.slug,
                  })}
                  onClick={() => onLocationChange(child1.slug)}
                >
                  <span>
                    {`${child1.title} (${child1.count})`}
                  </span>
                </div>
              );
              return child1.children && child1.children.length > 0 ? (
                <TreeView
                  nodeLabel={level1}
                  key={`${child1.slug}-${j}`}
                  defaultCollapsed={!child1.children.find(el => el.slug === location)}
                >
                  {child1.children.map((child2, k) => {
                    return (
                      <div
                        key={`${child2.slug}-${k}`}
                        className={classnames("tree-view_node", {
                          active: location === child2.slug,
                        })}
                        onClick={() => onLocationChange(child2.slug)}
                      >
                        <span>
                          {`${child2.title} (${child2.count})`}
                        </span>
                      </div>
                    );
                  })}
                </TreeView>
              ) : (
                level1
              )
            })}
          </TreeView>
        ) : (
          label
        );
      })}
    </div>
  );
};

export default FilterTreeView;
