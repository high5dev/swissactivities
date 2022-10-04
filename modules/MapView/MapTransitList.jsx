import React from "react";
import {sliceDistanceTime} from "./index";
import Image from '../Image'
import {BiArrowBack} from "react-icons/bi";
import {RiWalkFill} from "react-icons/ri";
import {CgEditBlackPoint} from "react-icons/cg";


export const MapTransitList = ({ directions, setShowTransit, showTransit }) => {
  return (
    <div className="transport-list">
      <header>
        <BiArrowBack onClick={() => setShowTransit(!showTransit)} size={30}/>
      </header>
      <div className="step-list">
        { directions?.TRANSIT &&  (
          directions?.TRANSIT.routes[0].legs[0].steps.map((step, index) => {
            const leg = directions.TRANSIT.routes[0].legs[0]

            return(
              <div className={`step ${step.travel_mode === "TRANSIT" ? 'transit' : ''}`} key={'step ' + index}>
                <div className="step-top-block">
                  {index === 0 ?
                    <>
                      <span className="arrival_time text-bold">{leg.departure_time.text}</span>
                      <span className="icon"></span>
                      <p className="start-address text-bold">
                        {leg.start_address}
                      </p>
                    </> :
                    <>
                                <span className="arrival_time text-bold">{
                                  step.transit ? step.transit.departure_time.text : leg.steps[index - 1].transit.arrival_time.text }
                                </span>
                      <span className="icon"></span>
                      <p className="start-address text-bold">
                        {/*leg.steps[index - 1].transit.arrival_stop.name*/}
                        { step.transit ? step.transit.departure_stop.name : step.instructions}
                      </p>
                    </>
                  }
                </div>
                <div className="bottom-block">
                  {step.travel_mode === "WALKING" ? <RiWalkFill size={20}/> : <Image src={step.transit.line.vehicle.icon} width="20" height="20" alt="transit icon"/>}
                  {index === leg.steps.length - 1 &&  <CgEditBlackPoint className="icon" size={20}/>}
                  <div>
                    {step.transit && (
                      <p className="transit-vehicle-name">
                        {step.transit ? step.transit.line.vehicle.name : ''}
                        <span className="transit-name">{step.transit?.line?.short_name ? step.transit.line.short_name : step.transit?.line?.name}</span>
                      </p>
                    )}

                    <p> ({sliceDistanceTime(step.duration.text)} ) {step.distance.text} </p>
                  </div>
                </div>
              </div>
            )})
        )}
      </div>

    </div>
  )
}
