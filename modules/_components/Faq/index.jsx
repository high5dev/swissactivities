import FaqGSD from "./FaqGSD";
import Accordion from "../Accordion";

const Faq = ({ faqs }) => {
  return (
    <>
      <FaqGSD faqs={faqs} />
      <div className={`divide-y divide-solid divide-gray-200`}>
        {faqs.map((faq) => (
          <Accordion large={false} key={faq.id} item={{ text: faq.question }}>
            <div className={`prose-sa pb-6`}><p>{faq.answer}</p></div>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default Faq;
