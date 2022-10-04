import React from "react";
import dynamic from "next/dynamic";

const LoadingPlaceholder = () => <p>Loading...</p>;

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  loading: LoadingPlaceholder,
});

const Media = ({ mediaLink }) => {
  const isYoutube = mediaLink.match(
    /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\//gim
  );

  if (isYoutube) {
    return (
      <div className={`react-player`}>
        <ReactPlayer url={mediaLink} light={true} />
      </div>
    );
  }

  return (
    <iframe
      className={`h-[400px] w-full xl:h-[500px]`}
      src={mediaLink}
      frameBorder="0"
    />
  );
};

export default React.memo(Media);
