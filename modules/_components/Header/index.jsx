import Link from "next/link";
import { getPageUrl } from "../../../services/contentServices";
import { useI18n } from "next-localization";
import {
  BsFillGridFill,
  BsGift,
  BsPersonCheck,
  BsPinMapFill,
  BsQuestionCircle,
} from "react-icons/bs";
import { useSearchContext } from "../../../hooks/useSearchContext";
import classNames from "classnames";
import SearchBar from "../SearchBar";
import React, { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LogoMobile } from "./LogoMobile";
import { IoMenuOutline, IoSearch } from "react-icons/io5";
import { Accordion } from "../Accordion";
import { Button } from "../Button";
import { FaSnowboarding } from "react-icons/fa";
import { Text } from "../Text";
import { useBookingStore } from "../../../store/bookingStore";
import Drawer from "../Drawer";
import { useDrawerStore } from "../../../store/drawerStore";
import LanguageSelect from "../LanguageSelect";

const NavbarNew = ({
  meta,
  pageType,
  pageUrls,
  pageUrlsQuery,
  menu,
  type,
  shadow = true,
}) => {
  const isActivity = pageType === "activity";
  const isHomepage = pageType === "homepage";
  const isSearch = pageType === "s";
  const isBooking = type === "booking";
  const { t, locale } = useI18n();
  const { isMobile, setIsMobile, setIsDesktop } = useSearchContext();
  const [isTop, setIsTop] = useState(true);
  const [cartAmount, setCartAmount] = useState(null);
  const isOpen = useBookingStore((state) => state.isOpen);
  const level = useBookingStore((state) => state.level);
  const setOpen = useDrawerStore((state) => state.setOpen);

  const menuArr = [
    menu?.locations.length > 1
      ? {
          text: t("filter.location"),
          type: "location",
          icon: (
            <span className={`flex text-primary`}>
              <BsPinMapFill />
            </span>
          ),
          children: menu.locations.map((item) => {
            return {
              text: item.title,
              href: item.url,
            };
          }),
        }
      : {},
    menu?.types.length > 1
      ? {
          text: t("filter.type"),
          type: "type",
          icon: (
            <span className={`flex text-primary`}>
              <BsFillGridFill />
            </span>
          ),
          children: menu.types.map((item) => {
            return {
              text: item.title,
              href: item.url,
            };
          }),
        }
      : {},
    {
      text: t("menu.ask"),
      icon: <BsQuestionCircle />,
      children: [
        {
          text: t("menu.help"),
          onClick: () => $crisp.push(["do", "chat:open"]),
        },
        {
          text: t("menu.contactus"),
          href: getPageUrl("contact", locale()),
        },
      ],
    },
    {
      text: t("menu.voucher"),
      href: meta?.locale
        ? `https://shop.e-guma.ch/swiss-activities/${meta.locale.replace(
            "_CH",
            ""
          )}/gutscheine/38315/wertgutschein`
        : "https://shop.e-guma.ch/swiss-activities/de/gutscheine/38315/wertgutschein",
      icon: <BsGift />,
    },
    {
      text: t("menu.partners"),
      icon: <BsPersonCheck />,
      children: [
        {
          text: t("menu.provider"),
          href: "https://supplier.swissactivities.com/de/",
        },
        {
          text: t("menu.affiliate"),
          href: "https://supplier.swissactivities.com/de/affiliate-swiss-activities",
        },
      ],
    },
  ];

  const languages = [];
  if (pageUrls) {
    for (const locale of Object.keys(pageUrls)) {
      languages.push({
        value: locale,
        url: pageUrls[locale],
        label: t(`locales.${locale}.name`),
        queryParams: pageUrlsQuery,
      });
    }
  }

  useEffect(() => {
    const setTop = () => {
      if (window.scrollY < 100) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
    };

    setCartAmount(localStorage.getItem("cartAmount") || "0");
    window.addEventListener("scroll", setTop);
    setTop();

    return () => {
      window.removeEventListener("scroll", setTop);
    };
  }, []);

  const MobileMenu = () => {
    return (
      <Drawer
        padding={false}
        ident="mobile-menu"
        title={t("header.navigation")}
      >
        <ul className={`divide-y divide-solid divide-gray-200`}>
          {menuArr.map((item) => {
            return (
              <Accordion className={`!px-6`} key={item.text} item={item} />
            );
          })}
        </ul>
      </Drawer>
    );
  };

  return (
    <>
      <header
        className={classNames(
          `duration-250 top-0 left-0 z-[105] h-[var(--h-header)] w-full border-b border-gray-300 bg-white py-2 backdrop-blur-md transition ease-in`,
          {
            "shadow-md": shadow,
            fixed: !isActivity || isMobile,
            "absolute lg:fixed": isActivity && !isMobile,
            "!z-0 lg:!z-[105]":
              (isHomepage && isMobile) || (isOpen && isActivity && level === 3),
          }
        )}
      >
        <div
          className={`container-tw mx-auto flex h-full w-full items-center justify-between`}
        >
          <Link
            prefetch={false}
            href={getPageUrl("homepage", locale())}
            passHref
          >
            <a className={`mr-6 block lg:mr-10 lg:mr-12`}>
              <span
                className={`relative left-[-3px] hidden origin-left scale-95 transform lg:block`}
              >
                <Logo />
              </span>
              <span
                className={`relative top-px block origin-left scale-110 transform lg:hidden`}
              >
                <LogoMobile />
              </span>
            </a>
          </Link>
          {!isBooking ? (
            <>
              {!isHomepage && (
                <div
                  className={classNames(`w-full max-w-[800px]`, {
                    "hidden lg:block": !isSearch,
                    "!block": isMobile,
                  })}
                >
                  <SearchBar meta={meta} type={`header`} />
                </div>
              )}
              <div
                className={classNames(
                  `flex items-center pl-4 lg:space-x-3 lg:pl-8`
                )}
              >
                {isHomepage && !isTop && (
                  <Button
                    type="transparent"
                    className={"!hidden lg:!flex"}
                    onClick={() => {
                      document.getElementById("search").scrollIntoView();
                      setIsDesktop(true);
                    }}
                    icon={<IoSearch />}
                  />
                )}
                <Button
                  type="transparent"
                  className={classNames(
                    "group !relative !hidden !max-w-none lg:!flex"
                  )}
                  text={t("filter.activities")}
                  icon={<FaSnowboarding />}
                  onMouseEnter={() => setIsDesktop(false)}
                >
                  <div
                    className={`absolute right-0 top-[48px] hidden min-w-[500px] cursor-default pt-2.5 group-hover:block`}
                  >
                    <div
                      className={`grid w-full w-full auto-cols-max grid-flow-col gap-8 rounded-lg border border-solid border-gray-200 bg-white p-8 shadow-md`}
                    >
                      {menuArr.map((item) => {
                        return (
                          item.children &&
                          (item.type === "location" ||
                            item.type === "type") && (
                            <div
                              className={`text-left`}
                              key={`menu-${item.text}`}
                            >
                              <div className={`mb-2 flex items-center`}>
                                <span className={`flex !text-primary`}>
                                  {item.icon}
                                </span>
                                <Text size="md" className={`ml-2`}>
                                  {item.text}
                                </Text>
                              </div>
                              <ul className={`grid`}>
                                {item.children.map((itemChild) => {
                                  return (
                                    itemChild.href && (
                                      <li
                                        className={`w-full`}
                                        key={`header-${itemChild.text}`}
                                      >
                                        <Link href={itemChild.href} passHref>
                                          <a
                                            className={`inline-block w-full py-1 text-sm text-gray-700 hover:underline`}
                                          >
                                            {itemChild.text}
                                          </a>
                                        </Link>
                                      </li>
                                    )
                                  );
                                })}
                              </ul>
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>
                </Button>
                <Button
                  type="transparent"
                  className={classNames("!hidden lg:!flex")}
                  onClick={() => $crisp.push(["do", "chat:open"])}
                  text={<span className={`hidden lg:block`}>Chat</span>}
                  icon={<BsQuestionCircle />}
                />
                {!isSearch && (
                  <Button
                    type="transparent"
                    className={"lg:hidden"}
                    onClick={() => setIsMobile(true)}
                    icon={<IoSearch />}
                  />
                )}
                <Button
                  type="transparent"
                  href={getPageUrl("basket", locale())}
                  icon={
                    <div className={`relative flex`}>
                      {cartAmount && cartAmount >= 1 && (
                        <span
                          className={`absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white`}
                        >
                          {cartAmount}
                        </span>
                      )}
                      <svg
                        className={`h-[17px] w-[17px]`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M96 0C107.5 0 117.4 8.19 119.6 19.51L121.1 32H541.8C562.1 32 578.3 52.25 572.6 72.66L518.6 264.7C514.7 278.5 502.1 288 487.8 288H170.7L179.9 336H488C501.3 336 512 346.7 512 360C512 373.3 501.3 384 488 384H159.1C148.5 384 138.6 375.8 136.4 364.5L76.14 48H24C10.75 48 0 37.25 0 24C0 10.75 10.75 0 24 0H96zM475.6 240L520.6 80H131.1L161.6 240H475.6zM128 464C128 437.5 149.5 416 176 416C202.5 416 224 437.5 224 464C224 490.5 202.5 512 176 512C149.5 512 128 490.5 128 464zM512 464C512 490.5 490.5 512 464 512C437.5 512 416 490.5 416 464C416 437.5 437.5 416 464 416C490.5 416 512 437.5 512 464z" />
                      </svg>
                    </div>
                  }
                />
                {languages.length >= 1 && (
                  <div className={`!ml-8 hidden lg:block`}>
                    <LanguageSelect
                      options={languages}
                      value={languages.find((l) => l.value === locale())}
                    />
                  </div>
                )}
                <Button
                  type="transparent"
                  className={"lg:hidden"}
                  onClick={() => setOpen("mobile-menu")}
                  icon={<IoMenuOutline className={`h-6 w-6`} />}
                />
              </div>
            </>
          ) : (
            <Button
              type="transparent"
              onClick={() => $crisp.push(["do", "chat:open"])}
              icon={<BsQuestionCircle />}
            />
          )}
        </div>
      </header>
      <MobileMenu />
    </>
  );
};

export default NavbarNew;
