import React from "react";
import styles from "./styles.module.scss";
import Layout from "../_components/Layout";
import Link from "next/link";
import { getPageUrls } from "../../services/contentServices";
import {useI18n} from "next-localization";

export default function Error(props) {
  const {t, locale} = useI18n();
  const { statusCode } = props;

  const pageUrls = getPageUrls('about-us');
  const homepageUrls = getPageUrls('homepage');
  const meta = {
    title: t('pages.error.title'),
    desc: t('pages.error.description', { returnObjects: true, statusCode: statusCode }),
    locale: locale(),
  };

  return <Layout isSearchPage={true} meta={meta} pageUrls={pageUrls}>
    <section className={styles.sectionHeader}>
    </section>
    <section className={styles.sectionBody}>
      <div className="container error-container">
        <div className={styles.errorIcon}>
        </div>
        <div className={styles.errorContents}>
          <h1>404</h1>
          <h2>We have a problem {t('pages.error.subTitle')}</h2>
          <p>{t('pages.error.description', { returnObjects: true, statusCode: statusCode })}
          </p>
          <Link href={homepageUrls[locale()]} className={styles.btn}>HOME</Link>
        </div>
      </div>
    </section>
  </Layout>;
}

