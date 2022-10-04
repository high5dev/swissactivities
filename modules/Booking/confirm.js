import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { useRouter } from "next/router";


import Layout from "../_components/Layout";
import Icon from "../Icon";
import StaticImage from "../Image";
import BookingInfoCard from "../BookingInfoCard";
import styles from "./styles.module.scss";
import { getBooking, getPaymentAttempts } from "../../services/bookingServices";
import { useI18n } from "next-localization";
import { queryActivityById, getPageUrls } from "../../services/contentServices";

const STATUS_PAID = "paid";
const STATUS_USED = "used";
const checkInterval = 3000;
const maxCheckNumber = 20;

export default function Confirm({ algolia, menu }) {
  const router = useRouter();
  const [activity, setActivity] = useState(null);
  const [address, setAddress] = useState(null);
  const [booking, setBooking] = useState(null);
  const [dates, setDates] = useState(null);
  const [payment, setPayment] = useState(null);
  const [paymentAccepted, setPaymentAccepted] = useState(false);
  const [checkNumber, setCheckNumber] = useState(maxCheckNumber);
  const checkNumberRef = useRef(checkNumber);
  const { t, locale } = useI18n();

  const meta = {
    title: t("pages.booking.title"),
    desc: t("pages.booking.description"),
    locale: locale(),
  };

  const conversionEvent = (value, currency, transactionId) => {
    const isActivated = localStorage.getItem('conversion_event_' + transactionId);
    if(!isActivated) {
      function gtag(){
        dataLayer.push(arguments);
      }
      gtag('event', 'conversion', {
        'send_to': 'AW-645360092/nr6OCI_6gocDENzT3bMC',
        'value': value,
        'currency': currency,
        'transaction_id': transactionId
      });
      localStorage.setItem('conversion_event_' + transactionId, true);
    }
  }

  const handleGA = () => {
    const items = booking.items.map((item) => {
      //TODO: use booking.items
      return {
        item_name: item.service.activity,
        item_id: activity.id,
        price: item.totalPrice.amount,
        item_region: activity.location.title,
        item_category: activity.type.title,
        quantity: 1,
      };
    });

    const reservationList = booking.items[0].reservations;
    const guests = booking.items[0].guests;
    const ticketsList = reservationList.map((reservation) => {
      let quantity = 0;

      reservation.guests &&
        reservation.guests.forEach((guest) => {
          quantity += guest.occupancy;
        });

      return {
        ticket_name: reservation.ticketCategoryLabel,
        price: Number(reservation.totalPrice.amount),
        quantity: quantity,
      };
    });

    dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: router.query.transaction_id,
        value: booking.totalPayments.amount, //total value of items
        tax: booking.vat.amount, // if there such please add it, if not - delete
        currency: booking.totalPayments.currency,
        // 'shipping': '5.99', // if there such please add it, if not - delete
        // 'coupon': 'SUMMER_SALE', // if there such please add it, if not - delete
        // 'payment_method': 'credit_card',  // should be changed dynamically based on user selection. Example
        items: items,
        ticket: ticketsList,
      },
    });

    conversionEvent(booking.totalPayments.amount, booking.totalPayments.currency, router.query.transaction_id);
  };


  const checkPaymentStatus = async (bookingItem) => {
    setCheckNumber((prevState) => {
      return prevState - 1;
    });
    const paymentResultPromises = bookingItem.paymentAttempts.map((attempt) =>
      getPaymentAttempts(attempt.paymentAttemptId)
    );
    const paymentResult = await Promise.all(paymentResultPromises);
    setPayment(paymentResult[0]);
    if (paymentResult.some(({ status }) => status === STATUS_USED)) {
      return setPaymentAccepted(true);
    }

    if (checkNumberRef.current > 0) {
      setTimeout(() => {
        checkPaymentStatus(bookingItem);
      }, checkInterval);
    }
  };

  useEffect(() => {
    checkNumberRef.current = checkNumber;
  }, [checkNumber]);

  useEffect(() => {
    async function fetchActivity() {
      const activityRes = await queryActivityById(router.query.activityId);
      setActivity(activityRes.data.activity);
      const meetingPoint = activityRes.data.activity.meeting_points?.[0];

      if (meetingPoint) {
        const translation = meetingPoint.translations.find(
          (translation) => translation.locale === locale()
        );
        const info = (translation && translation.info[0]) || meetingPoint.info;

        setAddress(info.address);
      }
    }
    if (router.query.activityId) {
      fetchActivity();
    }
  }, [router.query.activityId]);

  useEffect(() => {
    async function fetchPayment() {
      const bookingItem = await getBooking(router.query.bookingId);

      if (bookingItem) {
        setBooking(bookingItem);

        if (bookingItem.items && bookingItem.items[0]) {
          const start = new Date(bookingItem.items[0].startsAt);
          const startTime = start.toLocaleTimeString("en-CH", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          });
          const startDate = start.toLocaleDateString("en-CH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const end = new Date(bookingItem.items[0].endsAt);
          const endTime = end.toLocaleTimeString("en-CH", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          });
          const endDate = end.toLocaleDateString("en-CH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          setDates({
            start: {
              time: startTime,
              date: startDate,
              fullDate: start,
            },
            end: {
              time: endTime,
              date: endDate,
            },
          });
        }

        setPayment(bookingItem.paymentAttempts[0]);
        if (bookingItem.paymentStatus !== STATUS_PAID) {
          setTimeout(() => {
            checkPaymentStatus(bookingItem);
          }, checkInterval);
        } else {
          setPaymentAccepted(true);
        }
      }
    }
    if (router.query.bookingId) {
      fetchPayment();
    }
  }, [router.query.bookingId]);

  useEffect(() => {
    if (booking && activity && paymentAccepted) {
      handleGA();
    }
  }, [activity, booking, paymentAccepted]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  const urls = getPageUrls("confirm");
  const { path, translations, ...queryParams } = router.query;

  return (
    <>
    {booking?.items?.length && booking.items[0] && activity &&
      <Script
        strategy="afterInteractive"
        id="pap_x2s6df8d"
        src="https://saaffiliate.postaffiliatepro.com/scripts/9onzfjau"
        onLoad={() => {
          window.PostAffTracker.setAccountId('default1');
          try {
            window.PostAffTracker.track();
            var sale = window.PostAffTracker.createSale();
            sale.setTotalCost(booking.items[0].totalPrice?.amount);
            sale.setOrderID(booking.items[0].bookingItemId);
            sale.setProductID(activity.info?.title);

            window.saleTest = sale;
            window.PostAffTracker.register();
          } catch (err) {
          }
        }}
      />
    }
    <Layout
      meta={meta}
      pageUrls={urls}
      pageUrlsQuery={queryParams}
      isSearchPage={true}
      algolia={algolia}
      disableLinksBlock
      menu={menu}
    >
      <section className={styles.sectionBooking}>
        <div className={styles.bookingContainer}>
          <div className="container">
            <span className={styles.helper}>{t("confirm.title")}</span>
          </div>
          <div className="container" id="bookingContent">
            <div className="col-8 content-bar">
              <div className={styles.confirmTicketSection}>
                {paymentAccepted ? (
                  <span className={styles.confirmed}>
                    <Icon color="#54A657" icon={<FaCheckCircle />} />
                    {t("confirm.confirmed")}
                  </span>
                ) : (
                  <span className={styles.pending}>
                    <Icon color="#ccc51f" icon={<FaCircle />} />
                    {checkNumber > 0
                      ? t("confirm.wait")
                      : t("confirm.waitEmail")}
                  </span>
                )}
              </div>
              {booking && activity && (
                <div className={styles.confirmedDetailSection}>
                  <div className={styles.caption}>{t("confirm.caption")}</div>
                  <div className={styles.sectionBody}>
                    <div className="detailCard">
                      <div className="card-title">
                        <span className="cap">
                          {t("confirm.bookingNumber")}
                        </span>
                      </div>
                      <div className="card-body">
                        <span className={styles.bookingNumber}>
                          {booking && booking.bookingId}
                        </span>
                      </div>
                    </div>
                    <div className="detailCard">
                      <div className="card-title">
                        <span className="cap">{t("confirm.point")}</span>
                        {!booking.items[0].isAllDay && (
                          <span className="time">
                            {dates && dates.start.time}
                          </span>
                        )}
                      </div>
                      <div className="card-body">
                        <span className="big">{dates && dates.start.date}</span>
                      </div>
                    </div>
                    {!booking.items[0].isAllDay && (
                      <div className="detailCard">
                        <div className="card-title">
                          <span className="cap">{t("confirm.end")}</span>
                          <span className="time">
                            {dates && dates.end.time}
                          </span>
                        </div>
                        <div className="card-body">
                          <span className="big">{dates && dates.end.date}</span>
                        </div>
                      </div>
                    )}
                    <div className="detailCard big">
                      <div className="card-title">
                        <span className="cap">{t("confirm.pointAddress")}</span>
                      </div>
                      <div className="card-body">
                        <span className="small">{address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-4 right-sidebar">
              {booking && activity && (
                <BookingInfoCard
                  activity={activity}
                  reservation={booking.items[0]}
                  reservationTime={dates && dates.start.fullDate}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
    </>
  );
}
