import React, { useState } from "react";
import classnames from "classnames";
import { useI18n } from "next-localization";

import ContactUsInputField from "./ContactUsInputField";
import ContactThankYou from "./ContactThankYou";
import Loading from "../Loading";
import Button from "../Button";

import styles from "./styles.module.scss";

export default function ContactForm({ onClose, isPopup, pageTitle }) {
  const { t, locale } = useI18n();
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const required = (field) => !!field;
  const validateEmail = (value) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(value);
  };

  const validatorList = {
    fullname: required,
    email: validateEmail,
    subject: required,
    message: required,
  };

  const handleInput = e => {
    const field = e.target.name;
    const value = e.target.value;
    setData(prev => ({ ...prev, [field]: value }));
    setErrors({ ...errors, [field]: false, formError: false });
  };

  const validate = () => {
    const entries = Object.entries(validatorList);

    const validationResult = entries.map(([fieldKey, validator]) => {
      const result = validator(data[fieldKey])
      setErrors((prev) => ({...prev, [fieldKey]: !result}));

      return result; //return true if validation passed
    })

    return validationResult.filter(res => !res).length; // check failed validators
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validate();
    if(validationErrors) {
      return setLoading(false);
    }

    setErrors((prev) => ({...prev, formError: false }));
    const mailData = data;
    if(pageTitle) {
      mailData.subject = `${pageTitle} - ${data.subject}`;
    }

    try {
      const res = await fetch("/api/sendgrid", {
        body: JSON.stringify({...mailData, locale: locale(), }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const result = await res.json();

      if (result.error) {
        console.log(result.error);
        setErrors((prev) => ({...prev, formError: true }));
        setLoading(false)
        return;
      }

      setFinished(true)
      setLoading(false)
    } catch (e) {
      console.log(e);
      setErrors((prev) => ({...prev, formError: true }));
      setLoading(false)
    }
  };

  const handleClose = () => {
    setFinished(false);
  }

  if(finished) {
    return <ContactThankYou onClose={onClose || handleClose}/>
  }

  return (
    <>
    <h2 className={classnames(styles.title, {[styles.small]: !isPopup})}>{isPopup ? t("contactPopup.modalTitle") : t("activity.question")}</h2>
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <ContactUsInputField
        value={data.fullname}
        onInput={handleInput}
        placeholder={t("contactForm.fullname")}
        name="fullname"
        errors={errors}
        title={t("contactForm.fullname")}
        required
      />
      <ContactUsInputField
        value={data.email}
        onInput={handleInput}
        placeholder={t("contactForm.email")}
        name="email"
        errors={errors}
        title={t("contactForm.email")}
        required
      />
      <ContactUsInputField
        value={data.subject}
        onInput={handleInput}
        placeholder={t("contactForm.subject")}
        name="subject"
        errors={errors}
        title={t("contactForm.subject")}
        required
      />
      <label className={styles.messageRow}>
        <textarea
          className={classnames(styles.messageField, {[styles.errorField]: errors.message })}
          name="message"
          value={data.message}
          onInput={handleInput}
          placeholder={t("contactForm.messagePlaceholder")}
        />
      </label>
      <br />

      <Button type="submit" title={t("contactForm.submit")} customStyle={styles.submitButton} />
      <span className={styles.error}>{errors.formError && t("contactForm.formError")}</span>
      {loading && (
        <Loading
          type="spin"
          color="#8b8b8b"
          width="100px"
          height="100px"
          className={styles.loader}
        />
      )}
    </form>
    </>
  );
}
