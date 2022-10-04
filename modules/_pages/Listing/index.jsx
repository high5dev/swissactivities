import Layout from "../../_components/Layout";
import Breadcrumbs from "../../_components/Breadcrumbs";
import { useI18n } from "next-localization";
import StaticImage from "../../Image";
import classNames from "classnames";
import styles from "./styles.module.scss";
import { Text } from "../../_components/Text";
import { Rating } from "../../_components/Rating";
import { useEffect, useState } from "react";
import Media from "./Media";
import Markdown from "./Markdown";
import { EmailSubscription } from "../../_components/EmailSubscription";
import Images from "./Images";
import React, { useMemo } from "react";
import Usps from "../../_components/Usps";
import Link from "next/link";
import { MobileToc } from "./MobileToc";
import { Nav } from "./Nav";
import { Activities } from "../../_components/Activities";
import { SectionTwoColumn } from "../../_components/Section/TwoColumn";
import { Section } from "../../_components/Section";

export const Listing = ({
  listing,
  headings,
  pageType,
  breadcrumbs,
  relatedArticles,
  menu,
  offers,
}) => {
  const { t, locale } = useI18n();
  const [sortedHeadings, setSortedHeadings] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isOpen, setIsOpen] = useState(listing?.type !== "point_of_interest");

  const refsById = useMemo(() => {
    const refs = {};
    headings.forEach((item) => {
      refs[item.anchor] = React.createRef();
    });
    return refs;
  }, [headings]);

  useEffect(() => {
    window.addEventListener("scroll", scrollbar);

    function scrollbar() {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (document.getElementById("toc-progress")) {
        document.getElementById("toc-progress").style.strokeDashoffset = String(
          194.779 - (194.779 / 100) * scrolled
        );
      }
    }

    return () => window.removeEventListener("scroll", scrollbar);
  }, []);

  useEffect(() => {
    const arr = [];
    const parents = [];
    const children = {};
    headings.forEach((item) => {
      if (item.level === 2) {
        parents.push(item.anchor);
        const obj = {
          parent: {
            text: item.text,
            anchor: item.anchor,
            level: item.level,
          },
          children: headings.filter(
            (heading) => heading.parent === item.anchor
          ),
        };
        arr.push(obj);
      } else if (item.level === 3) {
        children[item.anchor] = item.parent;
      }
    });
    setSortedHeadings(arr);

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setCurrent(id);
          document.querySelectorAll(`[data-id]`).forEach((item) => {
            item?.classList.remove("lg:!text-primary");
          });
          document.querySelectorAll(`[data-id="${id}"]`).forEach((item) => {
            item?.classList.add("lg:!text-primary");
          });
          if (parents.includes(id) || children[id]) {
            setCurrent(id);
            document.querySelectorAll(`[data-parent]`).forEach((item) => {
              item?.classList.remove("lg:!block");
            });
            document
              .querySelectorAll(
                `[data-parent="${parents.includes(id) ? id : children[id]}"]`
              )
              .forEach((item) => {
                item.classList.add("lg:!block");
              });
          }
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "0px 0px -75% 0px",
    });

    Object.values(refsById).forEach((i) => {
      if (i.current) {
        observer.observe(i.current);
      }
    });

    return () => observer.disconnect();
  }, [headings, refsById]);

  const pageUrls = listing.urls;
  const meta = {
    title: listing.info.title,
    desc: listing.info.meta_description,
    locale: locale(),
    image: listing.teaser_image?.url,
  };

  return (
    <Layout {...{ meta, listing, pageUrls, pageType, menu }}>
      <div
        className={classNames(
          `mt-header container-tw mb-6 pt-4`,
          styles.breadcrumbs
        )}
      >
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <SectionTwoColumn push section={false} image={listing.teaser_image}>
        <Rating hit={listing} />
        <Text as="h1" size="lg">
          {listing.info.title}
        </Text>
        <Text>{listing.info.teaser}</Text>
        <Usps
          className={`!mt-6 lg:!mt-8`}
          type="row"
          simple
          ids={["online", "mobileTicket", "cancel", "payment"]}
          label={false}
        />
      </SectionTwoColumn>
      <Activities
        title={listing.info?.title_frontend}
        listing={listing}
        offers={offers}
      />
      <Section
        last={relatedArticles.length === 0}
        className={classNames("mt-8 lg:mt-0", {
          "relative max-h-[600px] overflow-hidden ": !isOpen,
        })}
      >
        {!isOpen && (
          <div
            role="button"
            onClick={() => setIsOpen(true)}
            className={`group absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center bg-gradient-to-t from-white transition duration-100 ease-in`}
          >
            <div
              className={`rounded-full border border-solid border-gray-400 bg-white px-4 py-2 shadow-md transition duration-100 ease-in group-hover:shadow-lg`}
            >
              <Text
                size="md"
                className={`transition duration-100 ease-in group-hover:!text-primary`}
              >
                {t("pages.listing.more", { val: listing.info?.title_frontend })}
              </Text>
            </div>
          </div>
        )}
        <div
          className={`grid grid-cols-[minmax(0,1fr)] lg:grid-cols-3 lg:gap-8 xl:gap-16`}
        >
          <div
            className={classNames(
              `m-0 hidden h-[max-content] max-h-[calc(var(--vh)-var(--h-header)-64px)] overflow-y-auto rounded-lg border border-solid border-gray-200 bg-gray-50 p-6 shadow-md lg:block`,
              {
                "sticky top-[calc(var(--h-header)+32px)]": isOpen,
              }
            )}
          >
            <Nav headings={sortedHeadings} />
          </div>
          <div className={`prose-sa max-w-none lg:col-span-2`}>
            {listing.content_blocks.map((el, i) => (
              <>
                {el.youtube_url && <Media mediaLink={el.youtube_url} />}
                {el.text && <Markdown text={el.text} refs={refsById} />}
                {el.pictures && el.pictures.length > 0 && (
                  <Images images={el.pictures} />
                )}
                {i === 2 && (
                  <div className={`my-4`}>
                    <EmailSubscription type="sm" />
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </Section>
      {relatedArticles.length >= 1 && (
        <Section id="related" last>
          <Text as="h2" size="lg" className={`mb`}>
            {t("pages.listing.related")}
          </Text>
          <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4`}>
            {relatedArticles.map((item) => {
              return (
                item.urls[locale()] && (
                  <Link
                    key={item.info.slug}
                    passHref
                    href={item.urls[locale()]}
                  >
                    <a className="grid grid-rows-[150px,1fr] overflow-hidden rounded-lg border border-solid border-gray-200 transition duration-100 ease-in hover:shadow-md">
                      <div className={`image-wrapper relative`}>
                        {item.teaser_image?.url && (
                          <StaticImage
                            src={item.teaser_image?.url}
                            alt={item.teaser_image?.alternativeText}
                            width={200}
                            height={200}
                          />
                        )}
                      </div>
                      <div className={`space-y-2 p-4`}>
                        <h4 className={`text-base font-medium text-black`}>
                          {item.info.title}
                        </h4>
                        {item.activities.length >= 1 && (
                          <Text className={`text-gray-600`}>
                            {item.activities.length}{" "}
                            {item.activities.length >= 1
                              ? t("filter.activity")
                              : t("filter.activities")}
                          </Text>
                        )}
                      </div>
                    </a>
                  </Link>
                )
              );
            })}
          </div>
        </Section>
      )}
      {isOpen && <MobileToc current={current} headings={sortedHeadings} />}
    </Layout>
  );
};
