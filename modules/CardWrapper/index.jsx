import React from "react";
import classnames from "classnames";

import styles from "./styles.module.scss";

const CardWrapper = ({ children, className }) => {
  return (
    <div className={classnames(styles.wrapper, className)}>{children}</div>
  );
};

export default CardWrapper;
