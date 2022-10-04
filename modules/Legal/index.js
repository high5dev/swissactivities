import React from "react";
import classnames from "classnames";
import styles from "./styles.module.scss";
import Layout from "../_components/Layout";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import {getPageUrl, getPageUrls, legalPages} from "../../services/contentServices";
import {useI18n} from "next-localization";

export default function Legal({text, page, menu}) {
  const {t, locale} = useI18n();
  const pageLocale = locale();

  const pageUrls = getPageUrls(page.type);
  const meta = {
    title: t(`pages.${page.type}.title`),
    desc: t(`pages.${page.type}.description`),
    locale: pageLocale,
  };

  const tabs = legalPages.map(type => ({
    type,
    url: getPageUrl(type, pageLocale),
    title: t(`pages.${type}.title`),
  }));

  return <Layout isSearchPage={true} meta={meta} pageUrls={pageUrls} menu={menu}>
    <section className={styles.sectionHeader}/>
    <section className={styles.legalBody}>
      <div className="container legal-container">
        <div className={styles.legalSidebar}>
          <ul>
            {tabs.map(tab => <li key={tab.url} className={classnames("legal-item", {"active": page.type === tab.type})}>
              <Link href={tab.url}>{tab.title}</Link>
            </li>)}
          </ul>
        </div>
        <div className={styles.legalContent}>
          <div className={styles.legalItemHead}>{meta.title}</div>
          <div className={styles.legalItemBody}>
          <ReactMarkdown
            plugins={[gfm]}
            // eslint-disable-next-line
            children={text}/>
          </div>
        </div>
      </div>
    </section>
  </Layout>;
}

