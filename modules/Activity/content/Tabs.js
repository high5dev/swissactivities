import React, {useState} from 'react';
import classnames from "classnames";
import styles from "../styles.module.scss";
import {useRouter} from "next/router";
import Link from "next/link";
import {useI18n} from "next-localization";

const Tab = ({title, active, onClick, toId}) => {
    const router = useRouter();
    const handleClick = () => {
        onClick(toId);
    }
    const path = router.query.path.length > 1 ?  router.query.path.join('/') : router.query.path ;
    return (
        <Link href={'/' + path + toId}>
            <a className={classnames("tab", {"active": active}, styles.navTab)} onClick={handleClick}>
                <span>{title}</span>
            </a>
        </Link>
    )
}

const Tabs = ({activity, isSticky}) => {
    const [activeTab, setActiveTab] = useState('#about');
    const {t} = useI18n();
    const handleAnchorNav = (id) => {
        setActiveTab(id)
    }

    return (
        <div className={classnames(styles.sectionBody, {[styles.stickyTabs]:isSticky})} id="tabs">
            <div className={styles.tabsContainer}>
                <Tab title={t("activity.tabs.highlights")} onClick={handleAnchorNav} active={activeTab === "#about"} toId="#about"/>

                {(activity.info.benefits && activity.info.benefits.length > 0) && (
                    <Tab title={t("activity.tabs.includes")} onClick={handleAnchorNav} active={activeTab === "#includes"} toId="#includes"/>
                )}

                {activity.content_blocks.map((el, index) => (
                  <React.Fragment key={`tab-${index}`}>
                      {(el.text !== '-') && (
                        <Tab
                          title={el.title}
                          onClick={handleAnchorNav}
                          active={activeTab === `#${el.title.toLowerCase().replace(/ /g,"_")}`}
                          toId={`#${el.title.toLowerCase().replace(/ /g,"_")}`}
                        />
                      )}
                  </React.Fragment>
                ))}

                 {activity.info.important_information && (
                     <Tab title={t("activity.tabs.importantInformation")} onClick={handleAnchorNav} active={activeTab === "#info"} toId="#info"/>
                )}

                <Tab title={t("activity.tabs.meetingPoints")} onClick={handleAnchorNav} active={activeTab === "#meeting"} toId="#meeting"/>
            </div>
        </div>
    );
};

export default Tabs;