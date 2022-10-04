import React from "react";
import { useI18n } from "next-localization";
import Button from "../Button";
import { Text } from "../Text";
import StaticImage from "../../Image";
import classNames from "classnames";

const bgImageUrl = "/assets/homepagepic.webp";

const campaignList = {
  de_CH: "jWGtV",
  en_CH: "jWGm3",
  it_CH: "jWG0r",
  fr_CH: "jWGeF",
};

export const EmailSubscription = ({ type }) => {
  const { t, locale } = useI18n();
  const isSm = type === "sm";

  return (
    <div
      className={classNames(`container-tw`, {
        "!my-8 !px-0": isSm,
      })}
    >
      <div
        className={classNames(
          `flex flex-col-reverse overflow-hidden rounded-xl border border-solid border-gray-200 bg-white shadow-lg sm:grid`,
          {
            "sm:grid-cols-3": isSm,
            "sm:grid-cols-2": !isSm,
          }
        )}
      >
        <form
          className={classNames(
            `space-y-3 p-7 sm:space-y-4 sm:p-9 md:space-y-5 md:p-12 lg:space-y-6 xl:space-y-7`,
            {
              "sm:col-span-2": isSm,
              "lg:p-16 xl:p-20": !isSm,
            }
          )}
          action="https://app.getresponse.com/add_subscriber.html"
          acceptCharset="utf-8"
          method="post"
        >
          <div className={`space-y-2`}>
            <Text as="h3" size="lg" className={`!mt-0`}>
              {t("activity.newsletter.title")}
            </Text>
            <Text>{t("activity.newsletter.description")}</Text>
          </div>
          <div className={`flex flex-col space-y-2.5`}>
            <input
              className={`form-input rounded-lg`}
              type="text"
              name="email"
              placeholder={t("activity.newsletter.inputPlaceholder")}
            />
            <input
              type="hidden"
              name="campaign_token"
              value={campaignList[locale()]}
            />
            <Button
              type="primary"
              as="submit"
              value={t("activity.newsletter.signup")}
            />
          </div>
          <Text>{t("activity.newsletter.hint")}</Text>
        </form>
        <div
          className={`image-wrapper relative h-44 sm:h-auto sm:max-h-[500px]`}
        >
          <StaticImage
            src={bgImageUrl}
            height={400}
            width={400}
            className={`object-cover`}
          />
        </div>
      </div>
    </div>
  );
};
