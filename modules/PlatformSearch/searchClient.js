import algoliasearchlight from 'algoliasearch/lite';
import algoliasearch from 'algoliasearch';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
const prefix = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX;

const searchClient = algoliasearchlight(appId, apiKey);

export const indices = {
  listings: `${prefix}_LISTINGS`,
  categories: `${prefix}_CATEGORIES`,
  activities: `${prefix}_ACTIVITIES`,
};

export const updateIndices = async (options) => new Promise((resolve, reject) => {
  const adminClient = algoliasearch(appId, adminKey);
  const { index, data, settings: s } = options;
  const api = adminClient.initIndex(index);

  console.log(`Algolia update [${index}]: trying to update index...`);

  api.replaceAllObjects(data)
    .then(() => {
      console.log(`Algolia update [${index}]: index updated successfully!`);
      console.log(`Algolia update [${index}]: trying to configure index...`);
      const settings = {
        distinct: true,
        attributeForDistinct: "objectID"
      };

      if (s.attributes) {
        settings.searchableAttributes = s.attributes;
      }
      if (s.filter) {
        settings.attributesForFaceting = s.filter;
      }
      if (s.hits) {
        settings.hitsPerPage = s.hits;
      }
      if (Object.values(settings).length === 0) {
        console.log(`Algolia update [${index}]: no settings. Skip configuring.`);
        return resolve();
      }
      api.setSettings(settings)
        .then(() => {
          console.log(`Algolia update [${index}]: configured successfully!`);
          resolve();
        })
        .catch((ex) => {
          console.log(`Algolia udpate [${index}]: Fail. Can't an index...`);
          reject(ex);
        });
    })
    .catch((ex) => {
      console.log(`Algolia update [${index}]: Fail. Can't update an index.`);
      reject(ex);
    });
});

export default searchClient;
