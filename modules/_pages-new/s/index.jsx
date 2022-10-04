import { useI18n } from "next-localization";
import Layout from "../../_components/Layout";
import {
  Configure,
  connectStateResults,
  connectCurrentRefinements,
} from "react-instantsearch-dom";
import { Activity } from "../../_components/Activity";
import Hits from "./Hits";
import Filters from "./Filters";
import { FaList, FaMapPin, FaRegStar, FaTimes } from "react-icons/fa";
import { useEffect } from "react";
import { Sort } from "./Sort";
import { Tags } from "./Tags";
import orderBy from "lodash/orderBy";
import classNames from "classnames";
import { Map } from "./Map";
import { useSearchContext } from "../../../hooks/useSearchContext";
import { getSearchParams } from "../../../utils";
import { getPageUrls, getParams } from "../../../services/contentServices";
import { FilterDrawer } from "./FilterDrawer";

export const S = ({ menu }) => {
  const { t, locale } = useI18n();
  const { mode, setMode, visible } = useSearchContext("");

  const urls = getPageUrls("s");

  useEffect(() => {
    setMode(getSearchParams(window.location)?.mode || "list");
  }, []);

  useEffect(() => {
    if (mode === "map") {
      document.body.classList.add("is-map-search");
    } else if (mode === "list") {
      document.body.classList.remove("is-map-search");
    }
  }, [mode]);

  const meta = {
    title: t("pages.s.title"),
    desc: t("pages.s.description"),
    locale: locale(),
  };

  const HitsInfo = connectStateResults(({ searchResults }) => {
    return (
      searchResults &&
      searchResults.nbHits !== 0 &&
      mode === "list" && (
        <span
          className={`mb-4 mt-6 inline-block text-lg font-medium text-gray-900 sm:my-0`}
        >
          {t("activity.title")} ({searchResults?.nbHits})
        </span>
      )
    );
  });

  const Refinements = connectCurrentRefinements(({ items, refine }) => {
    return (
      items.length >= 1 && (
        <div className={`mb-8 empty:hidden`}>
          <ul className={`flex flex-wrap empty:hidden`}>
            {items.map((item) => {
              return item.id === "ratingRounded" ? (
                <li className={`mr-2  mt-2 max-w-max`}>
                  <a
                    className={`inline-flex items-center rounded border border-solid border-gray-600 px-3 py-1.5 text-xs font-semibold uppercase text-gray-600 transition duration-100 ease-in hover:border-blue hover:bg-blue hover:text-white`}
                    onClick={(event) => {
                      event.preventDefault();
                      refine(item.value);
                    }}
                  >
                    Min. {item.currentRefinement.min}{" "}
                    <FaRegStar className={`ml-1`} />
                    <FaTimes className={`ml-1`} />
                  </a>
                </li>
              ) : item.id !== "availability" &&
                (item.id === "locationH.lvl0" ||
                  item.id === "locationH.lvl1" ||
                  item.id === "typeH.lvl0" ||
                  item.id === "typeH.lvl1") ? (
                <li className={`mr-2  mt-2 max-w-max`} key={item.label}>
                  <a
                    className={`inline-flex items-center rounded border border-solid border-gray-600 px-3 py-1.5 text-xs font-semibold uppercase text-gray-600 transition duration-100 ease-in hover:border-blue hover:bg-blue hover:text-white`}
                    onClick={(event) => {
                      event.preventDefault();
                      refine(item.value);
                    }}
                  >
                    {item.currentRefinement}
                    <FaTimes className={`ml-1`} />
                  </a>
                </li>
              ) : (
                item.id !== "availability" &&
                item.items?.map((nested) => {
                  return (
                    <li className={`mr-2  mt-2 max-w-max`} key={nested.label}>
                      <a
                        className={`inline-flex items-center rounded border border-solid border-gray-600 px-3 py-1.5 text-xs font-semibold uppercase text-gray-600 transition duration-100 ease-in hover:border-blue hover:bg-blue hover:text-white`}
                        onClick={(event) => {
                          event.preventDefault();
                          refine(nested.value);
                        }}
                      >
                        {nested.label}
                        <FaTimes className={`ml-1`} />
                      </a>
                    </li>
                  );
                })
              );
            })}
          </ul>
        </div>
      )
    );
  });

  return (
    <Layout
      meta={meta}
      isS={true}
      disableLinksBlock
      menu={menu}
      pageUrls={urls}
    >
      <div
        className={classNames(
          "mt-header mx-auto flex flex-col lg:min-h-[700px]",
          {
            visible: visible || mode === "map",
            invisible: !visible && mode === "list",
            "mb-0 max-w-none bg-white lg:z-10": mode === "map",
            "container mb-12 px-4": mode === "list",
          }
        )}
      >
        <div
          className={classNames({
            "mb-0 flex items-center justify-between lg:gap-0": mode === "map",
            "mb-4 lg:grid lg:grid-cols-[320px,1fr] lg:gap-y-6 lg:gap-x-12":
              mode === "list",
          })}
        >
          <Filters isMap={mode === "map"} />
          <div
            className={classNames(
              `container sticky top-[var(--h-header)] z-40 grid h-[60px] w-full grid-cols-[1fr,100px] items-center justify-between bg-white lg:static lg:col-span-2 lg:row-start-1 lg:h-[80px] lg:grid-cols-[1fr,auto] lg:gap-4`,
              { "px-4 ": mode === "map" }
            )}
          >
            <Tags
              isMap={mode === "map"}
              attributes={["typeH.lvl0", "typeH.lvl1"]}
              limit={100}
              transformItems={(items) => orderBy(items, "label", "asc")}
            />
            <div className={`ml-auto flex`}>
              {[
                {
                  type: "list",
                  icon: <FaList />,
                  onClick: () => {
                    setMode("list");
                  },
                },
                {
                  type: "map",
                  icon: <FaMapPin />,
                  onClick: () => {
                    setMode("map");
                  },
                },
              ].map((item, index) => {
                return (
                  <div
                    key={index}
                    role="button"
                    onClick={item.onClick}
                    className={classNames(
                      `flex h-[32px] w-10 cursor-pointer items-center justify-center border-2 border-solid border-blue transition duration-100 ease-in hover:bg-gray-50 lg:h-[-36px] lg:w-12`,
                      {
                        "relative left-[-2px] rounded-r-md": index === 1,
                        "rounded-l-md": index === 0,
                        "!bg-blue !text-white": item.type === mode,
                        "text-blue": item.type !== mode,
                      }
                    )}
                  >
                    {item.icon}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className={classNames(`mt-6`, {
              "mt-0": mode === "map",
              "lg:mt-0": mode === "list",
            })}
          >
            <div
              className={classNames(
                `flex w-full flex-col-reverse flex-wrap justify-between sm:flex-row`,
                {
                  "sm:mb-6": mode === "list",
                }
              )}
            >
              <HitsInfo />
              <Sort hide={mode === "map"} />
            </div>
            {mode === "list" && <Refinements />}
            <Configure
              hitsPerPage={mode === "list" ? 15 : 30}
              filters={`locale: ${meta.locale} AND priceNumber > 0`}
            />
            {mode === "list" && <Hits hitComponent={Activity} />}
          </div>
        </div>
        {mode === "map" && <Map />}
      </div>
      {/*<FilterDrawer />*/}
    </Layout>
  );
};

export const sStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);

  return {
    props: {
      ...params,
    },
  };
};
