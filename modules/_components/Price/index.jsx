import { useI18n } from "next-localization";
import { FaTag } from "react-icons/fa";

export const Price = ({ activity, icon = true }) => {
  const { t } = useI18n();

  return activity?.summary?.startingPrice?.formatted ? (
    <div className={`flex items-center text-sm leading-snug`}>
      {icon && (
        <div className={`mr-2 flex text-gray-400`}>
          <FaTag />
        </div>
      )}
      <div className={`flex space-x-1.5`}>
        <span className={`inline-block`}>{t("search.card.from")}</span>
        <span className={`inline-block font-semibold`}>
          {activity.summary.startingPrice.formatted}
        </span>
        {activity.summary.showPerPersonSuffix && (
          <span className={`inline-block`}>{t("search.card.person")}</span>
        )}
      </div>
    </div>
  ) : null;
};
