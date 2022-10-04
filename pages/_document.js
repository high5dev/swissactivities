import Document, { Head, Html, Main, NextScript } from "next/document";
import { defaultLocale } from "../lib/i18n";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // extract the current locale from the URL path and overwrite the current locale
    let locale = defaultLocale.replace("_", "-");
    if (ctx.query.path) {
      const localeParts = ctx.query.path[0].match(/^([a-z]{2})-([a-z]{2})$/);
      if (localeParts !== null) {
        locale = localeParts[1] + "-" + localeParts[2].toUpperCase(); // convert lang-region into lang-REGION (de-ch into de-CH)
      }
    }

    return { ...initialProps, locale };
  }

  render() {
    return (
      <Html lang={this.props.locale}>
        <Head>
          <link
            rel="preload"
            href="/assets/fonts/inter-v11-latin-regular.woff"
            as="font"
            type="font/woff"
            crossOrigin
          />
          <link
            rel="preload"
            href="/assets/fonts/inter-v11-latin-500.woff"
            as="font"
            type="font/woff"
            crossOrigin
          />
          <link
            rel="preload"
            href="/assets/fonts/inter-v11-latin-600.woff"
            as="font"
            type="font/woff"
            crossOrigin
          />
          <link
            rel="preload"
            href="/assets/fonts/inter-v11-latin-700.woff"
            as="font"
            type="font/woff"
            crossOrigin
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `@font-face { font-family: "Inter"; font-style: normal; font-weight: 400; src: url("/assets/fonts/inter-v11-latin-regular.woff") format("woff"); font-display: block; } @font-face { font-family: "Inter"; font-style: normal; font-weight: 500; src: url("/assets/fonts/inter-v11-latin-500.woff") format("woff"); font-display: block; } @font-face { font-family: "Inter"; font-style: normal; font-weight: 600; src: url("/assets/fonts/inter-v11-latin-600.woff") format("woff"); font-display: block; } @font-face { font-family: "Inter"; font-style: normal; font-weight: 700; src: url("/assets/fonts/inter-v11-latin-700.woff") format("woff"); font-display: block; } body, * { font-family: "Inter", sans-serif !important; font-weight: 500; }, .font-normal {font-weight: 400 !important;} .font-medium {font-weight: 500 !important;} .font-semibold {font-weight: 600 !important;} .font-bold {font-weight: 700 !important;}`,
            }}
          />
        </Head>
        <body>
          <noscript>
            <iframe
              data-cfasync="false"
              src="https://www.googletagmanager.com/ns.html?id=GTM-P9BFZ6P"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
