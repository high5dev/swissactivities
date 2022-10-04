import StaticImage from "../Image";
import { useI18n } from "next-localization";
import { Accordion as Acc } from "../_components/Accordion";
import Content from "../_components/Content";

const Accordions = (props) => {
  const { activity, isMobile, onOpenMapListView } = props;

  const { t } = useI18n();

  return (
    <>
      <div
        style={{ borderLeft: "none", borderRight: "none" }}
        className={`border-solid border-gray-200 border divide-y divide-gray-200 divide-solid lg:border-none lg:divide-none lg:px-2 lg:space-y-8 lg:mt-8`}
      >
        {[
          {
            id: "includes",
            text: t("activity.tabs.includes"),
            condition:
              activity.info.benefits && activity.info.benefits.length > 0,
            content: <Content type="list-icon" item={activity.info.benefits} />,
          },
          {
            id: "about",
            text: t("activity.tabs.highlights"),
            condition: true,
            content: <Content type="list" item={activity.info.highlights} />,
          },
          ...activity.content_blocks.map((item) => {
            return {
              id: item.title.toLowerCase().replace(/ /g, "_"),
              text: item.title,
              condition: true,
              content: (
                <Content
                  type={item.youtube_url ? "video" : false}
                  item={item.youtube_url || item.text}
                />
              ),
            };
          }),
          {
            id: "info",
            text: t("activity.tabs.importantInformation"),
            condition: activity.info?.important_information,
            content: <Content item={activity.info.important_information} />,
          },
          {
            id: "meeting",
            text: t("activity.tabs.meetingPoints"),
            condition: activity.meeting_points,
            content: (
              <Content>
                {activity.meeting_points &&
                  activity.meeting_points.map((el, index) => (
                    <p key={`${el.info}-${index}`}>
                      {el.info[index]
                        ? el.info[index]?.address
                        : el.info.address}
                    </p>
                  ))}

                {isMobile && (
                  <div
                    role="button"
                    onClick={onOpenMapListView}
                    className={`max-w-[300px] mt-4`}
                  >
                    <StaticImage
                      src="/assets/search/map-back.png"
                      alt="pin"
                      width={253}
                      height={130}
                      layout="responsive"
                    />
                  </div>
                )}
              </Content>
            ),
          },
        ].map((item, index) => {
          return (
            item.condition && (
              <Acc
                key={`acc-${index}`}
                item={item}
                type="desktop"
                open={item.open}
              >
                {item.content}
              </Acc>
            )
          );
        })}
      </div>
    </>
  );
};

export default Accordions;
