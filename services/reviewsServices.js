import path from "path";

async function _loadData(fs, name) {
  const data = await fs.readFile(path.join('.', 'var', name + '.json'), 'utf8');

  return JSON.parse(data);
}

const cache = { raw: [] };

export const getReviewsRatingsByIdsArray = async (fs, activitiesArray) => {
  const reviews = await getReviewsRatings(fs);

  return reviews.filter((review) => activitiesArray.includes(review.sku))
}

export const getReviewsRatings = async (fs) => {
  if(cache.raw && cache.raw.length) { return cache.raw }

  const reviews = await _loadData(fs, 'reviews');
  cache.raw = reviews;

  return reviews;
}

export const getReviews = async (fs) => {
  const reviews = await _loadData(fs, 'reviews_full');
  return reviews;
}

export const getUsps = async (fs) => {
  const usps = await _loadData(fs, 'usps');
  return usps;
}
