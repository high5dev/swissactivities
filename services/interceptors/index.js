export const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty("handlerEnabled") && !config.handlerEnabled
    ? false
    : true;
};

export const requestHandler = request => {
  return request;
};

export const successHandler = response => {
  return response;
};

export const errorHandler = error => {
  console.error(error);
  
  return Promise.reject({ ...error });
};
