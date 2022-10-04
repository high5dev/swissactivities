import React from "react";
import styles from "./styles.module.scss";
import Layout from "../_components/Layout";
import { AiFillLinkedin } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { getPageUrls } from "../../services/contentServices";
import StaticImage from "../Image";
import Icon from "../Icon";
import {useI18n} from "next-localization";

export default function AboutUs(props) {
  const {t, locale} = useI18n();
  const { employees, menu } = props;
  //console.log(employees)

  const pageUrls = getPageUrls('about-us');
  const meta = {
    title: t('pages.about_us.title'),
    desc: t('pages.about_us.description'),
    locale: locale(),
  };

  const brain = '/assets/brain.svg';
  const books = '/assets/books.svg';
  const hands = '/assets/hands.svg';
  const heard = '/assets/heard.svg';

  const approach = [
    {img: brain},
    {img: books},
    {img: hands},
    {img: heard}
  ]

  return <Layout isSearchPage={true} meta={meta} pageUrls={pageUrls} menu={menu}>
    <section className={styles.sectionHeader}>
      <div className={styles.sectionHead + ' container'}>
        <h1 className={styles.sectionTitle}>{t(`approach.title`)}</h1>
        <p className={styles.sectionSubTitle}>
          {t(`approach.description`)}
        </p>

        <div className={styles.approachList}>
          {approach.map((item, index) => (
            <div className={styles.approach} key={`${index}-item`}>
              <div className={styles.icon}>
                <StaticImage src={item.img} alt="Children" width={33} height={32} />
              </div>
              <h4 className={styles.approachTitle}>{t(`approach.titles.${index}`)}</h4>
              <p className={styles.approachDescription}>
                {t(`approach.descriptions.${index}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className={styles.membersSection}>
      <div className="container members-container">
        {employees.map((el, index) => (
          el.picture && <div className={styles.member} key={`member-${index}`}>
            <div className={styles.avatar}>
              <StaticImage src={el.picture.url} alt={el.picture.caption} width={209} height={212} layout="fixed" />
              <div className={styles.avatarOverlay}>
                <span>
                  <Icon
                    color="#FFFFFF"
                    icon={<AiFillLinkedin />}
                  />
                </span>
              </div>
            </div>
            <div className={styles.name}>{el.given_name} {el.family_name}</div>
            <div className={styles.title}>{el.role}</div>
            <div className={styles.description}>
              <ReactMarkdown plugins={[gfm]}>
                {el.aboutme}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>;
}

