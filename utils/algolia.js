import * as bookingServices from "../services/bookingServices";
import { queryActivityById } from "../services/contentServices";
import qs from "qs";

export class ActivityService {
  static getPriceObject(prices, activity) {
    return prices.find((p) => p.contentApiActivityId === parseInt(activity.id));
  }

  static getPriceRange(priceObject) {
    const currentPrice = priceObject?.startingPrice?.formatted;
    if (currentPrice) {
      const currency = currentPrice.match(/[A-Z]+/g)[0];
      const price = Number(currentPrice.match(/[0-9.’]+/g)[0].replace("’", ""));
      switch (true) {
        case price >= 0 && price < 50:
          return currency + " 0-50";
        case price >= 50 && price < 100:
          return currency + " 50-100";
        case price >= 100 && price < 200:
          return currency + " 100-200";
        case price >= 200:
          return currency + " >200";
        default:
          return currentPrice;
      }
    }
  }

  static getLabels(activity) {
    return [].concat(
      ...activity.attribute_values.map(
        ({ attribute }) =>
          attribute &&
          [].concat(...attribute.activity_attributes.map(({ value }) => value))
      )
    );
  }

  /**
   * Logic below is copied from [...path] for page.type 'activity'
   */
  static async getAvailableDates(id) {
    const availableDates = [];
    const bookableDates = await bookingServices.getDatesOnce();
    for (const [date, activityIds] of Object.entries(bookableDates)) {
      if (activityIds.includes(Number(id))) {
        availableDates.push(date);
      }
    }
    return availableDates;
  }

  static async getAvailabilitiesList(id, endDay, locale) {
    return await bookingServices.getActualAvailabilities({
      activityId: id,
      untilEndOfDay: endDay,
      limit: 50,
      locale,
    });
  }

  static async getActivity(id) {
    const {
      data: { activity },
    } = await queryActivityById(id);
    return activity;
  }

  /**
   * Logic above is copied from [...path] for page.type 'activity'
   */
}

export class DateService {
  static initialState = {
    allDates: false,
    today: false,
    tomorrow: false,
  };
  static weekDays = {
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
    0: "SUNDAY",
  };
  static tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1));

  static formatDate(date) {
    return date.toLocaleDateString("en-GB").split("/").reverse().join("-");
  }

  static formatWeekday(date, format) {
    return this.weekDays[new Date(date).getDay()].slice(0, format.length);
  }

  static initialButtonsState(currentRefinement) {
    switch (true) {
      case currentRefinement === this.formatDate(new Date()):
        return { ...this.initialState, today: true };
      case currentRefinement === this.formatDate(this.tomorrowDate):
        return { ...this.initialState, tomorrow: true };
      default:
        return { ...this.initialState, allDates: true };
    }
  }
}

export class CategoriesService {
  static initialState = {
    priceRange: [],
    labels: [],
  };

  static getLabels(activityAttributes) {
    const labels = {};
    activityAttributes.forEach((item) => {
      if (item.attribute) {
        labels[item.attribute.label] = [
          ...(labels[item.attribute.label] || []),
          item.value,
        ];
      }
    });
    return labels;
  }
}

export class GeoSearchService {
  /**
   * Translate element to not be cropped by map's borders
   * @param {Object} event
   * @param {number} preserver
   * @returns {string}
   */
  static translateElement(event, preserver = 200) {
    if (!event) {
      return "none";
    }
    const mapElement =
      event.domEvent.target.parentElement.parentElement.parentElement
        .parentElement.parentElement;
    const currentPosition = event.pixel;
    const transformation = {};
    if (mapElement.offsetWidth / 2 - currentPosition.x < preserver * 1.5) {
      transformation.translateX = -preserver * 1.5;
    }
    if (mapElement.offsetHeight / 2 - currentPosition.y < preserver) {
      transformation.translateY = -preserver * 1.4;
    }

    let result = [];
    for (const key in transformation) {
      result.push(`${key}(${transformation[key]}px)`);
    }
    return result.join(" ");
  }
}

export const getSearchParams = (location) => {
  return qs.parse(location.search.slice(1));
};
export const createQuery = (state) => `${qs.stringify(state)}`;

export const createURL = (state) => `?${createQuery(state)}`;

export const searchStateToUrl = (location, searchState) =>
  searchState ? `${location.pathname}${createURL(searchState)}` : "";

export const getClusterId = (hit) =>
  (100 * parseFloat(hit._geoloc.lat.toFixed(2) + hit._geoloc.lng.toFixed(2)))
    .toString()
    .replaceAll(".", "0");
