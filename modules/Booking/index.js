import React, { useState, useEffect, useRef } from "react";
import {
  BsCalendar,
  BsChevronCompactDown,
  BsChevronCompactUp,
} from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
import { BiLockAlt } from "react-icons/bi";
import classnames from "classnames";
import Link from "next/link";
import { useI18n } from "next-localization";
import { useRouter } from "next/router";

import {
  postBookings,
  postPaymentAttempts,
  getReservations,
} from "../../services/bookingServices";
import { queryActivityById, getPageUrl } from "../../services/contentServices";

import BookingInfoCard from "../BookingInfoCard";
import Layout from "../_components/Layout";
import Icon from "../Icon";
import Image from "../Image";
import Loading from "../Loading";
import InputWithValidation from "../InputWithValidation";
import SelectWithValidation from "../InputWithValidation/Select";
import ErrorModal from "../ErrorModal";
import Button from "../Button";
import Faq from "../Faq";
import countryList from "../../data/constants/countryList";

import styles from "./styles.module.scss";

const defaultGuest = {
  fullName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  country: "",
};

const RadioAccordion = ({ title, children }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className={classnames("accordion radio-accordion", { open: isOpen })}>
      <div
        className={classnames("accordion-title")}
        onClick={() => setOpen(!isOpen)}
      >
        <span>
          <div className="outer-line">
            <div className={classnames("inner", { hidden: isOpen })}></div>
          </div>
          {title}
        </span>
        <Icon
          color="#3B3B3B"
          icon={isOpen ? <BsChevronCompactDown /> : <BsChevronCompactUp />}
        />
      </div>
      <div className={classnames("accordion-body radio", { open: isOpen })}>
        {children}
      </div>
    </div>
  );
};

const CardAccordion = ({
  title,
  payment,
  children,
  onClick,
  value,
  currentValue,
  menu
}) => {
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
            ></div>
          </div>
          <span className={styles.accordionTitleText}>{title}</span>
        </span>
        {payment}
      </div>
    </div>
  );
};

const GuestSelector = ({ disabled = false, title, amount }) => {
  return (
    <div
      className={classnames("guest-selector__container", {
        disabled: disabled,
      })}
    >
      <div className="guest-selector__title">{title}</div>
      <div className="flex">
        <div className="minus">-</div>
        <div className="amount">{amount}</div>
        <div className="plus">+</div>
      </div>
    </div>
  );
};

const Booking = ({ faqs, menu }) => {
  const { t, locale } = useI18n();
  const paymentMethodRef = useRef(null);
  const bookingButtonRef = useRef(null);
  const countryRef = useRef(null);
  const observerRef = useRef(null);
  const [guestData, setGuestData] = useState(defaultGuest);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [activity, setActivity] = useState(null);
  const [requestError, setRequestError] = useState(null);
  const [errors, setErrors] = useState({});
  const [reservationTime, setReservationTime] = useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const [stage, setStage] = useState(t("booking.addDetails"));
  const [isButtonVisible, setButtonVisible] = useState(false);
  const router = useRouter();

  const meta = {
    title: t("pages.booking_confirmation.title"),
    desc: t("pages.booking_confirmation.description"),
    locale: locale(),
  };

  useEffect(() => {
    const optional = ["phoneNumber"];
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

  const handleGA = (activityObject, reservationItem) => {
    if (!reservationItem) return;

    const ticketsList = reservationItem.ticketReservations.map(
      (reservation) => {
        let quantity = 0;
        reservation.guests.forEach((guest) => {
          quantity += guest.occupancy;
        });
        return {
          item_name: reservation.ticketCategoryLabel,
          price: reservation.seatPrice.amount,
          quantity: quantity,
        };
      }
    );

    const totalSum = reservationItem.totalPrice.amount;

    dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        items: [
          {
            item_name: activityObject.info.title,
            item_id: activityObject.id, // id of the item if exists, if not, do not add this line to the code
            price: Number(totalSum), //should be a number NOT a string
            item_region: activityObject.location.title, // It should take region name. example
            item_category: activityObject.type.title, // Category of the activity. Example is here
          },
        ],
        ticket: ticketsList,
      },
    });
  };

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
        )}/?bookingId=${bookingId}&activityId=${router.query.activityId}`,
        failureReturnUrl: `${baseUrl}${getPageUrl(
          "booking",
          locale()
        )}/?status=failure&bookingId=${bookingId}&activityId=${
          router.query.activityId
        }`,
        paymentMethod,
        language: locale(),
      },
      setRequestError
    ).then((payment) => {
      if (payment && !payment.isAxiosError && payment.redirectUrl) {
        return router.push(payment.redirectUrl);
      }
      setLoading(false);
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
        const scrollToItem = (name === "country") ? countryRef.current : form[name]; // react-select <select> tag has display: none

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
    setLoading(true);
    const isValid = validateFields(e.target);
    if (!isValid) {
      return setLoading(false);
    }

    const reservationId = localStorage.getItem("reservationId");
    localStorage.setItem("guestData", JSON.stringify(guestData));
    let bookingId = router.query.bookingId || localStorage.getItem("bookingId");

    if (!bookingId) {
      const bookingItem = await postBookings(
        {
          user: {
            givenName: guestData.fullName,
            familyName: guestData.lastName,
            email: guestData.email,
            phone: guestData.phoneNumber ? guestData.phoneNumber : null,
            countryCode: guestData.country && guestData.country.value,
          },
          reservationIds: [reservationId],
          locale: locale(),
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

    setLoading(false);
  };

  const validateEmail = (value) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(value);
  };

  const validateField = (field, value) => {
    if (field === 'phoneNumber') {
      return true; // optional
    }

    return !!value;
  };

  const validatorList = {
    email: validateEmail,
  };

  const handleInput = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    setGuestData({ ...guestData, [field]: value });

    const validator = validatorList[field];
    const result = !validateField(field, value) || (validator && !validator(value));

    setErrors({ ...errors, [field]: result });
  };

  const handleCountry = (country, action) => {
    setGuestData({ ...guestData, [action.name]: country });
    setErrors({ ...errors, country: false });
  };
  const findByLocale = (element) => {
    return element.locale === locale();
  };

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    setErrors({ ...errors, paymentMethod: false });
  };

  useEffect(() => {
    async function fetchData() {
      const reservationId = localStorage.getItem("reservationId");
      const guestData = JSON.parse(localStorage.getItem("guestData"));

      if (guestData && guestData.country) {
        const country = countryList[locale()].find(
          (country) => country.value === guestData.country.value
        );
        guestData.country = country;
      }

      setGuestData({ ...defaultGuest, ...guestData });

      const activityRes = await queryActivityById(router.query.activityId);
      const activityObject = activityRes.data.activity;

      setActivity(activityObject);

      const reservationItem = await getReservations(reservationId);
      handleGA(activityObject, reservationItem);
      setReservation(reservationItem);
      setReservationTime(reservationItem?.startsAt ? (new Date(reservationItem.startsAt)) : (new Date()));
    }

    if (router.query.activityId) {
      fetchData();
    }
  }, [router.query.activityId]);

  useEffect(() => {
    if (router.query.status === "failure") {
      setRequestError(router.query.status);
    }
  }, [router.query.status]);

  useEffect(() => {
    if (bookingButtonRef.current) {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver((entries, observer) => {
          setButtonVisible(entries[0].isIntersecting);
        });
      }
      observerRef.current.observe(bookingButtonRef.current);
    }
    return () => {
      observerRef.current.disconnect();
    };
  }, [bookingButtonRef.current]);

  return (
    <Layout disableLinksBlock isSearchPage={true} isBooking={true} meta={meta} menu={menu}>
      <section className={styles.sectionBooking}>
        <div className={styles.bookingContainer}>
            <div className={styles.onlyMobile}>
              <BookingInfoCard
                activity={activity}
                reservation={reservation}
                reservationTime={reservationTime}
              />
            </div>


          <div className="container" id="bookingContent">
            <form
              className="col-8 content-bar"
              onSubmit={handleBooking}
              noValidate
            >
              {/* <div className={styles.ticketSection}>
                <div className={styles.ticketType}>
                  <RadioAccordion title="Summer 2020">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utnim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                  </p>
                    <Select
                      options={[]}
                      className="black time-picker"
                      placeholder="Choose Time"
                      onChange={() => console.log("Choose time")}
                    />
                  </RadioAccordion>
                  <RadioAccordion title="Friday Night Special">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utnim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                  </p>
                    <Select
                      options={[]}
                      className="black time-picker"
                      placeholder="Choose Time"
                      onChange={() => console.log("Choose time")}
                    />
                  </RadioAccordion>
                </div>
              </div>
              <div className={styles.guestsSection}>
                <div className={styles.sectionTitle}>Select Guests</div>
                <div className={styles.sectionBody}>
                  <GuestSelector disabled={false} title="Under 6 (0 CHF)" amount="03" />
                  <GuestSelector disabled={true} title="Under 16 (0 CHF)" amount="00" />
                  <GuestSelector disabled={false} title="Adult (19 CHF)" amount="02" />
                  <GuestSelector disabled={true} title="School Groups from 10 people (9 CHF)" amount="00" />
                  <GuestSelector disabled={true} title="School Groups from 10 people (9 CHF)" amount="00" />
                </div>
              </div> */}
              <div className={styles.personalSection}>
                <div className={styles.sectionTitle}>
                  {t("booking.personalTitle")}
                  <p className={styles.sectionSubTitle}>
                    {t("booking.personalSubtitle")}
                  </p>
                </div>
                <div className={styles.sectionBody}>
                  <div className={styles.title}>{t("booking.mainGuest")}</div>
                  <InputWithValidation
                    className={styles.inputRow}
                    title={t("booking.fullName")}
                    name="fullName"
                    onInput={handleInput}
                    errors={errors.fullName}
                    value={guestData.fullName}
                    required
                  />
                  <InputWithValidation
                    className={styles.inputRow}
                    title={t("booking.lastName")}
                    name="lastName"
                    onInput={handleInput}
                    errors={errors.lastName}
                    value={guestData.lastName}
                    required
                  />
                  <InputWithValidation
                    className={styles.inputRow}
                    title={t("booking.email")}
                    name="email"
                    type="email"
                    onInput={handleInput}
                    errors={errors.email}
                    value={guestData.email}
                    required
                  />
                  <InputWithValidation
                    className={styles.inputRow}
                    title={t("booking.phoneNumber")}
                    name="phoneNumber"
                    type="tel"
                    titleIcon={<AiFillInfoCircle color="#111" />}
                    tooltipText={t("booking.phoneTooltip")}
                    tooltipId="phone-tooltip"
                    onInput={handleInput}
                    errors={errors.phoneNumber}
                    value={guestData.phoneNumber}
                  />
                  <SelectWithValidation
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
                  />
                  {/*
                  <div className="col-6 personal-detail">
                    <span className="label">Full Name*</span>
                    <input type="text" placeholder="John Doe" onInput={handleInput} name="fullName" value={guestData.fullName}/>
                  </div>
                  <div className="col-6 personal-detail">
                    <span className="label">Last Name*</span>
                    <input type="text" placeholder="John Doe" onInput={handleInput} name="lastName" value={guestData.lastName}/>
                  </div>
                  <div className="col-6 personal-detail">
                    <span className="label">Email*</span>
                    <input type="text" placeholder="example@email.com" onInput={handleInput} name="email" value={guestData.email}/>
                  </div>
                  <div className="col-6 personal-detail">
                    <span className="label">Phone number<AiFillInfoCircle /></span>
                    <input type="text" placeholder="+1 123 456 7890" onInput={handleInput} name="phoneNumber" value={guestData.phoneNumber}/>
                  </div>
                  <div className={styles.title}>First guest</div>
                  <div className="col-6 personal-detail">
                    <span className="label">Full Name*</span>
                    <input type="text" placeholder="John Doe" />
                  </div>
                  <div className="col-6 personal-detail">
                    <span className="label">Last Name*</span>
                    <input type="text" placeholder="John Doe" />
                  </div>
                  <div className={styles.title}>Second guest</div>
                  <div className="col-6 personal-detail">
                    <span className="label">Full Name*</span>
                    <input type="text" placeholder="John Doe" />
                  </div>
                  <div className="col-6 personal-detail">
                    <span className="label">Last Name*</span>
                    <input type="text" placeholder="John Doe" />
                  </div>
                  */}
                </div>
              </div>
              <div className={styles.cardSection}>
                <div className={styles.sectionTitle}>
                  {t("booking.cardDetails")}
                </div>
                <div className={styles.paymentsSecure}>
                  <BiLockAlt color="#219653" />{" "}
                  <span>{t("booking.paymentSecure")}</span>
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
                  <div className={styles.footer}>
                    <p className={styles.privacyPolicy}>
                      <span>{t("booking.privacyMessage")}</span>
                      <Link href={getPageUrl("tos_b2c", locale())}>
                        {t("booking.privacyPolicy")}
                      </Link>
                    </p>
                    <Button
                      ref={bookingButtonRef}
                      title={stage}
                      customStyle={classnames("booking", styles.submitButton)}
                      type="submit"
                    />
                  </div>
                </div>
              </div>
              {!isButtonVisible && (
                <div className={styles.fixedCta}>
                  <Button title={stage} customStyle={classnames("booking", styles.submitButton)} type="submit" />
                </div>
              )}
              {/* <div className={styles.moreSection}>
                <div className={styles.header}>
                  Book with Great Confidence
              </div>
                <div className={styles.body}>
                    <span>
                    <div>
                  <Image layout="fill" src="/assets/booking/secure.svg" alt="Secure" /> Most Secure payment method</span>
                  </div>
                    <span>
                    <div>
                  <Image layout="fill" src="/assets/booking/discount.svg" alt="Discount" /> Get the best Discount Rates Available</span>
                  </div>
                    <span>
                    <div>
                  <Image layout="fill" src="/assets/booking/lock.svg" alt="Lock" /> Your Data is secure with us, We never have and will sell your personal information to third parties</span>
                  </div>
                </div>
              </div>
              */}
            </form>
            <div className="col-4 right-sidebar">

                <div className={styles.onlyDesktop}>
                  <BookingInfoCard
                    activity={activity}
                    reservation={reservation}
                    reservationTime={reservationTime}
                  />
                </div>

              {faqs && (
                <div className={styles.faqContainer}>
                  <div className={styles.faqTitle}>{t("booking.faq")}</div>
                  <Faq faqs={faqs} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {isLoading && (
        <Loading
          type="spin"
          color="#8b8b8b"
          width="100px"
          height="100px"
          className={styles.loader}
        />
      )}
      <ErrorModal open={!!requestError} onClose={closeError}>
        {requestError === "failure" ? (
          <span>{t("booking.paymentFailed")}</span>
        ) : (
          <span>
            We are sorry, but something went wrong. Please try again or contact{" "}
            <a href="mailto:support@swissactivities.com">
              support@swissactivities.com
            </a>
            .
          </span>
        )}
      </ErrorModal>
    </Layout>
  );
};

export default Booking;
