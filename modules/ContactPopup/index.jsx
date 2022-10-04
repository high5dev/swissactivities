import React, { useState } from "react";
import classnames from 'classnames';
import { useI18n } from "next-localization";
import { BsX } from "react-icons/bs";

import ContactForm from "../ContactUs/ContactForm";
import Button from "../../modules/Button";
import Image from "../../modules/Image";
import Modal from "../../modules/Modal";

import styles from "./styles.module.scss";

export default function ContactPopup(props) {
  const { title, subTitle, pageTitle, isBadge, className } = props;
  const [ isFormOpen, setFormOpen ] = useState(false);
  const { t, locale } = useI18n();

  const onClose = () => {
    setFormOpen(false);
  }
  const handleOpen = () => {
    setFormOpen(true);
  }

  return (
    <div className={classnames(styles.contactForm, className)}>
      <div className={styles.icon}>
        <Image src="/assets/contact.svg" alt="contact" width={80} height={80} />
      </div>
      <div className={styles.title}>
        <h2>{t("contactPopup.title")}</h2>
        <h3>{t("contactPopup.subTitle")}</h3>
      </div>
      <div className={styles.control}>
        <Button title={t("contactPopup.message")} onClick={handleOpen} />
        <Button
          title={t("contactPopup.chat")}
          customStyle={styles.whiteButton}
          onClick={() => $crisp.push(['do', 'chat:open'])}
        />
      </div>
      <Modal
        open={isFormOpen}
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
        <div className={styles.modalBody}>
          <ContactForm onClose={onClose} pageTitle={pageTitle} isPopup/>
        </div>
      </Modal>
    </div>
  );
}
