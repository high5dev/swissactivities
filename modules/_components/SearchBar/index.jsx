import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import { useSearchContext } from "../../../hooks/useSearchContext";
import classNames from "classnames";
import { useRouter } from "next/router";
import Results from "./Results";
import SeeAllResults from "./SeeAllResults";
import { disableBodyLock, enableBodyLock } from "../../../utils/bodylock";

const SearchBar = ({ meta, type }) => {
  const router = useRouter();
  const isHeader = type === "header";
  const { isSearchPage, isMobile, setIsMobile, setIsDesktop } =
    useSearchContext();
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setVh();
    });

    setVh();

    function reset() {
      resetMobile();
      setIsDesktop(false);
    }

    router.events.on("routeChangeComplete", reset);

    return () => {
      router.events.off("routeChangeComplete", reset);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      clickMobile();
    } else {
      resetMobile();
    }
  }, [isMobile]);

  const clickMobile = () => {
    if (!isSearchPage) {
      setScroll(window.pageYOffset);
      document.getElementById("search-container")?.classList.add("grid");
      document.getElementById("search-container")?.classList.remove("hidden");
      document.getElementById("search-results")?.classList.add("block");
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      enableBodyLock();
      document.querySelector("header .search-input")?.focus();
    }
  };

  const resetMobile = () => {
    if (!isSearchPage) {
      document.getElementById("search-container")?.classList.remove("grid");
      document.getElementById("search-container")?.classList.add("hidden");
      document.getElementById("search-results")?.classList.remove("block");
      if (!document.body.classList.contains("is-map-search")) {
        disableBodyLock();
      }
      if (isMobile) {
        window.scrollTo(0, scroll);
      }
    }
    setIsMobile(false);
  };

  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh * 100}px`);
  };

  return (
    <div id="search" className={"w-full select-none "}>
      {!isSearchPage && type !== "header" && (
        <div
          role="button"
          onClick={() => setIsMobile(true)}
          className={"relative lg:hidden"}
        >
          <span className={"pointer-events-none"}>
            <SearchBox type="dummy" />
          </span>
        </div>
      )}
      <div
        id="search-container"
        className={classNames(
          "hidden lg:relative lg:z-[2] lg:block lg:h-auto lg:rounded-full lg:border-solid",
          {
            "lg:border-2": isHeader,
            "lg:border-4": !isHeader,
            "!block": isSearchPage,
            "lg:border-primary": type !== "header",
            "lg:border-blue": type === "header",
            "fixed left-0 top-0 z-[100] grid h-[var(--vh)] w-full grid-rows-[auto,1fr,auto] bg-white":
              !isSearchPage,
          }
        )}
      >
        <SearchBox onMobileReset={resetMobile} type={type} />
        {!isSearchPage && (
          <>
            <Results isHeader={isHeader} meta={meta} />
            <div className={"block w-full lg:hidden"}>
              <SeeAllResults meta={meta} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
