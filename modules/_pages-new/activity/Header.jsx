import { useI18n } from "next-localization";
import { Rating } from "../../_components/Rating";
import { Text } from "../../_components/Text";
import { FaSadTear } from "react-icons/fa";
import { SliderGrid } from "../../_components/SliderGrid";
import classNames from "classnames";

const Header = ({ activity, similarActivities, bookable }) => {
  const { t } = useI18n();

  return (
    <div
      className={`w-full lg:mt-6 lg:mb-2 lg:inline-flex lg:w-full lg:justify-between`}
    >
      <div className={`lg:space-y-2`}>
        <Text
          as="span"
          size="xl"
          className={`mt-0 inline-block hidden pt-4 lg:block lg:pt-2 lg:!text-3xl`}
        >
          {activity.info.title}
        </Text>
        {activity?.rating?.num_ratings &&
          parseFloat(activity?.rating?.average_rating) >= 4 && (
            <div className={`mt-6 flex items-center text-black lg:hidden`}>
              <Rating
                className={`!text-xs font-medium`}
                hit={{
                  rating: parseFloat(activity?.rating?.average_rating),
                  ratingAmount: activity?.rating?.num_ratings,
                }}
                minRating={4.0}
              />
            </div>
          )}
        <div className={`items-center hidden lg:flex lg:space-x-4 lg:text-sm`}>
          {activity?.rating?.num_ratings &&
            parseFloat(activity?.rating?.average_rating) >= 4 && (
              <>
                <div className={`relative top-px hidden lg:block`}>
                  <Rating
                    hit={{
                      rating: parseFloat(activity?.rating?.average_rating),
                      ratingAmount: activity?.rating?.num_ratings,
                    }}
                  />
                </div>
                <span className={`hidden lg:block`}>·</span>
              </>
            )}
          <span
            className={`mt-1 block hidden text-xs text-gray-600 lg:mt-0 lg:block lg:text-sm lg:text-gray-900`}
          >
            {t("activity.providedBy")}: {activity.supplier.name}
          </span>
        </div>
        <div className={`mt-3 lg:hidden`}>
          {activity?.info?.teaser && <Text>{activity.info.teaser}</Text>}
        </div>
      </div>
      {!bookable && (
        <div className={`mt-6 lg:hidden`}>
          <div
            className={classNames(
              `rounded-lg border-2 border-solid border-primary bg-gray-50 py-4 px-10 text-center font-medium`,
              {
                mb: !!similarActivities?.length,
              }
            )}
          >
            <Text className={`text-gray-500`}>
              {t("activity.widget.notBookable")} <FaSadTear />
            </Text>
          </div>
          {!!similarActivities?.length && (
            <>
              <Text as="h2" size="md" className={`mb mt-6`}>
                {t("activity.similarActivities")}
              </Text>
              <SliderGrid
                activities={similarActivities}
                navClasses={`hidden z-0 lg:!grid`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
