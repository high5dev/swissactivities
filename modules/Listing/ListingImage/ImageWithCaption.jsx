import React from "react";
import dynamic from "next/dynamic";

import styles from "./styles.module.scss";
import StaticImage from "../../Image";


const ImageWithCaption = props => {
  return (
    <div className={styles.imageContainer}>
      <StaticImage
        src={props.src}
        alt={props.alt}
        layout="responsive"
        quality={40}
        width={650}
        height={400}
      />
      <span className={styles.caption}>
      {props.caption || props.name}
      </span>
    </div>
  );
};

export default React.memo(ImageWithCaption)