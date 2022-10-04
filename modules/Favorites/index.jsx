import React, { useState, useEffect } from "react";
import classnames from "classnames";
import Link from "next/link";
import { useI18n } from "next-localization";

import { queryActivityById, getPageUrl } from "../../services/contentServices";
import ActivitiesRow from "./ActivitiesRow";
import Layout from "../_components/Layout";
import Tabs from "../Tabs";

import EmptyBucket from "./EmptyBucket";

import styles from "./styles.module.scss";

const Favorites = ({menu}) => {
  const { t, locale } = useI18n();
  const [favoriteActivities, setFavoriteActivities] = useState(null);
  const [favoriteListings, setFavoriteListings] = useState(null);
  const [activeTab, setActiveTab] = useState("activities");
  const meta = {
    title: "Saved activities"
  };
  useEffect(() => {
    if (window?.localStorage) {
      const activities = JSON.parse(
        window.localStorage.getItem("savedActivities")
      );
      const listings = JSON.parse(window.localStorage.getItem("savedListings"));
      if (activities?.length) {
        setFavoriteActivities(activities);
      }
      if (listings?.length) {
        setFavoriteListings(listings);
      }
    }
  }, []);

  return (
    <Layout meta={meta} menu={menu}>
      <div className={classnames("container", styles.container)}>
        <h1 className={styles.title}>{t("favorites.title")}</h1>
        <h2 className={styles.subTitle}>{t("favorites.subtitle")}</h2>
        <Tabs
          tabs={[
            { title: "Activities", id: "activities" },
            { title: "Articles", id: "articles" }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        {activeTab === "activities" && (
          <div>
            {favoriteActivities?.length ? (
              <ActivitiesRow activities={favoriteActivities} notitle />
            ) : (
              <EmptyBucket />
            )}
          </div>
        )}
        {activeTab === "articles" && (
          <div>
            <EmptyBucket />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
