import React, { useEffect } from "react";
import classnames from "classnames";

import Usps from "../../../Usps";
import styles from "./styles.module.scss";

const UspsSection = (props) => {
  return (
    <div className={styles.uspsSection}>
      <Usps {...props} uspClassName={styles.usp} className={styles.uspsContent} darkText/>
    </div>
  );
};

export default UspsSection;
