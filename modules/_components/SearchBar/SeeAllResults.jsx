import { connectStateResults } from "react-instantsearch-dom";
import Link from "next/link";
import { createQuery } from "../../../utils";
import { FaArrowRight } from "react-icons/fa";
import React from "react";
import { useI18n } from "next-localization";

const SeeAllResults = connectStateResults(({ searchState }) => {
  const { t, locale } = useI18n();

  return (
    <Link
      href={
        searchState.query
          ? {
              pathname: `${
                locale() !== "de_CH"
                  ? `/${locale().toLowerCase().replace("_", "-")}`
                  : ""
              }/s/`,
              query: createQuery({
                query: searchState.query,
              }),
            }
          : {
              pathname: `${
                locale() !== "de_CH"
                  ? `/${locale().toLowerCase().replace("_", "-")}`
                  : ""
              }/s/`,
            }
      }
    >
      <a
        style={{
          borderBottom: "none",
          borderLeft: "none",
          borderRight: "none",
        }}
        tabIndex={0}
        className={
          "group flex w-full cursor-pointer items-center justify-between border-t border-solid border-gray-200 bg-white px-5 py-4 font-medium text-black hover:bg-gray-100 lg:col-span-3 lg:px-7"
        }
      >
        <span>{t("filter.viewAll")}</span>
        <FaArrowRight className={"ml-4"} />
      </a>
    </Link>
  );
});

export default React.memo(SeeAllResults);
