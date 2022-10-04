import { useI18n } from "next-localization";
import { Rating } from "../_components/Rating";
import Share from "../_components/Share";
import { Text } from "../_components/Text";
import React from "react";
import { Price } from "../_components/Price";
import {Voucher} from "../_components/Voucher";

const Header = ({
  activity,
  isMobile,
  mobileWidgetRef,
  widgetComponent,
  tag = "h1",
}) => {
  const { t } = useI18n();

  return (
    <div
      className={`mt-2 w-full lg:inline-flex lg:justify-between lg:w-full lg:mt-6 lg:mb-2`}
    >
      <div className={`flow-text`}>
        <Text as={tag} size="xl" className={`pt-4 mt-0 inline-block`}>
          {activity.info.title}
        </Text>
        <Rating
          hit={{
            rating: parseFloat(activity?.rating?.average_rating),
            ratingAmount: activity?.rating?.num_ratings,
          }}
        />
        <div className={`booking:hidden`}>
          <Price activity={activity} />
        </div>
        <span className={`text-sm block text-gray-900`}>
          {t("activity.providedBy")}: {activity.supplier.name}
        </span>
      </div>
      {isMobile && (
        <div className={`-mx-4 mt-6`} ref={mobileWidgetRef}>
          {widgetComponent}
        </div>
      )}
      <Voucher className={`mb-6 w-full booking:hidden`} type="secondary"/>
      <div className={`lg:mt-4 hidden`}>
        <Share />
      </div>
    </div>
  );
};

export default Header;
