import Layout from "../../_components/Layout";
import { useI18n } from "next-localization";
import { Text } from "../../_components/Text";
import StaticImage from "../../Image";
import React, { useEffect, useState } from "react";
import { BsCheckCircleFill, BsInfoCircleFill, BsX } from "react-icons/bs";
import { Rating } from "../../_components/Rating";
import Button from "../../_components/Button";
import Modal from "../../Modal";
import styles from "../../ContactPopup/styles.module.scss";
import ContactForm from "../../ContactUs/ContactForm";
import Content from "../../_components/Content";
import { Reviews } from "../../_components/Reviews";
import { SliderGrid } from "../../_components/SliderGrid";
import * as services from "../../../services/contentServices";
import { getReviews } from "../../../services/reviewsServices";
import { getParams, supplierPages } from "../../../services/contentServices";
import { pagePathToArray } from "../../../utils/paths/pagePathToArray";
import { findPage } from "../../../utils/paths/findPage";
import { Section } from "../../_components/Section";
import { getStaticPaths } from "../../../utils/paths/getStaticPaths";

export const Supplier = ({ listing, menu, activities, reviews }) => {
  const { t, locale } = useI18n();
  const [totalRating, setTotalRating] = useState(0);
  const [totalRatingAmount, setTotalRatingAmounts] = useState(0);
  const [isFormOpen, setFormOpen] = useState(false);

  const onClose = () => {
    setFormOpen(false);
  };
  const handleOpen = () => {
    setFormOpen(true);
  };

  useEffect(() => {
    let rating = 0;
    let ratingAmounts = 0;

    activities.forEach((item) => {
      rating =
        rating +
        (item?.rating?.average_rating
          ? parseFloat(item?.rating?.average_rating) * item?.rating?.num_ratings
          : 0);

      ratingAmounts =
        ratingAmounts +
        (item?.rating?.num_ratings ? parseInt(item?.rating?.num_ratings) : 0);
    });

    setTotalRating(rating / ratingAmounts);
    setTotalRatingAmounts(ratingAmounts);
  }, []);

  const meta = {
    title: listing.info.title,
    desc: listing.info.meta_description,
    locale: locale(),
    image: listing.teaser_image?.url,
  };

  const pageUrls = {
    de_CH: `/${supplierPages["de_CH"]}${listing.urls["de_CH"]}`,
    en_CH: `/en-ch/${supplierPages["en_CH"]}/${listing.urls["en_CH"].replace(
      "/en-ch/",
      ""
    )}`,
    fr_CH: `/fr-ch/${supplierPages["fr_CH"]}/${listing.urls["fr_CH"].replace(
      "/fr-ch/",
      ""
    )}`,
    it_CH: `/it-ch/${supplierPages["it_CH"]}/${listing.urls["it_CH"].replace(
      "/it-ch/",
      ""
    )}`,
  };

  return (
    <Layout {...{ meta, pageUrls, menu }}>
      <section
        className={`mt-header relative 2xl:h-[calc(100vh-var(--h-header))] 2xl:max-h-[700px]`}
      >
        <div
          className={`relative h-[200px] lg:absolute lg:grid lg:h-full lg:w-full lg:grid-cols-2`}
        >
          <div className={`hidden lg:block`} />
          <div
            className={`relative h-[200px] overflow-hidden lg:h-auto lg:rounded-bl-[4rem]`}
          >
            <StaticImage
              src={listing.teaser_image.url}
              layout="fill"
              className={`z-[-1]`}
              priority
            />
          </div>
        </div>
        <div className={`section container-tw lg:h-full 2xl:pt-0`}>
          <div
            className={`max-w-[1280px] items-center lg:relative lg:top-0 lg:grid lg:h-full lg:grid-cols-2 lg:items-end lg:gap-72 2xl:items-center`}
          >
            <div className={`relative max-w-screen-md space-y-3 lg:space-y-4`}>
              <div
                className={`lg:flex lg:flex-row-reverse lg:items-center lg:justify-between`}
              >
                {listing.certificates.length >= 1 && (
                  <div
                    className={`absolute right-4 -top-16 flex w-full justify-end sm:-top-20 lg:static lg:mt-0 lg:w-auto`}
                  >
                    {listing.certificates.map((item) => {
                      return (
                        <div
                          key={item.icon_name}
                          className={`rounded-full border-4 border-solid border-white lg:h-16 lg:w-16`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/assets/badges/${item.icon_name}.png`}
                            alt={item.icon_name}
                            height={70}
                            width={70}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
                <Text as="h1" size="lg" className={`!-mt-1`}>
                  {listing.info.title}
                </Text>
              </div>
              <Text size="sm">{listing.info.teaser}</Text>
              <div className={`space-y-2 py-2 !text-lg font-medium text-black`}>
                {[
                  {
                    condition: !!activities.length,
                    element: (
                      <Text as="p" size="md" className={`!text-lg`}>
                        {activities?.length} {t("supplier.activities")}
                      </Text>
                    ),
                  },
                  {
                    condition: totalRatingAmount !== 0,
                    element: (
                      <Rating
                        hit={{
                          rating: totalRating,
                          ratingAmount: totalRatingAmount,
                        }}
                      />
                    ),
                  },
                ].map((item, index) => {
                  return (
                    item.condition && (
                      <div className={`flex items-center`} key={`sup-${index}`}>
                        <BsCheckCircleFill className={`mr-3 text-green-500`} />
                        {item.element}
                      </div>
                    )
                  );
                })}
              </div>
              <Button
                type="primary"
                text={t("menu.contactus")}
                onClick={handleOpen}
              />
            </div>
          </div>
        </div>
      </section>
      <Section>
        <Text as="h2" size="lg" className={`mb`}>
          {t("filter.activities")}
        </Text>
        <SliderGrid activities={activities} />
      </Section>
      <Section>
        <Text as="h2" size="lg" className={`mb`}>
          {t("activity.reviews")}
        </Text>
        <Reviews reviews={reviews} />
      </Section>
      <Section last>
        <div
          className={`overflow-x-auto lg:mx-auto lg:max-w-screen-lg lg:rounded-xl lg:border lg:border-solid lg:border-gray-100 lg:p-8 lg:shadow-xl xl:p-16`}
        >
          <Text as="h2" size="lg" className={`mb flex items-center`}>
            <BsInfoCircleFill className={`mr-4 text-primary`} /> Über{" "}
            {listing.info.title}
          </Text>
          <Content item={listing.content_blocks} className={`!max-w-none`} />
        </div>
      </Section>
      <Modal
        open={isFormOpen}
        onClose={onClose}
        classes={{
          modalContainer: styles.modalContainer,
          modal: styles.modal,
        }}
      >
        <div className={styles.header}>
          <button onClick={onClose} className={styles.close}>
            <BsX />
          </button>
        </div>
        <div className={styles.modalBody}>
          <ContactForm onClose={onClose} isPopup />
        </div>
      </Modal>
    </Layout>
  );
};

export const supplierStaticProps = async ({ params, fs }) => {
  const pages = await services.getPages(fs);
  const path = params.path[0]
    .replace("/en-ch/", "")
    .replace("/fr-ch/", "")
    .replace("/it-ch/", "");
  let page = findPage(path, pages);

  const parameters = await getParams(fs, page.locale);
  const allTypes = await services.getActivityTypes(fs, page.locale);
  const supplierListing = await services.getListingDetails(
    fs,
    page.listingId,
    page.locale
  );
  const activities = await services.getActivities(fs, page.locale);
  const activitiesIds = [];
  const supplierActivities = activities
    .filter((activity) => activity.supplier.id === supplierListing.supplier.id)
    .map((activity) => {
      const fullType = allTypes.find((type) => type.id === activity.type?.id);

      const activityType =
        activity.attribute_values.find(
          (attributeValue) => Number(attributeValue.attribute?.id) === 18
        ) ||
        fullType ||
        activity.type ||
        null;

      activitiesIds.push(Number(activity.id));

      return {
        ...activity,
        type: activityType,
      };
    });

  const allReviews = await getReviews(fs);
  const reviews = allReviews.reviews.filter(
    (item) =>
      activitiesIds.includes(Number(item.sku)) &&
      item.review !== "" &&
      item.rating >= 4
  );

  const paths = [];
  for (const page of pages) {
    paths.push({
      params: {
        path: pagePathToArray(page.path),
      },
    });
  }

  return {
    props: {
      ...parameters,
      paths,
      page,
      pages,
      listing: supplierListing,
      activities: supplierActivities,
      reviews,
      key: "supplier",
    },
  };
};

export const supplierStaticPaths = async (fs, locale = "de_CH") => {
  return await getStaticPaths(fs, locale, "supplier");
};
