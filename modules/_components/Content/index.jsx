import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import YoutubePlayer from "../../YoutubePlayer";
import { Benefit } from "../Benefit";
import classNames from "classnames";
import { isArray } from "lodash";
import { Slider } from "../Slider";

export const Content = ({ type, item, children, className }) => {
  return (
    <div
      className={classNames(`prose-sa w-full`, {
        [className]: className,
        "max-w-none": type === "list-icon",
      })}
    >
      {children && children}
      {!type && !isArray(item) && (
        <ReactMarkdown plugins={[gfm]}>{item}</ReactMarkdown>
      )}
      {!type &&
        isArray(item) &&
        item.map((itemInner) => {
          return Object.entries(itemInner).map(([key, value], index) => {
            return key === "text" ? (
              <ReactMarkdown key={`${index}-${value}`} plugins={[gfm]}>
                {value}
              </ReactMarkdown>
            ) : key === "pictures" && value.length >= 1 ? (
              <Slider
                images={value}
                className={`mt-6 h-[250px] lg:h-auto lg:max-h-[600px]`}
              />
            ) : (
              ""
            );
          });
        })}
      {type === "video" && <YoutubePlayer url={item} />}
      {type === "list" && (
        <ul>
          {item.map((el, index) => {
            return <li key={`${el.text}-${index}`}>{el.text}</li>;
          })}
        </ul>
      )}
      {type === "list-icon" && (
        <ul
          className={`relative -left-1 flex w-full list-none flex-col space-y-1 !pl-0`}
        >
          {item.map((el, index) => {
            return <Benefit key={`${el.text}-${index}`} item={el} />;
          })}
        </ul>
      )}
    </div>
  );
};

export default Content;
