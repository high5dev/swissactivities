import { useMemo } from "react";
import Link from "next/link";
import types from "prop-types";
import { useI18n } from "next-localization";
import BreadcrumbsGSD from "../../BreadcrumbsGSD";
import { getPageUrl } from "../../../services/contentServices";
import { FaArrowRight } from "react-icons/fa";

const Breadcrumbs = ({ breadcrumbs, last }) => {
  const { t, locale } = useI18n();
  const currentLocale = locale();
  const data = useMemo(
    () => [
      {
        title: t("menu.switzerland"),
        url: getPageUrl("activities", currentLocale),
      },
      ...breadcrumbs.map((b) => ({
        title: b.title,
        url: b.urls[currentLocale],
      })),
    ],
    [breadcrumbs, currentLocale, t]
  );

  return (
    <div className={`relative`}>
      <BreadcrumbsGSD items={data} />
      <div
        className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white`}
      />
      <div id={"breadcrumb"} className={`flex max-w-full overflow-y-auto`}>
        {(last ? [data[data.length - 1]] : data).map((item, index) => (
          <Link key={item.url} href={item.url} prefetch={false}>
            <a
              className={`flex items-center whitespace-nowrap text-xs font-medium text-gray-800 hover:underline lg:text-sm`}
            >
              {last ? item.titleFrontend : item.title}{" "}
              {data.length > index + 1 && !last && (
                <>
                  <span
                    className={`hidden px-1.5 text-xs text-gray-300 sm:flex`}
                  >
                    <FaArrowRight />
                  </span>
                  <span className={`flex px-1 text-xs text-gray-400 sm:hidden`}>
                    |
                  </span>
                </>
              )}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};
Breadcrumbs.propTypes = {
  breadcrumbs: types.arrayOf(
    types.shape({
      title: types.string.isRequired,
      urls: types.objectOf(types.string.isRequired),
    })
  ).isRequired,
};

export default Breadcrumbs;
