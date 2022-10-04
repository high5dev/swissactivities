import React from 'react';
import { Helmet } from 'react-helmet';

// Marks current page as a FAQ page, and put ld+json data into the head tag of the page. Details:
// https://developers.google.com/search/docs/data-types/faqpage#structured-data-type-definitions

// Faq page schema: https://schema.org/FAQPage
// Question schema: https://schema.org/Question
// Answer schema: https://schema.org/Answer
// Text schema: https://schema.org/Text

const FaqGoogleStructuredData = ({ faqs }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
  return (
    <Helmet>
      <script type="application/ld+json">
        { JSON.stringify(data, null, 2) }
      </script>
    </Helmet>
  );
};

export default FaqGoogleStructuredData;
