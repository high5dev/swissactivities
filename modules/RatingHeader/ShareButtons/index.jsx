import React from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  RedditIcon,
  EmailIcon
} from "react-share";
import { useI18n } from "next-localization";
import { FiCopy } from "react-icons/fi";

import styles from "./styles.module.scss";

const ShareButtons = ({ shareUrl, title, isOpen }) => {
  const { t, locale } = useI18n();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className={styles.shareContainer}>
      <FacebookShareButton
        url={shareUrl}
        quote={title}
        className={styles.shareButton}
      >
        <FacebookIcon size={30} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={shareUrl}
        quote={title}
        className={styles.shareButton}
      >
        <TwitterIcon size={30} round />
      </TwitterShareButton>
      <EmailShareButton
        url={shareUrl}
        quote={title}
        className={styles.shareButton}
      >
        <EmailIcon size={30} round />
      </EmailShareButton>
      <RedditShareButton
        url={shareUrl}
        quote={title}
        className={styles.shareButton}
      >
        <RedditIcon size={30} round />
      </RedditShareButton>
      <TelegramShareButton
        url={shareUrl}
        quote={title}
        className={styles.shareButton}
      >
        <TelegramIcon size={30} round />
      </TelegramShareButton>
      <button className={styles.copyButton} onClick={copyToClipboard}>
        <FiCopy size={16} color="#fff" />
      </button>
    </div>
  );
};

export default ShareButtons;
