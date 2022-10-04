import React, { useEffect, useRef } from "react";
import classnames from "classnames";

import styles from "./styles.module.scss";

const ListingHeading = ({ level, children, observer }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref && observer && ref.current && level <= 3) {
      observer.observe(ref.current);
    }
  }, [ref, observer, children, level]);

  //return null if there is empty heading
  if (children.length < 1) {
    return null;
  }

  const heading = children[0].props.value;
  let anchor = typeof heading === "string" ? heading.toLowerCase() : "";

  anchor = anchor.replace(/[^a-zA-Z0-9 ]/g, "");
  anchor = anchor.replace(/ /g, "-");

  const container = children => (
    <span id={anchor} className={styles.headingAnchor} ref={ref}>
      {children}
    </span>
  );

  switch (level) {
    case 1:
      return <h1>{container(children)}</h1>;
    case 2:
      return <h2>{container(children)}</h2>;
    case 3:
      return <h3>{container(children)}</h3>;

    default:
      return <h4>{children}</h4>;
  }
};

export default ListingHeading;
