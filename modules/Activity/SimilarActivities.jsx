import { useI18n } from "next-localization";
import { Text } from "../_components/Text";
import { Activity } from "../_components/Activity";

export const SimilarActivities = ({ activities }) => {
  const { t } = useI18n();

  return (
    <>
      <Text as="h3" size="lg" className={`mb-4 mt-8 lg:mt-0`}>
        {t("activity.similarActivities")}
      </Text>
      <div className={`space-y-6`}>
        {activities.map((item) => {
          return <Activity key={item.teaser_image.url} hit={item} type="lg" />;
        })}
      </div>
    </>
  );
};

export default SimilarActivities;
