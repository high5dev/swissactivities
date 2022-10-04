import { Text } from "../Text";
import { Button } from "../Button";
import { useI18n } from "next-localization";
import * as Icons from "./icons";
import styles from "./styles.module.scss";
import classNames from "classnames";

export const SkiResort = ({ region, className }) => {
  const { t } = useI18n();

  const dateConvert = (input) => {
    const array = (input || "").toString().split(/\-/g);
    array.push(array.shift());
    return `${array[1]}/${array[0]}/${array[2]}` || null;
  };

  return (
    <div
      className={classNames(
        `w-full bg-gradient-to-tr from-slate-50 to-slate-100`,
        {
          [className]: className,
        }
      )}
    >
      <div className={`container-tw m:mr-0 py-8 lg:py-16`}>
        <div className={`flex items-start justify-between`}>
          <div>
            <Text as="h2" size="lg" className={``}>
              {t("skiresortInfo.title")}
            </Text>
            <span className={`text-sm`}>
              {t("skiresortInfo.lastUpdate", {
                date: dateConvert(region.lastUpdate),
              })}
            </span>
          </div>
          {region.mapLink && (
            <Button
              href={region.mapLink}
              className={`flex items-center`}
              target="_blank"
              rel="noreferrer"
              type="tertiary"
              text={t("skiresortInfo.mapLink")}
              icon={<Icons.ExternalLink />}
            />
          )}
        </div>
        <div className={`relative overflow-x-hidden sm:mr-0`}>
          <div
            className={`absolute right-0 h-full w-16 bg-gradient-to-r from-transparent sm:hidden`}
          />
          <ul
            className={`mt-6 -mr-8 flex max-w-full space-x-3 overflow-x-auto pr-12 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-x-0 sm:overflow-x-hidden sm:pr-0 md:flex md:flex-wrap`}
          >
            {[
              {
                label: t("skiresortInfo.label.status"),
                icon: <Icons.Mountain />,
                value: t(
                  region.isOpen
                    ? "skiresortInfo.status.open"
                    : "skiresortInfo.status.close"
                ),
                className: styles.iconStroke,
              },
              {
                label: t("skiresortInfo.label.openLifts"),
                icon: <Icons.Lift />,
                value: t("skiresortInfo.openTotalKm", {
                  open: region.lifts.openKm,
                  total: region.lifts.totalKm,
                }),
                className: styles.iconStroke,
              },
              {
                label: t("skiresortInfo.label.openSlopes"),
                icon: <Icons.Ski />,
                value: t("skiresortInfo.openTotalKm", {
                  open: region.slopes.openKm,
                  total: region.slopes.totalKm,
                }),
                className: styles.iconFill,
              },
              {
                label: t("skiresortInfo.label.snowQuality"),
                icon: <Icons.Snow />,
                value: t("skiresortInfo.snowQuality." + region.snow.quality),
                className: styles.iconFill,
              },
              {
                label: t("skiresortInfo.label.lastSnowfall"),
                icon: <Icons.Time />,
                value: dateConvert(region.snow.lastFall),
                className: styles.iconFill,
              },
            ].map((item) => {
              return (
                <li
                  key={item.label}
                  className={`rounded-lg border border-solid border-gray-200 bg-white p-3 md:px-6`}
                >
                  <div className={`flex items-center text-gray-700`}>
                    <span className={classNames(`flex w-8`, item.className)}>
                      {item.icon}
                    </span>
                    <span
                      className={`whitespace-nowrap text-sm font-medium uppercase text-gray-600`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`mt-2 inline-block font-medium text-black md:mt-3`}
                  >
                    {item.value}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
