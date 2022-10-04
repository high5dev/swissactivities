import React, {useState} from "react";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";

import styles from "./styles.module.scss";
const LoadingPlaceholder = () => <p>Loading...</p>;

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  loading: LoadingPlaceholder
});

const YoutubePlayer = ({ url }) => {
  const [isActive, setActive] = useState(false);

    return (
      <div className={styles.playerWrapper}>
        <ReactPlayer url={url} className={styles.player} light={true} />
      </div>
    );

}

export default React.memo(YoutubePlayer);