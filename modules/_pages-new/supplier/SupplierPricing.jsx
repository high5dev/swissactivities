import { Section } from "../../_components/Section";
import { Flow } from "../../_components/Flow";
import { Text } from "../../_components/Text";
import Button from "../../_components/Button";
import Accordion from "../../_components/Accordion";
import { LogoGrid } from "../../_components/LogoGrid";
import { useI18n } from "next-localization";
import { getPageUrl } from "../../../services/contentServices";
import { FaCheck } from "react-icons/fa";

const SupplierPricing = ({ inline }) => {
  const { t, locale } = useI18n();

  return (
    <>
      <Section center row>
        <Flow className={`max-w-screen-md`}>
          <Text as="h1" size="xl">
            {t(`pages.supplier.pricing.title`)}
          </Text>
          <Text as="h3" size="md">
            {t(`pages.supplier.pricing.subtitle`)}
          </Text>
          <Text>{t(`pages.supplier.pricing.description`)}</Text>
        </Flow>
        <div className={`grid w-full max-w-screen-md gap-8 md:grid-cols-2`}>
          {Object.values(
            t("pages.supplier.pricing.blocks", { returnObject: true })
          ).map((item, index) => {
            return (
              <div
                key={`pricing-${index}`}
                className={`flex w-full flex-col space-y-4 overflow-hidden rounded-xl border border-solid border-gray-100 shadow-md`}
              >
                <div className={`space-y-3 px-4 pt-6`}>
                  <p
                    className={`mx-auto max-w-max rounded-full bg-light py-1 px-2.5 text-xs font-semibold uppercase text-primary`}
                  >
                    {item.pretitle}
                  </p>
                  <div>
                    <Text size="lg">{item.cost}</Text>
                    <Text size="xs">{item.subcost}</Text>
                  </div>
                  <Button
                    target={item.button === "Registrieren" ? "_self" : "_blank"}
                    href={
                      item.button === "Registrieren"
                        ? inline
                          ? "#register"
                          : getPageUrl("supplierRegistration", locale())
                        : "https://supplier.swissactivities.com/cs/c/?cta_guid=82b8ad29-27fd-4c45-ad41-151d281bcaab&signature=AAH58kEo1zZ65W8wWR10HrANS_eefUWvxQ&pageId=35315795100&placement_guid=64db1575-1918-42fd-a259-deadb3a3e170&click=63977b06-4a26-401c-869b-7e4fc9e8a07b&hsutk=3e4fffa284612025052e15a448285e48&canon=https%3A%2F%2Fsupplier.swissactivities.com%2Fde%2Fpreis%C3%BCbersicht&utm_referrer=https%3A%2F%2Fsupplier.swissactivities.com%2Fde%2Fkontakt%3FhsCtaTracking%3D80a07dd4-f2bc-426a-98ad-e01b0a879941%7C4bcf773a-6a39-471e-b60a-1b9fb4623b55&portal_id=7531548&redirect_url=APefjpF_FZvFqFBlLreG7gh_-Q9pzdFrQI4El0iF0HLQWzaB6c986raMk3npglyi8h6Ea2yl4lypm8WCv9NZYBjdSSvUuu2SVRGBPWVKuY8s5Npw507qQBvFjywnPJTA7qFyMfkiApYcub8UQH7IjpEgAkxw3npADt5YI5kwgrIVnOL9hPrB9aIG5BpqhHkgUyDuIX8BO5rmi8jV4rC2L_0mYUlyvwyT33raMvc-IfAOKuVKGWg4Ht3Jqjob1TCkZMnPUaAd3ZFjisKrBaEbO1pkQ4XZRKOxQw"
                    }
                    type="primary"
                    className={`!mt-5  max-w-max`}
                  >
                    {item.button}
                  </Button>
                  <Text bold black>{item.subbutton}</Text>
                </div>
                {item.includes && (
                  <div className={`flex-grow space-y-2`}>
                    <div className={`h-px w-full bg-gray-100 mb-4`} />
                    {item.includes.map((itemInner, indexInner) => {
                      return (
                        <div
                          key={`includes-${item.pretitle}-${indexInner}`}
                          className={`flex px-6 text-xs`}
                        >
                          <FaCheck
                            className={`relative top-1.5 mr-2 shrink-0 text-left text-primary`}
                          />
                          <Text className={`text-left`}>
                            {itemInner}
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                )}
                <ul className={`mt-auto w-full`}>
                  <div className={`h-px w-full bg-gray-100`} />
                  {item.faq.map((itemInner) => {
                    return (
                      <Accordion
                        large={false}
                        key={`faq-${itemInner.text}`}
                        item={{ text: itemInner.title }}
                        className={`px-6`}
                        classNameChildren={`px-6`}
                      >
                        <div className={`prose-sa pb-6 text-left`}>
                          <p>{itemInner.text}</p>
                        </div>
                      </Accordion>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>
      <Section row center bg="bg-gray-50">
        <Flow>
          <Text as="h2" size="lg">
            {t(`pages.supplier.tech.title`)}
          </Text>
          <Text>{t(`pages.supplier.tech.description`)}</Text>
        </Flow>
        <LogoGrid
          items={[
            "/assets/supplier/technology/adlevo.webp",
            "/assets/supplier/technology/booking-kit.webp",
            "/assets/supplier/technology/experiencebank.webp",
            "/assets/supplier/technology/payyo.webp",
            "/assets/supplier/technology/smeetz.webp",
            "/assets/supplier/technology/trekksoft.webp",
            "/assets/supplier/technology/waldhart.webp",
          ]}
        />
      </Section>
      <Section last>
        <div className={`grid gap-8 lg:grid-cols-2`}>
          {Object.values(t("pages.supplier.faq", { returnObject: true })).map(
            (item) => {
              return (
                <Flow key={item.title}>
                  <Text as="h2" size="lg">
                    {item.title}
                  </Text>
                  <div
                    className={`overflow-hidden rounded-lg border border-solid border-gray-200`}
                  >
                    {item.blocks.map((itemInner, itemIndex) => {
                      return (
                        <div key={`faq-${itemInner.title}`}>
                          {itemIndex !== 0 && (
                            <div className={`h-px w-full bg-gray-200`} />
                          )}
                          <Accordion
                            large={false}
                            item={{ text: itemInner.title }}
                          >
                            <div className={`prose-sa pb-6 text-left`}>
                              {itemInner.text && <p>{itemInner.text}</p>}
                              {itemInner.list && (
                                <ul>
                                  {itemInner.list.map((itemList) => {
                                    return (
                                      <li key={`faq-list-${itemList}`}>
                                        {itemList}
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          </Accordion>
                        </div>
                      );
                    })}
                  </div>
                </Flow>
              );
            }
          )}
        </div>
      </Section>
    </>
  );
};

export default SupplierPricing;
