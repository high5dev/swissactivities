import Toast from "../Toast";
import { useI18n } from "next-localization";
import { useEffect, useState } from "react";
import { useBookingStore } from "../../../store/bookingStore";
import { toISO } from "../../../utils/dates/toISO";

export const Cancellable = ({ date, inline }) => {
  const { t } = useI18n();
  const [d, setD] = useState("");
  const data = useBookingStore((state) => state.data);
  const selectedOffer = useBookingStore((state) => state.selectedOffer);

  useEffect(() => {
    const newDate = selectedOffer?.availabilities?.find(
      (e) => e?.availabilityId === data?.time?.id
    )?.cancellableUntil;

    if (newDate) {
      setD(newDate);
    }
  }, [selectedOffer]);

  return date || d ? (
    <Toast inline={inline}>{`${t("booking.cancelable")} ${toISO(date || d, {
      dateString: true,
    })} ${
      toISO(date || d, {
        time: true,
      }) === "00:00"
        ? "23:59"
        : toISO(date || d, {
            time: true,
          })
    }`}</Toast>
  ) : null;
};
