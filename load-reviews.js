const axios = require("axios");
const https = require("https");

const baseURL = process.env.REVIEWS_BASE_URL;

const axiosInstance = axios.create({
  baseURL: process.env.REVIEWS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    store: process.env.REVIEWS_STORE,
    apikey: process.env.REVIEWS_API_KEY,
  },
  httpsAgent: new https.Agent({
    keepAlive: true,
  }),
});

const getReviewsRatings = (activitiesArray) => {
  return axiosInstance
    .get("/product/rating-batch", {
      params: {
        store: process.env.REVIEWS_STORE,
        sku: activitiesArray.join(";"),
      },
    })
    .then((response) => {
      return response.data;
    });
};

const getReviews = () => {
  return axiosInstance
    .get("/product/reviews/all", {
      params: {
        store: process.env.REVIEWS_STORE,
        per_page: 1000,
        include_no_comments: true,
      },
    })
    .then((response) => {
      return response.data;
    });
};

module.exports = {
  getReviewsRatings,
  getReviews,
};
