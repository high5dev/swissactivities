import React from "react";
import types from "prop-types";
import { Helmet } from "react-helmet";

const brand = "Swiss Activities";
const currency = "CHF";

const ProductGoogleStructuredData = ({ activity, summary }) => {
  const { info, gallery, teaser_image, id } = activity;
  const { title, teaser } = info;
  const images = [];

  if (teaser_image) {
    images.push(teaser_image.url);
  }
  if (Array.isArray(gallery)) {
    gallery.forEach(({ url }) => {
      images.push(url);
    });
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    image: images,
    description: teaser,
    sku: id,
    brand: {
      "@type": "Brand",
      name: brand,
    },
  };

  if (summary) {
    data.offers = {
      "@type": "AggregateOffer",
      offerCount: summary.numOffers,
      priceCurrency: currency,
      lowPrice: summary.minPrice.amount,
      highPrice: summary.maxPrice.amount,
    };
  }

  if (
    activity.rating &&
    Number(activity.rating.average_rating).toFixed(1) >= 3.5
  ) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue:
        activity.rating?.average_rating &&
        Number(activity.rating.average_rating).toFixed(1),
      ratingCount: activity.rating?.num_ratings,
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data, null, 2)}
      </script>
    </Helmet>
  );
};
const scalar = types.oneOfType([types.string, types.number]);

ProductGoogleStructuredData.propTypes = {
  activity: types.shape({
    id: scalar.isRequired,
    info: types.shape({
      title: types.string.isRequired,
      teaser: types.string.isRequired,
    }).isRequired,
    teaser_image: types.shape({
      url: types.string.isRequired,
    }),
    gallery: types.arrayOf(
      types.shape({
        url: types.string.isRequired,
      })
    ),
  }).isRequired,
  summary: types.shape({
    minPrice: types.shape({
      amount: types.string.isRequired,
    }).isRequired,
    maxPrice: types.shape({
      amount: types.string.isRequired,
    }).isRequired,
    numOffers: types.number.isRequired,
  }),
};
ProductGoogleStructuredData.defaultProps = {};

export default ProductGoogleStructuredData;
