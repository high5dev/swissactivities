import Layout from "../_components/Layout";
import { useI18n } from "next-localization";
import { getPageUrls, getParams } from "../../services/contentServices";
import { Section } from "../_components/Section";
import { Flow } from "../_components/Flow";
import { Text } from "../_components/Text";
import Content from "../_components/Content";
import SectionBlock from "../_components/SectionBlock";
import { CardBorder } from "../_components/CardBorder";
import Hubspot from "../_components/Hubspot";

export const Affiliate = ({ menu }) => {
  const { t, locale } = useI18n();
  const pageUrls = getPageUrls("affiliate");
  const meta = {
    title: t("pages.affiliate.title"),
    desc: t("pages.affiliate.description"),
    locale: locale(),
  };
  return (
    <Layout {...{ pageUrls, meta, menu }} disableLinksBlock>
      <Section first>
        <div
          className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-32`}
        >
          <Flow>
            <Text as="h1" size="lg">
              {t(`pages.affiliate.hero.title`)}
            </Text>
            <Text>{t(`pages.affiliate.hero.description`)}</Text>
            <Content>
              <ol>
                {Object.values(
                  t(`pages.affiliate.hero.steps`, {
                    returnObject: true,
                  })
                ).map((item) => {
                  return (
                    <li className={`font-semibold`} key={item}>
                      {item}
                    </li>
                  );
                })}
              </ol>
            </Content>
          </Flow>
          <Hubspot
            form={{
              region: "na1",
              portalId: "7531548",
              formId: "fb0501df-991b-4788-a36d-90f24f7bf360",
            }}
          />
        </div>
      </Section>
      <SectionBlock
        items={[
          {
            title: t(`pages.affiliate.flat.title`),
            text: t(`pages.affiliate.flat.text`),
            img: "/assets/affiliate/1.webp",
          },
          {
            title: t(`pages.affiliate.blog.title`),
            text: t(`pages.affiliate.blog.text`),
            img: "/assets/affiliate/2.webp",
          },
        ]}
      />
      <Section row last center>
        <Text as="h2" size="lg">
          {t(`pages.affiliate.hyperlinks.title`)}
        </Text>
        <div className={`grid gap-8 lg:grid-cols-2`}>
          {Object.values(
            t(`pages.affiliate.hyperlinks.blocks`, { returnObject: true })
          ).map((item, index) => {
            return (
              <CardBorder key={`hyper-${index}`}>
                <Flow>
                  <Text as="h3" size="md">
                    {item.title}
                  </Text>
                  <Text>{item.text}</Text>
                </Flow>
              </CardBorder>
            );
          })}
        </div>
      </Section>
    </Layout>
  );
};

export const affiliateStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);

  return {
    props: {
      ...params,
    },
  };
};
