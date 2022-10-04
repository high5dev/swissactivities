import React, { useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import ListingHeading from "./ListingHeading";

export default function ListingMarkdown({ text, observer }) {
  const CustomHeading = props => {
    return useMemo(() => <ListingHeading observer={observer} {...props} />, []);
  };

  const memoHeading = useCallback(CustomHeading, [observer]);

  return (
    <ReactMarkdown
      plugins={[gfm]}
      // eslint-disable-next-line
      children={text}
      renderers={{ heading: memoHeading }}
    />
  );
}
