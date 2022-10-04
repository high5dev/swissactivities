import { useState } from "react";
import {
  Marker,
  CustomMarker
} from "react-instantsearch-dom-maps";
import { BsX, BsPlus } from "react-icons/bs";
import { GeoSearchService } from "../../utils";
import HitActivities from "../PlatformSearch/HitActivitiesRedesigned";

import StaticImage from "../Image";
import styles from "./styles.module.scss";

const MapContent = ({ t, isMobile, locale, hits, handleMarkerClick }) => {
  const [displayedHit, setDisplayedHit] = useState({});
  const [activeLocation, setActiveLocation] = useState(null);

  const handleMarkerHover = (hit, event) => {
      setNewDisplayedHit(hit, event);
  };

  const handleSingleItemClick = (hit, hits, event) => {
    locationClose();
    handleMarkerClick(hit, hits, event);
  };

  const handleLocationClick = location => {
    setActiveLocation(location);
  };
  const locationClose = () => {
    setActiveLocation(null);
  };

  const setNewDisplayedHit = (hit = {}, event = {}) => {
    setDisplayedHit({
      ...hit,
      transform: GeoSearchService.translateElement(event.event)
    });
  };

  const mapPoints = {};

  hits.forEach((hit, i) => {
    const locationCode = `${hit._geoloc.lat}_${hit._geoloc.lng}`;
    if (mapPoints[locationCode]) {
      mapPoints[locationCode].push(hit);
    } else {
      mapPoints[locationCode] = [hit];
    }
  });

  const locations = Object.keys(mapPoints);

  return locations.map(location => {
    const locationHits = mapPoints[location];

    if (locationHits.length === 1) {
      const hit = locationHits[0];
      return (
        <CustomMarker key={hit.objectID} hit={hit}>
          {hit.objectID === displayedHit.objectID && (
            <div
              className={styles.hit}
              style={{ transform: displayedHit.transform }}
            >
              <HitActivities {...{ hit }} showAttributes={false} />
            </div>
          )}
          {hit.typeIconName ? (
            <div
              className={styles.iconMarker}
              onMouseOver={event => handleMarkerHover(hit, event)}
              onMouseOut={() => handleMarkerHover()}
              onClick={event => handleSingleItemClick(hit, hits, event)}
            >
              <StaticImage
                src={`/assets/icons/${hit.typeIconName}.svg`}
                alt={hit.title}
                width={20}
                height={20}
                layout="fixed"
                key={hit.objectID}
              />
            </div>
          ) : (
            <Marker
              hit={hit}
              key={hit.objectID}
              onMouseOver={event => handleMarkerHover(hit, event)}
              onMouseOut={() => handleMarkerHover()}
              onClick={event => handleSingleItemClick(hit, hits, event)}
              animation={google.maps.Animation.DROP}
            />
          )}
        </CustomMarker>
      );
    }

    return (
      <CustomMarker key={location} hit={locationHits[0]} className={styles.customMarker}>
        {location === activeLocation && (
          <div
            className={styles.multipleHits}
            style={{ transform: displayedHit.transform }}
          >
            <div className={styles.multipleHitsTopbar}>
              {" "}
              <BsX className={styles.closeIcon} onClick={locationClose} />
            </div>
            {locationHits.map(hit => (
              <li
                className={styles.hitItem}
                onClick={event => handleMarkerClick(hit, hits, event)}
                key={hit.objectID}
              >
                <StaticImage
                  src={
                    hit.typeIconName
                      ? `/assets/icons/${hit.typeIconName}.svg`
                      : "/assets/activities/map-pin-black.svg"
                  }
                  alt={hit.title}
                  className={styles.hitIcon}
                  width={30}
                  height={30}
                  layout="fixed"
                  key={hit.objectID}
                />
                <span className={styles.hitTitle}>{hit.title}</span>
              </li>
            ))}
          </div>
        )}
        <div
          className={styles.iconMarker}
          onMouseOut={() => handleMarkerHover()}
          onClick={() => handleLocationClick(location)}
          key={location}
        >
          <BsPlus />
        </div>
      </CustomMarker>
    );
  });
};

export default MapContent;
