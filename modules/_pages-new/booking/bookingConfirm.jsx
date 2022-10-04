import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { useRouter } from "next/router";

import Layout from "../../_components/Layout";
import {
  getBooking,
  getPaymentAttempts,
} from "../../../services/bookingServices";
import { useI18n } from "next-localization";
import { getPageUrls, getParams } from "../../../services/contentServices";
import { Text } from "../../_components/Text";
import { Basket } from "../basket";
import { dataLayerSend } from "../../../utils/dataLayerSend";

const STATUS_PAID = "paid";
const STATUS_USED = "used";
const checkInterval = 3000;
const maxCheckNumber = 20;

export const BookingConfirm = ({ menu }) => {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [paymentAccepted, setPaymentAccepted] = useState(false);
  const [checkNumber, setCheckNumber] = useState(maxCheckNumber);
  const checkNumberRef = useRef(checkNumber);
  const { t, locale } = useI18n();

  const meta = {
    title: t("pages.confirmation.title"),
    desc: t("pages.booking.description"),
    locale: locale(),
  };

  const conversionEvent = (value, currency, transactionId) => {
    const isActivated = localStorage.getItem(
      "conversion_event_" + transactionId
    );

    if (isActivated !== "true") {
      function gtag() {
        dataLayer.push(arguments);
      }

      gtag("event", "conversion", {
        send_to: "AW-645360092/nr6OCI_6gocDENzT3bMC",
        value: value,
        currency: currency,
        transaction_id: transactionId,
      });

      dataLayerSend({
        event: "purchase",
        item_name: booking.items
          .map((item) => item.service.activity)
          .join(", "),
        cart_id: booking.bookingId,
        transaction_id: transactionId,
        location_id: locale().replace("_CH", "-ch"),
        value: booking.totalGross.amount,
        currency: booking.totalGross.currency,
        tax: booking.vat.amount,
      });

      localStorage.setItem("conversion_event_" + transactionId, "true");
      localStorage.removeItem("cartId");
    }
  };

  const checkPaymentStatus = async (bookingItem) => {
    setCheckNumber((prevState) => {
      return prevState - 1;
    });
    const paymentResultPromises = bookingItem.paymentAttempts.map((attempt) =>
      getPaymentAttempts(attempt.paymentAttemptId)
    );
    const paymentResult = await Promise.all(paymentResultPromises);
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
    async function fetchPayment() {
      const bookingItem = await getBooking(router.query.bookingId);
      // console.log(bookingItem);

      if (bookingItem) {
        setBooking(bookingItem);

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
    if (booking && paymentAccepted) {
      conversionEvent(
        booking.totalNet.amount,
        booking.totalNet.currency,
        router.query.transaction_id
      );
    }
  }, [booking, paymentAccepted]);

  const urls = getPageUrls("confirm");
  const { path, translations, ...queryParams } = router.query;

  return (
    <>
      {booking?.items?.length && booking.items[0] && (
        <Script
          strategy="afterInteractive"
          id="pap_x2s6df8d"
          src="https://saaffiliate.postaffiliatepro.com/scripts/9onzfjau"
          onLoad={() => {
            window.PostAffTracker.setAccountId("default1");
            try {
              window.PostAffTracker.track();
              var sale = window.PostAffTracker.createSale();
              sale.setTotalCost(booking.totalNet.amount);
              sale.setOrderID(booking.bookingId);
              sale.setProductID(booking.bookingId);
              window.saleTest = sale;
              window.PostAffTracker.register();
            } catch (err) {}
          }}
        />
      )}
      <Layout
        meta={meta}
        pageUrls={urls}
        pageUrlsQuery={queryParams}
        disableLinksBlock
        menu={menu}
        pageType="confirm"
      >
        <section className={`bg-gray-50 pb-12 lg:pb-24`}>
          <div className={`mt-header container-tw pt-10 pb-20`}>
            <Text as="h1" size="lg" className={`mb-2`}>
              {t("confirm.title")}
            </Text>
            <div id="bookingContent">
              <div className={`mb-8`}>
                {paymentAccepted ? (
                  <Text
                    size="md"
                    className={`flex items-center text-green-600`}
                  >
                    <FaCheckCircle className={`mr-2`} />
                    {t("confirm.confirmed")}
                  </Text>
                ) : (
                  <Text className={`flex items-center`}>
                    <FaCircle className={`mr-2 text-yellow-600`} />
                    {checkNumber > 0
                      ? t("confirm.wait")
                      : t("confirm.waitEmail")}
                  </Text>
                )}
              </div>
            </div>
            <div className={`max-w-screen-md`}>
              <Basket widget={true} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export const bookingConfirmStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);

  return {
    props: {
      ...params,
    },
  };
};
