import { useState } from "react";
import {
    GoogleMapsLoader,
    GeoSearch,
    Marker,
    CustomMarker
} from 'react-instantsearch-dom-maps';
import { retroStyle, initialPosition } from '../../data/constants/googleMap';
import { GeoSearchService, ActivityService } from "../../utils";
import HitActivities from "../PlatformSearch/HitActivitiesRedesigned";
import BookingWidget from "../BookingWidget";

import StaticImage from "../Image";
import styles from './styles.module.scss'
import { GimmickMap } from "../MapView";
import MapContent from './MapContent';

const bookingDataInitialState = {
    availabilitiesList: [],
    activity: {},
    availableDates: [],
    mappedId: null,
}


const AlgoliaMap = ({ t, isMobile, locale }) => {
    const [bookingData, setBookingData] = useState(bookingDataInitialState);
    const [mapVisible, setMapVisible] = useState(false)

    const handleMapDisplay = () => {
        setMapVisible(!mapVisible);
    }

    const handleMarkerClick = async (hit, hits, event) => {
        const bookingId = hit.price?.activityId;
        const contentId = hit.objectID.split('_')[2];
        // Ask Philip to implement paginated data for availableDates
        const availableDates = await ActivityService.getAvailableDates(bookingId);
        const availabilitiesList = await ActivityService.getAvailabilitiesList(bookingId, availableDates[0], locale)
        const activity = await ActivityService.getActivity(contentId);
        setBookingData({
            availabilitiesList,
            activity,
            availableDates,
            mappedId: bookingId
        })
    }

    const handleBookingClose = () => {
        setBookingData(bookingDataInitialState)
    }

    return (
        <div className={styles.container}>
                <GoogleMapsLoader
                    apiKey="AIzaSyBcKGk6X9qCfWICi9RmPCebhCwm4NnTP0E"
                >
                    {google => (
                        <GeoSearch
                            google={google}
                            initialPosition={initialPosition}
                            initialZoom={8}
                            enableRefine={true}
                            enableRefineOnMapMove={false}
                            styles={retroStyle}
                            streetViewControl={false}
                            mapTypeControl={false}
                            panControl={false}
                            zoomControl={false}
                            rotateControl={false}
                            fullscreenControl={false}
                            gestureHandling="greedy"
                            zoomControlOptions={{
                                position: google.maps.ControlPosition.RIGHT_CENTER,
                            }}
                        >
                            {({ hits }) => (
                              <>
                              {bookingData.activity.id &&
                                <div className={styles.booking}>
                                    <BookingWidget
                                        availabilitiesList={bookingData.availabilitiesList}
                                        mappedId={bookingData.mappedId}
                                        activity={bookingData.activity}
                                        setWidgetState={() => null}
                                        locale={locale}
                                        availableDates={bookingData.availableDates}
                                        isMobile={isMobile}
                                        t={t}
                                        onClose={handleBookingClose}
                                    />
                                </div>
                              }
                              <MapContent hits={hits} handleMarkerClick={handleMarkerClick} />
                              </>
                            )}
                        </GeoSearch>
                    )}
                </GoogleMapsLoader>
        </div>
    )
}

export default AlgoliaMap
