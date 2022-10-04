import React from "react";
import StaticImage from "../Image";
import styles from "./styles.module.scss";

const HeadFilterSection = props => {
  const { children, alt, image, className } = props;
  return (
    <>
      <div className={styles.filterBlock}>
        {image && (
          <StaticImage alt={alt || "back img"} src={image} layout="fill" />
        )}
      </div>
      <div className={`container-new ${styles.categoryDetailsWrap} ${className}`}>
        {children}
      </div>
    </>
  );
};

export default HeadFilterSection;
