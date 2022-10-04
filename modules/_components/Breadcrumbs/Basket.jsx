import { useI18n } from "next-localization";
import classNames from "classnames";

export const BreadcrumbsBasket = ({ active = 1 }) => {
  const { t } = useI18n();

  return (
    <div className={`container-tw mt-header space-y-8 py-8 lg:py-12 `}>
      <div
        className={`relative mx-auto flex w-full max-w-screen-lg justify-between`}
      >
        <div className={`absolute left-0 top-0 h-10 w-full lg:h-12`}>
          <div
            className={`absolute top-1/2 left-1/2 mt-1 h-px w-full w-[calc(100%-56px)] -translate-y-1/2 -translate-x-1/2 bg-gray-200`}
          />
        </div>
        {[
          {
            title: t("breadcrumbsBasket.stepOne"),
            description: t("breadcrumbsBasket.stepOneDescription"),
          },
          {
            title: t("breadcrumbsBasket.stepTwo"),
            description: t("breadcrumbsBasket.stepTwoDescription"),
          },
          {
            title: t("breadcrumbsBasket.stepThree"),
            description: t("breadcrumbsBasket.stepThreeDescription"),
          },
        ].map((item, index) => {
          return (
            <div
              key={`${item.tile}-${index}`}
              className={`relative z-10 flex flex-col items-center`}
            >
              <span
                className={`rounded-full border-4 border-solid border-gray-50`}
              >
                <span
                  className={classNames(
                    "flex h-10 w-10 items-center justify-center rounded-full bg-blue text-base font-semibold lg:h-12 lg:w-12",
                    {
                      "bg-blue  text-white": active === index + 1,
                      "border border-solid border-gray-200 bg-white text-blue":
                        active !== index + 1,
                    }
                  )}
                >
                  {index + 1}
                </span>
              </span>
              <div className={`mt-2 flex flex-col items-center justify-center`}>
                <span className={`text-xs font-semibold text-blue lg:text-sm`}>
                  {item.title}
                </span>
                <span className={`text-xs text-gray-500 lg:text-sm`}>
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
