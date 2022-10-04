import { useI18n } from "next-localization";
import { getPageUrls, getParams } from "../../services/contentServices";
import Layout from "../_components/Layout";
import StaticImage from "../Image";
import { Text } from "../_components/Text";
import React, { useEffect, useMemo } from "react";
import SearchBar from "../_components/SearchBar";
import { Reviews } from "../_components/Reviews";
import Link from "next/link";
import { useSearchContext } from "../../hooks/useSearchContext";
import classNames from "classnames";
import { SliderGrid } from "../_components/SliderGrid";
import { Helmet } from "react-helmet";
import { FaMailBulk, FaMoneyCheck, FaSmile, FaTicketAlt } from "react-icons/fa";
import { CgSwiss } from "react-icons/cg";
import { gsap } from "gsap";
import { ImageCard } from "../_components/ImageCard";
import { Section } from "../_components/Section";
import { Flow } from "../_components/Flow";
import Explore from "../_components/Explore";
import * as services from "../../services/contentServices";
import { getReviews, getUsps } from "../../services/reviewsServices";
import orderBy from "lodash/orderBy";

export const Homepage = ({
  types,
  locations,
  activities,
  menu,
  reviews,
  usps,
  pointsOfInterest,
  destinations,
  blogPosts,
}) => {
  const { t, locale } = useI18n();
  const { isMobile } = useSearchContext();
  const bgImageUrl = "/assets/homepagepic.webp";
  const urls = getPageUrls("homepage");
  const meta = {
    title: t("pages.home.title"),
    desc: t("pages.home.description"),
    locale: locale(),
    image: bgImageUrl,
  };

  const refs = useMemo(() => {
    const refs = [];
    Object.values(usps).forEach(() => {
      refs.push(React.createRef());
    });
    return refs;
  }, [usps]);

  useEffect(() => {
    let index = 0;

    document
      .querySelector(`.usp-${index}`)
      ?.classList.add("!bg-primary", "!border-primary", "!text-white");

    const fader = () => {
      refs?.[index]?.current &&
        gsap.to(refs[index].current, {
          opacity: 1,
          duration: 1,
          onComplete: () => {
            setTimeout(() => {
              gsap.to(refs[index].current, {
                opacity: 0,
              });

              document?.querySelectorAll(".usp")?.forEach((item) => {
                item?.classList.remove(
                  "!bg-primary",
                  "!border-primary",
                  "!text-white"
                );
              });

              if (index + 1 === refs.length) {
                index = 0;
              } else {
                index++;
              }

              document
                .querySelector(`.usp-${index}`)
                ?.classList.add(
                  "!bg-primary",
                  "!border-primary",
                  "!text-white"
                );

              refs.forEach((item) => {
                gsap.set(item.current, {
                  opacity: 0,
                });
              });

              fader();
            }, 4000);
          },
        });
    };

    fader();
  }, [refs]);

  const Icons = ({ index }) => {
    return index === 0 ? (
      <FaTicketAlt />
    ) : index === 1 ? (
      <FaSmile />
    ) : index === 2 ? (
      <FaMoneyCheck />
    ) : index === 3 ? (
      <CgSwiss />
    ) : (
      index === 4 && <FaMailBulk />
    );
  };

  return (
    <Layout
      meta={meta}
      pageUrls={urls}
      disableLinksBlock
      pageType="homepage"
      menu={menu}
    >
      <Helmet>
        <meta
          name="og:image"
          content="https://website-swissactivities.imgix.net/assets/homepagepic.webp"
        />
      </Helmet>
      <section className={`relative`}>
        <div className={`absolute top-0 left-0 h-full w-full overflow-hidden`}>
          <div
            className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-screen`}
          />
          <Link href={`/rigi/`} passHref>
            <a className={`absolute left-0 top-0 z-[1] h-full w-screen`}>
              <StaticImage
                className={`absolute left-0 top-0 z-[1] h-full w-screen object-[25%_75%] 2xl:object-center`}
                src={bgImageUrl}
                alt="Swiss Activities"
                layout="fill"
                objectFit="cover"
                quality={90}
                priority
              />
            </a>
          </Link>
        </div>
        <div
          className={classNames(
            `container-tw mt-header pointer-events-none relative z-10 w-full py-20 md:py-32 lg:py-32 2xl:py-44`,
            {
              "z-[100]": isMobile,
              "z-20": !isMobile,
            }
          )}
        >
          <div
            className={`pointer-events-auto relative max-w-lg rounded-lg p-6 sm:p-8 lg:max-w-max`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-full rounded-lg bg-white/80 backdrop-blur-sm`}
            />
            <div className={`flow-text relative z-10`}>
              <Text
                as="h1"
                size="xl"
                className={`pointer-events-auto max-w-[510px]`}
              >
                {`${t("home.title")} ${types[0].title}`}
              </Text>
              <Text
                as="h2"
                className={`pointer-events-auto max-w-[550px] !font-medium`}
              >
                {t("home.newSubTitle")}
              </Text>
            </div>
            <div className={`pointer-events-auto relative z-10 mt-6`}>
              <SearchBar meta={meta} type="homepage" />
            </div>
          </div>
        </div>
      </section>
      <Section className={`!mt-0 !pt-12 !pb-4 lg:!pb-0`} bg={`bg-white`}>
        <div className={`flex justify-center`}>
          {Object.values(usps).map((item, index) => {
            return (
              <div
                key={`icon-${item[locale()]}-${index}`}
                className={classNames(`inline-flex items-center rounded`)}
              >
                <span
                  className={`usp usp-${index} duration-250 mx-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-solid border-gray-300 bg-white text-xl text-primary transition ease-in lg:mx-3`}
                >
                  <Icons index={index} />
                </span>
              </div>
            );
          })}
        </div>
        <div className={`relative mt-4 lg:mt-6`}>
          {Object.values(usps).map((item, index) => {
            return (
              <p
                ref={refs[index]}
                key={`text-${item[locale()]}`}
                className={classNames(
                  `text-center text-base font-medium opacity-0 lg:text-lg`,
                  {
                    "absolute top-0 left-1/2 w-full -translate-x-1/2":
                      index !== 2,
                  }
                )}
              >
                {item[locale()]}
              </p>
            );
          })}
        </div>
      </Section>
      <Section>
        <Text as="h2" size="lg" className={`mb`}>
          {t("discover.title")}
        </Text>
        <SliderGrid
          navClasses={`hidden z-0 lg:!grid`}
          items={types
            .sort((a, b) => b.numActivities - a.numActivities)
            .map((item) => {
              return (
                <Link
                  passHref
                  href={item.urls[locale()]}
                  key={`${item.id}-discover`}
                >
                  <ImageCard
                    item={item}
                    href={item.urls[locale()]}
                    num={true}
                  />
                </Link>
              );
            })}
        />
        <div className={`grid grid-cols-6 gap-4`}>{}</div>
      </Section>
      <Section>
        <div
          className={`grid overflow-hidden rounded-lg border border-solid border-gray-100 bg-gray-50 lg:grid-cols-3`}
        >
          <Flow className={`p-5 sm:p-7 lg:col-span-2 lg:p-9 xl:p-11`}>
            <Text as="h2" size="lg">
              {t("pages.home.switzerland.title")}
            </Text>
            <Text>{t("pages.home.switzerland.description")}</Text>
          </Flow>
          <div className={`relative hidden h-[300px] lg:block lg:h-auto`}>
            <StaticImage
              height={700}
              width={700}
              layout={`fill`}
              src={"/assets/search/freizeitaktivitaeten.webp"}
            />
          </div>
        </div>
      </Section>
      <Section>
        <Text as="h2" size="lg" className={`mb`}>
          {t("discover.region")}
        </Text>
        <SliderGrid
          navClasses={`hidden z-0 lg:!grid`}
          items={locations
            .sort((a, b) => b.numActivities - a.numActivities)
            .map((item) => (
              <Link
                passHref
                href={item.urls[locale()]}
                key={`${item.id}-region`}
              >
                <ImageCard item={item} href={item.urls[locale()]} />
              </Link>
            ))}
        />
      </Section>
      {!!destinations.length && (
        <Section>
          <Flow>
            <Text as="h2" size="lg">
              {t("blog.destinations")}
            </Text>
            <Text className={`lg:columns-2 lg:gap-6`}>
              {t("blog.destinationsDescription")}
            </Text>
          </Flow>
          <div
            className={`mt-6 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4`}
          >
            {destinations.map((listing, index) => {
              return (
                <ImageCard
                  className={`!min-h-[150px] md:!min-h-[200px]`}
                  href={listing.urls[locale()] || "/"}
                  key={`dest-${index}`}
                  item={listing}
                  title={listing.info.title_frontend}
                />
              );
            })}
          </div>
        </Section>
      )}
      <Section>
        <Text as="h2" size="lg" className={`mb`}>
          {t("topActivities.title")}
        </Text>
        <SliderGrid
          activities={activities}
          navClasses={`hidden z-0 lg:!grid`}
        />
      </Section>
      {!!pointsOfInterest.length && (
        <Section>
          <Flow>
            <Text as="h1" size="lg">
              {t("blog.pointOfInterest")}
            </Text>
            <Text className={`lg:columns-2 lg:gap-6`}>
              {t("blog.pointOfInterestDescription")}
            </Text>
          </Flow>
          <div className={`mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3`}>
            {pointsOfInterest.map((listing) => (
              <Link
                key={listing.key}
                passHref
                href={listing.urls[locale()] || "/"}
              >
                <a className="grid grid-rows-[150px,1fr] overflow-hidden rounded-lg border border-solid border-gray-200 transition duration-100 ease-in hover:shadow-md">
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
                  <div className={`space-y-2 p-4 lg:p-6`}>
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
      {/* reviews && (
        <Section>
          <Text as="h2" size="lg" className={`mb flex items-center`}>
            {t("home.reviewTitle")}
          </Text>
          <Reviews reviews={reviews} navClasses={`hidden z-0 lg:!grid`} />
        </Section>
      ) */}
      {!!blogPosts.length && (
        <Section>
          <Flow>
            <Text as="h2" size="lg">
              {t("blog.insiderBlog")}
            </Text>
            <Text className={`lg:columns-2 lg:gap-6`}>
              {t("blog.insiderBlogDescription")}
            </Text>
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
      <Explore className={`mt-4 xl:mt-0 2xl:-mt-4`} />
    </Layout>
  );
};

export const homepageStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);
  const types = await services.getActivityTypesGraph(fs, locale);
  const activities = await services.getActivities(fs, locale);
  const locations = await services.getActivityLocationsGraph(fs, locale);
  const listings = await services.getListings(fs, locale);
  const filteredListings = listings.filter((listing) => listing.teaser_image);
  const reviews = await getReviews(fs);
  const usps = await getUsps(fs);
  const uspsSorted = {};
  usps.usps.forEach((item) => {
    if (
      item.id === "8" ||
      item.id === "13" ||
      item.id === "14" ||
      item.id === "15" ||
      item.id === "16"
    ) {
      uspsSorted[item.id] = {
        ["de_CH"]: item.description,
      };

      item.translations.forEach((itemNested) => {
        uspsSorted[item.id] = {
          ...uspsSorted[item.id],
          [itemNested.locale]: itemNested.description,
        };
      });
    }
  });

  return {
    props: {
      ...params,
      usps: uspsSorted,
      reviews: reviews.reviews
        .filter((item) => item.review !== "" && item.rating >= 4)
        .slice(0, 20),
      activities: activities
        .filter(
          (item) =>
            Number(item.rating?.average_rating) >= 4.5 &&
            Number(item.summary?.minPrice?.amount) >= 1
        )
        .slice(0, 8)
        .map((activity) => {
          const fullType = types.find((type) => type.id === activity.type?.id);

          const activityType =
            activity.attribute_values.find(
              (attributeValue) => Number(attributeValue.attribute?.id) === 18
            ) ||
            fullType ||
            activity.type ||
            null;

          return {
            ...activity,
            type: activityType,
          };
        }),
      locations: orderBy(locations, ["numActivities"], ["desc"])
        .slice(0, 5)
        .map((location) => {
          return {
            id: location.id,
            title: location.title,
            description: location.description,
            teaser_image: location.teaser_image,
            urls: location.urls,
          };
        }),
      types: types.map((type) => {
        return {
          id: type.id,
          teaser_image: type.teaser_image,
          urls: type.urls,
          title: type.title,
          numActivities: type.numActivities,
        };
      }),
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
