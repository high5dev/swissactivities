import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";
import { BsHeart, BsHeartFill, BsBoxArrowUp } from "react-icons/bs";

import ShareButtons from "../ShareButtons";
import styles from "./styles.module.scss";

const ControlButtons = ({
  favoriteLocalstorageKey,
  itemToSave,
  shareUrl,
  title,
  className
}) => {
  const { t, locale } = useI18n();
  const shareRef = useRef(null);
  const shareButton = useRef(null);
  const [isFavorite, setFavorite] = useState(false);
  const [isShareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (isShareOpen) {
      document.addEventListener("click", handleOutsideClick, true);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, [shareRef, shareButton, isShareOpen]);

  useEffect(() => {
    if (window?.localStorage && itemToSave) {
      const savedItems = JSON.parse(
        window.localStorage.getItem(favoriteLocalstorageKey)
      );

      if (savedItems?.length) {
        const isSaved = savedItems.filter(item => !!item).find(saved => saved.id === itemToSave.id);

        setFavorite(!!isSaved);
      }
    }
  }, []);

  const handleOutsideClick = e => {
    if (
      !e?.path?.includes(shareRef.current) &&
      !e?.path?.includes(shareButton.current)
    ) {
      setShareOpen(false);
    }
  };

  const toggleShare = () => {
    setShareOpen(prev => !prev);
  };

  const toggleFavorite = () => {
    if (window?.localStorage) {
      try {
        const savedItems = JSON.parse(localStorage.getItem(favoriteLocalstorageKey));
        if (savedItems?.length && isFavorite) {
          setFavorite(false);

          return localStorage.setItem(
            favoriteLocalstorageKey,
            JSON.stringify(savedItems.filter(act => act.id !== itemToSave.id))
          );
        }

        saveItems(savedItems || [], itemToSave);
      } catch (e) {
        console.log("remove err =", e);
      }
    }
  };

  const saveItems = (savedItems, itemToSave) => {
    if (savedItems) {
      if (!savedItems.find(saved => saved.id === itemToSave.id)) {
        savedItems.push(itemToSave);
      }

      localStorage.setItem(favoriteLocalstorageKey, JSON.stringify(savedItems));
    } else {
      localStorage.setItem(favoriteLocalstorageKey, JSON.stringify([itemToSave]));
    }

    setFavorite(true);
  };

  return (
        <div className={classnames(styles.controlButtons, className)}>
          <div className={styles.controlContent}>
            <button
              className={styles.button}
              onClick={toggleShare}
              ref={shareButton}
            >
              <BsBoxArrowUp size={24} className={styles.icon} />
              <span className={styles.buttonText}>{t("activity.share")}</span>
            </button>
            {isShareOpen && (
              <div className={styles.sharePopup} ref={shareRef}>
                <ShareButtons
                  shareUrl={shareUrl}
                  title={title}
                />
              </div>
            )}
            <button className={styles.button} onClick={toggleFavorite}>
              {isFavorite ? (
                <BsHeartFill size={24} color="#FF385C" />
              ) : (
                <BsHeart size={24} className={styles.icon} />
              )}
              {!isFavorite && (
                <span className={styles.buttonText}>{t("activity.save")}</span>
              )}
            </button>
          </div>
        </div>
  );
};

export default ControlButtons;
