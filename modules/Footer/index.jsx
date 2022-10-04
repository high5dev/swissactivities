import React, {useEffect, useState} from 'react';
import Link from "next/link";
import { FaHeart, FaCoffee , FaYoutube, FaFacebookSquare, FaTwitter, FaTimes} from "react-icons/fa";
import styles from './styles.module.scss';
import {getPageUrl} from "../../services/contentServices";
import {useI18n} from "next-localization";

import PaymentMethods from "../_components/PaymentMethods";
import {ExternalLink} from "../ListComponent";
import {WindowService} from "../../utils";
import classnames from "classnames";
import Icon from "../Icon";
import {BsChevronCompactDown, BsChevronCompactUp} from "react-icons/bs";


const Footer = ({
  isBooking = false,
  isActivity = false,
  data = {},
  pageUrls,
  pageUrlsQuery,
}) => {
  const {t, locale} = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  const languages = [];

  if (pageUrls) {
    for (const locale of Object.keys(pageUrls)) {
      languages.push({
        value: locale,
        url: pageUrls[locale],
        label: t(`locales.${locale}.name`),
        queryParams: pageUrlsQuery
      });
    }
  }


  const Accordion = ({title, children}) => {
    const [isOpen, setOpen] = useState(false);

    return (
      <div className={classnames("accordion", {"open": isOpen})}>
        <div className={classnames("accordion-title", {"open": isOpen})} onClick={() => {
          if (isMobile) {
            setOpen(!isOpen)
          }
        }}>
          <h2>{title}</h2>

          {isMobile && (
            <Icon
              color="#3B3B3B"
              icon={isOpen ? <BsChevronCompactUp/> : <BsChevronCompactDown/>}
            />
          )}

        </div>
        <div className={classnames("accordion-body", {"open": isOpen})}>
          {children}
        </div>
      </div>
    )
  }

  const AffiliateCode = () => {
    const [isOpen, setOpen] = useState(false);
    const [affId, setAffId] = useState(1);
    const [copied, setCopied] = useState(t("footer.affiliate.button"))
    const [id, setId] = useState(null);

    useEffect(() => {
      setId(data.pageType === 'type' || data.pageType === 'listing' || data.pageType === 'location' ? data[data.pageType]?.id : data.meta?.id);
    }, [])

    const code =
        `${String.fromCharCode(60)}script src="https://swissactivities.com/assets/widget.js">${String.fromCharCode(60)}/script>${String.fromCharCode(60)}swiss-activities-widget affiliate="${affId}" ident="${id}" type="${data.pageType}" language="${data.meta.locale.replace('_CH', '')}">${String.fromCharCode(60)}/swiss-activities-widget>`

    return (
    <li className={classnames(styles.footerBox, styles.footerItem, {"open": isOpen})}>
      <a onClick={() => {
        setOpen(!isOpen)
      }}>
        {t("footer.affiliate.title")}
        <div style={{transform: isOpen ? 'rotate(45deg)' : 'initial'}}>
        <FaTimes/>
          </div>
      </a>
      {isOpen &&
        <div className="box">
          <div className="inputs">
            <label>
              Affiliate ID:
              <input type="number" defaultValue={1} onChange={(e)=>setAffId(e.target.value)} />
            </label>
          </div>
          <pre>{code}</pre>
          <button onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(t("footer.affiliate.buttonCopied"));
            setTimeout(()=>{
              setCopied(t("footer.affiliate.button"));
            }, 2000)
          }}>{copied}</button>
        </div>
      }
    </li>
    )
  }

  const handleResize = () => {
    setIsMobile(WindowService.isMobile)
  }

  useEffect(() => {
    WindowService.addListener("resize", handleResize);
    handleResize();
    return () => WindowService.removeListener("resize", handleResize);
  }, [])

  return (
  <>
    {!isBooking && <section className={styles.footer}>
      <div className="container footer-container" style={{justifyContent: 'space-between'}}>
        <Accordion title={t("footer.company.title")}>
          <div className={styles.footerItem}>
            <ul>
              <li><Link href={getPageUrl('about-us', locale())}>{t("footer.company.about-us")}</Link></li>
              <li><ExternalLink isMobile={isMobile} href="https://apply.workable.com/swissactivities/">{t("footer.company.jobs")}</ExternalLink></li>
              <li><Link href={getPageUrl("blog", locale())}>{t("footer.company.blog")}</Link></li>
              <li><Link href={getPageUrl('tos_b2c', locale())}>{t("footer.company.legal")}</Link></li>
            </ul>
          </div>
        </Accordion>

        <Accordion title={t("footer.collaboration.title")}>
          <div className={styles.footerItem}>
            <ul>
              <li>
                <ExternalLink isMobile={isMobile} href="https://supplier.swissactivities.com/de/">{t("footer.collaboration.becomeapartner")}</ExternalLink>
              </li>
              <li>
                <ExternalLink isMobile={isMobile} href="https://supplier.swissactivities.com/de/affiliate-swiss-activities">{t("footer.collaboration.affiliate")}</ExternalLink>
              </li>
              {isActivity &&
                <AffiliateCode/>
              }
            </ul>
          </div>
        </Accordion>

        <Accordion title={t("footer.contact.title")}>
          <div className={styles.footerItem}>
            <ul>
              <li><Link href={getPageUrl('contact', locale())}>{t("footer.contact.contactus")}</Link></li>
            </ul>
          </div>
        </Accordion>

        <div className={styles.footerItem}>
          <h4>{t("footer.socialMedia")}</h4>

          <div className={styles.socials}>
            <ExternalLink isMobile={isMobile} href={'https://www.youtube.com/channel/UCsAYE3lz9Q3esS7rTMNuZmg'}>
              <FaYoutube className={styles.faYoutube}/>
            </ExternalLink>
            <ExternalLink isMobile={isMobile}  href={'https://www.facebook.com/swissactivites'}>
              <FaFacebookSquare className={styles.faFacebook}/>
            </ExternalLink>
            <ExternalLink isMobile={isMobile} href={'https://twitter.com/activitiesswiss'}>
              <FaTwitter className={styles.faTwitter}/>
            </ExternalLink>
          </div>
        </div>

        <div className="payment-methods">
          <h4>{t("activity.widget.paymentMethods")}</h4>
          <PaymentMethods heading={false} />
        </div>

      </div>

    </section>}
    <footer className={styles.copyright + ' copyright'}>
      <div className="container copyright-container">

        <div className="welcome">
          Made with <FaHeart/> and <FaCoffee/> in Switzerland
        </div>

      </div>
    </footer>
  </>
  )
}

export default Footer;
