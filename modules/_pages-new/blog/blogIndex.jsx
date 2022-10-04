import Layout from "../../_components/Layout";
import { useI18n } from "next-localization";
import { getPageUrls, getParams } from "../../../services/contentServices";
import { Section } from "../../_components/Section";
import { getPosts } from "../../../services/wordpressServices";
import { Flow } from "../../_components/Flow";
import { Text } from "../../_components/Text";
import { useEffect } from "react";
import Link from "next/link";
import { toISO } from "../../../utils/dates/toISO";
import Explore from "../../_components/Explore";
import { Author } from "./Author";
import { Date } from "./Date";
import { LogoPicture } from "../../_components/Logo/Picture";

export const BlogIndex = ({ menu, posts }) => {
  const { t, locale } = useI18n();

  const pageUrls = getPageUrls("test-blog");
  const meta = {
    title: t(`pages.blog.title`),
    desc: t(`pages.blog.description`),
  };

  useEffect(() => {
    console.log(posts);
  }, []);

  return (
    <Layout {...{ meta, menu, pageUrls }}>
      <Section first row>
        <Flow>
          <Text as="h1" size="xl">
            {t(`pages.blog.title`)}
          </Text>
          <Text>{t(`pages.blog.description`)}</Text>
        </Flow>
        <div
          className={`grid gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-12`}
        >
          {posts.map((item) => {
            return (
              <Link
                key={item.id}
                passHref
                href={`${
                  locale() !== "de_CH"
                    ? "/" + locale().replace("_CH", "-ch")
                    : ""
                }/test-blog/${item.slug}`}
              >
                <a
                  className={`group flex h-auto cursor-pointer flex-col overflow-hidden rounded-lg border border-solid border-gray-200 transition duration-100 ease-in hover:shadow`}
                >
                  <div
                    className={`relative flex h-[150px] items-center justify-center overflow-hidden bg-gray-200`}
                  >
                    {item?._embedded?.["wp:term"] && (
                      <span
                        className={`absolute right-2 top-2 z-10 flex items-center justify-center rounded-full bg-light px-2 py-1.5 text-xs font-semibold uppercase leading-none text-primary`}
                      >
                        {item._embedded["wp:term"][0][0].name}
                      </span>
                    )}
                    {item?._embedded?.["wp:featuredmedia"] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className={`h-full w-full object-cover transition duration-100 ease-in group-hover:scale-105`}
                        src={
                          item._embedded["wp:featuredmedia"][0].media_details
                            .sizes.full.source_url
                        }
                      />
                    ) : (
                      <div className={`opacity-10 saturate-0 duration-100 ease-in group-hover:opacity-100 group-hover:saturate-100`}>
                        <LogoPicture />
                      </div>
                    )}
                  </div>
                  <div className={`px-4 py-5`}>
                    <Text size="md">{item.title.rendered}</Text>
                    <div
                      className={`prose-sa mt-3 line-clamp-4`}
                      dangerouslySetInnerHTML={{
                        __html: item.excerpt.rendered || item.content.rendered,
                      }}
                    ></div>
                  </div>
                  <div className={`mt-auto h-px w-full bg-gray-100`} />
                  <div className={`bg-gray-50 px-4 py-2`}>
                    <div className={`flex items-center justify-between`}>
                      <Author item={item} />
                      <Date item={item} />
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </Section>
      <Explore />
    </Layout>
  );
};

export const blogIndexStaticProps = async (fs, locale = "de_CH") => {
  const parameters = await getParams(fs, locale);
  const posts = await getPosts();

  return {
    props: {
      ...parameters,
      posts,
    },
    revalidate: 10,
  };
};
