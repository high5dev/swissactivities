const { ApolloClient, InMemoryCache } = require("@apollo/client");
const { gql } = require("@apollo/client");
const staticRedirects = require("./staticRedirects");

const ALL_ACTIVITIES_1 = gql`
  query AllActivityIds {
    activities(start: 0, limit: 500) {
      id
      info {
        slug
        old_slugs
      }

      translations {
        locale
        info {
          slug
          old_slugs
        }
      }
    }
  }
`;

const ALL_ACTIVITIES_2 = gql`
  query AllActivityIds {
    activities(start: 501, limit: 500) {
      id
      info {
        slug
        old_slugs
      }

      translations {
        locale
        info {
          slug
          old_slugs
        }
      }
    }
  }
`;

const ALL_LISTINGS = gql`
  query AllListings {
    listings {
      id
      type
      info {
        slug
        old_slugs
      }
      translations {
        locale
        info {
          slug
          old_slugs
        }
      }
    }
  }
`;

const ALL_TYPES = gql`
  query activityTypes {
    activityTypes {
      id
      slug
      old_slugs
      translations {
        locale
        slug
        old_slugs
      }
    }
  }
`;

const ALL_LOCATIONS = gql`
  query activityLocations {
    activityLocations {
      id
      slug
      old_slugs
      translations {
        locale
        slug
        old_slugs
      }
    }
  }
`;

const initApolloClient = () => {
  return new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_CONTENTAPI_HOST}/graphql`,
    cache: new InMemoryCache(),
  });
};

const activityPages = {
  de_CH: "aktivitaet",
  en_CH: "activity",
  fr_CH: "activite",
  it_CH: "attivita",
};

const supplierPages = {
  de_CH: "anbieter",
  en_CH: "supplier",
  fr_CH: "fournisseur",
  it_CH: "fornitore",
};

const listingOffers = {
  de_CH: "angebote/",
  en_CH: "offers/",
  fr_CH: "offres/",
  it_CH: "offerte/",
};

const newContentPrefixes = {
  supplier: supplierPages,
  activity: activityPages,
};

const getPrefix = (type, locale = "de_CH") => {
  return newContentPrefixes[type] ? `/${newContentPrefixes[type][locale]}` : "";
};

const getRedirectsFromItemsList = (items, t = false) => {
  return items.reduce((acc, item) => {
    const infoObject = item.info || item;
    const type = t || item.type;

    let activityRedirectList = [];

    if (newContentPrefixes[type]) {
      activityRedirectList.push({
        source: `/${infoObject.slug}/`,
        destination: `${getPrefix(type)}/${infoObject.slug}/`,
        permanent: true,
      });
    }

    if (infoObject.old_slugs && infoObject.old_slugs.length) {
      infoObject.old_slugs.forEach((oldSlug) => {
        if (oldSlug !== infoObject.slug) {
          activityRedirectList.push({
            source: `${getPrefix(type)}/${oldSlug}/`,
            destination: `${getPrefix(type)}/${infoObject.slug}/`,
            permanent: true,
          });
        }
      });
    }

    item.translations.forEach((translation) => {
      const locale = translation.locale.toLowerCase().replace("_", "-");
      const localeId = locale.replace("-ch", "_CH");
      const infoTranslated = translation.info || translation;

      if (newContentPrefixes[type]) {
        activityRedirectList.push({
          source: `/${locale}/${infoTranslated.slug}/`,
          destination: `/${locale}${getPrefix(type, localeId)}/${
            infoTranslated.slug
          }/`,
          permanent: true,
        });
      }

      if (infoTranslated.old_slugs) {
        infoTranslated.old_slugs.forEach((oldSlug) => {
          if (newContentPrefixes[type]) {
            activityRedirectList.push({
              source: `/${locale}/${oldSlug}/`,
              destination: `/${locale}${getPrefix(type, localeId)}/${
                infoTranslated.slug
              }/`,
              permanent: true,
            });
          }

          if (oldSlug !== infoTranslated.slug) {
            activityRedirectList.push({
              source: `/${locale}${getPrefix(type, localeId)}/${oldSlug}/`,
              destination: `/${locale}${getPrefix(type, localeId)}/${
                infoTranslated.slug
              }/`,
              permanent: true,
            });
          }
        });
      }
    });

    return [...acc, ...activityRedirectList];
  }, []);
};

const getActivitiesRedirects = async (client) => {
  const response = await client.query({ query: ALL_ACTIVITIES_1 });
  const response_2 = await client.query({ query: ALL_ACTIVITIES_2 });
  const activities = response.data.activities;
  const activities_2 = response_2.data.activities;
  const redirectList = getRedirectsFromItemsList(activities, "activity");
  const redirectList2 = getRedirectsFromItemsList(activities_2, "activity");

  return [...redirectList, ...redirectList2];
};

const getListingOffersRedirects = (listings) => {
  const redirectList = [];
  listings.forEach((listing) => {
    redirectList.push({
      source: `/${listing.info.slug}/${listingOffers["de_CH"]}`,
      destination: `/${listing.info.slug}/`,
      permanent: true,
    });

    listing.translations.forEach((translation) => {
      const locale = translation.locale.toLowerCase().replace("_", "-");

      redirectList.push({
        source: `/${locale}/${translation.info.slug}/${
          listingOffers[translation.locale]
        }`,
        destination: `/${locale}/${translation.info.slug}/`,
        permanent: true,
      });
    });
  });

  return redirectList;
};

const getListingsRedirects = async (client) => {
  const response = await client.query({ query: ALL_LISTINGS });
  const listings = response.data.listings;
  const redirectList = getRedirectsFromItemsList(listings);
  const listingOffersRedirects = getListingOffersRedirects(listings);

  return [redirectList, listingOffersRedirects];
};
const getTypesRedirects = async (client) => {
  const response = await client.query({ query: ALL_TYPES });
  const types = response.data.activityTypes;
  return getRedirectsFromItemsList(types);
};
const getLocationsRedirects = async (client) => {
  const response = await client.query({ query: ALL_LOCATIONS });
  const locations = response.data.activityLocations;
  return getRedirectsFromItemsList(locations);
};

const getRedirectsList = async () => {
  const client = initApolloClient();

  const activityRedirects = await getActivitiesRedirects(client);
  const [listingsRedirects, listingOffersRedirects] =
    await getListingsRedirects(client);
  const typesRedirects = await getTypesRedirects(client);
  const locationsRedirects = await getLocationsRedirects(client);

  return staticRedirects.concat(
    activityRedirects,
    listingsRedirects,
    listingOffersRedirects,
    typesRedirects,
    locationsRedirects
  );
};

module.exports = getRedirectsList;
