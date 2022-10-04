import Layout from "../../_components/Layout";
import { getPageUrls, getParams } from "../../../services/contentServices";
import { Section } from "../../_components/Section";
import { getPost, getSlugs } from "../../../services/wordpressServices";
import { Flow } from "../../_components/Flow";
import { Text } from "../../_components/Text";
import { useEffect } from "react";
import { Author } from "./Author";
import { Date } from "./Date";
import Explore from "../../_components/Explore";

export const Blog = ({ menu, post }) => {
  const urls = getPageUrls("test-blog");
  const pageUrls = {
    de_CH: `${urls["de_CH"]}/${post.slug}`,
    en_CH: `${urls["en_CH"]}/${post.slug}`,
    fr_CH: `${urls["fr_CH"]}/${post.slug}`,
    it_CH: `${urls["it_CH"]}/${post.slug}`,
  };

  const meta = {
    title: post.title.rendered,
    desc: post.title.rendered,
  };

  useEffect(() => {
    console.log(post);
  }, []);

  return (
    <Layout {...{ meta, menu, pageUrls }}>
      <Section first last row>
        <div className={`mx-auto max-w-screen-md`}>
          {post?._embedded?.["wp:featuredmedia"] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={`mb-8 max-h-[300px] w-full rounded-lg object-cover`}
              src={
                post._embedded["wp:featuredmedia"][0].media_details.sizes.full
                  .source_url
              }
            />
          )}
          <div>
            <Flow>
              <Text as="h1" size="xl">
                {post.title.rendered}
              </Text>
              <div className={`flex items-center space-x-2`}>
                <Author item={post} />
                <span>·</span>
                <Date item={post} />
                {post?._embedded?.["wp:term"] && (
                  <>
                    <span>·</span>
                    <span className={`text-xs`}>
                      {post._embedded["wp:term"][0][0].name}
                    </span>
                  </>
                )}
              </div>
            </Flow>
          </div>
          <div className={`mt-8 max-w-screen-lg`}>
            <div
              className={`prose-sa prose-figcaption:mx-auto prose-figcaption:mt-0 prose-figcaption:w-5/6 prose-figcaption:text-center prose-figcaption:text-xs prose-img:my-0`}
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>
        </div>
      </Section>
      <Explore />
    </Layout>
  );
};

export const blogStaticProps = async ({ fs, params, locale = "de_CH" }) => {
  const parameters = await getParams(fs, locale);
  const post = await getPost(params.slug);

  return {
    props: {
      ...parameters,
      post,
    },
    revalidate: 10,
  };
};

export async function blogStaticPaths() {
  const paths = await getSlugs("posts");

  return {
    paths,
    fallback: false,
  };
}
