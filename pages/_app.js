import Script from "next/script";
import { initSentry } from "../lib/sentry";
import { I18nProvider } from "next-localization";
import { useRouter } from "next/router";
import { defaultLocale } from "../lib/i18n";
import { InternalLinksProvider } from "../hooks/useInternalLinksContext";
import { SearchContextProvider } from "../hooks/useSearchContext";
import "../styles/css/calendar.min.css";
import "../styles/style.scss";
import "../styles/responsive.scss";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "../styles/tailwind.css";

initSentry();

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  let locale = defaultLocale;

  if (
    router.asPath.startsWith("/en-ch/") ||
    router.asPath.startsWith("/fr-ch/") ||
    router.asPath.startsWith("/it-ch/")
  ) {
    locale = router.asPath
      .substring(0, 6)
      .replace("-ch", "_CH")
      .replace("/", "");
  }
  const isConfirmPage = pageProps.page?.type === "confirm";
  const isGetSiteControl =
    pageProps.page?.type === "homepage" ||
    pageProps.page?.type === "activities" ||
    pageProps.page?.type === "listing";

  return (
    <>
      {!isConfirmPage && (
        <Script
          strategy="afterInteractive"
          id="pap_x2s6df8d"
          src="https://saaffiliate.postaffiliatepro.com/scripts/9onzfjau"
          onLoad={() => {
            PostAffTracker.setAccountId("default1");
            try {
              PostAffTracker.track();
            } catch (err) {}
          }}
        />
      )}
      {isGetSiteControl && (
        <Script
          id="getSiteControl"
          strategy="afterInteractive"
          src="https://l.getsitecontrol.com/d4e2enk4.js"
        />
      )}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-P9BFZ6P');`}
      </Script>
      <Script
        id="cloudflareinsights"
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "8fc23ab6f7094de89f88b8384adf93c2"}'
      />
      <Script id="getResponse" strategy="afterInteractive">
        {`(function(i, s, o, g, r, a, m){
        i['__GetResponseAnalyticsObject'] = r;i[r] = i[r] || function() {(i[r].q = i[r].q || []).push(arguments)};
        a = s.createElement(o);m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://ga.getresponse.com/script/ga.js?v=2&grid=sBDcBXk1QfHAKA3I%3D', 'GrTracking');
        GrTracking('setDomain', 'auto');
        GrTracking('push');`}
      </Script>
      <Script id="crisp" strategy="lazyOnload">
        {`window.$crisp=[];window.CRISP_WEBSITE_ID="139520f1-f611-407a-ae80-accbf4646f17";
        (function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";
        s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
      </Script>
      <SearchContextProvider>
        <I18nProvider lngDict={pageProps.translations || {}} locale={locale}>
          <InternalLinksProvider internalLinks={pageProps.internalLinks}>
            <Component {...pageProps} />
          </InternalLinksProvider>
        </I18nProvider>
      </SearchContextProvider>
    </>
  );
}

export default MyApp;
