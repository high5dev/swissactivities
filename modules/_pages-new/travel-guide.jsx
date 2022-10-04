import Layout from "../_components/Layout";
import { useI18n } from "next-localization";
import { getPageUrls, getParams } from "../../services/contentServices";
import { Section } from "../_components/Section";
import { Flow } from "../_components/Flow";
import { Text } from "../_components/Text";
import { SectionTwoColumn } from "../_components/Section/TwoColumn";
import Link from "next/link";
import StaticImage from "../Image";
import { ImageCard } from "../_components/ImageCard";
import classNames from "classnames";
import * as services from "../../services/contentServices";

export const TravelGuide = ({
  pointsOfInterest = [],
  destinations = [],
  blogPosts = [],
  menu,
}) => {
  const { t, locale } = useI18n();
  const pageUrls = getPageUrls("blog");

  const meta = {
    title: t("blog.title"),
    desc: t("blog.description"),
    locale: locale(),
  };

  return (
    <Layout {...{ menu, meta, pageUrls }}>
      <SectionTwoColumn
        first
        flush
        push
        classNameChildren={`lg:!pt-0`}
        image={{ url: "/assets/search/freizeitaktivitaeten.webp" }}
      >
        <Text as="h1" size="lg">
          {t("blog.title")}
        </Text>
        <Text>{t("blog.description")}</Text>
      </SectionTwoColumn>
      {!!pointsOfInterest.length && (
        <Section>
          <Flow>
            <Text as="h1" size="lg">
              {t("blog.pointOfInterest")}
            </Text>
            <Text>{t("blog.pointOfInterestDescription")}</Text>
          </Flow>
          <div className={`mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3`}>
            {pointsOfInterest.map((listing) => (
              <Link
                key={listing.key}
                passHref
                href={listing.urls[locale()] || "/"}
              >
                <a className="grid grid-rows-[150px,1fr] overflow-hidden rounded-lg border border-solid border-gray-200 shadow transition duration-100 ease-in hover:shadow-md">
                  <div className={`image-wrapper relative`}>
                    {listing.teaser_image && (
                      <StaticImage
                        src={listing.teaser_image?.url}
                        alt={listing.teaser_image?.caption}
                        width={700}
                        height={300}
                      />
                    )}
                  </div>
                  <div className={`space-y-2 p-4`}>
                    <Text className={`text-base font-semibold !text-black`}>
                      {listing.info.title}
                    </Text>
                    <Text className={`text-gray-600`}>
                      {listing.info.meta_description}
                    </Text>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </Section>
      )}
      {!!destinations.length && (
        <Section>
          <Flow>
            <Text as="h2" size="lg">
              {t("blog.destinations")}
            </Text>
            <Text>{t("blog.destinationsDescription")}</Text>
          </Flow>
          <div className={`mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4`}>
            {destinations.map((listing) => {
              console.log(listing);
              return (
                <ImageCard
                  href={listing.urls[locale()] || "/"}
                  key={listing.key}
                  item={listing}
                  title={listing.info.title_frontend}
                />
              );
            })}
          </div>
        </Section>
      )}
      {!!blogPosts.length && (
        <Section last>
          <Flow>
            <Text as="h2" size="lg">
              {t("blog.insiderBlog")}
            </Text>
            <Text>{t("blog.insiderBlogDescription")}</Text>
          </Flow>
          {!!blogPosts.length && (
            <div className={`mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4`}>
              {blogPosts.map((listing, index) => (
                <div
                  className={classNames({
                    "md:col-span-2 md:row-span-2": index === 0,
                  })}
                  key={listing.key}
                >
                  <ImageCard
                    href={listing.urls[locale()] || "/"}
                    item={listing}
                    title={listing.info.title}
                    text={index === 0 && listing.info.meta_description}
                  />
                </div>
              ))}
            </div>
          )}
        </Section>
      )}
    </Layout>
  );
};

export const travelGuideStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);

  const listings = await services.getListings(fs, locale);
  const filteredListings = listings.filter((listing) => listing.teaser_image);

  return {
    props: {
      ...params,
      pointsOfInterest: filteredListings
        .filter((listing) => listing.type === "point_of_interest")
        .slice(0, 6)
        .map((item) => {
          return {
            info: {
              title_frontend: item?.info?.title_frontend,
              title: item?.info.title,
              meta_description: item?.info?.meta_description,
            },
            teaser_image: item?.teaser_image,
            urls: item?.urls,
          };
        }),
      destinations: filteredListings
        .filter((listing) => listing.type === "destination")
        .slice(0, 8)
        .map((item) => {
          return {
            info: {
              title_frontend: item?.info?.title_frontend,
            },
            teaser_image: item?.teaser_image,
            urls: item?.urls,
          };
        }),
      blogPosts: filteredListings
        .filter((listing) => listing.type === "blog_post")
        .slice(0, 5)
        .map((item) => {
          return {
            info: {
              title_frontend: item?.info?.title_frontend,
              title: item?.info.title,
              meta_description: item?.info?.meta_description,
            },
            teaser_image: item?.teaser_image,
            urls: item?.urls,
          };
        }),
    },
  };
};
