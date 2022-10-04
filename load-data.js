const {ApolloClient, InMemoryCache, HttpLink} = require("@apollo/client");
const {gql} = require("@apollo/client");
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const {getReviewsRatings, getReviews}= require('./load-reviews');

const ACTIVITIES_COUNT = gql`
query{
  activitiesConnection {
    aggregate{
      count
    }
  }
}
`

const ALL_ACTIVITIES = gql`
    query AllActivityIds($start: Int, $limit: Int) {
        activities(start: $start, limit: $limit) {
            id
            supplier {
                name
                id
            }
            info {
                title
                slug
                teaser
                highlights {
                    text
                }
                benefits {
                    type
                    text
                }
                important_information
            }
            content_blocks {
                title
                text
                youtube_url
            }
            destination {
                id
                latitude
                longitude
            }
            teaser_image {
                alternativeText
                caption
                name
                width
                height
                url
                formats
            }
            gallery {
                name
                caption
                url
            }
            attribute_values {
                id
                value
                translations {
                    id
                    locale
                    value
                }
                attribute {
                    id
                    label
                    activity_attributes {
                        value
                    }
                }
            }
            location {
                id
            }
            type {
                id
            }
            translations {
                locale
                info {
                    title
                    slug
                    teaser
                    highlights {
                        text
                    }
                    benefits {
                        type
                        text
                    }
                    important_information
                }
                teaser_image_alt_text
                content_blocks {
                    title
                    text
                    youtube_url
                }
            }
            destination {
                latitude
                longitude
            }
            usps {
               id
               key
               label
               description
               icon_name
               translations {
                 locale
                 label
                 description
               }
            }
            meeting_points {
                info {
                    label
                    address
                }
                latitude
                longitude
                translations {
                    locale
                    info {
                        label
                        address
                    }
                }
            }
            parent_listing {
              id
            }
        }
    }
`;

const ALL_LOCATIONS = gql`
    query ActivityLocations {
        activityLocations {
            id
            title
            description
            slug
            parent {
                id
            }
            translations {
                locale
                title
                description
                slug
            }
            activities {
                id
                attribute_values {
                    id
                    attribute {
                        id
                        label
                        activity_attributes {
                            id
                            value
                        }
                    }
                }
            }
            faq {
                id
                question
                answer
                translations {
                    locale
                    question
                    answer
                }
            }
            teaser_image {
                caption
                formats
            }
        }
    }
`;


const ALL_TYPES = gql`
    query ActivityTypes {
        activityTypes {
            id
            title
            description
            slug
            icon_name
            parent {
                id
            }
            translations {
                locale
                title
                description
                slug
            }
            activities {
                id
                attribute_values {
                    id
                    attribute {
                        label
                        activity_attributes {
                            id
                            value
                        }
                    }
                }
            }
            faq {
                question
                answer
                translations {
                    locale
                    question
                    answer
                }
            }
            teaser_image {
                caption
                formats
            }
        }
    }
`;

const ALL_LISTINGS = gql`
    query Listings {
        listings {
            id
            latitude
            longitude
            published_at
            activity_types {
                id
            }
            locations {
                id
            }
            type
            supplier {
              id
            }
            certificates{
              id
              icon_name
              key
              label
              translations{
                label
                locale
              }
            }
            info {
                slug
                old_slugs
                title
                title_frontend
                skiresort_region_id
                teaser
                meta_description
            }
            teaser_image {
                caption
                alternativeText
                url
            }
            gallery {
              id
              name
              alternativeText
            	caption
              url
            }
            content_blocks {
                text
                youtube_url
                pictures {
                    caption
                    alternativeText
                    url
                }
                translations {
                  locale
                  text
                  youtube_url
                  data
                }
            }
            translations {
                locale
                info {
                    slug
                    old_slugs
                    title
                    title_frontend
                    teaser
                    skiresort_region_id
                    meta_description
                }
                teaser_image_alt_text
                content_blocks {
                    text
                    youtube_url
                    pictures {
                        caption
                        alternativeText
                        url
                    }
                }
            }
            parent {
                id
            }
            activities {
                id
            }
            child_activities {
                id
            }
        }
    }
`;

const ALL_TEXTS = gql`
    query Texts {
        texts {
            key
            value
            translations {
                locale
                value
            }
        }
    }
`;

const ALL_EMPLOYEES = gql`
    query Employes {
        employees {
            id
            given_name
            family_name
            role
            linkedin_url
            aboutme
            picture {
                caption
                url
            }
            translations {
                locale
                aboutme
            }
        }
    }
`;

const ALL_ACTIVITY_ATTRIBUTES = gql`
    query AllActivityAttributes {
        activityAttributes {
            id
            value
            translations {
                locale
                value
            }
            attribute {
                id
                label
            }
        }
    }
`;

const ALL_USPS = gql`
    query USPS {
        usps {
          id,
          description,
            translations {
              locale
              id
              description
            }
        }
    }
`;

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_CONTENTAPI_HOST}/graphql`,
    fetch,
  }),
  cache: new InMemoryCache()
});

let activitiesIds = [];

async function paginatedActivitiesCache(name, query, itemsPerRequest, countQuery)  {
  console.time(name);

  try {
    const numberOfItems = await apolloClient.query({query: countQuery});
    const numberOfPages = numberOfItems.data.activitiesConnection.aggregate.count/itemsPerRequest;

    const pagesData = [];

    for (let i = 0; i < numberOfPages; i++) {
      const pageData = await apolloClient.query({query, variables: {limit: itemsPerRequest, start: i * itemsPerRequest}})
      pagesData.push(pageData.data.activities);
    }
    const activities = [].concat(...pagesData)
    activitiesIds = activities.map(act => act.id);

    fs.writeFileSync(path.join(__dirname, 'var', name + '.json'), JSON.stringify({activities}));
    console.timeEnd(name);
  } catch (e) {
    console.error(e);
    console.timeEnd(name);
  }
}

async function cache(name, query) {
  console.time(name);

  await apolloClient.query({query}).then(rsp => {
    fs.writeFileSync(path.join(__dirname, 'var', name + '.json'), JSON.stringify(rsp.data));
    console.timeEnd(name);
  }).catch(e => {
    console.error(e);
    console.timeEnd(name);
  });
}

async function cacheReviews(name) {
  console.time(name);
  if(!activitiesIds || (activitiesIds && !activitiesIds.length)) return;

  const reviews = await getReviewsRatings(activitiesIds);
  fs.writeFileSync(path.join(__dirname, 'var', name + '.json'), JSON.stringify(reviews));

  console.timeEnd(name);
}

async function cacheReviewsFull(name) {
  console.time(name);
  if (!activitiesIds || (activitiesIds && !activitiesIds.length)) return;1

  const reviews = await getReviews();
  fs.writeFileSync(path.join(__dirname, 'var', name + '.json'), JSON.stringify(reviews));

  console.timeEnd(name);
}

(async () => {
  await paginatedActivitiesCache('activities', ALL_ACTIVITIES, 100, ACTIVITIES_COUNT);
  await cacheReviews('reviews');
  await cacheReviewsFull('reviews_full');
  await cache('locations', ALL_LOCATIONS);
  await cache('types', ALL_TYPES);
  await cache('listings', ALL_LISTINGS);
  await cache('texts', ALL_TEXTS);
  await cache('employees', ALL_EMPLOYEES);
  await cache('activity_attributes', ALL_ACTIVITY_ATTRIBUTES);
  await cache('usps', ALL_USPS);
})();
