import classNames from "classnames";
import { useI18n } from "next-localization";
import Button from "../_components/Button";
import { Text } from "../_components/Text";
import { Rating } from "../_components/Rating";

const StickyHeader = ({ activity, bookNow, open }) => {
  const { t } = useI18n();

  return (
    <section
      className={classNames(
        `flex fixed bottom-0 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)] transition duration-100 ease-in left-0 w-full z-20 bg-blue booking:block booking:top-[var(--h-header)] booking:bottom-[unset] `,
        {
          "translate-y-full booking:translate-y-[-101%]": !open,
          "translate-y-0 booking:translate-y-0": open,
        }
      )}
    >
      <div
        className={`container-tw w-full booking:grid booking:grid-cols-3 booking:gap-2 booking:items-center`}
      >
        <div
          className={`hidden text-white space-y-2 booking:block booking:col-span-2`}
        >
          <Text as="h2" size="md" className={`!text-white`}>
            {activity.info.title}
          </Text>
          <Rating
            hit={{
              rating: parseInt(activity?.rating?.average_rating),
              ratingAmount: activity?.rating?.num_ratings,
            }}
          />
        </div>
        <Button
          className={`w-full text-base`}
          type="primary"
          text={`${t("booking.booknow")}${
            activity?.summary?.startingPrice?.formatted
              ? " - " +
                t("search.card.from") +
                " " +
                activity?.summary?.startingPrice?.formatted
              : ""
          }`}
          onClick={bookNow}
        />
      </div>
    </section>
  );
};

export default StickyHeader;
