import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";

export function initSentry() {
  if (process.env.NODE_ENV === 'development') {
    console.info('Sentry integration is disabled for development environment');
    return;
  }
  
  Sentry.init({
    dsn: "https://d0095b5facb64862820bdcb56309b425@o558607.ingest.sentry.io/5692289",
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}