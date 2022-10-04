import { useI18n } from "next-localization";
import {
  getPageUrl,
  getPageUrls,
  getParams,
  legalPages,
} from "../../services/contentServices";
import Layout from "../_components/Layout";
import { Section } from "../_components/Section";
import Content from "../_components/Content";
import * as services from "../../services/contentServices";
import { Select } from "../_components/Form/Select";
import { useRouter } from "next/router";

export const Legal = ({ menu, text, type, locale = "de_CH" }) => {
  const { t } = useI18n();
  const router = useRouter();

  const pageUrls = getPageUrls(type);
  const meta = {
    title: t(`pages.${type}.title`),
    desc: t(`pages.${type}.description`),
    locale: locale,
  };

  const tabs = legalPages.map((typeInner) => {
    return {
      label: t(`pages.${typeInner}.title`).replace(" - Swiss Activities", ""),
      value: getPageUrl(typeInner, locale),
      selected: type === typeInner,
    };
  });

  const onChange = (e) => {
    router.push(e.target.value);
  };

  return (
    <Layout meta={meta} pageUrls={pageUrls} menu={menu}>
      <Section first last classNameInner={`mt-4 lg:mt-0`}>
        <div className={`mb-8`}>
          <Select
            options={tabs}
            selected={tabs.find((e) => e.selected).value}
            onChange={onChange}
          />
        </div>
        <Content item={text} />
      </Section>
    </Layout>
  );
};

export const legalStaticProps = async (fs, type, locale = "de_CH") => {
  const params = await getParams(fs, locale);

  return {
    props: {
      ...params,
      text: await services.getText(fs, locale, type),
    },
  };
};
