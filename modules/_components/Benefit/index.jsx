import { FaCheckCircle, FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export const Benefit = ({ item }) => {
  return (
    <li className={`mr-4 !mb-0 flex`}>
      <span className={`relative top-1 mr-2 flex`}>
        {item.type === "included" ? (
          <FaCheckCircle className={`text-green-500`} />
        ) : item.type === "offered" ? (
          <FaPlusCircle />
        ) : (
          <FaTimesCircle className={`text-red-500`} />
        )}
      </span>
      <span className={`not-prose`}>
        <ReactMarkdown plugins={[gfm]}>{item.text}</ReactMarkdown>
      </span>
    </li>
  );
};
