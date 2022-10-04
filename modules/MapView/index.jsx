import React, { useEffect, useState } from "react";

const _ = require("lodash");
const { compose, lifecycle } = require("recompose");
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "react-google-maps";
import Button from "../Button";
import { BsX } from "react-icons/bs";
import { FaDirections } from "react-icons/fa";
import { CgEditBlackPoint } from "react-icons/cg";
import { RiWalkFill, RiArrowUpDownLine } from "react-icons/ri";
import { AiFillCar } from "react-icons/ai";
import { VscLocation } from "react-icons/vsc";
import {
  BiArrowBack,
  BiTrain,
  BiCycling,
  BiDotsVerticalRounded,
  BiDotsHorizontalRounded,
  BiTimeFive,
} from "react-icons/bi";
import SearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";
import { MapTransitList } from "./MapTransitList";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Image from "../Image";
import styles from "../MapListView/styles.module.scss";
import slideTransition from "../../styles/transitions/slide.module.scss";
import fadeTransition from "../../styles/transitions/fade.module.scss";
import googleMapStyles from "./../_components/Map/styles.json";
import { BookingButton } from "../_components/Booking/Button";
import { Text } from "../_components/Text";
import StaticImage from "../Image";

const CustomMarker = ({ position, ...rest }) => {
  return (
    <Marker
      {...rest}
      position={position}
      onClick={() => {
        console.log("Marker");
      }}
    />
  );
};

export const sliceDistanceTime = (text) => {
  const getTime = text.split(" ");
  getTime.forEach((item, index) => {
    if (item.length > 2) {
      getTime[index] = item.substring(0, 1);
    }
  });
  return getTime.join(" ");
};

const MapWithAMarker = compose(
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        bounds: null,
        center: null,
        markers: [],
        searchPlaces: {},
        directions: null,
        places: JSON.parse(localStorage.getItem("places")) || [],
        onMapMounted: (ref) => {
          refs.map = ref;
        },
        onZoomChanged:
          ({ onZoomChange }) =>
          () => {
            onZoomChange(refs.map.getZoom());
          },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          });
        },
        onSearchBoxMounted: (ref, loc) => {
          refs[loc] = ref;
        },
        onPlacesChanged: (loc) => {
          const places = refs[loc].getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach((place) => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map((place) => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(
            nextMarkers,
            "0.position",
            this.state.center
          );

          this.setState((prev) => ({
            center: nextCenter,
            markers: nextMarkers,
            searchPlaces: { ...prev.searchPlaces, [loc]: places[0] },
            places: [...prev.places, places[0]],
          }));
          const localPlaces = localStorage.getItem("places");

          if (localPlaces) {
            localStorage.setItem("places", JSON.stringify(this.state.places));
          } else {
            localStorage.setItem("places", JSON.stringify([places[0]]));
          }
        },
        onRemovePlace: (id) => {
          this.setState((prev) => ({
            places: prev.places.filter((item) => item.place_id !== id),
          }));
          const places = JSON.parse(localStorage.getItem("places"));
          if (places) {
            localStorage.setItem(
              "places",
              JSON.stringify(places.filter((item) => item.place_id !== id))
            );
          }
        },
        onSetPlace: (place, key) => {
          const findPlace = this.state.places.find(
            (item) => item.place_id === place.place_id
          );
          this.setState((prev) => ({
            searchPlaces: { [key]: place },
            places: findPlace ? prev.places : [...prev.places, place],
          }));
          const localPlaces = localStorage.getItem("places");

          if (localPlaces) {
            localStorage.setItem("places", JSON.stringify(this.state.places));
          } else {
            localStorage.setItem("places", JSON.stringify([place]));
          }
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const {
    hideMapView,
    isMobile,
    t,
    activity,
    isWidgetActive,
    setWidgetActive,
      onClickBooking
  } = props;
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [position, setPosition] = useState(null);
  const [activeMenu, setActiveMenu] = useState(false);
  const [route, setRoute] = useState("DRIVING");
  const [destination, setDestination] = useState({
    lat: Number(props.destination.latitude),
    lng: Number(props.destination.longitude),
  });
  const [openRoadMenu, setOpenRoadMenu] = useState(false);
  const [openDepartureHistory, setOpenDepartureHistory] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [showTransit, setShowTransit] = useState(false);

  const distanceMatrixService = (routes) => {
    const service = new google.maps.DistanceMatrixService();

    return service.getDistanceMatrix(
      {
        destinations: [destination],
        origins: [position],
        travelMode: routes,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          return result;
        } else {
          console.error(`DistanceMatrixService ERROR ${result}`);
        }
      }
    );
  };

  const directionsService = (routes = "") => {
    const DirectionsService = new google.maps.DirectionsService();
    // modes - If no preference is given, the API returns the default best route.
    // FEWER_TRANSFERS - Specifies that the calculated route should prefer a limited number of transfers.
    const transitOptions = {
      departureTime: new Date(),
      modes: ["BUS", "TRAIN", "TRAM", "RAIL"],
      routingPreference: "FEWER_TRANSFERS",
    };

    return DirectionsService.route(
      {
        origin: position,
        destination: destination,
        travelMode: routes,
        transitOptions: transitOptions,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          return result;
        } else {
          console.error(`error fetching directions, ${(result, status)}`);
        }
      }
    );
  };

  useEffect(() => {
    getPosition()
      .then((position) => {
        const { latitude, longitude } = position.coords;
        setPosition({ lat: latitude, lng: longitude });
        setOpenRoadMenu(!openRoadMenu);

        geocode({ lat: latitude, lng: longitude })
          .then((result) => {
            props.onSetPlace(result.results[0], "departure2");
          })
          .catch((err) => {
            console.error("handleClickLocation geocode error: ", err);
          });
      })
      .catch((err) => {
        setOpenRoadMenu(!openRoadMenu);
        console.error("getPosition error: ", err.message);
      });
  }, []);

  const getAllWays = (func, postion) => {
    const drivingResult = func("DRIVING");
    const walkingResult = func("WALKING");
    const bicyclingResult = func("BICYCLING");
    const transitResult = func("TRANSIT");

    const promises = [
      drivingResult,
      walkingResult,
      bicyclingResult,
      transitResult,
    ];
    return Promise.allSettled(promises).then((results) => {
      const obj = {};
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          if (postion === "distance") {
            obj[Object.values(google.maps.TravelMode)[index]] = result.value;
          } else {
            obj[result.value.request.travelMode] = result.value;
          }
        }
      });
      return obj;
    });
  };

  useEffect(() => {
    if (position) {
      getAllWays(directionsService, "direction").then((resp) => {
        setDirections(resp);
      });

      getAllWays(distanceMatrixService, "distance").then((resp) => {
        setDistance(resp);
      });
    }
  }, [position]);

  useEffect(() => {
    if (props.searchPlaces.departure2) {
      setPosition(props.searchPlaces.departure2.geometry.location);
    }
  }, [props.searchPlaces]);

  const getPosition = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const handleClickMenu = (e) => {
    const el = e.target;
    const activeRoute = el.closest("span.menu-item");
    const activeSpan = document.querySelector(".items-wrapper span.active");

    if (activeSpan) {
      activeSpan.classList.remove("active");
    }

    if (activeRoute) {
      activeRoute.classList.add("active");

      const route = activeRoute.dataset.route;
      setRoute(route);
      setActiveMenu(!activeMenu);

      if (route === "TRANSIT") {
        setShowTransit(!showTransit);
      }
    }
  };

  const getTravelMode = (route) => {
    switch (route) {
      case "WALKING":
        return <RiWalkFill size={25} />;
      case "BICYCLING":
        return <BiCycling size={25} />;
      case "TRANSIT":
        return <BiTrain size={25} />;
      default:
        return <AiFillCar size={25} />;
    }
  };

  // get address by coords
  const geocode = (loc) => {
    let geocoder = new google.maps.Geocoder();
    let latLng = new google.maps.LatLng(loc.lat, loc.lng);

    return geocoder.geocode({ latLng: latLng }, (results, status) => {
      if (status === "OK") {
        return results;
      } else {
        console.error("geocode error", results);
      }
    });
  };

  const handleClickLocation = () => {
    getPosition()
      .then((position) => {
        const { latitude, longitude } = position.coords;
        setPosition({ lat: latitude, lng: longitude });

        geocode({ lat: latitude, lng: longitude })
          .then((result) => {
            props.onSetPlace(result.results[0], "departure2");
          })
          .catch((err) => {
            console.error("handleClickLocation geocode error: ", err);
          });
      })
      .catch((error) => {
        setLocationError(!locationError);
      });
  };

  const handleWidgetActivation = () => {
    if (isWidgetActive) return;
    hideMapView();
    setWidgetActive(true);
  };

  return (
    <GoogleMap
      ref={props.onMapMounted}
      defaultZoom={12}
      DistanceMatrixService
      defaultOptions={{
        streetViewControl: false,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
        styles: googleMapStyles,
      }}
      center={props.center ? props.center : destination}
    >
      {directions && directions[route] && (
        <DirectionsRenderer directions={directions[route]} />
      )}

      {props.markers.map((marker, index) => (
        <CustomMarker key={index} position={marker.position} />
      ))}

      {!position && destination && <CustomMarker position={destination} />}

      <>
        <div
          className="directions"
          onClick={() => setOpenRoadMenu(!openRoadMenu)}
        >
          <FaDirections size={30} />
          <span>{t("activity.map.road")}</span>
        </div>

        <div
          className={`mobile-menu ${openRoadMenu ? "open" : ""} ${
            openDepartureHistory ? "openDepartureHistory" : ""
          } ${showTransit ? "show-transit" : ""} `}
        >
          <div className="road-menu">
            <div className="road-menu_header">
              <BiArrowBack
                onClick={() => setOpenRoadMenu(!openRoadMenu)}
                size={30}
              />
              <div className="road-search_inputs">
                <div className="road-icons">
                  <CgEditBlackPoint className="CgEditBlackPoint" size={20} />
                  <BiDotsVerticalRounded
                    className="BiDotsVerticalRounded"
                    style={{ opacity: 0.5 }}
                    size={25}
                  />
                  <VscLocation className="VscLocation" size={25} />
                </div>
                <div className="search-wrap">
                  <input
                    readOnly
                    value={
                      props.searchPlaces?.departure2?.formatted_address || ""
                    }
                    onClick={() =>
                      setOpenDepartureHistory(!openDepartureHistory)
                    }
                    className={"search-input"}
                    type="text"
                    placeholder={`${t("activity.map.departure")}...`}
                  />
                  <input
                    readOnly
                    id="destinationInput"
                    value={props.destination?.info.address || ""}
                    className={"search-input"}
                    type="text"
                    placeholder="point of destination..."
                  />
                </div>
              </div>
              <div className="road-icons">
                <BiDotsHorizontalRounded size={30} />
                <RiArrowUpDownLine className="RiArrowUpDownLine" size={25} />
              </div>
            </div>

            <menu className="items-wrapper" onClick={handleClickMenu}>
              <span
                data-route="DRIVING"
                className={`menu-item  ${route === "DRIVING" ? "active" : ""}`}
              >
                <AiFillCar size={20} />
                <span className="time">
                  {distance &&
                  distance.DRIVING?.rows[0].elements[0].status === "OK"
                    ? sliceDistanceTime(
                        distance.DRIVING?.rows[0].elements[0].duration.text
                      )
                    : ""}
                </span>
              </span>
              <span
                data-route="WALKING"
                className={`menu-item  ${route === "WALKING" ? "active" : ""}`}
              >
                <RiWalkFill size={20} />
                <span className="time">
                  {distance &&
                  distance.WALKING?.rows[0].elements[0].status === "OK"
                    ? sliceDistanceTime(
                        distance.WALKING?.rows[0].elements[0].duration.text
                      )
                    : ""}
                </span>
              </span>
              <span
                data-route="BICYCLING"
                className={`menu-item  ${
                  route === "BICYCLING" ? "active" : ""
                }`}
              >
                <BiCycling size={20} />
                <span className="time">
                  {distance &&
                  distance.BICYCLING?.rows[0].elements[0].status === "OK"
                    ? sliceDistanceTime(
                        distance.BICYCLING?.rows[0].elements[0].duration.text
                      )
                    : ""}
                </span>
              </span>
              <span
                data-route="TRANSIT"
                className={`menu-item  ${route === "TRANSIT" ? "active" : ""}`}
              >
                <BiTrain size={20} />
                <span className="time">
                  {distance &&
                  distance.TRANSIT?.rows[0].elements[0].status === "OK"
                    ? sliceDistanceTime(
                        distance.TRANSIT?.rows[0].elements[0].duration.text
                      )
                    : ""}
                </span>
              </span>
            </menu>
          </div>

          <CSSTransition
            in={showTransit}
            timeout={200}
            classNames={fadeTransition}
            unmountOnExit
          >
            <MapTransitList
              showTransit={showTransit}
              setShowTransit={setShowTransit}
              directions={directions}
            />
          </CSSTransition>

          <div className="departure-history">
            <div className="search-wrap">
              <BiArrowBack
                onClick={() => setOpenDepartureHistory(!openDepartureHistory)}
                size={25}
              />
              <SearchBox
                ref={(ref) => props.onSearchBoxMounted(ref, "departure2")}
                onPlacesChanged={() => {
                  props.onPlacesChanged("departure2");
                  setOpenDepartureHistory(!openDepartureHistory);
                }}
              >
                <input
                  className={"search-input"}
                  type="text"
                  placeholder={`${t("activity.map.departure")}...`}
                />
              </SearchBox>
            </div>

            <div className="departure-search-card">
              <div onClick={handleClickLocation}>
                <CgEditBlackPoint color="#1A73E8" size={20} />
                <p>{t("activity.map.myLocation")}</p>
              </div>
            </div>
          </div>

          <CSSTransition
            in={openDepartureHistory}
            timeout={200}
            classNames={fadeTransition}
            unmountOnExit
          >
            <div className="list-wrap">
              <CSSTransition
                in={locationError}
                timeout={200}
                classNames={fadeTransition}
                unmountOnExit
              >
                <p className="location-error">
                  {t("activity.map.locationError")}
                </p>
              </CSSTransition>
              <TransitionGroup component="ul" className="departure-list">
                {props.places &&
                  props.places.map((item) => (
                    <CSSTransition
                      key={item.place_id}
                      timeout={200}
                      classNames={slideTransition}
                    >
                      <li>
                        <div className="BiTimeFive">
                          <BiTimeFive size={20} />
                        </div>
                        <p
                          onClick={() => {
                            props.onSetPlace(item, "departure2");
                            setOpenDepartureHistory(!openDepartureHistory);
                          }}
                        >
                          {item.formatted_address}
                        </p>
                        <BsX
                          onClick={() => props.onRemovePlace(item.place_id)}
                          size={25}
                        />
                      </li>
                    </CSSTransition>
                  ))}
              </TransitionGroup>
            </div>
          </CSSTransition>
        </div>

        <div className="map-distance !max-w-[calc(100%-1.75rem)] sm:!max-w-[400px]">
          <div className={`grid grid-cols-[50px,1fr] gap-x-4 gap-y-3 p-3`}>
            <div className={`overflow-hidden rounded-md h-[50px]`}>
              <StaticImage
                width="50"
                height="50"
                src={activity.gallery[0].url}
                alt=""
              />
            </div>
            <div>
              <Text className={`font-semibold !text-black`}>
                {activity.info.title}
              </Text>
            </div>
            <div className={`col-span-2`}>
              <BookingButton onClick={onClickBooking} />
            </div>
          </div>
        </div>
      </>
    </GoogleMap>
  );
});

export * from "./GimmickMap";
export default MapWithAMarker;
