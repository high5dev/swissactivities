import {
  getPricesOnce,
  getDatesOnce,
  getMappingsOnce,
} from "./bookingServices";
import { defaultLocale, locales } from "../lib/i18n";
import { updateIndices, indices } from "../modules/PlatformSearch/searchClient";
import {
  getListings,
  getActivities,
  getActivityTypes,
  getActivityLocations,
  getLocationTypeUrl,
} from "./contentServices";
import { ActivityService } from "../utils";
import { filter } from "lodash";
import * as reviewsServices from "./reviewsServices";

const allLocales = locales.concat(defaultLocale);

export const attributes = {
  [indices.activities]: [
    "title",
    "labels",
    "teaser",
    "priceRange",
    "attributes",
    "availability",
    "attribute_values",
  ],
  [indices.categories]: [
    "type",
    "title",
    "nested",
    "labels",
    "related",
    "type_id",
    "icon_name",
    "location_id",
    "description",
    "teaser_image",
    "category_id",
  ],
  [indices.listings]: ["text", "title", "teaser"],
};

export const getAlgoliaData = async (fs) => {
  const result = {
    activities: [],
    categories: [],
    listings: [],
  };

  const idsMapping = (await getMappingsOnce()).contentApiIds;
  const prices = await getPricesOnce();
  const dates = await getDatesOnce();

  const getActivityDates = (capiId) => {
    const bapiId = Object.keys(idsMapping).find(
      (capiIdKey) => idsMapping[capiIdKey] === parseInt(capiId)
    );
    if (!bapiId) {
      return [];
    }

    return Object.entries(dates)
      .filter(([_, ids]) => ids.includes(parseInt(bapiId)))
      .map(([date]) => date);
  };

  for (const locale of allLocales) {
    const activities = await getActivities(fs, locale);
    const types = await getActivityTypes(fs, locale);
    const locations = await getActivityLocations(fs, locale);
    const listings = await getListings(fs, locale);

    // Compose activities index data
    for (const activity of activities) {
      const availability = getActivityDates(activity.id);
      const priceObject = ActivityService.getPriceObject(prices, activity);
      const activityLocationId = activity?.location?.id;
      const activityTypeId = activity?.type?.id;
      const activityCategories = [];

      if (activityLocationId) {
        activityCategories.push(activityLocationId);
      }
      if (activityTypeId) {
        activityCategories.push(activityTypeId);
      }
      if (activityLocationId && activityTypeId) {
        activityCategories.push(`${activityLocationId}_${activityTypeId}`);
      }

      const activityType = types.find((type) => type.id === activityTypeId);
      const activityTypeParent = types.find(
        (type) => type.id === activityType?.parent?.id
      );
      const activityLocation = locations.find(
        (location) => location.id === activityLocationId
      );
      const activityLocationParent = locations.find(
        (location) => location.id === activityLocation?.parent?.id
      );

      const activitySeason = filter(activity.attribute_values, function (item) {
        return item?.attribute?.id === "14";
      }).map((item) => item.value);

      const activityAge = filter(activity.attribute_values, function (item) {
        return item?.attribute?.id === "15";
      }).map((item) => item.value);

      const activityTopics = filter(activity.attribute_values, function (item) {
        return item?.attribute?.id === "16";
      }).map((item) => item.value);

      const activityLang = filter(activity.attribute_values, function (item) {
        return item?.attribute?.id === "17";
      }).map((item) => item.value);

      const rating = await reviewsServices.getReviewsRatingsByIdsArray(fs, [
        activity.id,
      ]);

      result.activities.push({
        locale,
        availability,
        activity: activity,
        categories: activityCategories,
        typeIconName: activityType?.icon_name,
        objectID: `${locale}_${activity.id}`,
        href: activity.hrefs[locale],
        title: activity.info.title,
        teaser: activity.info.teaser,
        teaser_image: activity?.teaser_image?.url,
        price: priceObject,
        priceNumber: Number(priceObject?.startingPrice?.amount) || 0,
        priceRange: ActivityService.getPriceRange(priceObject),
        season: activitySeason,
        age: activityAge,
        topics: activityTopics,
        lang: activityLang,
        labels: ActivityService.getLabels(activity),
        rating: rating[0]?.average_rating
          ? Number(rating[0].average_rating)
          : null,
        ratingRounded: rating[0]?.average_rating
          ? Math.round(Number(rating[0].average_rating))
          : null,
        ratingAmount: rating[0]?.num_ratings ? rating[0].num_ratings : null,
        popularity: activity.summary?.popularity || 0,
        type: activityType?.title,
        typeParent: activityTypeParent?.title,
        ["typeH.lvl0"]: activityTypeParent?.title,
        ["typeH.lvl1"]: `${activityTypeParent?.title} > ${activityType?.title}`,
        location: activityLocation?.title,
        locationParent: activityLocationParent?.title,
        ["locationH.lvl0"]: activityLocationParent?.title,
        ["locationH.lvl1"]: `${activityLocationParent?.title} > ${activityLocation?.title}`,
        attribute_values: activity.attribute_values.map(
          ({ id, value, attribute }) => ({
            attribute: { id: attribute?.id },
            id,
            value,
          })
        ),
        _geoloc: {
          lat: Number(activity.destination.latitude),
          lng: Number(activity.destination.longitude),
        },
      });
    }

    // Compose categories (type) index data
    for (const type of types) {
      if (type.numActivities === 0) {
        continue;
      }

      const parent =
        type?.parent?.id && types.find(({ id }) => id === type.parent.id);
      const related = types
        .slice(0, 4)
        .filter(({ id }) => id !== type.id)
        .slice(0, 3)
        .map(({ title, urls }) => ({
          title,
          url: urls[locale],
        }));

      result.categories.push({
        locale,
        related,
        _tags: [],
        type: "type",
        type_id: type.id,
        location_id: null,
        title: type.title,
        category_id: type.id,
        parent: parent && {
          title: parent.title,
          url: parent.urls[locale],
        },
        numActivities: type.numActivities,
        url: type.urls[locale],
        teaser_image: type?.teaser_image?.url,
        description: [""],
        labels: type.labels.slice(0, 10),
        objectID: `${locale}_type_${type.id}`,
        icon_name: type.icon_name,
      });
    }

    // Compose categories (location) index data
    for (const location of locations) {
      if (location.numActivities === 0) {
        continue;
      }

      const parent =
        location?.parent?.id &&
        locations.find(({ id }) => id === location.parent.id);

      const locationLabels = [];
      const allLabels = location.labels;

      while (allLabels.length) {
        locationLabels.push(allLabels.splice(0, 200));
      }

      const splitedCategories = locationLabels.map((labels, i) => {
        return {
          locale,
          _tags: [],
          type: "location",
          chunkNumber: i,
          title: location.title,
          type_id: null,
          location_id: location.id,
          parent: parent && {
            title: parent.title,
            url: parent.urls[locale],
          },
          category_id: location.id,
          numActivities: location.numActivities,
          teaser_image: location?.teaser_image?.url,
          url: location.urls[locale],
          description: [""],
          labels: labels.slice(0, 10),
          objectID: `${locale}_location_${location.id}`,
        };
      });

      const newLocation = allLabels.length
        ? splitedCategories[0]
        : {
            locale,
            _tags: [],
            type: "location",
            title: location.title,
            type_id: null,
            location_id: location.id,
            parent: parent && {
              title: parent.title,
              url: parent.urls[locale],
            },
            category_id: location.id,
            numActivities: location.numActivities,
            teaser_image: location?.teaser_image?.url,
            url: location.urls[locale],
            description: [""],
            labels: location.labels.slice(0, 10),
            objectID: `${locale}_location_${location.id}`,
          };

      if (splitedCategories.length) {
        result.categories.push(...splitedCategories);
      } else {
        result.categories.push(newLocation);
      }

      // Compose categories (location + type) index data
      for (const type of types) {
        const activityIds = location.activityIds.filter((id) =>
          type.activityIds.includes(id)
        );

        if (activityIds.length === 0) {
          continue;
        }

        const parent =
          type?.parent?.id && types.find(({ id }) => id === type.parent.id);
        const related = types
          .slice(0, 4)
          .filter(({ id }) => id !== type.id)
          .slice(0, 3)
          .map(({ title, urls }) => ({
            title,
            url: urls[locale],
          }));

        result.categories.push({
          locale,
          _tags: [],
          type_id: type.id,
          labels: type.labels.slice(0, 10),
          type: "location_type",
          location_id: location.id,
          icon_name: type.icon_name,
          parent: newLocation.parent,
          related: newLocation.related,
          numActivities: activityIds.length,
          teaser_image: type?.teaser_image?.url,
          category_id: `${location.id}_${type.id}`,
          title: `${location.title} | ${type.title}`,
          url: getLocationTypeUrl(location, type, locale),
          description: ["", ""],
          objectID: `${locale}_location_type_${location.id}_${type.id}`,
          nested: {
            location: {
              url: newLocation.url,
              title: newLocation.title,
              teaser_image: newLocation.teaser_image,
            },
            type: {
              related,
              title: type.title,
              parent: parent && {
                title: parent.title,
                url: parent.urls[locale],
              },
              url: type.urls[locale],
              teaser_image: type?.teaser_image?.url,
            },
          },
        });
      }
    }

    // Compose listings index data
    for (const listing of listings) {
      const categories = [];
      const listingTypes = Array.isArray(listing.types) ? listing.types : [];
      const listingLocations = Array.isArray(listing.activity_locations)
        ? listing.activity_locations
        : [];

      if (listingTypes.length) {
        categories.push(...listingTypes.map(({ id }) => id));
      }
      if (listingLocations.length) {
        categories.push(...listingLocations.map(({ id }) => id));

        listingLocations.forEach(({ id }) => {
          listingTypes.forEach((type) => {
            categories.push(`${id}_${type.id}`);
          });
        });
      }
      result.listings.push({
        locale,
        categories,
        objectID: `${locale}_${listing.id}`,
        url: listing.urls[locale],
        title: listing.info.title,
        teaser: listing.info.teaser,
        text: "",
        teaser_image: listing?.teaser_image?.url,
        _geoloc: {
          lat: Number(listing.latitude),
          lng: Number(listing.longitude),
        },
      });
    }
  }
  return result;
};

const updateAlgolia = async (fs) => {
  const doUpdate = process.env.UPDATE_ALGOLIA !== undefined;
  console.log("Should algolia be updated?", doUpdate);

  if (doUpdate) {
    console.log("Updating Algolia indices");

    const algoliaData = await getAlgoliaData(fs);

    try {
      await updateIndices({
        index: indices.activities,
        data: algoliaData.activities,
        settings: {
          attributes: attributes[indices.activities],
          filter: [
            "availability",
            "filterOnly(locale)",
            "attribute_values.id",
            "attribute_values",
            "labels",
            "priceNumber",
            "priceRange",
            "season",
            "age",
            "topics",
            "lang",
            "categories",
            "ratingRounded",
            "popularity",
            "type",
            "typeParent",
            "typeH.lvl0",
            "typeH.lvl1",
            "location",
            "locationParent",
            "locationH.lvl0",
            "locationH.lvl1",
          ],
        },
      });
      await updateIndices({
        index: indices.categories,
        data: algoliaData.categories,
        settings: {
          attributes: attributes[indices.categories],
          filter: [
            "labels",
            "searchable(category_id)",
            "filterOnly(locale)",
            "filterOnly(type)",
          ],
        },
      });
      await updateIndices({
        index: indices.listings,
        data: algoliaData.listings,
        settings: {
          attributes: attributes[indices.listings],
          filter: ["filterOnly(locale)", "categories"],
        },
      });
      console.log("Algolia updated successfully!");
    } catch (ex) {
      console.error(ex);
    }
  }
};

export default updateAlgolia;
