import trim from "lodash/trim";

export const pagePathToArray = (path, filter = false) => {
  if (filter) {
    return trim(path, "/")
      .split("/")
      .filter((e) => e !== "en-ch" && e !== "fr-ch" && e !== "it-ch");
  }

  return trim(path, "/").split("/");
};
