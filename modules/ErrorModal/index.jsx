import React from "react";
import { BsX } from "react-icons/bs";

import Icon from "../Icon";
import Modal from "../Modal";
import styles from "./styles.module.scss";

export default function ErrorModal({ open, onClose, children }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      classes={{
        modalContainer: styles.errorModalContainer,
        modal: styles.errorModal
      }}
    >
      <div className={styles.errorHeader}>
        <button onClick={onClose} className={styles.errorClose}>
          <Icon icon={<BsX />} color="#3B3B3B" height={30} />
        </button>
      </div>
      <div className={styles.errorBox}>{children}</div>
    </Modal>
  );
}
