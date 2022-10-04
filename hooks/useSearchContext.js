import algoliasearch from "algoliasearch/lite";
import React, { useState, useContext, useEffect, useRef } from "react";
import { InstantSearch } from "react-instantsearch-dom";
import { useRouter } from "next/router";
import { getSearchParams, createURL, searchStateToUrl } from "../utils";
import { disableBodyLock } from "../utils/bodylock";
import { useDrawerStore } from "../store/drawerStore";

const SearchContext = React.createContext({
  isDesktop: false,
  isMapListOpen: false,
  isMobile: false,
  isSearchPage: "",
  mode: "",
  setIsDesktop: () => {},
  setIsMapListOpen: () => {},
  setIsMobile: () => {},
  setMode: () => {},
  setValue: () => {},
  setVisible: () => {},
  value: "",
  visible: false,
});

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const algoliaClient = algoliasearch(appId, apiKey);

export const SearchContextProvider = ({ children }) => {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMapListOpen, setIsMapListOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [searchState, setSearchState] = useState({});
  const [mode, setMode] = useState("");
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const debouncedSetStateRef = useRef(null);
  const setDrawer = useDrawerStore((state) => state.setOpen);

  const checkIfS = () => {
    return (
      router.asPath.startsWith("/s/") ||
      router.asPath.startsWith("/en-ch/s/") ||
      router.asPath.startsWith("/it-ch/s/") ||
      router.asPath.startsWith("/fr-ch/s/")
    );
  };

  const onSearchStateChange = (updatedSearchState) => {
    if (checkIfS()) {
      clearTimeout(debouncedSetStateRef.current);

      debouncedSetStateRef.current = setTimeout(() => {
        router.push(
          searchStateToUrl(window.location, {
            ...updatedSearchState,
            mode: mode,
          }),
          undefined,
          { scroll: false }
        );
      }, 500);
    }

    setSearchState(updatedSearchState ?? {});
  };

  useEffect(() => {
    if (checkIfS()) {
      setIsSearchPage(true);
      setSearchState(getSearchParams(window.location ?? {}));
    } else {
      document.body.classList.remove("is-map-search");
      setIsSearchPage(false);
      setSearchState({});
    }
    if (!document.body.classList.contains("is-map-search") && !document.body.classList.contains("is-filter-open")) {
      disableBodyLock(true);
    }
    setDrawer("");
  }, [router]);

  const searchClient = {
    ...algoliaClient,
    search(requests) {
      if (isMobile || isDesktop || isSearchPage) {
        return algoliaClient.search(requests).then((results) => {
          setVisible(
            results.results[0].query === "" || results.results[0].nbHits !== 0
          );

          return results;
        });
      }
    },
  };

  return (
    <SearchContext.Provider
      value={{
        isDesktop: isDesktop,
        isMapListOpen: isMapListOpen,
        isMobile: isMobile,
        isSearchPage: isSearchPage,
        setIsDesktop: setIsDesktop,
        setIsMapListOpen: setIsMapListOpen,
        setIsMobile: setIsMobile,
        setValue: setValue,
        value: value,
        mode: mode,
        setMode: setMode,
        visible: visible,
        setVisible: setVisible,
      }}
    >
      <InstantSearch
        indexName={`${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}_ACTIVITIES`}
        searchClient={searchClient}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createURL={createURL}
      >
        {children}
      </InstantSearch>
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
