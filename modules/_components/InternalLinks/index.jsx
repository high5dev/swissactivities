import Link from "next/link";
import { useI18n } from "next-localization";

import { useInternalLinksContext } from "../../../hooks/useInternalLinksContext";
import { Text } from "../Text";

export const InternalLinks = () => {
  const { t } = useI18n();
  const internalLinkData = useInternalLinksContext();
  return (
    <div className={`bg-gray-100 py-10 md:py-12 lg:py-16`}>
      <div className={`container-tw grid gap-8 md:grid-cols-2 lg:grid-cols-4`}>
        {internalLinkData &&
          Object.keys(internalLinkData).map((internalLinkSection) => (
            <div key={internalLinkSection}>
              <Text as="h4" size="md" className={`mb-2.5`}>
                {t(`internalLinkBlock.${internalLinkSection}`)}
              </Text>
              <ul className={`grid gap-2`}>
                {internalLinkData[internalLinkSection].map((link) => (
                  <li key={internalLinkSection + link.title}>
                    <Link href={link.url} passHref>
                      <a
                        className={`inline-block w-full rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-600 transition duration-100 ease-in hover:bg-primary hover:text-white`}
                      >
                        {link.title}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};
