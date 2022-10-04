import React from "react";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";

import styles from "./styles.module.scss";
const LoadingPlaceholder = () => <p>Loading...</p>;

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  loading: LoadingPlaceholder
});

const ListingMedia = ({ mediaLink, isPlayerActive }) => {
  const isYoutube = mediaLink.match(
    /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\//gmi
  );

  if (isYoutube) {
    return (
      <div className={styles.playerWrapper}>
        <ReactPlayer url={mediaLink} className={styles.player} light={true}/>
      </div>
    );
  }

  return <iframe src={mediaLink} frameBorder="0" className={styles.mediaIframe} />;
}

export default React.memo(ListingMedia);