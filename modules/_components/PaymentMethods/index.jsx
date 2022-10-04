import React from "react";
import { useI18n } from "next-localization";
import StaticImage from "../../Image";
import styles from "./styles.module.scss";
import classNames from "classnames";
import { Text } from "../Text";

const PaymentMethods = ({ heading = true, center }) => {
  const { t } = useI18n();

  return (
    <div id="payment-methods" className={`w-full`}>
      {heading && (
        <Text className={`mb-1 inline-block font-medium`}>
          {t("activity.widget.paymentMethods")}:
        </Text>
      )}
      <div
        className={classNames(
          `flex flex-wrap items-center gap-2`,
          styles.paymentMethods,
          { "justify-center": center }
        )}
      >
        {[
          {
            file: "twint.svg",
            alt: "Twint",
          },
          {
            file: "visa.svg",
            alt: "Visa",
          },
          {
            file: "mastercard.svg",
            alt: "MasterCard",
          },
          {
            file: "express.svg",
            alt: "Maestro",
          },
          {
            file: "amex.svg",
            alt: "AMEX",
          },
          {
            file: "applepay.svg",
            alt: "ApplePay",
            bg: true,
          },
          {
            file: "swissbilling.svg",
            alt: "Swiss Billing",
          },
          {
            file: "sofort.svg",
            alt: "Sofort",
          },
          {
            file: "ideal.svg",
            alt: "DinersClub",
            bg: true,
          },
          {
            file: "bitcoin.svg",
            alt: "Bitcoin",
            bg: true,
          },
        ].map((item, index) => {
          return (
            <div
              className={classNames(
                `relative h-[34px] w-[50px] overflow-hidden rounded`,
                {
                  "!h-[33px] border border-solid border-[#DDDDDD] bg-white":
                    item.bg,
                  [styles.bg]: item.bg,
                }
              )}
              key={`payment-${item.file}`}
            >
              <StaticImage
                src={`/assets/booking/${item.file}`}
                layout={`fill`}
                alt={item.alt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethods;
