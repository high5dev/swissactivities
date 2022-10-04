import { useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import Heading from "./Heading";

const ListingMarkdown = ({ text, refs }) => {
  const CustomHeading = (props) => {
    return useMemo(() => <Heading refs={refs} {...props} />, [props]);
  };

  const memoHeading = useCallback(CustomHeading, []);

  return (
    <ReactMarkdown
      plugins={[gfm]}
      // eslint-disable-next-line
      children={text}
      renderers={{ heading: memoHeading }}
    />
  );
};

export default ListingMarkdown;
