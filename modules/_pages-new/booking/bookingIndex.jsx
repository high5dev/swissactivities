import { useEffect, useRef, useState } from "react";
import { BiLockAlt } from "react-icons/bi";
import Link from "next/link";
import { useI18n } from "next-localization";
import { useRouter } from "next/router";

import {
  checkout,
  getCart,
  getRebate,
  postPaymentAttempts,
  updateCart,
} from "../../../services/bookingServices";
import { getPageUrl, getParams } from "../../../services/contentServices";

import Layout from "../../_components/Layout";
import Image from "../../Image";
import Faq from "../../_components/Faq";
import countryList from "../../../data/constants/countryList";
import { Summary } from "../../_components/Booking/Summary";
import { Text } from "../../_components/Text";
import classNames from "classnames";
import classnames from "classnames";
import { Input } from "../../_components/Form/Input";
import styles from "./styles.module.scss";
import ReactSelect from "../../_components/Form/ReactSelect";
import Button from "../../_components/Button";
import { LoaderScreen } from "../../_components/Loader/LoaderScreen";
import { Loader } from "../../_components/Loader";
import { Modal } from "../../_components/Modal";
import { FaArrowRight } from "react-icons/fa";
import { Card } from "../../_components/Card";
import { Basket } from "../basket";
import { BreadcrumbsBasket } from "../../_components/Breadcrumbs/Basket";
import { BottomBar } from "../../_components/BottomBar";
import Accordion from "../../_components/Accordion";
import { dataLayerSend } from "../../../utils/dataLayerSend";
import { Phone } from "../../_components/Form/Phone";
import * as services from "../../../services/contentServices";

const defaultGuest = {
  fullName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  country: "",
};

const CardAccordion = ({ title, payment, onClick, value, currentValue }) => {
  const isActive = value === currentValue;
  const handleClick = () => {
    onClick(value);
  };

  return (
    <div className={styles.cardAccordion}>
      <div className={styles.accordionTitle} onClick={handleClick}>
        <span className={styles.accordionTitleContainer}>
          <div className={styles.outerLine}>
            <div
              className={classnames(styles.inner, {
                [styles.hidden]: isActive,
              })}
            />
          </div>
          <span className={styles.accordionTitleText}>{title}</span>
        </span>
        {payment}
      </div>
    </div>
  );
};

export const Booking = ({ faqs, menu }) => {
  const { t, locale } = useI18n();
  const [cart, setCart] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState({});
  const [guestData, setGuestData] = useState(defaultGuest);
  const [isDiscount, setIsDiscount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [rebate, setRebate] = useState("");
  const [requestError, setRequestError] = useState(null);
  const [stage, setStage] = useState(t("booking.addDetails"));
  const countryRef = useRef(null);
  const paymentMethodRef = useRef(null);
  const router = useRouter();

  const meta = {
    title: t("pages.booking.title"),
    desc: t("pages.booking.description"),
    locale: locale(),
  };

  useEffect(() => {
    const optional = [];
    const isHaveEmptyFields = Object.keys(guestData).some(
      (fieldName) => !optional.includes(fieldName) && !guestData[fieldName]
    );

    if (isHaveEmptyFields) {
      return setStage(t("booking.addMoreInformation"));
    }

    if (!paymentMethod) {
      return setStage(t("booking.addPaymentMethod"));
    }

    setStage(t("booking.booknow"));
  }, [errors, guestData, paymentMethod]);

  const closeError = () => {
    setRequestError(null);
  };

  const createPaymentAttempt = (bookingId) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    postPaymentAttempts(
      {
        bookingId: bookingId,
        successReturnUrl: `${baseUrl}${getPageUrl(
          "confirm",
          locale()
        )}/?bookingId=${bookingId}`,
        failureReturnUrl: `${baseUrl}${getPageUrl(
          "booking",
          locale()
        )}/?status=failure&bookingId=${bookingId}`,
        paymentMethod,
        language: locale(),
      },
      setRequestError
    ).then((payment) => {
      if (payment && !payment.isAxiosError && payment.redirectUrl) {
        localStorage.removeItem("cartId");
        localStorage.removeItem("cartAmount");
        return router.push(payment.redirectUrl);
      }
      setIsLoading(false);
    });
  };

  const validateFields = (form) => {
    const fields = Object.keys(guestData);
    let noErrors = true;

    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const isRequired =
        (form[name] && form[name].required) || name === "country";
      const value = form[name] && form[name].value;
      const inputErrors = errors[name];
      const isError = inputErrors || (isRequired && !value);

      setErrors({ ...errors, [name]: isError });

      if (noErrors && isError) {
        noErrors = false;
        const scrollToItem =
          name === "country" ? countryRef.current : form[name]; // react-select <select> tag has display: none

        window.scrollBy({
          top: scrollToItem?.getBoundingClientRect().top - 150,
          behavior: "smooth",
        });
        form[name].focus({ preventScroll: true });

        return noErrors;
      }
    }

    if (!paymentMethod) {
      paymentMethodRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      setErrors({ ...errors, paymentMethod: true });
      return false;
    }

    return noErrors;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isValid = validateFields(e.target);
    if (!isValid) {
      return setIsLoading(false);
    }

    localStorage.setItem("guestData", JSON.stringify(guestData));
    let bookingId = router.query.bookingId || localStorage.getItem("bookingId");

    if (!bookingId) {
      const bookingItem = await checkout(
        router.query.cartId,
        {
          ...{
            user: {
              givenName: guestData.fullName,
              familyName: guestData.lastName,
              email: guestData.email,
              phone: guestData.phoneNumber,
              countryCode: guestData.country && guestData.country.value,
            },
          },
        },
        setRequestError
      );

      if (bookingItem && !bookingItem.isAxiosError) {
        bookingId = bookingItem.bookingId;
        localStorage.setItem("bookingId", bookingId);
      }
    }
    if (bookingId) {
      createPaymentAttempt(bookingId);
    }

    setIsLoading(false);
  };

  const validateEmail = (value) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(value);
  };

  const validateField = (field, value) => {
    return !!value;
  };

  const validatorList = {
    email: validateEmail,
  };

  const handleInput = (e) => {
    const field = e?.target?.name ? e?.target?.name : "phoneNumber";
    const value = field === "phoneNumber" ? e : e.target.value;
    setGuestData({ ...guestData, [field]: value });

    const validator = validatorList[field];
    const result =
      !validateField(field, value) || (validator && !validator(value));

    setErrors({ ...errors, [field]: result });
  };

  const handleCountry = (country, action) => {
    setGuestData({ ...guestData, [action.name]: country });
    setErrors({ ...errors, country: false });
  };

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    setErrors({ ...errors, paymentMethod: false });
  };

  const handleRebate = async (e) => {
    e.preventDefault();

    await getRebate(rebate)
      .then((resp) => {
        if (resp.isRedeemable) {
          setDiscount(Number(resp.balance.amount));
          setIsDiscount(true);
          updateCart(cart.cartId, {
            rebateCodes: [resp.code],
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setIsDiscount(false);
      });
  };

  const handleRebateInput = (e) => {
    setRebate(e.target.value);
    setIsDiscount(false);
  };

  useEffect(() => {
    async function fetchData() {
      const cartId = router.query.cartId || localStorage.getItem("cartId");
      const guestData = JSON.parse(localStorage.getItem("guestData"));

      if (guestData && guestData.country) {
        guestData.country = countryList[locale()].find(
          (country) => country.value === guestData.country.value
        );
      }
      setGuestData({ ...defaultGuest, ...guestData });

      let c;
      if (cartId) {
        c = await getCart(cartId);
      }

      if (!c?.isAxiosError) {
        setCart(c);
        dataLayerSend({
          event: "checkout_page",
          cart_id: router.query.cartId || localStorage.getItem("cartId"),
          location_id: c.locale.replace("_CH", "-ch"),
          value: c.reservationsNet.amount,
          currency: c.reservationsNet.currency,
        });
      } else {
        setCart(null);
      }
    }

    if (router.query.cartId || localStorage.getItem("cartId")) {
      fetchData();
    }
  }, [router.query.cartId]);

  useEffect(() => {
    if (router.query.status === "failure") {
      setRequestError(router.query.status);
    }
  }, [router.query.status]);

  const Questions = () => {
    return (
      faqs && (
        <>
          <Text as="h2" size="md" className={`mb`}>
            {t("booking.faq")}
          </Text>
          <Card padding={false}>
            <Faq faqs={faqs} />
          </Card>
        </>
      )
    );
  };

  const Footer = ({ className }) => {
    return (
      <div className={classNames(className)}>
        <div className={`mt-2 mb-4 hidden h-px w-full bg-gray-200 lg:block`} />
        <Text className={`mt-1 mb-4 lg:text-sm`}>
          <span>{t("booking.privacyMessage")}</span>
          <span className={`ml-1 inline`}>
            <Link href={getPageUrl("tos_b2c", locale())}>
              {t("booking.privacyPolicy")}
            </Link>
          </span>
        </Text>
        <Button
          form="booking"
          type="primary"
          text={stage}
          submit
          className={`w-full`}
        />
      </div>
    );
  };

  return (
    <Layout disableLinksBlock isBooking={true} meta={meta} menu={menu}>
      <section className={`bg-gray-50 pb-12 lg:pb-24`}>
        <BreadcrumbsBasket active={2} />
        <div
          className={`container-tw grid gap-8 lg:grid-cols-[2fr,1fr] lg:gap-12 lg:space-y-0`}
        >
          {cart !== null && (
            <div className={`lg:col-start-2`}>
              <Text as="h2" size="md" className={`mb`}>
                {t("booking.youBook")}
              </Text>
              <div className={`space-y-10`}>
                <Card>
                  {cart ? (
                    <>
                      <Basket widget={true} size="sm" />
                      <div className={`mb-4 mt-6 h-px w-full bg-gray-200`} />
                      <Summary
                        type="total"
                        checkout={false}
                        total={`${cart?.total.currency} ${
                          Number(cart?.total.amount) - discount
                        }`}
                      />
                      <div className={`mt-5 h-px w-full bg-gray-200`} />
                      <div className={`-mx-4 mt-0`}>
                        <Accordion
                          className={`!min-h-[40px] !px-4 !px-6 !pb-2 hover:!bg-white`}
                          classNameChildren={`!pb-0 lg:!pb-2`}
                          item={{ text: t("booking.rebate") }}
                        >
                          <div>
                            <form
                              onSubmit={handleRebate}
                              id="rebate"
                              className={`grid grid-cols-[1fr,auto] gap-4`}
                            >
                              <Input
                                key="rebate-code"
                                name="rebateCode"
                                placeholder={t("booking.rebate")}
                                errors={!isDiscount}
                                value={rebate}
                                onInput={handleRebateInput}
                              />
                              <Button
                                type="secondary"
                                className={`!h-full !min-h-[auto]`}
                                submit
                                form="rebate"
                              >
                                <FaArrowRight />
                              </Button>
                            </form>
                          </div>
                        </Accordion>
                      </div>
                      <Footer className={`hidden lg:block`} />
                    </>
                  ) : (
                    <div className={`flex items-center justify-center`}>
                      <Loader />
                    </div>
                  )}
                </Card>
                <div className={`hidden lg:block`}>
                  <Questions />
                </div>
              </div>
            </div>
          )}
          <div className={`lg:col-start-1 lg:row-start-1`}>
            <div className={`mb`}>
              <Text as="h2" size="md" className={`mb-0.5`}>
                {t("booking.personalTitle")}
              </Text>
              <Text className={`mb-3 text-sm`}>
                {t("booking.personalSubtitle")}
              </Text>
            </div>
            <Card id="bookingContent">
              <form id="booking" onSubmit={handleBooking} noValidate>
                <div>
                  <Text size="md" className={`mb-4`}>
                    {t("booking.mainGuest")}
                  </Text>
                  <div className={`space-y-3`}>
                    <Input
                      title={t("booking.fullName")}
                      name="fullName"
                      onInput={handleInput}
                      errors={errors.fullName}
                      value={guestData.fullName}
                      required
                      row
                    />
                    <Input
                      title={t("booking.lastName")}
                      name="lastName"
                      onInput={handleInput}
                      errors={errors.lastName}
                      value={guestData.lastName}
                      required
                      row
                    />
                    <Input
                      title={t("booking.email")}
                      name="email"
                      type="email"
                      onInput={handleInput}
                      errors={errors.email}
                      value={guestData.email}
                      required
                      row
                    />
                    <Phone
                      row
                      title={t("booking.phoneNumber")}
                      name="phoneNumber"
                      required
                      onInput={handleInput}
                      value={guestData.phoneNumber}
                    />
                    {/*
                    <Input
                      title={t("booking.phoneNumber")}
                      name="phoneNumber"
                      type="tel"
                      onInput={handleInput}
                      errors={errors.phoneNumber}
                      value={guestData.phoneNumber}
                      required
                      row
                    />
                    */}
                    <ReactSelect
                      containerRef={countryRef}
                      title={t("booking.country")}
                      options={countryList[locale()]}
                      name="country"
                      instanceId="country-select"
                      containerClassName={classnames(
                        styles.inputRow,
                        styles.countryInputRow
                      )}
                      className={classnames([
                        "black",
                        "react-select-w-100",
                        styles.countrySelectContainer,
                      ])}
                      selectClassName={styles.countrySelect}
                      placeholder={t("booking.countryChoose")}
                      onChange={handleCountry}
                      value={guestData.country}
                      errors={errors.country}
                      required
                      row
                    />
                  </div>
                </div>
                <div>
                  <Text as="h2" size="md" className={`mb-1 mt-3`}>
                    {t("booking.cardDetails")}
                  </Text>
                  <div className={`mb-1.5 flex text-green-600`}>
                    <BiLockAlt className={`relative top-1 mr-2 shrink-0`} />
                    <Text className={`text-green-600`}>
                      {t("booking.paymentSecure")}
                    </Text>
                  </div>

                  <div className={styles.sectionBody} ref={paymentMethodRef}>
                    <CardAccordion
                      onClick={handlePaymentMethod}
                      value="twint"
                      currentValue={paymentMethod}
                      title="Twint"
                      payment={
                        <div className={styles.paymentGroup}>
                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/booking/twint.svg"
                              alt="Twint"
                            />
                          </div>
                        </div>
                      }
                    />
                    <CardAccordion
                      onClick={handlePaymentMethod}
                      value="card"
                      currentValue={paymentMethod}
                      title={t("booking.creditPayments")}
                      payment={
                        <div className={styles.paymentGroup}>
                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              className={styles.paymentIcon}
                              src="/assets/booking/visa.svg"
                              alt="visa"
                            />
                          </div>

                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/booking/mastercard.svg"
                              alt="mastercard"
                            />
                          </div>

                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/booking/express.svg"
                              alt="american express"
                            />
                          </div>

                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/booking/amex.svg"
                              alt="american express"
                            />
                          </div>

                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/booking/discover.svg"
                              alt="discover"
                            />
                          </div>
                        </div>
                      }
                    />
                    <CardAccordion
                      onClick={handlePaymentMethod}
                      value="apple_pay"
                      currentValue={paymentMethod}
                      title="ApplePay"
                      payment={
                        <div className={styles.paymentGroup}>
                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/footer/applepay.png"
                              alt="ApplePay"
                            />
                          </div>
                        </div>
                      }
                    />
                    <CardAccordion
                      onClick={handlePaymentMethod}
                      value="ideal"
                      currentValue={paymentMethod}
                      title="iDEAL"
                      payment={
                        <div
                          className={
                            styles.paymentGroup + " " + styles.paymentGroupIdeal
                          }
                        >
                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/booking/ideal.svg"
                              alt="iDEAL"
                            />
                          </div>
                        </div>
                      }
                    />
                    <CardAccordion
                      onClick={handlePaymentMethod}
                      value="sofort"
                      currentValue={paymentMethod}
                      title="Sofortüberweisung"
                      payment={
                        <div className={styles.paymentGroup}>
                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/booking/sofort.svg"
                              alt="Sofort"
                            />
                          </div>
                        </div>
                      }
                    />
                    <CardAccordion
                      onClick={handlePaymentMethod}
                      value="invoice"
                      currentValue={paymentMethod}
                      title={t("booking.invoice")}
                      payment={
                        <div className={styles.paymentGroup}>
                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/booking/swissbilling.svg"
                              alt="Swissbilling"
                            />
                          </div>
                        </div>
                      }
                    />
                    <CardAccordion
                      onClick={handlePaymentMethod}
                      value="crypto"
                      currentValue={paymentMethod}
                      title="Bitcoin"
                      payment={
                        <div className={styles.paymentGroup}>
                          <div className={styles.iconContainer}>
                            <Image
                              layout="fill"
                              src="/assets/booking/bitcoin.svg"
                              alt="Bitcoin"
                            />
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
                <BottomBar className={`lg:hidden`}>
                  <Button
                    type="primary"
                    text={stage}
                    submit
                    className={`w-full`}
                  />
                </BottomBar>
              </form>
            </Card>
          </div>
          <div className={`lg:hidden`}>
            <Questions />
          </div>
        </div>
      </section>
      {isLoading && <LoaderScreen fixed blur />}
      <Modal
        open={!!requestError}
        loaded={!!requestError}
        onClose={closeError}
        type="info"
      >
        {requestError === "failure" ? (
          <Text>{t("booking.paymentFailed")}</Text>
        ) : (
          <Text>
            We are sorry, but something went wrong. Please try again or contact{" "}
            <a href="mailto:support@swissactivities.com">
              support@swissactivities.com
            </a>
            .
          </Text>
        )}
      </Modal>
    </Layout>
  );
};

export const bookingStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);
  const faqRes = await services.queryFaqsById([222, 223, 224]);
  const translatedFaqs = faqRes.data.faqs.map((faqItem) => {
    const translatedItem =
      faqItem.translations.find((tr) => tr.locale === locale) || faqItem;

    return { ...translatedItem, id: faqItem.id };
  });

  return {
    props: {
      ...params,
      faqs: translatedFaqs,
    },
  };
};
