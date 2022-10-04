import Button from "../Button";
import { useState } from "react";
import { useBookingStore } from "../../../store/bookingStore";
import { useI18n } from "next-localization";
import { dataLayerSend } from "../../../utils/dataLayerSend";

export const BookingButton = ({
  text,
  onClick = () => {},
  bare,
  children,
  activity,
}) => {
  const { t, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const bookingActivity = useBookingStore((state) => state.activity);
  const isOpen = useBookingStore((state) => state.isOpen);
  const isSelected = useBookingStore((state) => state.isSelected);
  const level = useBookingStore((state) => state.level);
  const setActivity = useBookingStore((state) => state.setActivity);
  const selectedOffer = useBookingStore((state) => state.selectedOffer);
  const setIsLoaded = useBookingStore((state) => state.setIsLoaded);
  const setIsOpen = useBookingStore((state) => state.setIsOpen);
  const setIsSelected = useBookingStore((state) => state.setIsSelected);
  const reset = useBookingStore((state) => state.reset);

  const clickHandler = () => {
    if (!isSelected && !bare) {
      const nextData = window?.__NEXT_DATA__?.props?.pageProps;
      dataLayerSend({
        event: "verfügbarkeit_prüfen",
        cart_id: localStorage?.getItem?.("cartId"),
        item_name: nextData?.activity?.info?.title.trim(),
        id: nextData?.activity?.info?.title.trim(),
        location_id: locale().replace("_CH", "-ch"),
        value: nextData?.startingPrice?.startingPrice?.amount,
        currency: nextData?.startingPrice?.startingPrice?.currency,
      });
    }
    if (activity) {
      if (activity !== bookingActivity) {
        setIsLoaded(false);
        reset(new Date(activity.bookDate));
      }
      setActivity(activity);
    }
    setIsSelected(true);
    setIsOpen(true);
    setIsLoading(true);
    onClick();
  };

  return (
    <>
      {bare ? (
        <span role="button" onClick={clickHandler}>
          {children}
        </span>
      ) : (
        <Button
          text={
            text
              ? text
              : ((isSelected && !isOpen) || isSelected) && level >= 2
              ? t("activity.widget.adjust")
              : t("activity.booknow")
          }
          type="primary"
          className={`w-full !items-center !justify-center !text-center font-bold`}
          loading={!selectedOffer && isLoading}
          onClick={clickHandler}
        />
      )}
    </>
  );
};
