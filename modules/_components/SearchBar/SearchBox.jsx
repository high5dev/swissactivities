import React, { useEffect, useRef, useState } from "react";
import { connectSearchBox, connectStateResults } from "react-instantsearch-dom";
import { FaArrowLeft, FaMapPin } from "react-icons/fa";
import { useSearchContext } from "../../../hooks/useSearchContext";
import classNames from "classnames";
import { getSearchParams } from "../../../utils";
import { useI18n } from "next-localization";
import debounce from "lodash/debounce";
import Link from "next/link";
import { createQuery } from "../../../utils";
import { useRouter } from "next/router";
import { BsXLg } from "react-icons/bs";
import { dataLayerSend } from "../../../utils/dataLayerSend";

export default connectSearchBox(({ refine, onMobileReset, type }) => {
  const router = useRouter();
  const { t, locale } = useI18n();
  const { isMobile, isDesktop, setIsDesktop, value } = useSearchContext();
  const [isFocus, setFocus] = useState(false);
  const isSearchPage = useSearchContext().isSearchPage;
  const isHeader = type === "header";
  const isDummy = type === "dummy";
  const isHomepage = type === "homepage";
  const textInput = useRef(null);
  const debouncedSearch = debounce((e) => refine(e.target.value), 500);

  useEffect(() => {
    const q = getSearchParams(window.location)["query"];
    if (isSearchPage && q !== undefined) {
      textInput.current.value = q;
    }
  }, [isSearchPage]);

  useEffect(() => {
    if (isDesktop) {
      textInput.current.focus();
    } else {
      textInput.current.blur();
    }
  }, [isDesktop, isMobile]);

  useEffect(() => {
    textInput.current.value = value;
  }, [value]);

  const onChange = (e) => {
    debouncedSearch(e, e.eventTarget);
  };

  const onFocus = () => {
    if (!isSearchPage) {
      setIsDesktop(true);
      setFocus(true);
    }
  };

  const onBlur = (e) => {
    if (!isSearchPage) {
      if (
        e?.relatedTarget?.tagName === "BUTTON" &&
        e?.relatedTarget?.getAttribute("type") === "reset"
      ) {
        e.preventDefault();
      } else if (e?.relatedTarget?.tagName !== "A") {
        setFocus(false);
        setIsDesktop(false);
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dataLayerSend({
      event: "view_search_results",
      search_term: textInput.current.value,
    });
    if (isMobile) {
      router.push({
        pathname: `/s/`,
        query: createQuery({
          query: textInput.current.value,
        }),
      });
    }
  };

  const mobileReset = () => {
    refine("");
    textInput.current.value = "";
    if (isDesktop) {
      setFocus(false);
      setIsDesktop(false);
    }
  };

  const mobileClose = () => {
    onMobileReset();
  };

  const ResetButton = connectStateResults(({ searchState }) => {
    return (
      !isDummy &&
      searchState.query?.length >= 1 && (
        <button
          style={{
            borderBottom: "none",
            borderTop: "none",
            borderRight: "none",
          }}
          type="reset"
          className={classNames(
            "flex h-full w-10 cursor-pointer items-center justify-center border-l border-solid border-gray-200 bg-white pr-2 text-black hover:bg-gray-100 lg:w-14",
            {
              "rounded-r-full": isHeader,
            }
          )}
          hidden=""
          onClick={mobileReset}
        >
          <BsXLg />
        </button>
      )
    );
  });

  const SeeAllResults = connectStateResults(({ searchState }) => {
    return (
      !isDummy &&
      !isSearchPage &&
      searchState.query?.length >= 1 && (
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
              borderTop: "none",
              borderRight: "none",
            }}
            tabIndex={0}
            className={classNames(
              "flex h-full items-center justify-center border-l border-solid border-gray-200 bg-white px-3 text-sm font-medium text-black hover:bg-gray-100 lg:right-14 lg:px-4",
              { hidden: isMobile }
            )}
          >
            <span>{t("filter.viewAll")}</span>
          </a>
        </Link>
      )
    );
  });

  const SeeMapResults = connectStateResults(({ searchState }) => {
    return (
      isHomepage &&
      !isHeader &&
      !isMobile && (
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
                    mode: "map",
                  }),
                }
              : {
                  pathname: `${
                    locale() !== "de_CH"
                      ? `/${locale().toLowerCase().replace("_", "-")}`
                      : ""
                  }/s/`,
                  query: createQuery({
                    mode: "map",
                  }),
                }
          }
          passHref
        >
          <a
            className={`-my-px -mr-px flex items-center justify-center rounded-r-full border-none bg-primary pl-4 pr-6 font-semibold text-white transition duration-100 ease-in hover:bg-dark`}
          >
            <FaMapPin className={`mr-2`} />
            {t("filter.mapView")}
          </a>
        </Link>
      )
    );
  });

  return (
    <div
      className={classNames(`ais-SearchBox relative block`, {
        "is-focus": isFocus,
        "is-header": isHeader,
      })}
    >
      <div className={"flex"}>
        {onMobileReset && !isSearchPage && (
          <button
            onClick={mobileClose}
            className={
              "top-0 flex flex w-full w-20 items-center items-center justify-center justify-center !border-none bg-gray-800 text-lg text-white hover:bg-gray-900 lg:hidden"
            }
          >
            <FaArrowLeft />
          </button>
        )}
        <form
          noValidate=""
          className={classNames("relative w-full", {
            "border-solid lg:border-none": onMobileReset,
            "border-2": onMobileReset && !isMobile,
            "border-4": onMobileReset && isMobile,
            "border-solid border-primary": !isSearchPage,
            "rounded-full border-solid border-blue": isSearchPage,
            "overflow-hidden rounded-full": isDummy,
          })}
          action=""
          role="search"
          onSubmit={onSubmit}
        >
          <input
            tabIndex={0}
            type="text"
            placeholder={t("placeholder.headerSearch")}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            required=""
            maxLength="512"
            className={classNames(
              "search-input h-full w-full cursor-text rounded-full border-none !bg-white !pl-10 text-base font-medium text-black placeholder-gray-500 focus:outline-none lg:rounded-full",
              {
                "py-2 px-4 sm:py-2.5": isHeader && !isMobile,
                "py-3 px-4": isMobile && !isDummy,
                "py-2 px-4 lg:py-4 lg:px-5":
                  (isHomepage || isDummy) && !isMobile,
                "lg:!pl-12": !isHeader && !isMobile,
              }
            )}
            onInput={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={textInput}
          />
          <button
            type="submit"
            className={classNames(
              "fill-current text-blue absolute top-1/2 mt-px left-1 h-auto -translate-y-1/2 border-none bg-transparent",
              {
                "!left-2": !isHeader && !isMobile,
              }
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 40 40"
            >
              <path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z" />
            </svg>
          </button>
          <div
            className={`absolute right-0 top-0 flex h-full overflow-hidden rounded-r-full`}
          >
            <SeeAllResults />
            <ResetButton />
          </div>
        </form>
      </div>
    </div>
  );
});
