import { FaStar, FaStarHalf } from "react-icons/fa";
import classNames from "classnames";
import { useI18n } from "next-localization";

export const Rating = ({ hit, type, rating, minRating = 0, className }) => {
  const { t } = useI18n();
  const isSm = type === "sm";

  const ratingScore = rating
    ? rating
    : hit?.rating?.num_ratings
    ? parseFloat(hit.rating.average_rating)
    : hit.rating;
  const ratingAmount = hit?.rating?.num_ratings
    ? hit?.rating?.num_ratings
    : hit?.ratingAmount;

  return ratingAmount >= 1 || rating
    ? minRating <= Number(ratingScore) && (
        <span
          className={classNames("flex items-center", {
            "mr-2": isSm,
          })}
        >
          {ratingScore && (
            <span
              className={classNames(`relative text-sm`, className, {
                "mr-1": isSm,
                "mr-2": !isSm,
              })}
            >
              {ratingScore.toFixed(1)}
            </span>
          )}
          {!isSm ? (
            <>
              <span className={`relative -top-px flex items-center space-x-1`}>
                {[1, 2, 3, 4, 5].map((itemNested, indexNested) => {
                  return (
                    <span className={`relative flex`} key={indexNested}>
                      <FaStar
                        className={classNames({
                          "text-yellow-400":
                            ratingScore > itemNested ||
                            ratingScore === itemNested,
                        })}
                      />
                      {(itemNested === 1 && ratingScore >= 0.5) ||
                      (itemNested === 2 && ratingScore >= 1.5) ||
                      (itemNested === 3 && ratingScore >= 2.5) ||
                      (itemNested === 4 && ratingScore >= 3.5) ||
                      (itemNested === 5 &&
                        ratingScore >= 4.5 &&
                        ratingScore !== 5) ? (
                        <FaStarHalf
                          className={`absolute top-0 left-0 text-yellow-400`}
                        />
                      ) : (
                        itemNested === 5 &&
                        ratingScore === 5 && (
                          <FaStar
                            className={`absolute top-0 left-0 text-yellow-400`}
                          />
                        )
                      )}
                    </span>
                  );
                })}
              </span>
              {ratingAmount && (
                <span className={`relative ml-2 flex text-xs`}>
                  ({ratingAmount}{" "}
                  {ratingAmount === 1
                    ? t("activity.rating")
                    : t("activity.reviews")}
                  )
                </span>
              )}
            </>
          ) : (
            <FaStar className="text-sm text-yellow-400" />
          )}
        </span>
      )
    : null;
};
