import React from 'react';
import types from 'prop-types';
import { Helmet } from 'react-helmet';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const BreadcrumbsGoogleStructuredData = ({ items }) => {
  const origin = typeof window === 'object' ? (window?.location?.origin || baseUrl) : baseUrl;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.title,
      'item': {
        '@type': 'thing',
        '@id': `${origin}${item.url}`,
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
BreadcrumbsGoogleStructuredData.propTypes = {
  items: types.arrayOf(
    types.shape({
      title: types.string.isRequired,
      url: types.string.isRequired,
      // relative url started with slash [/]
    }),
  ).isRequired,
};

export default BreadcrumbsGoogleStructuredData;
