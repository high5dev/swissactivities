import { axiosInstance, axiosInstancePatch } from "./index";

const cache = [];
const axios = axiosInstance;
const axiosPatch = axiosInstancePatch;

const once = async (key, fn) => {
  if (cache[key]) {
    return Promise.resolve(cache[key]);
  }

  return fn().then((data) => {
    cache[key] = data;

    return data;
  });
};

const setCartAmount = (data) => {
  const cartAmount = data.reservations.length;
  localStorage.setItem("cartAmount", cartAmount);
};

export async function getPricesOnce() {
  return once("getPricesOnce", () => {
    return axios.get(`/activities/prices`).then((response) => {
      return response.data;
    });
  });
}

export async function getActivitySummariesOnce() {
  return once("getActivitySummariesOnce", () => {
    return axios.get(`/activities/summaries`).then((response) => {
      return response.data;
    });
  });
}

export async function getDatesOnce() {
  return once("getDatesOnce", () => {
    return axios.get(`/activities/dates`).then((response) => {
      return response.data;
    });
  });
}

export async function getMappingsOnce() {
  return once("getMappingsOnce", () => {
    return axios.get(`/activities/mappings`).then((response) => {
      return response.data;
    });
  });
}

export const getActualAvailabilities = async (...options) => {
  const offers = await getAvailablities(...options);

  for (const offer of offers) {
    for (const availability of offer.availabilities) {
      availability.ticketCategories = offer.ticketCategories.filter((tc) =>
        availability.ticketCategoryIds.includes(tc.ticketCategoryId)
      );
    }
  }

  return offers;
};

export async function getAvailablities({
  activityId,
  startsAfter = null,
  untilEndOfDay,
  limit = 50,
  locale,
}) {
  if (!activityId) {
    return [];
  }
  const today = new Date();
  const placeholderDate = today.toLocaleDateString("en-ca");

  const response = await axios
    .get(`/activities/${activityId}/availabilities`, {
      params: {
        startsAfter: startsAfter || placeholderDate,
        untilEndOfDay: untilEndOfDay || placeholderDate,
        limit,
        locale,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error ===", err));

  if (!Array.isArray(response)) {
    return [];
  }

  return response;
}

export async function getRebate(rebateId) {
  return axios
    .get(`/rebates/${rebateId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error ===", err));
}

export async function newCart(locale) {
  return axios
    .post(`/carts`, {
      locale,
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error ===", err));
}

export async function getCart(cartId) {
  return axios
    .get(`/carts/${cartId}`)
    .then((response) => {
      setCartAmount(response.data);
      return response.data;
    })
    .catch((err) => {
      console.log("error ===", err);
      return err;
    });
}

export async function updateCart(cartId, data) {
  return axiosPatch
    .patch(`/carts/${cartId}`, data)
    .then((response) => {
      setCartAmount(response.data);
      return response.data;
    })
    .catch((err) => console.log("error ===", err));
}

export async function checkout(cartId, bookingForm, onError) {
  return axiosPatch
    .patch(`/carts/${cartId}/check_out`, bookingForm)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("error ===", err);
      onError(err);
      return err;
    });
}

export async function deleteReservation(reservation) {
  return axios
    .delete(`/reservations/${reservation}`)
    .then((response) => {
      return console.log(response.data);
    })
    .catch((error) => {
      throw error;
    });
}

export async function postReservations(reservation) {
  return axios
    .post("/reservations", reservation)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export async function getReservations(reservationId) {
  return axios
    .get(`/reservations/${reservationId}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error ===", err));
}

export async function postBookings(bookingForm, onError) {
  return axios
    .post("/bookings", bookingForm)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("error ===", err);
      onError(err);
      return err;
    });
}

export async function getBooking(id) {
  return axios
    .get(`/bookings/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error ===", err));
}

export async function getBookingItem(id) {
  return axios
    .get(`/booking_items/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error ===", err));
}

export async function getPaymentAttempts(id) {
  return axios
    .get(`/payment_attempts/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error ===", err));
}

export async function postPaymentAttempts(
  { bookingId, successReturnUrl, failureReturnUrl, language, paymentMethod },
  onError
) {
  return axios
    .post(`/bookings/${bookingId}/payment_attempts`, {
      successReturnUrl,
      failureReturnUrl,
      language,
      paymentMethod,
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("error ===", err);
      onError(err);
      return err;
    });
}

export async function updateGuest({ id, guestData }) {
  return axios
    .patch(`/guests/${id}`, guestData)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log("error ===", err));
}
