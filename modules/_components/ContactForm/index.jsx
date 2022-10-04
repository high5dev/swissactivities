import { useState } from "react";
import { useI18n } from "next-localization";
import { Text } from "../Text";
import { Input } from "../Form/Input";
import Button from "../Button";
import { Textarea } from "../Form/Textarea";

export default function ContactForm({ isPopup, pageTitle }) {
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

  const handleInput = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors({ ...errors, [field]: false, formError: false });
  };

  const validate = () => {
    const entries = Object.entries(validatorList);

    const validationResult = entries.map(([fieldKey, validator]) => {
      const result = validator(data[fieldKey]);
      setErrors((prev) => ({ ...prev, [fieldKey]: !result }));

      return result;
    });

    return validationResult.filter((res) => !res).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validate();
    if (validationErrors) {
      return setLoading(false);
    }

    setErrors((prev) => ({ ...prev, formError: false }));
    const mailData = data;
    if (pageTitle) {
      mailData.subject = `${pageTitle} - ${data.subject}`;
    }

    try {
      const res = await fetch("/api/sendgrid", {
        body: JSON.stringify({ ...mailData, locale: locale() }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = await res.json();

      if (result.error) {
        console.log(result.error);
        setErrors((prev) => ({ ...prev, formError: true }));
        setLoading(false);
        return;
      }

      setFinished(true);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setErrors((prev) => ({ ...prev, formError: true }));
      setLoading(false);
    }
  };

  if (finished) {
    return (
      <Text as="h2" size="md">
        {t("contactThankYou.title")}
      </Text>
    );
  }

  return (
    <div>
      <Text as="h2" size="md" className="mb">
        {isPopup ? t("contactPopup.modalTitle") : t("activity.question")}
      </Text>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col space-y-3`}
        id="contact-us"
      >
        <Input
          value={data.fullname}
          onInput={handleInput}
          placeholder={t("contactForm.fullname")}
          name="fullname"
          errors={errors}
          title={t("contactForm.fullname")}
          required
        />
        <Input
          value={data.email}
          onInput={handleInput}
          placeholder={t("contactForm.email")}
          name="email"
          errors={errors}
          title={t("contactForm.email")}
          required
        />
        <Input
          value={data.subject}
          onInput={handleInput}
          placeholder={t("contactForm.subject")}
          name="subject"
          errors={errors}
          title={t("contactForm.subject")}
          required
        />
        <Textarea
          name="message"
          value={data.message}
          onInput={handleInput}
          placeholder={t("contactForm.messagePlaceholder")}
          className={`min-h-[120px]`}
        />

        <Button
          form="contact-us"
          type="primary"
          className={`!mt-4 max-h-[48px]`}
          loading={loading}
          submit
        >
          {t("contactForm.submit")}
        </Button>
        <span className={`text-sm text-red-500`}>
          {errors.formError && t("contactForm.formError")}
        </span>
      </form>
    </div>
  );
}
