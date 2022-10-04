import Layout from "../../_components/Layout";
import { useI18n } from "next-localization";
import {
  getPageUrl,
  getPageUrls,
  getParams,
} from "../../../services/contentServices";
import { SectionTwoColumn } from "../../_components/Section/TwoColumn";
import { Flow } from "../../_components/Flow";
import { Text } from "../../_components/Text";
import { Section } from "../../_components/Section";
import Button from "../../_components/Button";
import { CardBorder } from "../../_components/CardBorder";
import {
  FaMoneyBillWave,
  FaPhone,
  FaPiggyBank,
  FaSkiingNordic,
} from "react-icons/fa";
import { Icon } from "../../_components/Icon";
import { LogoGrid } from "../../_components/LogoGrid";
import { useState } from "react";
import classNames from "classnames";
import SupplierPricing from "./SupplierPricing";

export const SupplierIndex = ({ menu }) => {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const pageUrls = getPageUrls("supplier");
  const meta = {
    title: t("pages.supplier.title"),
    desc: t("pages.supplier.description"),
    locale: locale(),
  };

  const HeroMedia = () => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        style={{
          borderTopLeftRadius: "70% 60%",
          borderTopRightRadius: "30% 40%",
          borderBottomRightRadius: "30% 60%",
          borderBottomLeftRadius: "70% 40%",
        }}
        className={`hidden rotate-2 saturate-150 lg:block`}
        src="/assets/supplier/hero.webp"
      />
    );
  };

  return (
    <Layout {...{ pageUrls, meta, menu }} disableLinksBlock>
      <SectionTwoColumn first pb media={<HeroMedia />}>
        <Flow>
          <Text as="h1" size="xl">
            {t(`pages.supplier.hero.title`)}
          </Text>
          <Button
            href={getPageUrl("supplierRegistration", locale())}
            type="primary"
          >
            {t(`pages.supplier.hero.button`)}
          </Button>
        </Flow>
      </SectionTwoColumn>
      <Section row>
        <Flow>
          <Text as="h2" size="lg">
            {t(`pages.supplier.numbers.title`)}
          </Text>
        </Flow>
        <div className={`grid gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4`}>
          {Object.values(
            t(`pages.supplier.numbers.blocks`, { returnObject: true })
          ).map((item) => {
            return (
              <div key={`numbers-${item.title}`}>
                <Flow
                  center
                  className={`rounded-lg border border-solid border-gray-100 p-8 shadow`}
                >
                  <Text size="md">{item.title}</Text>
                  <span
                    className={`text-4xl font-bold text-primary xl:text-5xl`}
                  >
                    {item.number}
                  </span>
                  <Text>{item.text}</Text>
                </Flow>
              </div>
            );
          })}
        </div>
      </Section>
      <Section row>
        <Flow>
          <Text as="h2" size="lg">
            {t(`pages.supplier.why.title`)}
          </Text>
        </Flow>
        <div className={`grid gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4`}>
          {[
            { id: "sales", icon: <FaMoneyBillWave /> },
            { id: "support", icon: <FaPhone /> },
            { id: "finances", icon: <FaPiggyBank /> },
            { id: "local", icon: <FaSkiingNordic /> },
          ].map((item) => {
            return (
              <CardBorder key={`why-${item.id}`}>
                <Flow>
                  <Icon icon={item.icon} />
                  <Text as="h3" size="md">
                    {t(`pages.supplier.why.${item.id}.title`)}
                  </Text>
                  <Text>{t(`pages.supplier.why.${item.id}.description`)}</Text>
                </Flow>
              </CardBorder>
            );
          })}
        </div>
      </Section>
      <Section row center pb className={`overflow-hidden`}>
        <Flow>
          <Text as="h2" size="lg">
            {t(`pages.supplier.who.title`)}
          </Text>
        </Flow>
        <div className="space-y-12">
          {Object.values(
            t(`pages.supplier.who.partners`, { returnObject: true })
          ).map((item, index) => {
            return (
              <Flow key={`partner-${index}`}>
                <Text bold gray>{item.title}</Text>
                <LogoGrid infinite={index + 1} items={item.blocks} />
              </Flow>
            );
          })}
        </div>
      </Section>
      <Section
        flushAlt
        row
        bg="bg-blue"
        classNameInner={classNames(`relative`, {
          "max-h-[700px] overflow-hidden lg:max-h-[500px]": !isOpen,
        })}
      >
        {!isOpen && (
          <div
            hidden
            role="button"
            onClick={() => setIsOpen(true)}
            className={`group absolute left-0 bottom-0 flex h-1/2 w-full cursor-pointer items-center justify-center bg-gradient-to-t from-blue transition duration-100 ease-in`}
          >
            <div
              className={`rounded-full border border-solid border-gray-400 bg-white px-4 py-2 shadow-md transition duration-100 ease-in group-hover:shadow-lg`}
            >
              <Text
                size="md"
                className={`transition duration-100 ease-in group-hover:!text-primary`}
              >
                {t("activity.widget.learnMore")}
              </Text>
            </div>
          </div>
        )}
        <Flow>
          <Text as="h2" size="xl" className={`!text-white`}>
            {t(`pages.supplier.help.title`)}
          </Text>
        </Flow>
        {Object.values(
          t(`pages.supplier.help.blocks`, { returnObject: true })
        ).map((item, index) => {
          return (
            <div key={`help-${item.title}`}>
              {index !== 0 && <div className={`mb-8 h-px w-full bg-white/5`} />}
              <Flow>
                <div className={`grid gap-8 lg:grid-cols-3`}>
                  {item.blocks.map((itemInner) => {
                    return (
                      <Flow key={`help-${item.title}-${itemInner.title}`}>
                        <Text className={`!text-white`} size="md">
                          {itemInner.title}
                        </Text>
                        <Text className={`!text-gray-400`}>
                          {itemInner.text}
                        </Text>
                      </Flow>
                    );
                  })}
                </div>
              </Flow>
            </div>
          );
        })}
      </Section>
      <SupplierPricing />
    </Layout>
  );
};

export const supplierIndexStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);

  return {
    props: {
      ...params,
    },
  };
};
