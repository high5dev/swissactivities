import React, { useState, useEffect } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  InfoWindow,
  Marker,
} from "react-google-maps";
import classnames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { BsX, BsChevronLeft, BsChevronRight, BsListUl } from "react-icons/bs";

import MapListItem from './MapListItem';
import Loading from "../Loading";
import Icon from "../../modules/Icon";
import Filter from '../Filter/MapViewFilter';
import styles from './styles.module.scss';
import { getFilteredLocations } from "../../lib/functions";
import * as services from "../../services/contentServices";
import {useI18n} from "next-localization";

const CustomMarker = ({position, data, price}) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <Marker
      position={position}
      onClick={() => setShowInfo(!showInfo)}
    >
      {showInfo && (
        <InfoWindow onCloseClick={() => setShowInfo(!showInfo)}>
          <MapListItem data={data} price={price} isMapElement={true} />
        </InfoWindow>
      )}
    </Marker>
  )
}

const MapWithMarkers = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: 46.9517, lng: 7.43596 }}
      defaultOptions={{
        streetViewControl: false,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        rotateControl: false,
        fullscreenControl: false
      }}
    >
      {props.activities.map(el => {
        return (
          <CustomMarker
            key={`activity-${el.id}`}
            position={{ lat: parseFloat(el.meeting_points[0].latitude), lng: parseFloat(el.meeting_points[0].longitude) }}
            data={el}
            price={props.prices.find(price => price.contentApiActivityId === parseInt(el.id))}
          />
        );
      })}
    </GoogleMap>
  ))
);

const MapListView = (props) => {
  const {t, locale} = useI18n();
  const [loading, setLoading] = useState(true);
  const [filterValues, setFilterValues] = useState([0, 0]);
  const { hideMapView, prices} = props;
  const [type, setType] = useState(null);
  const [location, setLocation] = useState(null);
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (loading && data.length < 1) {
      getActivities();
    }
    setLoading(false);
  }, [loading]);

  const getActivities = async () => {
    const activities = await services.getActivitiesForMap(locale());
    if (activities) {
      setData(activities);
    }
  }

  const toggleList = () => {
    setToggle(!toggle);
  }

  const filterByValues = (values) => {
    setFilterValues(values);
    if (values[0] === 0 && values[1] === 0) {
      setData(activities);
      return;
    }
    const filteredPrices = prices.filter(el => parseFloat(el.startingPrice.amount) > values[0] && parseFloat(el.startingPrice.amount) < values[1]);
    const filteredActivities = activities.filter(el => filteredPrices.find(price => price.contentApiActivityId === parseInt(el.id)));
    setData(filteredActivities);
  }

  const onTypeChange = (selected) => {
    const array = cloneDeep(activities);
    if (type !== selected) {
      setData(array.filter(el => el.type && el.type.slug === selected));
      setType(selected);
    } else {
      setType(null);
      setData(array);
    }
  }

  const onLocationChange = (selected) => {
    const array = cloneDeep(activities);
    const allLocs = getFilteredLocations(props.locations, selected);
    if (location !== selected) {
      setData(array.filter(el => el.location && allLocs.includes(el.location.slug)));
      setLocation(selected);
    } else {
      setLocation(null);
      setData(array);
    }
  }

  if (loading)
    return <Loading
      type="spin"
      color="#8b8b8b"
      width="100px"
      height="100px"
      className={styles.loader}
    />;
  return (
    <div className={styles.overlay}>
      <div className={styles.mapListViewContainer}>
        <div className={styles.mapListViewContent}>
          <div className={styles.activitiesList}>
            <div className={styles.listBody}>
              <Filter
                id="mapFilter"
                isSlidebar={true}
                type={type}
                location={location}
                filterValues={filterValues}
                filterByValues={filterByValues}
                onLocationChange={onLocationChange}
                onTypeChange={onTypeChange}
                {...props}
              />
              <div className={classnames("itemsList", {"toggle": toggle})}>
                  {data.map(el => (
                    <MapListItem
                      data={el}
                      key={`map-list-item-${el.id}`}
                      price={prices.find(price => price.contentApiActivityId === parseInt(el.id))}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className={styles.mapView}>
            <div className={styles.show} onClick={toggleList}>
              <Icon
                color="#3B3B3B"
                icon={!toggle ? <BsChevronLeft /> : <BsChevronRight />}
              />
            </div>
            <div className={styles.mobileList} onClick={toggleList}>
              <Icon
                color="#3B3B3B"
                icon={<BsListUl />}
              />
              <span>{t("filter.activities")}</span>
            </div>
            <div className={styles.close} onClick={hideMapView}>
              <Icon
                color="#3B3B3B"
                icon={<BsX />}
              />
            </div>
            <MapWithMarkers
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBcKGk6X9qCfWICi9RmPCebhCwm4NnTP0E&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              activities={data}
              prices={prices}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapListView;
