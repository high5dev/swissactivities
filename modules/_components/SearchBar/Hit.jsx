import StaticImage from "../../Image";
import classNames from "classnames";
import { Rating } from "../Rating";
import { dataLayerSend } from "../../../utils/dataLayerSend";

export const Hit = ({ hit, type }) => {
  const isActivity = type === "activity";

  const onClick = () => {
    dataLayerSend({
      event: "website_search_option",
      item_name: hit?.title,
      id: isActivity
        ? hit?.activity?.id
        : hit?.type === "location" || hit?.type === "type"
        ? hit?.objectID.split("_")[3]
        : hit?.objectID.split("_")[2],
      location_id: hit?.locale.replace("_CH", "-ch"),
      activity_section: isActivity
        ? "Activities"
        : hit?.type === "location"
        ? "Locations"
        : hit?.type === "type"
        ? "Category"
        : "Guide",
    });
  };

  return (
    <a
      onClick={onClick}
      tabIndex={0}
      href={hit.url}
      className={classNames(
        "group w-full justify-between px-5 py-1.5 text-base font-medium text-black transition duration-100 ease-in last-of-type:mb-3 hover:bg-gray-100 lg:px-7",
        {
          "grid grid-cols-[50px,minmax(0,1fr)] gap-4": isActivity,
          "flex flex-col": !isActivity,
        }
      )}
    >
      {isActivity && (
        <div className={"flex h-full w-full flex-col overflow-hidden"}>
          <StaticImage
            className={"h-full w-full rounded object-cover"}
            width={40}
            height={45}
            src={`${hit.teaser_image.replace(
              "fra1.digitaloceanspaces.com",
              "contentapi-swissactivities.imgix.net"
            )}?a[…]rmat,compress&fit=crop&crop=edges&w=40h=45&q=20`}
            alt={hit.title}
          />
        </div>
      )}
      <span className={"flex flex-col"}>
        <span className={"truncate"}>{hit.title}</span>
        <span
          className={
            "inline flex items-center items-center truncate text-sm text-gray-500"
          }
        >
          {isActivity ? (
            <>
              <Rating hit={hit} type="sm" />
              <span className={"flex items-center"}>
                {hit.topics.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className={`mr-1 rounded border border-solid border-gray-100 bg-gray-50 px-1 text-[11px] uppercase text-gray-600 group-hover:bg-gray-200`}
                    >
                      {item}
                    </span>
                  );
                })}
              </span>
            </>
          ) : (
            hit.teaser
          )}
        </span>
      </span>
    </a>
  );
};
