import { useI18n } from "next-localization";
import React, { useEffect, useState } from "react";
import {
  FaCoffee,
  FaFacebookSquare,
  FaHeart,
  FaTimes,
  FaTwitterSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import PaymentMethods from "../PaymentMethods";
import Button from "../../_primitives/Button";
import { getPageUrl } from "../../../services/contentServices";
import classNames from "classnames";
import LanguageSelect from "../LanguageSelect";
import { Text } from "../Text";
import { LogoGrid } from "../LogoGrid";

const className = "text-gray-700 font-medium w-full text-base hover:underline";
const p = "py-10 md:py-12 lg:py-16";

export const Footer = ({
  isBooking = false,
  isActivity = false,
  data = {},
  pageUrls,
  pageUrlsQuery,
}) => {
  const { t, locale } = useI18n();
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

  const Heading = ({ children, className }) => {
    return (
      <Text as="h5" size="md" className={classNames("mb-3", className)}>
        {children}
      </Text>
    );
  };

  const Column = ({ children, space }) => {
    return (
      <div
        className={classNames("w-full max-w-[250px]", {
          "space-y-8": space,
        })}
      >
        {children}
      </div>
    );
  };

  const ExternalLink = ({ children, item, className, target }) => {
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        target={target ? target : "_self"}
        rel={target === "_blank" ? "noreferrer noopener" : false}
        className={className}
        href={item.href || false}
      >
        {children}
      </a>
    );
  };

  const Links = ({ links }) => {
    return (
      <ul className={`my-0 space-y-2`}>
        {links.map((item) => {
          return (
            <li key={item.text}>
              {item.external ? (
                <ExternalLink
                  target={item.external ? "_blank" : false}
                  className={className}
                  item={item}
                >
                  {item.text}
                </ExternalLink>
              ) : (
                <Button className={className} href={item.href}>
                  {item.text}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const AffiliateCode = () => {
    const [isOpen, setOpen] = useState(false);
    const [affId, setAffId] = useState(1);
    const [copied, setCopied] = useState(t("footer.affiliate.button"));
    const [id, setId] = useState(null);

    useEffect(() => {
      setId(
        data.pageType === "type" ||
          data.pageType === "listing" ||
          data.pageType === "location"
          ? data[data.pageType]?.id
          : data.meta?.id
      );
    }, []);

    const code = `${String.fromCharCode(
      60
    )}script src="https://swissactivities.com/assets/widget.js">${String.fromCharCode(
      60
    )}/script>${String.fromCharCode(
      60
    )}swiss-activities-widget affiliate="${affId}" ident="${id}" type="${
      data.pageType
    }" language="${data.meta.locale.replace("_CH", "")}">${String.fromCharCode(
      60
    )}/swiss-activities-widget>`;

    return [
      <Button
        key="open-code"
        as="div"
        className={classNames(
          className,
          "mt-2 flex cursor-pointer items-center justify-between"
        )}
        onClick={() => {
          setOpen(!isOpen);
        }}
      >
        {t("footer.affiliate.title")}
        <div
          className={classNames(`relative top-0.5`, {
            "rotate-45": !isOpen,
            "rotate-0": isOpen,
          })}
        >
          <FaTimes />
        </div>
      </Button>,
      isOpen && (
        <div className={`mt-2 max-w-full space-y-2 `}>
          <div className={`text-xs`}>
            <label
              className={`flex items-center justify-between text-sm text-gray-700`}
            >
              <span className={`opacity-70`}>Affiliate ID:</span>
              <input
                className={`form-input ml-2 max-h-[40px] max-w-[100px] rounded !px-3 !py-0.5`}
                type="number"
                defaultValue={1}
                min={1}
                onChange={(e) => setAffId(e.target.value)}
              />
            </label>
          </div>
          <pre
            className={`whitespace-pre-wrap break-all rounded-lg bg-black/5 p-2 text-[10px] text-black/60`}
          >
            {code}
          </pre>
          <Button
            className={`cursor-pointer rounded border-none bg-black/10 py-1.5 px-2.5 font-medium text-black transition duration-100 ease-in hover:bg-primary hover:text-white`}
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopied(t("footer.affiliate.buttonCopied"));
              setTimeout(() => {
                setCopied(t("footer.affiliate.button"));
              }, 2000);
            }}
          >
            {copied}
          </Button>
        </div>
      ),
    ];
  };

  const Separator = () => {
    return (
      <div className={`container-tw`}>
        <div className={`h-px w-full bg-gray-200`} />
      </div>
    );
  };

  return (
    <footer className={`bg-gray-50`}>
      <div className={`h-px w-full bg-gray-200`} />
      {!isBooking && (
        <>
          <div
            className={classNames(
              `container-tw grid gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-5 xl:gap-20`,
              p
            )}
          >
            <Column space>
              <div className={`min-w-[200px]`}>
                <Heading>{t("filter.lang")}</Heading>
                <LanguageSelect options={languages} />
              </div>
            </Column>
            <Column>
              <Heading>{t("footer.company.title")}</Heading>
              <Links
                links={[
                  {
                    text: t("footer.company.about-us"),
                    href: getPageUrl("about-us", locale()),
                  },
                  {
                    text: t("footer.company.jobs"),
                    href: "https://apply.workable.com/swissactivities/",
                    external: true,
                  },
                  {
                    text: t("footer.company.legal"),
                    href: getPageUrl("tos_b2c", locale()),
                  },
                ]}
              />
            </Column>
            <Column>
              <Heading>{t("footer.collaboration.title")}</Heading>
              <Links
                links={[
                  {
                    text: t("footer.collaboration.becomeapartner"),
                    href: getPageUrl("supplier", locale()),
                  },
                  {
                    text: t("footer.collaboration.affiliate"),
                    href: getPageUrl("affiliate", locale()),
                  },
                ]}
              />
              {isActivity && <AffiliateCode />}
            </Column>
            <Column>
              <Heading>{t("footer.contact.title")}</Heading>
              <Links
                links={[
                  {
                    text: t("footer.contact.contactus"),
                    href: getPageUrl("contact", locale()),
                  },
                ]}
              />
            </Column>
            <Column>
              <Heading>{t("footer.socialMedia")}</Heading>
              <div className={`flex space-x-5`}>
                {[
                  {
                    href: "https://www.youtube.com/channel/UCsAYE3lz9Q3esS7rTMNuZmg",
                    icon: <FaYoutubeSquare />,
                  },
                  {
                    href: "https://www.facebook.com/swissactivites",
                    icon: <FaFacebookSquare />,
                  },
                  {
                    href: "https://twitter.com/activitiesswiss",
                    icon: <FaTwitterSquare />,
                  },
                ].map((item) => {
                  return (
                    <ExternalLink
                      target="_blank"
                      key={item.href}
                      item={item}
                      className={`text-2xl text-black`}
                    >
                      {item.icon}
                    </ExternalLink>
                  );
                })}
              </div>
            </Column>
          </div>
          <Separator />
          <div className={classNames(`container-tw flex`, p)}>
            <div className={`mx-auto flex items-center`}>
              <PaymentMethods heading={false} center />
            </div>
          </div>
          <Separator />
          <div className={p}>
            <LogoGrid
              items={[
                "/assets/footer/partners/st.png",
                "/assets/footer/partners/stv.png",
                "/assets/footer/partners/swiss-digital-services.png",
                {
                  url: "https://www.swissmadesoftware.org/home.html",
                  img: "/assets/footer/partners/sms.png",
                },
              ]}
            />
          </div>
        </>
      )}
      <div
        className={`bg-[#000e16] pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)]`}
      >
        <div
          className={`container-tw text-center text-xs font-medium uppercase text-white`}
        >
          Made with <FaHeart className={`relative top-px text-red-500`} /> and{" "}
          <FaCoffee className={`relative top-px`} /> in Switzerland
        </div>
      </div>
    </footer>
  );
};
