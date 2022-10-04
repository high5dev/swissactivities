import { gql } from "@apollo/client";

export const LOCATION_BY_ID = gql`
 query LocationById ($id: ID!) {
     activityLocation (id: $id) {
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
`

export const ACTIVITY_BY_ID = gql`
  query AcivityById ($id: ID!){
    activity (id: $id) {
        id
        info {
            title
        }
        teaser_image {
            caption
            url
            formats
        }
        location {
          id
          title
          translations {
              locale
              title
          }
        }
        type {
          id
          title
          translations {
            locale
            title
          }
          teaser_image {
            caption
            formats
          }
        }
        supplier{
          contact {
            id
            phone
          }
        }
        meeting_points{
          info{
            id
            label
            address
          }
          translations{
            locale
            info{
              address
            }
          }
        }
        translations {
            locale
            info {
                title
            }
            teaser_image_alt_text
        }
    }
  }
`;

export const TYPE_BY_ID = gql`
  query TypeById ($id: ID!) {
      activityType (id: $id) {
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

export const OFFER_BY_ID = gql`
  query($id: ID!) {
    offer(id: $id) {
      label
      description
      translations {
        locale
        label
        description
      }
    }
  }
`
export const GET_FAQS_BY_ID = gql`
  query faqs($ids: [Int]) {
    faqs(where:{id: $ids}){
      id
      question
      answer
      translations {
        locale
        question
        answer
      }
    }
  }
`

export const ALL_ACTIVITIES_MAP = gql`
    query AllActivityMap {
        activities {
            id
            info {
                title
            }
            teaser_image {
                caption
                formats
            }
            location {
                id
                title
            }
            type {
                id
            }
            translations {
                locale
                info {
                    title
                }
                teaser_image_alt_text
            }
            meeting_points {
                latitude
                longitude
            }
        }
    }
`;