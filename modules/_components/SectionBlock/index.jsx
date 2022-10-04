import { Section } from "../Section";
import classNames from "classnames";
import StaticImage from "../../Image";
import { Flow } from "../Flow";
import { Text } from "../Text";

const SectionBlock = ({ items }) => {
  return items.map((item, index) => {
    return (
      <Section
        key={`partner-${index}`}
        classNameInner={classNames(`md:grid md:gap-8 xl:gap-16`, {
          "md:grid-cols-[300px,1fr]": index === 0,
          "md:grid-cols-[1fr,300px]": index === 1,
        })}
      >
        <StaticImage
          height={400}
          width={500}
          layout={`responsive`}
          src={item.img}
          className={`h-44 w-full rounded-xl object-cover lg:h-full`}
        />
        <Flow
          className={classNames(
            `mt-6 md:mt-0 md:rounded-lg md:border md:border-solid md:border-gray-200 md:p-8 lg:p-8 xl:p-16`,
            {
              "md:col-start-1 md:row-start-1": index === 1,
            }
          )}
        >
          <Text as="h2" size="lg">
            {item.title}
          </Text>
          <Text display>{item.text}</Text>
        </Flow>
      </Section>
    );
  });
};

export default SectionBlock;
