import { Section } from "../_components/Section";
import { useI18n } from "next-localization";
import Layout from "../_components/Layout";
import { Flow } from "../_components/Flow";
import { Text } from "../_components/Text";
import ContactForm from "../_components/ContactForm";
import { getPageUrls, getParams } from "../../services/contentServices";

export const Contact = ({ menu }) => {
  const { t, locale } = useI18n();

  const pageUrls = getPageUrls("contact");
  const meta = {
    title: t("pages.contact_us.title"),
    desc: t("pages.contact_us.description"),
    locale: locale(),
  };

  return (
    <Layout meta={meta} pageUrls={pageUrls} disableLinksBlock menu={menu}>
      <Section
        first
        last
        classNameInner="grid gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24"
      >
        <div className="space-y-8">
          <Flow>
            <Text as="h1" size="lg">
              {t("pages.contact_us.title")}
            </Text>
            <Text>{t("pages.contact_us.description")}</Text>
          </Flow>
          <div className={`flex flex-col gap-4 md:flex-row md:gap-12`}>
            <div>
              <Text size="md">{t("contact_us.where")}</Text>
              <Text>Seestrasse 21, CH-8703 Erlenbach</Text>
            </div>
            <div>
              <Text size="md">{t("contact_us.how")}</Text>
              <Text>
                <a href="mailto:support@swissactivities.com">
                  support@swissactivities.com
                </a>
              </Text>
            </div>
          </div>
        </div>
        <ContactForm />
      </Section>
    </Layout>
  );
};

export const contactStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);

  return {
    props: {
      ...params,
    },
  };
};
