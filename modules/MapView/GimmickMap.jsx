import classnames from 'classnames';
import StaticImage from "../Image";
import styles from "./styles.module.scss";
import Icon from "../Icon";
import {BsX} from "react-icons/bs";

/**
 * @param {Function} t
 * @param children - actual map to be displayed
 * @param {boolean} mapVisible
 * @param {Function} switchHandler
 * @param {boolean} isMobile
 */
export const GimmickMap = ({ t, isMobile, children, mapVisible, switchHandler, className }) => {
    return (
        <>
          {!isMobile &&
            <div className={classnames(styles.mobileMapView, className)} onClick={switchHandler}>
              <StaticImage src="/assets/search/map-back.png" alt="pin" width={253} height={100} layout="responsive" />
            </div>
          }

            {(mapVisible) &&
            <div className={styles.overlay}>
                <div className={styles.mapListViewContainer}>
                    <div className={styles.mapListViewContent}>
                        <div className={styles.mapView} >
                            <div id="close" onClick={switchHandler}>
                                <Icon
                                    color="#3B3B3B"
                                    icon={<BsX/>}
                                />
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}
