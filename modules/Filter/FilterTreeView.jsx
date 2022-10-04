import React, { useCallback } from "react";
import TreeView from "react-treeview";
import classnames from "classnames";
import Link from "next/link";

const FilterTreeView = ({ data, selected, isReverse = false, goToPage }) => {
  const type = isReverse ? 'type' : 'location';
  const makeHref = useCallback((item) => goToPage(item, type), [goToPage, type]);
  const hasSelected = useCallback((item) => {
    if (!selected) {
      return false;
    }
    return item.id === selected.id || (item.children || []).some(hasSelected);
  }, [selected]);

  return (
    <div>
      {data.map((node) => {
        const label = (
          <div
            key={`tree-node-${node.id}`}
            className={classnames("tree-view_node", {
              active: selected && selected.id === node.id,
            })}
          >
            <Link href={makeHref(node)} scroll={false} passHref>
              <a className="tree-node-content">
                <span>{node.title}</span>
                {!isReverse && (
                  <span className="activities-number">
                    {node.numActivities}
                  </span>
                )}
              </a>
            </Link>
          </div>
        );
        const collapsedStatus = !hasSelected(node);

        return node.children.length > 0 ? (
          <TreeView
            key={`${node.slug}-${node.id}`}
            nodeLabel={label}
            collapsed={collapsedStatus}
            itemClassName={`filter_tree ${isReverse ? "reverse-order" : ""}`}
          >
            {node.children.map((child1, j) => {
              const level1 = (
                <div
                  key={j}
                  className={classnames("tree-view_node", {
                    active: selected && selected.id === child1.id,
                  })}
                >
                  <Link scroll={false} href={makeHref(child1)} passHref>
                    <a className="tree-node-content">
                      <span>{child1.title}</span>
                      <span className="activities-number">
                        {child1.numActivities}
                      </span>
                    </a>
                  </Link>
                </div>
              );
              return child1.children && child1.children.length > 0 ? (
                <TreeView
                  nodeLabel={level1}
                  key={`${child1.slug}-${child1.id}`}
                  itemClassName={classnames('filter_tree', isReverse && 'reverse-order')}
                  defaultCollapsed={
                    !child1.children.find(
                      (el) => selected && el.id === selected.id
                    )
                  }
                >
                  {child1.children.map((child2) => {
                    return (
                      <div
                        key={`${child2.slug}-${child2.id}`}
                        className={classnames("tree-view_node", {
                          active: selected === child2.slug,
                        })}
                      >
                        <Link href={makeHref(child2)} passHref>
                          <a className="tree-node-content">
                            <span>{child2.title}</span>
                            <span className="activities-number">
                              {child2.numActivities}
                            </span>
                          </a>
                        </Link>
                      </div>
                    );
                  })}
                </TreeView>
              ) : (
                level1
              );
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
