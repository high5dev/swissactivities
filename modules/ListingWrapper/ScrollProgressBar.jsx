import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  const scrolling = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (height > 0) {
      setProgress(Math.min(Math.floor(scrolled) / 100));
    }
  };

  useEffect(() => {
    try {
      window.addEventListener("scroll", scrolling);
    } catch (oError) {
      console.log(oError);
    }
    return () => {
      try {
        window.removeEventListener("scroll", scrolling);
      } catch (oError) {
        console.log(oError);
      }
    };
  }, []);

  return (
    <div className={styles.scrollProgressBar}>
      <div
        className={styles.scrollProgress}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
