import trim from "lodash/trim";

export const findPage = (path, pages) => {
  return pages.find(
    (page) =>
      trim(page.path, "/")
        .replace("en-ch/", "")
        .replace("fr-ch/", "")
        .replace("it-ch/", "") === path
  );
};
