/* eslint-disable */
//TODO remove img
import React from "react";
import styles from "./styles.module.scss";

const Post = ({ isLast = false }) => {
  return (
    <div
      className={styles.postContent}
      style={{
        borderBottom: !isLast ? "1px solid RGBA(0, 0, 0, 0.1)" : "none",
      }}
    >
      <div className={styles.postImage}>
        <img src="/assets/activities/post.png" alt="Post" />
      </div>
      <div className={styles.description}>
        <div>Paragliding in Bern | Tandemflug von der First</div>
        <div className={styles.details}>
          <span className={styles.from}>from</span>
          <span className={styles.price}>200.00</span>
          <span className={styles.currency}>CHF</span>
          <li className={styles.benefit}>Free cancellation</li>
        </div>
      </div>
    </div>
  );
};

export default Post;
