import { getPageUrls, getParams } from "../../../services/contentServices";
import { useI18n } from "next-localization";
import Layout from "../../_components/Layout";
import { Section } from "../../_components/Section";
import Hubspot from "../../_components/Hubspot";
import { Flow } from "../../_components/Flow";
import { Text } from "../../_components/Text";
import Content from "../../_components/Content";
import SupplierPricing from "./SupplierPricing";

export const SupplierRegistration = ({ menu }) => {
  const { t, locale } = useI18n();
  const pageUrls = getPageUrls("supplierRegistration");
  const meta = {
    title: t("pages.supplier.title"),
    desc: t("pages.supplier.description"),
    locale: locale(),
  };

  return (
    <Layout {...{ pageUrls, meta, menu }} disableLinksBlock>
      <Section id="register" first last>
        <div className={`grid gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-32`}>
          <Flow>
            <Text as="h1" size="xl">
              {t(`pages.supplierRegistration.hero.title`)}
            </Text>
            <Text size="md">
              {t(`pages.supplierRegistration.hero.description`)}
            </Text>
            <Content>
              <ul>
                {Object.values(
                  t(`pages.supplierRegistration.hero.list`, {
                    returnObject: true,
                  })
                ).map((item) => {
                  return <li key={item}>{item}</li>;
                })}
              </ul>
            </Content>
          </Flow>
          <Hubspot />
        </div>
      </Section>
      <SupplierPricing inline />
    </Layout>
  );
};

export const supplierRegistrationStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);

  return {
    props: {
      ...params,
    },
  };
};
