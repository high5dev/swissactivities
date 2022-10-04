import React, { useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import Link from "next/link";
import { useI18n } from "next-localization";

const Tab = ({ title, active, onClick, toId }) => {
  const router = useRouter();
  const handleClick = () => {
    onClick(toId);
  };
  const path =
    router.query.path.length > 1
      ? router.query.path.join("/")
      : router.query.path;
  return (
    <Link href={"/" + path + toId}>
      <a
        style={{
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
        }}
        className={classNames(
          "relative inline-block text-sm whitespace-nowrap border-b-2 border-solid py-3",
          {
            "relative z-10 border-primary text-primary": active,
            "border-gray-200 text-gray-900": !active,
          }
        )}
        onClick={handleClick}
      >
        <span>{title}</span>
      </a>
    </Link>
  );
};

const Tabs = ({ activity }) => {
  const [activeTab, setActiveTab] = useState("#about");
  const { t } = useI18n();
  const handleAnchorNav = (id) => {
    setActiveTab(id);
  };

  return (
    <div className={`relative`} id="tabs">
      <div
        className={`absolute bottom-0 h-[2px] w-[calc(100%-2rem)] bg-gray-200`}
      />
      <div
        className={`absolute right-0 top-0 z-10 h-full w-20 rotate-180 bg-gradient-to-r from-white`}
      />
      <div className={`flex space-x-5 overflow-x-auto overflow-y-hidden pr-8`}>
        <Tab
          title={t("activity.tabs.includes")}
          onClick={handleAnchorNav}
          active={activeTab === "#includes"}
          toId="#includes"
        />

        <Tab
          title={t("activity.tabs.highlights")}
          onClick={handleAnchorNav}
          active={activeTab === "#about"}
          toId="#about"
        />

        {activity.content_blocks.map((el, index) => (
          <React.Fragment key={`tab-${index}`}>
            {el.text !== "-" && (
              <Tab
                title={el.title}
                onClick={handleAnchorNav}
                active={
                  activeTab === `#${el.title.toLowerCase().replace(/ /g, "_")}`
                }
                toId={`#${el.title.toLowerCase().replace(/ /g, "_")}`}
              />
            )}
          </React.Fragment>
        ))}

        {activity.info.important_information && (
          <Tab
            title={t("activity.tabs.importantInformation")}
            onClick={handleAnchorNav}
            active={activeTab === "#info"}
            toId="#info"
          />
        )}

        <Tab
          title={t("activity.tabs.meetingPoints")}
          onClick={handleAnchorNav}
          active={activeTab === "#meeting"}
          toId="#meeting"
        />
      </div>
    </div>
  );
};

export default Tabs;
