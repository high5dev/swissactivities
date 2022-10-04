import React, { useState } from "react";
import FAQItem from "../FAQItem";
import FaqGSD from "./FaqGSD";

const Faq = ({ faqs }) => {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <div>
    <FaqGSD faqs={faqs}/>
      {faqs.map(faq => (
        <FAQItem
          faq={faq}
          active={activeItem === faq.id}
          key={faq.id}
          setActive={setActiveItem}
        />
      ))}
    </div>
  );
};

export default Faq;
