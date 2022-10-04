import Button from "../Button";
import { useI18n } from "next-localization";
import { BsGift } from "react-icons/bs";

export const Voucher = ({ className, type = "transparent", icon = true }) => {
  const { t } = useI18n();

  return (
    <Button
      className={className}
      href="https://shop.e-guma.ch/swiss-activities/de/gutscheine/38315/wertgutschein"
      target="_blank"
      icon={icon && <BsGift />}
      text={t("menu.voucher")}
      type={type}
    />
  );
};
