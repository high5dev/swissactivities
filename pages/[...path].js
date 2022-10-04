import trim from "lodash/trim";
import dropRight from "lodash/dropRight";
import pick from "lodash/pick";
import * as services from "../services/contentServices";
import * as bookingServices from "../services/bookingServices";
import { promises as fs } from "fs";

import Activities, { NUM_ACTIVITIES_PER_PAGE } from "../modules/Search";
import { findType } from "../lib/functions";

import { Listing } from "../modules/_pages/Listing";
import { getNextAvailable } from "../lib/functions";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const getPageComponent = (page) => {
  switch (page) {
    case "listing":
      return Listing;
    case "activities":
    default:
      return Activities;
  }
};

const tourArtId = 7;
const kombiId = 17;
const ticketsAttributeId = 21;
const rentId = 22;

const idPriorities = {
  [ticketsAttributeId]: 3,
  [kombiId]: 2,
  [rentId]: 1,
};

function sortListingActivities(a, b) {
  if (a.summary && b.summary) {
    const summaryValue = b.summary.popularity - a.summary.popularity;

    if (summaryValue) {
      return summaryValue;
    }
  }
  if (b.rating?.num_ratings - a.rating?.num_ratings) {
    return b.rating?.num_ratings - a.rating?.num_ratings;
  }

  if (a.bookDate && !b.bookDate) {
    return -1;
  }
  if (!a.bookDate && b.bookDate) {
    return 1;
  }

  const attrPriorityA = Math.max(
    a.attribute_values
      .filter(
        ({ attribute }) => attribute && Number(attribute.id) === tourArtId
      )
      .map((attr) => idPriorities[attr.id])
  );
  const attrPriorityB = Math.max(
    b.attribute_values
      .filter(
        ({ attribute }) => attribute && Number(attribute.id) === tourArtId
      )
      .map((attr) => idPriorities[attr.id])
  );

  return attrPriorityB - attrPriorityA;
}

export default function PageHandler(props) {
  const Page = getPageComponent(props?.page?.type);
  return <Page {...props} />;
}

export async function getStaticPaths() {
  const pages = await services.getPages(fs);

  const paths = [];
  for (const page of pages) {
    if (page.type === "activities") {
      const activities = await services.getActivities(fs, page.locale);

      paths.push(...generatePathsForActivities(page.path, activities.length));
    } else if (
      page.type === "location" ||
      page.type === "type" ||
      page.type === "location-type"
    ) {
      const activities = await services.getMultipleActivityDetails(
        fs,
        page.activityIds,
        page.locale
      );
      paths.push(...generatePathsForActivities(page.path, activities.length));
    } else if (page.type !== "supplier" && page.type !== "activity") {
      paths.push({
        params: {
          path: pagePathToArray(page.path),
        },
      });
    }
  }
  return { paths, fallback: false };
}

function findPage(path, pages) {
  return pages.find((page) => trim(page.path, "/") === path);
}

export async function getStaticProps({ params }) {
  const pages = await services.getPages(fs);

  const path = params.path.join("/");
  let page = findPage(path, pages);

  if (!page) {
    // attempt to find page after dropping the page counter
    page = findPage(dropRight(params.path).join("/"), pages);
  }

  const types = await services.getActivityTypesGraph(fs, page.locale);
  const locations = await services.getActivityLocationsGraph(fs, page.locale);
  const nextPrices = await bookingServices.getPricesOnce();
  const bookableDates = await bookingServices.getDatesOnce();
  const apiIdsMapping = await bookingServices.getMappingsOnce();
  const activityAttributes = await services.getActivityAttributes(
    fs,
    page.locale
  );
  const { default: translations = {} } = await import(
    `../public/locales/${page.locale}/common.json`
  );
  params.translations = translations;

  const activityPropertiesForSearch = [
    "id",
    "info.title",
    "urls",
    "info.teaser",
    "location",
    "type",
    "attribute_values",
    "teaser_image",
    "meeting_points",
  ];

  const internalLinks = await getInternalLinks(fs, page.locale);

  const menu = {
    locations: locations.map((location) => ({
      title: location.title,
      url: location.urls[page.locale],
    })),
    types: types.map((type) => ({
      title: type.title,
      url: type.urls[page.locale],
    })),
  };

  if (page.type === "listing") {
    const { activities, child_activities, ...listing } =
      await services.getListingDetails(fs, page.listingId, page.locale);
    const breadcrumbs = await services.getListingBreadcrumbs(
      fs,
      listing,
      page.locale
    );
    const listings = await services.getListings(fs, page.locale);
    const allActivities = await services.getActivities(fs, page.locale);

    let currentParent = null;

    //const skiresortInfoId = listing.type === 'point_of_interest' && listing?.info?.skiresort_region_id;
    //const skiresortInfo = (skiresortInfoId && await skiresortServices.getSkiresortInfo(skiresortInfoId)) || null;

    const headings = listing.content_blocks
      .filter((el) => el.text)
      .reduce((acc, element) => {
        const matched = element.text.match(/^#{2,3} .*/gm);
        if (!matched) {
          return acc;
        }
        const headingElement = matched.map((matchedElement) => {
          const text = matchedElement.trim();
          let anchor = text.toLowerCase() || "";
          anchor = anchor.replace(/[^a-zA-Z0-9 ]/g, "").trim();
          anchor = anchor.replace(/ /g, "-");
          const level = text.split("# ")[0].split("#").length;

          const headingItem = {
            level,
            text: text.replace(/^#*/g, "").trim(),
            anchor,
          };

          if (level === 2) {
            currentParent = anchor;
          } else {
            headingItem.parent = currentParent;
          }

          return headingItem;
        });
        return acc.concat(headingElement);
      }, []);

    const bookableDatesEntries = Object.entries(bookableDates);

    let listingRating = null;
    const ratings = child_activities
      .map((act) => act.rating)
      .filter((rating) => rating);

    if (ratings.length) {
      const rawRating = ratings.reduce((acc, el) => {
        return {
          num_ratings: acc.num_ratings + Number(el.num_ratings),
          average_rating:
            Number(acc.average_rating) + Number(el.average_rating),
        };
      });

      listingRating = {
        num_ratings: rawRating.num_ratings,
        average_rating: rawRating.average_rating / ratings.length,
      };
    }

    const allTypes = await services.getActivityTypes(fs, page.locale);
    const activitiesList = {};

    const listingActivities = child_activities.map((activity) => {
      const mappedId =
        Object.keys(apiIdsMapping.contentApiIds).find(
          (el) => apiIdsMapping.contentApiIds[el] === parseInt(activity.id)
        ) || null;
      const startingDate = bookableDatesEntries.find((entrie) =>
        entrie[1].includes(Number(mappedId))
      );

      const priceObject = nextPrices.find(
        (priceItem) => priceItem.contentApiActivityId === Number(activity.id)
      );
      const fullType = allTypes.find((type) => type.id === activity.type?.id);

      const activityType =
        activity.attribute_values.find(
          (attributeValue) => Number(attributeValue.attribute?.id) === 18 // Frontendlabel type has id 18
        ) ||
        fullType ||
        activity.type ||
        null;

      return {
        ...activity,
        type: activityType,
        price: priceObject?.startingPrice || null,
        bookDate: (startingDate && startingDate[0]) || null,
      };
    });
    activitiesList.topActivities = listingActivities
      .sort(sortListingActivities)
      .slice(0, 8);

    if (listing.type === "destination" && listing.locations[0]) {
      const location = listing.locations[0];
      const mappedActivities = allActivities
        .filter((act) => {
          return act.location?.id === location.id;
        })
        .map((activity) => {
          const mappedId =
            Object.keys(apiIdsMapping.contentApiIds).find(
              (el) => apiIdsMapping.contentApiIds[el] === parseInt(activity.id)
            ) || null;
          const startingDate = bookableDatesEntries.find((entrie) =>
            entrie[1].includes(Number(mappedId))
          );

          return {
            ...activity,
            bookDate: (startingDate && startingDate[0]) || null,
          };
        });

      mappedActivities
        .sort(sortListingActivities)
        .forEach((listingActivity) => {
          const activityTypeField =
            allTypes.find((type) => type.id === listingActivity.type?.id) ||
            listingActivity.type ||
            null;

          const parentType = activityTypeField.parent
            ? allTypes.find((type) => type.id === activityTypeField.parent?.id)
            : activityTypeField;

          if (parentType) {
            const priceObject = nextPrices.find(
              (priceItem) =>
                priceItem.contentApiActivityId === Number(listingActivity.id)
            );

            const activityToAdd = {
              ...listingActivity,
              type:
                listingActivity.attribute_values.find(
                  (attributeValue) =>
                    Number(attributeValue.attribute?.id) === 18 // Frontendlabel type has id 18
                ) || activityTypeField,
              price: priceObject?.startingPrice || null,
            };

            if (activitiesList[parentType.id]) {
              if (activitiesList[parentType.id].activities?.length < 8) {
                activitiesList[parentType.id].activities = [
                  ...activitiesList[parentType.id].activities,
                  activityToAdd,
                ];
              }
            } else {
              activitiesList[parentType.id] = {
                title: parentType.title || null,
                activities: [activityToAdd],
              };
            }
          }
        });
    }

    if (listing.type === "activities" && listing.activity_types[0]) {
      const listingActivityType = listing.activity_types[0];
      const mappedActivities = allActivities
        .filter((act) => {
          return act.type?.id === listingActivityType.id;
        })
        .map((activity) => {
          const mappedId =
            Object.keys(apiIdsMapping.contentApiIds).find(
              (el) => apiIdsMapping.contentApiIds[el] === parseInt(activity.id)
            ) || null;
          const startingDate = bookableDatesEntries.find((entrie) =>
            entrie[1].includes(Number(mappedId))
          );

          return {
            ...activity,
            bookDate: (startingDate && startingDate[0]) || null,
          };
        });

      mappedActivities
        .sort(sortListingActivities)
        .forEach((listingActivity) => {
          if (listingActivity.location) {
            let location = "";
            location = locations.find(
              ({ id }) => id === listingActivity.location.id
            );
            if (!location) {
              locations.forEach((item) => {
                const loc = item.children.find(
                  ({ id }) => id === listingActivity.location.id
                );
                if (loc) {
                  location = loc;
                }
              });
            }
            if (location) {
              const activityTypeField =
                allTypes.find((type) => type.id === listingActivity.type?.id) ||
                listingActivity.type ||
                null;
              const priceObject = nextPrices.find(
                (priceItem) =>
                  priceItem.contentApiActivityId === Number(listingActivity.id)
              );

              const activityToAdd = {
                ...listingActivity,
                type:
                  listingActivity.attribute_values.find(
                    (attributeValue) =>
                      Number(attributeValue.attribute?.id) === 18 // Frontendlabel type has id 18
                  ) || activityTypeField,
                price: priceObject?.startingPrice || null,
              };

              const parentLocation = location.parent
                ? locations.find(({ id }) => id === location.parent.id)
                : location;

              if (parentLocation) {
                if (activitiesList[parentLocation.id]) {
                  activitiesList[parentLocation.id].activities = [
                    ...activitiesList[parentLocation.id].activities,
                    activityToAdd,
                  ];
                } else {
                  activitiesList[parentLocation.id] = {
                    title: parentLocation.title || null,
                    activities: [activityToAdd],
                  };
                }
              }
            }
          }
        });
    }

    const relatedArticles = listings
      .filter(
        (rListing) =>
          rListing.type === listing.type && rListing.id !== listing.id
      )
      .sort((a, b) => {
        const aLocation = a.locations.some((loc) =>
          listing.locations.some(
            (listingLocation) => listingLocation.id === loc.id
          )
        )
          ? 1
          : 0;
        const bLocation = b.locations.some((loc) =>
          listing.locations.some(
            (listingLocation) => listingLocation.id === loc.id
          )
        )
          ? 1
          : 0;

        return bLocation - aLocation;
      });

    if (
      relatedArticles.length &&
      relatedArticles.length < 4 &&
      listing.type !== "destination"
    ) {
      const numberOfItems = 4 - relatedArticles.length;
      const itemsToAdd = listings
        .filter((relatedListing) => relatedListing.type === "destination")
        .slice(0, numberOfItems);
      relatedArticles.push(...itemsToAdd);
    }

    return {
      props: {
        ...params,
        menu,
        internalLinks,
        page,
        breadcrumbs,
        //skiresortInfo,
        mapped: locations,
        listing: {
          ...listing,
          shareUrl: `${baseUrl}${listing.urls[page.locale]}`,
          rating: listingRating,
          activities: activities.sort(sortListingActivities).map((activity) => {
            const mappedId =
              Object.keys(apiIdsMapping.contentApiIds).find(
                (el) =>
                  apiIdsMapping.contentApiIds[el] === parseInt(activity.id)
              ) || null;
            const startingDate = bookableDatesEntries.find((entrie) =>
              entrie[1].includes(Number(mappedId))
            );
            const priceObject = nextPrices.find(
              (priceItem) =>
                priceItem.contentApiActivityId === Number(activity.id)
            );
            const fullType = allTypes.find(
              (type) => type.id === activity.type?.id
            );

            const activityType =
              activity.attribute_values.find(
                (attributeValue) => Number(attributeValue.attribute?.id) === 18 // Frontendlabel type has id 18
              ) ||
              fullType ||
              activity.type ||
              null;

            return {
              ...activity,
              type: activityType,
              price: priceObject?.startingPrice || null,
              bookDate: (startingDate && startingDate[0]) || null,
            };
          }),
        },
        offers: activitiesList,
        pageType: page.type,
        algolia: {
          activityAttributes,
          dates: Object.keys(bookableDates),
        },
        relatedArticles: relatedArticles.slice(0, 4),
        headings,
        key: listing.id,
      },
    };
  }

  if (page.type === "activities") {
    const activities = await services.getActivities(fs, page.locale);
    const total = activities.length;
    const pageNum = getPageNumberFromPath(path);

    return {
      props: {
        ...params,
        menu,
        internalLinks,
        page,
        algolia: {
          activityAttributes,
          dates: Object.keys(bookableDates),
        },
        activities: selectAndFormatActivities(
          activities,
          apiIdsMapping.contentApiIds,
          activityPropertiesForSearch,
          pageNum,
          nextPrices,
          bookableDates
        ),
        locations,
        total,
        pageNum,
        types,
        typeColors: getTypeColors(activities, types),
      },
    };
  }

  if (
    page.type === "location" ||
    page.type === "type" ||
    page.type === "location-type"
  ) {
    const type = page.typeId
      ? await services.getActivityTypeDetails(fs, page.typeId, page.locale)
      : null;
    const location = page.locationId
      ? await services.getActivityLocationDetails(
          fs,
          page.locationId,
          page.locale
        )
      : null;
    const activities = await services.getMultipleActivityDetails(
      fs,
      page.activityIds,
      page.locale
    );
    const total = activities.length;
    const pageNum = getPageNumberFromPath(path);

    const recountLocationOrTypeActivitiesRecursively = (
      locationsOrTypes,
      typeOrLocation
    ) => {
      if (!typeOrLocation) {
        return locationsOrTypes;
      }

      return locationsOrTypes
        .map((locationOrType) => {
          locationOrType.children = recountLocationOrTypeActivitiesRecursively(
            locationOrType.children,
            typeOrLocation
          );
          locationOrType.activityIds = locationOrType.activityIds.filter((id) =>
            typeOrLocation.activityIds.includes(id)
          );
          locationOrType.numActivities = locationOrType.activityIds.length;

          return locationOrType;
        })
        .filter((locationOrType) => locationOrType.numActivities > 0);
    };

    const filteredLocations = recountLocationOrTypeActivitiesRecursively(
      locations,
      type
    );
    const filteredTypes = recountLocationOrTypeActivitiesRecursively(
      types,
      location
    );

    return {
      props: {
        ...params,
        menu,
        internalLinks,
        page,
        algolia: {
          activityAttributes,
          dates: Object.keys(bookableDates),
        },
        activities: selectAndFormatActivities(
          activities,
          apiIdsMapping.contentApiIds,
          activityPropertiesForSearch,
          pageNum,
          nextPrices,
          bookableDates
        ),
        locations: filteredLocations,
        location,
        types: filteredTypes,
        type,
        total,
        pageNum,
        typeColors: getTypeColors(activities, types),
      },
    };
  }

  // default
  return {
    props: {
      ...params,
      menu,
      page,
    },
  };
}

function getTypeColors(activities, types) {
  let typeColors = {};

  for (let el of activities) {
    const frontendlabelType = el.attribute_values?.find(
      (value) => Number(value.attribute?.id) === 18
    );
    if (el.type?.id || frontendlabelType) {
      if (frontendlabelType) {
        if (!typeColors[frontendlabelType.value]) {
          typeColors[frontendlabelType.value] =
            "#" + Math.random().toString(16).slice(-6);
        }
      } else {
        let type = findType(types, el.type.id);
        if (!typeColors[type.title]) {
          typeColors[type.title] = "#" + Math.random().toString(16).slice(-6);
        }
      }
    }
  }

  return typeColors;
}

function getMapId(activity, contentApiIds) {
  return (
    Object.keys(contentApiIds).find(
      (el) => contentApiIds[el] === parseInt(activity.id)
    ) || null
  );
}

function sortActivities(
  activities,
  prices,
  dates,
  contentApiIds,
  activityPropertiesForSearch
) {
  const collectedActivities = activities.map((activity) => {
    const mappedId = getMapId(activity, contentApiIds);

    return {
      ...activity,
      price:
        prices.find(
          (price) => price.contentApiActivityId === parseInt(activity.id)
        ) || null,
      nextAvailable: getNextAvailable(dates, mappedId) || null,
      mappedId,
      pickedDetail: pick(activity, activityPropertiesForSearch),
    };
  });

  let allDate = [];
  let notFoundAvailable = [];
  let notFoundPrice = [];
  let notFoundPriceAndDate = [];

  collectedActivities.forEach((el) => {
    if (!el.nextAvailable && !el.price) {
      notFoundPriceAndDate.push(el);
    } else if (!el.price && el.nextAvailable) {
      notFoundPrice.push(el);
    } else if (!el.nextAvailable && el.price) {
      notFoundAvailable.push(el);
    } else {
      allDate.push(el);
    }
  });
  const sortAllData = allDate.sort(
    (a, b) =>
      new Date(a.nextAvailable) - new Date(b.nextAvailable) ||
      a.price?.startingPrice.amount - b.price?.startingPrice.amount
  );
  const sortNotFoundAvailable = notFoundAvailable.sort(
    (a, b) => a.price.startingPrice.amount - b.price.startingPrice.amount
  );
  const sortNotFoundPrice = notFoundPrice.sort(
    (a, b) => new Date(a.nextAvailable) - new Date(b.nextAvailable)
  );

  return [
    ...sortAllData,
    ...sortNotFoundAvailable,
    ...sortNotFoundPrice,
    ...notFoundPriceAndDate,
  ];
}

function sliceActivityes(activities, total, pageNum) {
  return activities.slice(
    NUM_ACTIVITIES_PER_PAGE * (pageNum - 1),
    NUM_ACTIVITIES_PER_PAGE * pageNum > total
      ? total
      : NUM_ACTIVITIES_PER_PAGE * pageNum
  );
}

function selectAndFormatActivities(
  activities,
  contentApiIds,
  activityPropertiesForSearch,
  pageNum,
  prices = [],
  dates = []
) {
  const total = activities.length;
  let sortedActivities = sortActivities(
    activities,
    prices,
    dates,
    contentApiIds,
    activityPropertiesForSearch
  );

  return sliceActivityes(sortedActivities, total, pageNum);
}

function getPageNumberFromPath(path) {
  const segments = path.split("/");
  const lastSegment = segments[segments.length - 1];

  return isNaN(lastSegment) ? 1 : parseInt(lastSegment);
}

function generatePathsForActivities(basePath, numActivities) {
  const paths = [];
  const numTotalPages = Math.ceil(numActivities / NUM_ACTIVITIES_PER_PAGE);
  const pathArray = pagePathToArray(basePath);

  paths.push({
    params: {
      path: pathArray,
    },
  });

  for (let pageNr = 2; pageNr <= numTotalPages; pageNr++) {
    paths.push({
      params: {
        path: pathArray.concat(pageNr.toString()),
      },
    });
  }

  return paths;
}

function pagePathToArray(path) {
  return trim(path, "/").split("/");
}

async function getInternalLinks(fs, locale) {
  const internalLinks = await services.getInternalLinks(fs, locale);

  return internalLinks;
}
