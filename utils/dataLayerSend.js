export const dataLayerSend = (obj) => {
  if (process.env.NEXT_PUBLIC_BASE_URL.includes("staging")) {
    console.log("DataLayer: ", obj);
    window?.dataLayer?.push(obj);
  } else {
    window?.dataLayer?.push(obj);
  }
};
