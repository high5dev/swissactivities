import React from "react";
import classnames from "classnames";

import MobileCollapsableWrapper from "../../MobileCollapsableWrapper";

import styles from "./styles.module.scss";

const BlogSection = ({ title, description, children, contentClassName }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <MobileCollapsableWrapper className={styles.descriptionWrapper}>
        <p className={styles.description}>{description}</p>
      </MobileCollapsableWrapper>
      <div className={classnames(styles.sectionContent, contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export default BlogSection;
