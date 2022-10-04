import * as services from "../../services/contentServices";
import { pagePathToArray } from "./pagePathToArray";

export const getStaticPaths = async (fs, locale, type) => {
  const pages = await services.getPages(fs);

  const paths = [];
  for (const page of pages) {
    if (page.locale === locale && page.type === type) {
      paths.push({
        params: {
          path: pagePathToArray(page.path, true),
        },
      });
    }
  }
  return { paths, fallback: false };
};
