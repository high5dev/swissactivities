import Head from "next/head";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { defaultLocale, formatLocaleForUrl } from "../../lib/i18n";
import React from "react";

const BASE_URL = "https://www.swissactivities.com";

const Meta = ({ title, desc, image, js, pageUrls = {}, pageNum = null }) => {
  const router = useRouter();
  const { locale } = useI18n();
  const currentLocale = locale();

  const fullTitle = `${title} | Swiss Activities`;

  const canonical = formatUrl(
    pageUrls[currentLocale] || router.pathname,
    pageNum
  );
  const defaultPath = formatUrl(
    pageUrls[defaultLocale] || router.pathname,
    pageNum
  );

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={fullTitle} />
      <meta name="og:description" property="og:description" content={desc} />
      <meta property="og:site_name" content="Swiss Activities" />
      <meta property="og:url" content={canonical} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:site" content="@ActivitiesSwiss" />
      <meta name="twitter:creator" content="@ActivitiesSwiss" />
      {image && <meta name="twitter:image" content={image} />}
      <link rel="shortcut icon" type="image/png" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" href={defaultPath} hrefLang="x-default" />
      <link
        rel="preconnect"
        href="https://contentapi-swissactivities.imgix.net"
      />
      <link
        rel="dns-prefetch"
        href="https://contentapi-swissactivities.imgix.net"
      />
      <link rel="preconnect" href="https://website-swissactivities.imgix.net" />
      <link
        rel="dns-prefetch"
        href="https://website-swissactivities.imgix.net"
      />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      {pageUrls && (
        <>
          {Object.keys(pageUrls).map((locale) => {
            return (
              <link
                key={locale}
                rel="alternate"
                href={formatUrl(pageUrls[locale], pageNum)}
                hrefLang={formatLocaleForUrl(locale)}
              />
            );
          })}
        </>
      )}
      {js && <script async type="text/javascript" src={js} />}
    </Head>
  );
};

function formatUrl(path, pageNum) {
  if (path.substr(-1, 1) !== "/") {
    path = path + "/";
  }

  if (pageNum > 1) {
    path = path + pageNum + "/";
  }

  return BASE_URL + path;
}

export default Meta;
