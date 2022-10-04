import React from "react";
import classnames from "classnames";
import {BsDash, BsPlus} from "react-icons/bs";
import Icon from "../Icon";

import styles from "./styles.module.scss";

const FAQItem = ({ faq, setActive, active }) => {
  const handleOpen = () => {
    if (active) {
      setActive(null);
    } else {
      setActive(faq.id);
    }
  };
  return (
    <div className={classnames(styles.faqItem)}>
      <div className={styles.title} onClick={handleOpen}>
        <Icon color="#3B3B3B" icon={active ? <BsDash /> : <BsPlus />} />
        {faq.question}
      </div>
      {active && <div className={styles.faqBody}>{faq.answer}</div>}
    </div>
  );
};

export default FAQItem;
