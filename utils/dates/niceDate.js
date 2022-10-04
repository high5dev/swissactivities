export const niceDate = (obj) => {
  return `${new Date(obj.date).toLocaleDateString(obj.locale.replace("_", "-"), {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}${
    obj.time
      ? ` - ${new Date(obj.date).toLocaleTimeString("en-GB").slice(0, -3)}`
      : ""
  }`;
};
