import {
  GoogleMapsLoader,
  GeoSearch,
  Redo,
} from "react-instantsearch-dom-maps";
import { Marker } from "./Marker";
import Hits from "./Hits";
import { Activity } from "../../_components/Activity";
import { useSearchContext } from "../../../hooks/useSearchContext";
import { useI18n } from "next-localization";
import { getClusterId } from "../../../utils";
import React from "react";
import googleMapStyles from "./../../_components/Map/styles.json";
import { BodyLock } from "../../_components/BodyLock";

function MapInner() {
  const { t } = useI18n();
  const { isMapListOpen } = useSearchContext();

  return (
    <div
      className={`h-[calc(var(--vh)-var(--h-header)-60px)] lg:h-[calc(var(--vh)-var(--h-header)-80px)]`}
    >
      <BodyLock />
      <GoogleMapsLoader apiKey="AIzaSyBcKGk6X9qCfWICi9RmPCebhCwm4NnTP0E">
        {(google) => {
          return (
            <GeoSearch
              styles={googleMapStyles}
              google={google}
              zoomControl={false}
              scrollwheel={true}
              gestureHandling="greedy"
              enableRefineOnMapMove={false}
            >
              {({ hits }) => {
                const obj = {};
                Object.values(hits).map((item) => {
                  const latLng = getClusterId(item);
                  obj[latLng] = {
                    ...obj[latLng],
                    id: latLng,
                    _geoloc: {
                      lat: item._geoloc.lat,
                      lng: item._geoloc.lng,
                    },
                    items: {
                      ...obj[latLng]?.items,
                      [item.activity.id]: item,
                    },
                  };
                });

                Object.values(obj).forEach((item) => {
                  if (Object.values(item.items).length === 1) {
                    obj[Object.values(item.items)[0].activity.id] =
                      Object.values(item.items)[0];
                  }
                });

                const newHits = Object.values(obj).filter(
                  (item) =>
                    !item.items ||
                    (item.items && Object.values(item.items).length >= 2)
                );

                return (
                  <div>
                    <Redo
                      translations={{
                        redo: t("search.searchHere"),
                      }}
                    />
                    {newHits.map((hit) => (
                      <Marker key={hit?.title} hit={hit} />
                    ))}
                  </div>
                );
              }}
            </GeoSearch>
          );
        }}
      </GoogleMapsLoader>
      {isMapListOpen && (
        <div
          className={`hidden lg:fixed lg:right-4 lg:top-[calc(var(--h-header)+16px+80px)] lg:block lg:flex lg:h-[calc(var(--vh)-var(--h-header)-32px-80px)] lg:max-w-[330px] lg:flex-col lg:overflow-y-auto lg:rounded-lg lg:bg-white lg:p-5`}
        >
          <Hits hitComponent={Activity} type={"sm"} loadMore={false} />
        </div>
      )}
    </div>
  );
}

export const Map = React.memo(MapInner);
