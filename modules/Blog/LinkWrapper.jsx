import React from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import Link from "next/link";

import styles from "./styles.module.scss";

const LinkWrapper = ({ href, className, children }) => {
  const { t, locale } = useI18n();

  return (
    <Link href={href}>
      <a className={classnames(styles.link, className)} >
        {children}
      </a>
    </Link>
  );
};

export default LinkWrapper;
