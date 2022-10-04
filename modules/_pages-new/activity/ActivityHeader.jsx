import Breadcrumbs from "../../_components/Breadcrumbs";
import Header from "./Header";
import React from "react";

export const ActivityHeader = ({
  activity,
  breadcrumbs,
  tag,
  similarActivities,
  bookable,
}) => {
  return (
    <section className={`mt-header container-tw mb-6 lg:pt-4`}>
      <div className={`hidden lg:block`}>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className={`hidden lg:block`}>
        <Header
          similarActivities={similarActivities}
          activity={activity}
          tag={tag}
          bookable={bookable}
        />
      </div>
    </section>
  );
};
