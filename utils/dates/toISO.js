export const toISO = (date, options = {}) => {
  const d = new Date(new Date(date).toISOString().slice(0, -1));

  if (options.time) {
    return date.match(/\d\d:\d\d/)[0];
  }
  if (options.date) {
    return new Date(date)
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
      .replaceAll("/", ".");
  }
  if (options.dateString) {
    const dates = date.substring(0, 10).split("-");
    return `${dates[2]}.${dates[1]}.${dates[0]}`;
  }
  return d;
};
