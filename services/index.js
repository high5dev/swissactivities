import axios from "axios";
import https from "https";
import {errorHandler, successHandler} from "./interceptors";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BOOKINGAPI_HOST,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  httpsAgent: new https.Agent({
    keepAlive: true,
  }),
});

axiosInstance.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
);

export const axiosInstancePatch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BOOKINGAPI_HOST,
  headers: {
    "Content-Type": "application/merge-patch+json",
    "Accept": "application/json",
  },
  httpsAgent: new https.Agent({
    keepAlive: true,
  }),
});

axiosInstancePatch.interceptors.response.use(
    response => successHandler(response),
    error => errorHandler(error)
);
