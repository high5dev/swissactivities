import cloneDeep from "lodash/cloneDeep";
import pick from "lodash/pick";
import orderBy from "lodash/orderBy";
import path from "path";

import { initializeApollo } from "../lib/apolloClient";
import {
  ACTIVITY_BY_ID,
  ALL_ACTIVITIES_MAP,
  GET_FAQS_BY_ID,
  LOCATION_BY_ID,
  OFFER_BY_ID,
  TYPE_BY_ID,
} from "../data/queries/queries";

import { getActivitySummariesOnce } from "./bookingServices";
import { getReviewsRatingsByIdsArray } from "./reviewsServices";

import { defaultLocale, formatLocaleForUrl, locales } from "../lib/i18n";

const allLocales = locales.concat(defaultLocale);
const apolloClient = initializeApollo();

export async function queryFaqsById(ids) {
  return await apolloClient.query({
    query: GET_FAQS_BY_ID,
    variables: { ids },
  });
}

export async function queryOfferById(id) {
  return await apolloClient.query({ query: OFFER_BY_ID, variables: { id } });
}

export async function queryActivityById(id) {
  return await apolloClient.query({ query: ACTIVITY_BY_ID, variables: { id } });
}

export async function queryLocationById(id) {
  return await apolloClient.query({ query: LOCATION_BY_ID, variables: { id } });
}

export async function queryTypeById(id) {
  return await apolloClient.query({ query: TYPE_BY_ID, variables: { id } });
}

async function _loadData(fs, name) {
  console.log(`loading ${name}`);

  const data = await fs.readFile(path.join(".", "var", name + ".json"), "utf8");

  return JSON.parse(data);
}

// --- ACTIVITIES

const ACTIVITIES_CACHE = {
  raw: [],
  byLocale: {},
};

async function _loadActivities(fs) {
  if (ACTIVITIES_CACHE.raw.length) {
    return;
  }

  const activities = (await _loadData(fs, "activities")).activities;

  const ratings = await getReviewsRatingsByIdsArray(
    fs,
    activities.map((activity) => activity.id)
  );
  const activitySummaries = await getActivitySummariesOnce();

  for (const activity of activities) {
    const rating = ratings.find(
      ({ sku }) => Number(sku) === Number(activity.id)
    );
    const summ = activitySummaries.find(
      ({ contentApiActivityId }) =>
        parseInt(contentApiActivityId) === parseInt(activity.id)
    );
    activity.rating = rating || null;
    activity.summary = summ || null;
    activity.urls = { [defaultLocale]: "/" + activity.info.slug };
    activity.hrefs = {
      [defaultLocale]:
        "/" + activityPages[defaultLocale] + "/" + activity.info.slug,
    };
    for (const translation of activity.translations) {
      activity.urls[translation.locale] = buildPagePath(
        translation.locale,
        translation.info.slug
      );
      activity.hrefs[translation.locale] = buildPagePath(
          translation.locale,
          translation.info.slug,
          activityPages
      );
    }
  }
  for (const locale of allLocales) {
    ACTIVITIES_CACHE.byLocale[locale] = _transformActivities(
      activities,
      locale
    );
  }
  ACTIVITIES_CACHE.raw = activities;
}

function _transformActivities(all, locale) {
  const activities = [];
  const typeColors = {};

  for (const activity of cloneDeep(all)) {
    const translation = activity.translations.find((t) => t.locale === locale);

    activity.teaser_image = findLargestImageFormat(activity.teaser_image);

    if (translation) {
      activity.info = translation.info;
      activity.content_blocks = translation.content_blocks;
      activity.info.benefits = activity.info.benefits
        ? translation.info.benefits
        : null;
      if (translation.teaser_image_alt_text) {
        activity.teaser_image.caption = translation.teaser_image_alt_text;
        activity.teaser_image.alternativeText =
          translation.teaser_image_alt_text;
      }

      for (const image of activity.gallery) {
        if (translation.gallery) {
          const imageTranslation = translation.gallery.find(
            (i) => i.picture_name === image.name
          );
          if (imageTranslation) {
            image.caption = imageTranslation.alt_text;
          }
        }
      }
    }
    delete activity.translations;

    for (const attributeValue of activity.attribute_values) {
      if (attributeValue.translations) {
        const attributeValueTranslation = attributeValue.translations.find(
          (av) => av.locale === locale
        );
        if (attributeValueTranslation) {
          attributeValue.value = attributeValueTranslation.value;
        }
        delete attributeValue.translations;
      }

      if (Number(attributeValue.attribute?.id) === 18) {
        // Frontendlabel type has id 18
        if (typeColors[attributeValue.id]) {
          attributeValue.color = typeColors[attributeValue.id];
        } else {
          attributeValue.color = "#" + Math.random().toString(16).slice(-6);

          typeColors[attributeValue.id] = attributeValue.color;
        }
      }
    }

    for (const meetingPoint of activity.meeting_points) {
      const meetingPointTranslation = meetingPoint.translations.find(
        (mp) => mp.locale === locale
      );
      if (meetingPointTranslation) {
        meetingPoint.info = meetingPointTranslation.info;
      }
      delete meetingPoint.translations;
    }

    activities.push(activity);
  }

  return activities;
}

export async function getActivities(fs, locale) {
  await _loadActivities(fs);

  return ACTIVITIES_CACHE.byLocale[locale];
}

export async function getActivityDetails(fs, activityId, locale) {
  await _loadActivities(fs);

  return ACTIVITIES_CACHE.byLocale[locale].find((a) => a.id === activityId);
}

export async function getMultipleActivityDetails(fs, activityIds, locale) {
  await _loadActivities(fs);

  return ACTIVITIES_CACHE.byLocale[locale].filter((a) =>
    activityIds.includes(a.id)
  );
}

// @TODO: remove? it's run at runtime
export async function getActivitiesForMap(locale) {
  const response = await apolloClient.query({ query: ALL_ACTIVITIES_MAP });
  const activities = [];

  for (const activity of cloneDeep(response.data.activities)) {
    const translation = activity.translations.find((t) => t.locale === locale);

    activity.teaser_image = findLargestImageFormat(activity.teaser_image);

    if (translation) {
      activity.info = translation.info;
      if (translation.teaser_image_alt_text) {
        activity.teaser_image.caption = translation.teaser_image_alt_text;
      }
    }
    delete activity.translations;

    activities.push(activity);
  }

  return activities;
}

// --- TEXTS

const TEXTS_CACHE = {
  raw: [],
  byLocale: {},
};

async function _loadTexts(fs) {
  if (TEXTS_CACHE.raw.length) {
    return;
  }

  const texts = (await _loadData(fs, "texts")).texts;

  for (const locale of allLocales) {
    TEXTS_CACHE.byLocale[locale] = _transformTexts(texts, locale);
  }

  TEXTS_CACHE.raw = texts;
}

function _transformTexts(all, locale) {
  const texts = [];
  for (const text of cloneDeep(all)) {
    const translation = text.translations.find((t) => t.locale === locale);
    if (translation) {
      text.value = translation.value;
    }
    delete text.translations;

    texts.push({ ...text });
  }

  return texts;
}

export async function getText(fs, locale, key) {
  await _loadTexts(fs);

  const text = TEXTS_CACHE.byLocale[locale].find((t) => t.key === key);

  return text ? text.value : null;
}

// --- LISTINGS

const LISTINGS_CACHE = {
  raw: [],
  byLocale: {},
  graphByLocale: {},
};

async function _loadListings(fs) {
  if (LISTINGS_CACHE.raw.length) {
    return;
  }

  const listings = (await _loadData(fs, "listings")).listings;

  for (const listing of listings) {
    listing.urls = { [defaultLocale]: "/" + listing.info.slug };
    for (const locale of locales) {
      const translation = listing.translations.find((t) => t.locale === locale);
      listing.urls[locale] = buildPagePath(
        locale,
        translation ? translation.info.slug : listing.info.slug
      );
    }
  }

  for (const locale of allLocales) {
    LISTINGS_CACHE.byLocale[locale] = _transformListings(listings, locale);
    LISTINGS_CACHE.graphByLocale[locale] = buildListingsGraph(
      LISTINGS_CACHE.byLocale[locale]
    );
  }
  LISTINGS_CACHE.raw = listings;
}

function _transformListings(all, locale) {
  const listings = [];

  for (const listing of cloneDeep(all)) {
    let isNewContenBlockTranslation = false;
    listing.content_blocks = listing.content_blocks.map((contentBlock, i) => {
      const { translations, ...contentBlockData } = contentBlock;

      if (translations?.length) {
        isNewContenBlockTranslation = true;
        const trData = translations.find((tr) => tr.locale === locale);

        if (trData) {
          const {
            data,
            locale: trLocale,
            ...contentBlockTranslations
          } = trData;

          return {
            ...contentBlockData,
            text: contentBlockTranslations.text || contentBlockData.text,
            youtube_url:
              contentBlockTranslations.youtube_url ||
              contentBlockData.youtube_url,
            pictures: contentBlockData.pictures.map((pic, i) => {
              const picTr = data && data[i];
              return {
                ...pic,
                alternativeText: picTr?.alternative_text || pic.alternativeText,
                caption: picTr?.caption || pic.caption,
              };
            }),
          };
        }
      }
      return contentBlockData;
    });

    const translation = listing.translations.find((t) => t.locale === locale);

    if (translation) {
      if (listing.teaser_image) {
        listing.teaser_image.caption = translation.teaser_image_alt_text;
        listing.teaser_image.alternativeText =
          translation.teaser_image_alt_text;
      }
      listing.info = translation.info;

      if (!isNewContenBlockTranslation) {
        listing.content_blocks = translation.content_blocks;
      }
    }

    delete listing.translations;

    listings.push({ ...listing });
  }

  return listings;
}

function buildListingsGraph(listings) {
  return attachChildrenRecursively(
    listings,
    findChildren(listings, null, "title"),
    "title"
  );
}

export async function getListings(fs, locale) {
  await _loadListings(fs);

  return LISTINGS_CACHE.byLocale[locale];
}

export async function loadParentListing(fs, listingId, locale) {
  const listing = (await getListings(fs, locale)).find(
    (l) => l.id === listingId
  );
  if (!listing) {
    return null;
  }
  return listing;
}

export async function getListingDetails(fs, listingId, locale) {
  const listing = (await getListings(fs, locale)).find(
    (l) => l.id === listingId
  );
  if (!listing) {
    return null;
  }

  listing.activities = await Promise.all(
    listing.activities.map(async (a) => {
      return await getActivityDetails(fs, a.id, locale);
    })
  );
  listing.child_activities = await Promise.all(
    listing.child_activities.map(async (a) => {
      return await getActivityDetails(fs, a.id, locale);
    })
  );

  return listing;
}

// --- ACTIVITY LOCATIONS

const ACTIVITY_LOCATIONS_CACHE = {
  raw: [],
  byLocale: {},
  graphByLocale: {},
};

async function _loadActivityLocations(fs) {
  if (ACTIVITY_LOCATIONS_CACHE.raw.length) {
    return;
  }

  const locations = (await _loadData(fs, "locations")).activityLocations;

  for (const location of locations) {
    location.urls = { [defaultLocale]: "/" + location.slug };
    for (const locale of locales) {
      const translation = location.translations.find(
        (t) => t.locale === locale
      );
      location.urls[locale] = buildPagePath(
        locale,
        translation ? translation.slug : location.slug
      );
    }
  }

  for (const locale of allLocales) {
    ACTIVITY_LOCATIONS_CACHE.byLocale[locale] = _transformActivityLocations(
      locations,
      locale
    );
    ACTIVITY_LOCATIONS_CACHE.graphByLocale[locale] =
      buildActivityLocationsGraph(ACTIVITY_LOCATIONS_CACHE.byLocale[locale]);
  }
  ACTIVITY_LOCATIONS_CACHE.raw = locations;
}

function _transformActivityLocations(all, locale) {
  const locations = [];
  for (const location of cloneDeep(all)) {
    location.teaser_image = findLargestImageFormat(location.teaser_image);

    const translation = location.translations.find((t) => t.locale === locale);
    const faqs = cloneDeep(location.faq);

    if (translation) {
      location.title = translation.title;
      location.slug = translation.slug;
      location.description = translation.description;
    }

    location.faq = [];
    for (const faq of faqs) {
      const faqTrans = faq.translations.find((t) => t.locale === locale);
      if (faqTrans) {
        faq.question = faqTrans.question;
        faq.answer = faqTrans.answer;
      }
      delete faq.translations;

      location.faq.push(faq);
    }

    location.activityIdsSelf = location.activities.map((a) => a.id);
    location.numActivitiesSelf = location.activityIdsSelf.length;
    location.labels = [].concat(
      ...location.activities.map((activity) =>
        [].concat(
          ...activity.attribute_values.map(
            ({ attribute }) =>
              attribute &&
              [].concat(
                ...attribute.activity_attributes.map(({ value }) => value)
              )
          )
        )
      )
    );

    delete location.activities;
    delete location.translations;

    locations.push({ ...location });
  }

  return locations;
}

function buildActivityLocationsGraph(locations) {
  const graph = attachChildrenRecursively(
    locations,
    findChildren(locations, null, "title"),
    "title"
  );

  const getActivityIdsRecursively = (location) => {
    let ids = location.activityIdsSelf;

    for (const child of location.children) {
      child.activityIds = getActivityIdsRecursively(child);
      child.numActivities = child.activityIds.length;
      ids = ids.concat(...child.activityIds); // don't use push()
    }

    return ids;
  };

  for (const location of graph) {
    location.activityIds = getActivityIdsRecursively(location);
    location.numActivities = location.activityIds.length;
  }

  return graph;
}

export async function getActivityLocations(fs, locale) {
  await _loadActivityLocations(fs);

  return ACTIVITY_LOCATIONS_CACHE.byLocale[locale];
}

export async function getActivityLocationsGraph(fs, locale) {
  await _loadActivityLocations(fs);

  const locationPropertiesForSearch = [
    "id",
    "children",
    "description",
    "faq",
    "numActivities",
    "activityIds",
    "numActivitiesSelf",
    "parent",
    "slug",
    "teaser_image",
    "title",
    "urls",
  ];

  let locations = ACTIVITY_LOCATIONS_CACHE.graphByLocale[locale];

  return locations
    .filter((location) => location.numActivities > 0)
    .map((location) => {
      const pickedDetail = pick(location, locationPropertiesForSearch);

      return {
        ...pickedDetail,
        children: pickedDetail.children
          .filter((child) => child.numActivities > 0)
          .map((child) => {
            const pickedChildDetail = pick(child, locationPropertiesForSearch);

            return { ...pickedChildDetail };
          }),
      };
    });
}

export async function getActivityLocationDetails(fs, locationId, locale) {
  return (await getActivityLocations(fs, locale)).find(
    (l) => l.id === locationId
  );
}

const getCategoryParentsTree = (categories, id) => {
  const findCategory = (categoryId) =>
    categories.find((c) => c.id === categoryId);

  const getCategoryRelations = (category) => {
    const parentId = category?.parent?.id;

    if (parentId) {
      const parent = findCategory(parentId);

      return {
        ...category,
        parentNode: getCategoryRelations(parent),
      };
    }
    return {
      ...category,
      parentNode: null,
    };
  };

  return getCategoryRelations(findCategory(id));
};

const getLocationParentsTree = async (fs, locationId, locale) => {
  if (!locationId) {
    return null;
  }

  const locations = await getActivityLocations(fs, locale);

  return getCategoryParentsTree(locations, locationId);
};

const getTypeParentsTree = async (fs, typeId, locale) => {
  if (!typeId) {
    return null;
  }

  const types = await getActivityTypes(fs, locale);

  return getCategoryParentsTree(types, typeId);
};

const getParentListing = async (fs, listingId, locale) => {
  if (!listingId) {
    return null;
  }

  const listing = await loadParentListing(fs, listingId, locale);

  return listing;
};

const getCategoryBreadcrumbs = (category) => {
  const result = [];

  if (category.parentNode) {
    result.push(...getCategoryBreadcrumbs(category.parentNode));
  }
  result.push({
    title: category.title,
    urls: category.urls,
  });
  return result;
};

export const getActivityBreadcrumbs = async (fs, activity, locale) => {
  const location = await getLocationParentsTree(
    fs,
    activity?.location?.id,
    locale
  );

  const type = await getTypeParentsTree(fs, activity?.type?.id, locale);
  const parentListing = await getParentListing(
    fs,
    activity?.parent_listing?.id,
    locale
  );
  const breadcrumbs = [];

  if (location) {
    breadcrumbs.push(...getCategoryBreadcrumbs(location));
  }
  if (type) {
    breadcrumbs.push(...getCategoryBreadcrumbs(type));
  }
  if (parentListing) {
    breadcrumbs.push({
      title: parentListing.info.title,
      urls: parentListing.urls,
    });
  }
  return breadcrumbs;
};

export const getListingBreadcrumbs = async (fs, listing, locale) => {
  const parentListing = await getParentListing(fs, listing?.parent?.id, locale);
  const breadcrumbs = [];

  if (parentListing) {
    breadcrumbs.push({
      title: parentListing.info.title,
      urls: parentListing.urls,
    });
  }

  return breadcrumbs;
};

// --- ACTIVITY TYPES

const ACTIVITY_TYPES_CACHE = {
  raw: [],
  byLocale: {},
  graphByLocale: {},
};

async function _loadActivityTypes(fs) {
  if (ACTIVITY_TYPES_CACHE.raw.length) {
    return;
  }
  let typeColors = {};
  const types = (await _loadData(fs, "types")).activityTypes;

  for (const type of types) {
    type.urls = { [defaultLocale]: "/" + type.slug };
    if (typeColors[type.title]) {
      type.color = typeColors[type.title];
    } else {
      type.color = "#" + Math.random().toString(16).slice(-6);

      typeColors[type.title] = type.color;
    }
    for (const locale of locales) {
      const translation = type.translations.find((t) => t.locale === locale);
      type.urls[locale] = buildPagePath(
        locale,
        translation ? translation.slug : type.slug
      );
    }
  }

  for (const locale of allLocales) {
    ACTIVITY_TYPES_CACHE.byLocale[locale] = _transformActivityTypes(
      types,
      locale
    );
    ACTIVITY_TYPES_CACHE.graphByLocale[locale] = buildActivityTypesGraph(
      ACTIVITY_TYPES_CACHE.byLocale[locale]
    );
  }
  ACTIVITY_TYPES_CACHE.raw = types;
}

function _transformActivityTypes(all, locale) {
  const types = [];

  for (const type of cloneDeep(all)) {
    type.teaser_image = findLargestImageFormat(type.teaser_image);

    const translation = type.translations.find((t) => t.locale === locale);
    const faqs = cloneDeep(type.faq);

    if (translation) {
      type.title = translation.title;
      type.slug = translation.slug;
      type.description = translation.description;
    }

    type.faq = [];
    for (const faq of faqs) {
      const faqTrans = faq.translations.find((t) => t.locale === locale);
      if (faqTrans) {
        faq.question = faqTrans.question;
        faq.answer = faqTrans.answer;
      }
      delete faq.translations;

      type.faq.push(faq);
    }

    type.activityIdsSelf = type.activities.map((a) => a.id);
    type.numActivitiesSelf = type.activityIdsSelf.length;
    type.labels = [].concat(
      ...type.activities.map((activity) =>
        [].concat(
          ...activity.attribute_values.map(
            ({ attribute }) =>
              attribute &&
              [].concat(
                ...attribute.activity_attributes.map(({ value }) => value)
              )
          )
        )
      )
    );

    delete type.activities;
    delete type.translations;

    types.push({ ...type });
  }

  return types;
}

function buildActivityTypesGraph(types) {
  const graph = attachChildrenRecursively(
    types,
    findChildren(types, null, "title"),
    "title"
  );

  const getActivityIdsRecursively = (type) => {
    let ids = type.activityIdsSelf;

    for (const child of type.children) {
      child.activityIds = getActivityIdsRecursively(child);
      child.numActivities = child.activityIds.length;
      ids = ids.concat(...child.activityIds); // don't use push()
    }

    return ids;
  };

  for (const type of graph) {
    type.activityIds = getActivityIdsRecursively(type);
    type.numActivities = type.activityIds.length;
  }

  return graph;
}

export async function getActivityTypes(fs, locale) {
  await _loadActivityTypes(fs);

  return ACTIVITY_TYPES_CACHE.byLocale[locale];
}

export async function getActivityTypesGraph(fs, locale) {
  await _loadActivityTypes(fs);

  const typePropertiesForSearch = [
    "id",
    "children",
    "description",
    "faq",
    "numActivities",
    "activityIds",
    "parent",
    "slug",
    "teaser_image",
    "title",
    "urls",
  ];

  let types = ACTIVITY_TYPES_CACHE.graphByLocale[locale];

  return types
    .filter((type) => type.numActivities > 0)
    .map((type) => {
      const pickedDetail = pick(type, typePropertiesForSearch);

      return {
        ...pickedDetail,
        children: pickedDetail.children
          .filter((child) => child.numActivities > 0)
          .map((child) => {
            const pickedChildDetail = pick(child, typePropertiesForSearch);

            return { ...pickedChildDetail };
          }),
      };
    });
}

export async function getActivityTypeDetails(fs, typeId, locale) {
  return (await getActivityTypes(fs, locale)).find((l) => l.id === typeId);
}

// --- ACTIVITY ATTRIBUTES

const ACTIVITY_ATTRIBUTES_CACHE = {
  raw: [],
  byLocale: {},
};

async function _loadActivityAttributes(fs) {
  if (ACTIVITY_ATTRIBUTES_CACHE.raw.length) {
    return;
  }

  const activityAttributes = (await _loadData(fs, "activity_attributes"))
    .activityAttributes;

  for (const locale of allLocales) {
    const localeActivityAttributes = [];

    for (const aAttribute of cloneDeep(activityAttributes)) {
      const translation = aAttribute.translations.find(
        (tr) => tr.locale === locale
      );
      const labels = aAttribute.attribute
        ? {
            label: aAttribute.attribute.label,
            id: aAttribute.id,
            value: aAttribute.value,
          }
        : {};
      delete aAttribute.translations;

      localeActivityAttributes.push(
        translation
          ? {
              ...aAttribute,
              ...translation,
              labels,
            }
          : {
              ...aAttribute,
              labels,
            }
      );
    }
    ACTIVITY_ATTRIBUTES_CACHE.byLocale[locale] = localeActivityAttributes;
  }
  ACTIVITY_ATTRIBUTES_CACHE.raw = activityAttributes;
}

export async function getActivityAttributes(fs, locale) {
  await _loadActivityAttributes(fs);

  return ACTIVITY_ATTRIBUTES_CACHE.byLocale[locale];
}

/// --- PAGES ---

const mainPages = {
  "about-us": {
    [defaultLocale]: "ueber-uns",
    en_CH: "about-us",
    fr_CH: "a-propos",
    it_CH: "about-us",
  },
  activities: {
    [defaultLocale]: "freizeitaktivitaeten",
    en_CH: "activities",
    fr_CH: "activites",
    it_CH: "attivita",
  },
  affiliate: {
    [defaultLocale]: "affiliate",
    en_CH: "affiliate",
    fr_CH: "affiliate",
    it_CH: "affiliate",
  },
  basket: {
    [defaultLocale]: "warenkorb",
    en_CH: "basket",
    fr_CH: "chariot",
    it_CH: "carrello",
  },
  blog: {
    [defaultLocale]: "travel-guide",
    en_CH: "travel-guide",
    fr_CH: "travel-guide",
    it_CH: "travel-guide",
  },
  booking: {
    [defaultLocale]: "buchung",
    en_CH: "booking",
    fr_CH: "reservation",
    it_CH: "prenotazione",
  },
  confirm: {
    [defaultLocale]: "buchung/confirm",
    en_CH: "booking/confirm",
    fr_CH: "reservation/confirm",
    it_CH: "prenotazione/confirm",
  },
  contact: {
    [defaultLocale]: "kontakt",
    en_CH: "contact",
    fr_CH: "contact",
    it_CH: "contatto",
  },
  homepage: { [defaultLocale]: "", en_CH: "", fr_CH: "", it_CH: "" },
  imprint: {
    [defaultLocale]: "impressum",
    en_CH: "imprint",
    fr_CH: "imprint",
    it_CH: "imprint",
  },
  privacy_policy: {
    [defaultLocale]: "datenschutz",
    en_CH: "privacy-policy",
    fr_CH: "privacy-policy",
    it_CH: "privacy-policy",
  },
  s: { [defaultLocale]: "s", en_CH: "s", fr_CH: "s", it_CH: "s" },
  supplier: {
    [defaultLocale]: "anbieter",
    en_CH: "supplier",
    fr_CH: "fournisseur",
    it_CH: "fornitore",
  },
  supplierRegistration: {
    [defaultLocale]: "anbieter/registration",
    en_CH: "supplier/registration",
    fr_CH: "fournisseur/enregistrement",
    it_CH: "fornitore/registrazione",
  },
  tos_aff: {
    [defaultLocale]: "agb/affiliates",
    en_CH: "terms-of-service/affiliates",
    fr_CH: "terms-of-service/affiliates",
    it_CH: "terms-of-service/affiliates",
  },
  tos_b2b: {
    [defaultLocale]: "agb/b2b",
    en_CH: "terms-of-service/b2b",
    fr_CH: "terms-of-service/b2b",
    it_CH: "terms-of-service/b2b",
  },
  tos_b2c: {
    [defaultLocale]: "agb",
    en_CH: "terms-of-service",
    fr_CH: "terms-of-service",
    it_CH: "terms-of-service",
  },
  "test-blog": {
    [defaultLocale]: "test-blog",
    en_CH: "test-blog",
    fr_CH: "test-blog",
    it_CH: "test-blog",
  },
};

export const activityPages = {
  [defaultLocale]: "aktivitaet",
  en_CH: "activity",
  fr_CH: "activite",
  it_CH: "attivita",
};

export const supplierPages = {
  [defaultLocale]: "anbieter",
  en_CH: "supplier",
  fr_CH: "fournisseur",
  it_CH: "fornitore",
};

const dontPath = [
  "contact",
  "about-us",
  "s",
  "affiliate",
  "supplier",
  "supplierRegistration",
  "test-blog",
  "blog",
  "basket",
  "booking",
  "confirm",
];

export const legalPages = [
  "tos_b2c",
  "tos_b2b",
  "tos_aff",
  "imprint",
  "privacy_policy",
];

export const getPageUrls = (type) => {
  const page = {};
  for (const [locale, slug] of Object.entries(mainPages[type])) {
    page[locale] = buildPagePath(locale, slug);
  }

  return page;
};

export const getPageUrl = (type, locale) => {
  return getPageUrls(type)[locale];
};

export const getLocationTypeUrl = (location, type, locale) => {
  let typePath = type.urls[locale];
  if (locale !== defaultLocale) {
    typePath = type.urls[locale].substring(`${locale}/`.length); // drop locale
  }

  return location.urls[locale] + typePath;
};

export async function getPages(fs) {
  const data = [];

  for (const [type, locales] of Object.entries(mainPages)) {
    for (const [locale, slug] of Object.entries(locales)) {
      if (
        type === "homepage" ||
        legalPages.includes(type) ||
        dontPath.includes(type)
      ) {
        continue;
      }

      data.push({
        type,
        locale,
        path: buildPagePath(locale, slug),
      });
    }
  }

  // activity details
  await _loadActivities(fs);
  for (const activity of ACTIVITIES_CACHE.byLocale[defaultLocale]) {
    for (const [locale, path] of Object.entries(activity.urls)) {
      data.push({
        type: "activity",
        activityId: activity.id,
        locale,
        path,
      });
    }
  }

  // listings
  await _loadListings(fs);
  const supplierType = "supplier";

  for (const listing of LISTINGS_CACHE.byLocale[defaultLocale]) {
    for (const [locale, path] of Object.entries(listing.urls)) {
      const isSupplier = listing.type === supplierType;
      data.push({
        type: isSupplier ? supplierType : "listing",
        listingId: listing.id,
        locale,
        path,
      });
    }
  }

  // types
  await _loadActivityTypes(fs);
  for (const type of ACTIVITY_TYPES_CACHE.byLocale[defaultLocale]) {
    if (type.numActivities === 0) {
      continue;
    }

    for (const locale of allLocales) {
      data.push({
        type: "type",
        typeId: type.id,
        activityIds: type.activityIds,
        locale,
        path: type.urls[locale],
      });
    }
  }

  // locations
  await _loadActivityLocations(fs);
  for (const location of ACTIVITY_LOCATIONS_CACHE.byLocale[defaultLocale]) {
    if (location.numActivities === 0) {
      continue;
    }

    for (const locale of allLocales) {
      data.push({
        type: "location",
        locationId: location.id,
        activityIds: location.activityIds,
        locale,
        path: location.urls[locale],
      });

      // location/types
      for (const type of ACTIVITY_TYPES_CACHE.byLocale[defaultLocale]) {
        // only activities both in the location and the type
        const activityIds = location.activityIds.filter((id) =>
          type.activityIds.includes(id)
        );
        if (activityIds.length === 0) {
          continue;
        }

        data.push({
          type: "location-type",
          locationId: location.id,
          typeId: type.id,
          activityIds,
          locale,
          path: getLocationTypeUrl(location, type, locale),
        });
      }
    }
  }

  //console.log(data.map(o => '[' + o.type + '] ' + o.path));

  return data;
}

// ----- Employees -----

export async function getEmployees(fs, locale) {
  const data = (await _loadData(fs, "employees")).employees;

  const employees = [];
  for (const employee of data) {
    const translation = employee.translations?.find((t) => t.locale === locale);
    if (translation) {
      employee.aboutme = translation.aboutme;
    }
    delete employee.translations;

    employees.push(employee);
  }

  return employees;
}

function buildPagePath(locale, slug, prefix = false) {
  const path = [];
  if (locale !== defaultLocale) {
    path.push(formatLocaleForUrl(locale));
  }
  if (prefix) {
    path.push(prefix[locale]);
  }
  if (slug !== "") {
    path.push(slug);
  }

  return "/" + path.join("/");
}

function findInGraph(id, items) {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    const found = findInGraph(id, item.children);
    if (found) {
      return found;
    }
  }
  return undefined;
}

function findChildren(items, parentId, orderBy2) {
  return orderBy(
    items.filter((i) => {
      if (parentId === null) {
        return i.parent === null;
      }

      return i.parent && i.parent.id === parentId;
    }),
    [orderBy2],
    ["asc"]
  );
}

function attachChildrenRecursively(all, items, orderBy2) {
  for (const item of items) {
    item.children = findChildren(all, item.id, orderBy2);
    attachChildrenRecursively(all, item.children, orderBy2);
  }

  return items;
}

function findLargestImageFormat(image) {
  if (image) {
    if (!image.formats) {
      return {
        caption: image.caption || "",
        alternativeText: image.alternativeText || null,
        width: image.width || null,
        height: image.height || null,
        name: image.name || "",
        url: image.url,
      };
    }

    const order = ["large", "medium", "small", "thumbnail"];
    for (const key of order) {
      if (image.formats[key] !== undefined) {
        const format = image.formats[key];

        return {
          caption: image.caption,
          alternativeText: image.alternativeText || null,
          width: format.width,
          height: format.height,
          name: format.name,
          url: format.url,
        };
      }
    }
  }

  return {
    caption: "no image",
    width: 560,
    height: 374,
    name: "headerBack.webp",
    url: "/assets/search/headerBack.webp",
  };
}

// INTERNAL LINKS BLOCK
const INTERNAL_LINKS_CACHE = {
  isUpdated: false,
  byLocale: {},
};

export async function getInternalLinks(fs, locale) {
  await prepareInternalLinks(fs);
  return INTERNAL_LINKS_CACHE.byLocale[locale];
}

async function prepareInternalLinks(fs) {
  if (INTERNAL_LINKS_CACHE.isUpdated) {
    return;
  }

  for (const locale of allLocales) {
    const listings = await getListings(fs, locale);
    const activities = await getActivities(fs, locale);
    const locations = await getActivityLocationsGraph(fs, locale);
    const types = await getActivityTypesGraph(fs, locale);

    const childLocations = locations
      .map((location) => location.children)
      .flat();
    const destinations = childLocations.sort(
      (a, b) => b.activities?.length - a.activities?.length
    );

    const pointsOfInterest = listings.filter(
      (listing) => listing.type === "point_of_interest"
    );

    const childTypes = types.map((type) => type.children);
    const flatChildTypes = childTypes
      .flat()
      .sort((a, b) => b.numActivities - a.numActivities);

    const internalLinkBlock = {
      destinations: destinations
        .slice(0, 15)
        .map((dest) => ({ title: dest.title, url: dest.urls[locale] }))
        .sort((a, b) =>
          a.title.localeCompare(b.title, locale.replace("_", "-"))
        ),
      locations: locations
        .slice(0, 15)
        .map((location) => ({
          title: location.title,
          url: location.urls[locale],
        }))
        .sort((a, b) =>
          a.title.localeCompare(b.title, locale.replace("_", "-"))
        ),
      topActivities: flatChildTypes
        .slice(0, 15)
        .map((type) => ({ title: type.title, url: type.urls[locale] }))
        .sort((a, b) =>
          a.title.localeCompare(b.title, locale.replace("_", "-"))
        ),
      topAttractions: pointsOfInterest
        .slice(0, 15)
        .map((point) => ({
          title: point.info?.title_frontend || point.info?.title,
          url: point.urls[locale],
        }))
        .sort((a, b) =>
          a.title.localeCompare(b.title, locale.replace("_", "-"))
        ),
    };

    INTERNAL_LINKS_CACHE.byLocale[locale] = internalLinkBlock;
  }

  INTERNAL_LINKS_CACHE.isUpdated = true;
}

// PARAMS
export async function getParams(fs, locale) {
  const params = {};
  const { default: translations = {} } = await import(
    `../public/locales/${locale}/common.json`
  );
  params.translations = translations;

  const types = await getActivityTypesGraph(fs, locale);
  const locations = await getActivityLocationsGraph(fs, locale);
  const menu = {
    locations: locations.map((location) => ({
      title: location.title,
      url: location.urls[locale],
    })),
    types: types.map((type) => ({
      title: type.title,
      url: type.urls[locale],
    })),
  };
  const internalLinks = await getInternalLinks(fs, locale);

  return {
    ...params,
    menu,
    internalLinks,
  };
}
