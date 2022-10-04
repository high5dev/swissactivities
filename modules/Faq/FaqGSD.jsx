import React from 'react';
import { Helmet } from 'react-helmet';

const FAQGoogleStructuredData = ({ faqs }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => {
      return ({
         "@type": "Question",
         "name": faq.question,
         "acceptedAnswer": {
            "@type": "Answer",
            text: faq.answer,
         }
      })
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        { JSON.stringify(data, null, 2) }
      </script>
    </Helmet>
  );
};

export default FAQGoogleStructuredData;
