import React from "react";
import TreeView from "react-treeview";
import classnames from "classnames";

const ListingTreeView = ({ data  }) => {
  return (
    <div>
      {data.map((node, i) => {
        const label = (
          <div
            className="tree-view_node"
          >
            <a href={`#-${node.info.slug}`}>
              <div className="tree-node-content">
                <span>{node.info.title}</span>
              </div>
            </a>
          </div>
        );
        return node.children.length > 0 ? (
          <TreeView
            key={`${node.info.slug}-${i}`}
            nodeLabel={label}
            itemClassName="listing_tree"
            defaultCollapsed={false}
          >
            {node.children.map((child1, j) => {
              const level1 = (
                <div
                  className="tree-view_node"
                >
                <a href={`#-${child1.info.slug}`}>
                  <div className={classnames("tree-node-content", {"has_no_child" : (!child1.children || child1.children.length < 1) })}>
                    <span>{child1.info.title}</span>
                  </div>
                  </a>
                </div>
              );
              return child1.children && child1.children.length > 0 ? (
                <TreeView
                  nodeLabel={level1}
                  key={`${child1.info.slug}-${j}`}
                  itemClassName="listing_tree"
                  defaultCollapsed={false}
                >
                  {child1.children.map((child2, k) => {
                    return (
                      <div
                        key={`${child2.info.slug}-${k}`}
                        className="tree-view_node"
                      >
                      <a href={`#-${child2.info.slug}`}>
                        <div className="tree-node-content">
                          <span>{child2.info.title}</span>
                        </div>
                        </a>
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

export default ListingTreeView;
