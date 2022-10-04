import React from "react";
import classnames from "classnames";
import {GoogleMap, withGoogleMap, withScriptjs,} from "react-google-maps";

import styles from "./styles.module.scss";
import ContactForm from "./ContactForm";
import Layout from "../_components/Layout";
import Button from "../../modules/Button";
import {getPageUrls} from "../../services/contentServices";
import {useI18n} from "next-localization";

const MapView = withScriptjs(withGoogleMap(() => <GoogleMap defaultZoom={20} defaultCenter={{lat: 47.307397224886664, lng: 8.589868842763535}}/>));

export default function ContactUs({menu}) {
  const {t, locale} = useI18n();

  const pageUrls = getPageUrls('contact');
  const meta = {
    title: t('pages.contact_us.title'),
    desc: t('pages.contact_us.description'),
    locale: locale(),
  };

  return (
  <Layout isSearchPage={true} meta={meta} pageUrls={pageUrls} menu={menu}>
    <section className={styles.sectionHeader}>
      <div className={styles.sectionHead}>
        <h1 className={styles.sectionTitle}>{t("pages.contact_us.title")}</h1>
        <p className={styles.sectionSubTitle}>
          {t("pages.contact_us.description")}
        </p>
      </div>
    </section>
    <section className={styles.contactusSection}>
      <div className="container contact-us-container">
        <div className={classnames("contact-us-field flex", styles.formContainer)} style={{flexDirection: "column"}}>
          <ContactForm pageTitle={t('pages.contact_us.title')}/>
        </div>
        <div className="contact-us-field">
          <MapView
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBcKGk6X9qCfWICi9RmPCebhCwm4NnTP0E&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{height: `100%`}}/>}
          containerElement={<div className="contact-map" />}
          mapElement={<div style={{height: `100%`}}/>}
          />
          <div className={styles.infoForUs}>
            <div className="col-6">
              <span>{t("contact_us.where")}</span>
              <span>Seestrasse 21, CH-8703 Erlenbach</span>
            </div>
            <div className="col-6">
              <span>{t("contact_us.how")}</span>
              <span><a href="mailto:support@swissactivities.com">support@swissactivities.com</a></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
  );
}
