import { useI18n } from "next-localization";
import { Accordion as Acc } from "../../_components/Accordion";
import Content from "../../_components/Content";
import { Map } from "../../_components/Map";

const Accordions = ({ activity, prices }) => {
  const { t } = useI18n();

  return (
    <>
      <div
        style={{ borderLeft: "none", borderRight: "none" }}
        className={`divide-y divide-solid divide-gray-200 border border-solid border-gray-200 lg:ml-2 lg:space-y-8 lg:divide-none lg:border-none`}
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
                  activity.meeting_points.map((el, index) => {
                    return (
                      <p key={`${el.info}-${index}`}>
                        {el.info[0] ? el.info[0]?.address : el.info.address}
                      </p>
                    );
                  })}
                <div className={`max-w-[300px]`}>
                  <Map
                    activity={activity}
                    prices={prices}
                    classNameImg={`lg:hidden`}
                  />
                </div>
              </Content>
            ),
          },
          {
            id: "notCancelable",
            text: t("activity.notRefundable.title"),
            content: <Content item={t("activity.notRefundable.description")} />,
            condition: !activity?.summary?.cancellation,
          },
        ].map((item, index) => {
          return (
            item.condition && (
              <Acc
                large
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
