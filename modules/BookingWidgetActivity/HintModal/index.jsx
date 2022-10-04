import React from "react";
import { BsX } from "react-icons/bs";
import { useI18n } from "next-localization";

import Modal from "../../Modal";
import styles from "./styles.module.scss";

export default function HintModal({ open, onClose }) {
  const { t, locale } = useI18n();

  return (
    <Modal
      open={open}
      onClose={onClose}
      classes={{
        modalContainer: styles.modalContainer,
        modal: styles.modal
      }}
    >
      <div className={styles.header}>
        <button onClick={onClose} className={styles.close}>
          <BsX />
        </button>
      </div>
      <div className={styles.body}>
        <h1 className={styles.title}>
          {t("activity.widget.reservePopup.title")}
        </h1>
        <p>{t("activity.widget.reservePopup.description")}</p>
        <h2 className={styles.subTitle}>
          {t("activity.widget.reservePopup.listTitle")}
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span className={styles.listMark}>1</span>
            <span className={styles.listText}>
              {t("activity.widget.reservePopup.listOffer")}
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.listMark}>2</span>
            <span className={styles.listText}>
              {t("activity.widget.reservePopup.listComplete")}
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.listMark}>3</span>
            <span className={styles.listText}>
              {t("activity.widget.reservePopup.listInformation")}
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.listMark}>4</span>
            <span className={styles.listText}>
              {t("activity.widget.reservePopup.listConfirmation")}
            </span>
          </li>
        </ul>
      </div>
    </Modal>
  );
}
