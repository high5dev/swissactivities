import StaticImage from "../../Image";
import React, { useState } from "react";
import { Modal } from "../Modal";
import MapView from "../../MapView";
import { useI18n } from "next-localization";

export const Map = ({ activity, className, classNameImg, children }) => {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <div onClick={() => setIsVisible(true)} className={classNameImg}>
        {children || (
          <StaticImage
            className={`rounded-lg`}
            src="/assets/search/map-back.png"
            alt="pin"
            width={253}
            height={100}
            layout="responsive"
          />
        )}
      </div>

      {isVisible && (
        <Modal
          className={className}
          open={isVisible}
          loaded={isVisible}
          loader
          onClose={() => setIsVisible(false)}
          full
        >
          <MapView
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBcKGk6X9qCfWICi9RmPCebhCwm4NnTP0E&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: "100vh", width: "100%" }} />}
            containerElement={
              <div id="map" style={{ height: "100vh", width: "100%" }} />
            }
            mapElement={
              <div
                style={{ height: "100vh", width: "100vw", maxWidth: "100%" }}
              />
            }
            onClick={() => console.log("Click Map")}
            onClickBooking={() => setIsVisible(false)}
            hideMapView={() => setIsVisible(false)}
            type="activity"
            activity={activity}
            t={t}
            destination={activity.meeting_points[0]}
          />
        </Modal>
      )}
    </>
  );
};
