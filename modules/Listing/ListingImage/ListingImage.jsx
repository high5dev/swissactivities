import React, { useState } from "react";
import dynamic from "next/dynamic";

import styles from "./styles.module.scss";
import StaticImage from "../../Image";
import ImageWithCaption from "./ImageWithCaption";

const ImageGallery = dynamic(() => import("react-image-gallery"));

const ImageGalleryItem = props => {
  return (
      <StaticImage
        src={props.original}
        alt={props.alt}
        layout="responsive"
        quality={40}
        width={650}
        height={400}
      />
  );
};

const ListingImage = ({ pictures, isMobile }) => {
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  if (pictures.length === 1) {
    return (
      <ImageWithCaption
        src={pictures[0].url}
        alt={pictures[0].alternativeText || pictures[0].caption}
        caption={pictures[0].caption}
        name={pictures[0].name}
        width={isMobile ? 427 : 1000}
        height={isMobile ? 344 : 800}
        quality={!isMobile && 25}
        layout="responsive"
      />
    );
  }
  if (isMobile) {
    return (
      <div className={styles.mobileGallery}>
      <ImageGallery
        items={pictures.map((img, idx) => {
          return {
            alt: img.alternativeText || img.caption,
            index: idx,
            original: img.url
          };
        })}
        onSlide={setCurrentMobileSlide}
        renderItem={ImageGalleryItem}
        useBrowserFullscreen={false}
        showPlayButton={false}
        showThumbnails={false}
        showFullscreenButton={false}
      />
      {pictures[currentMobileSlide] && <span className={styles.mobileCaption}>
      {pictures[currentMobileSlide].caption || pictures[currentMobileSlide].name}
      </span>}
      </div>
    );
  }

  return (
    <>
      {pictures.map(pic => (
        <ImageWithCaption
          src={pic.url}
          alt={pic.alternativeText || pic.caption}
          caption={pic.caption}
          name={pic.name}
          width={427}
          height={344}
          layout="responsive"
          key={pic.url}
        />
      ))}
    </>
  );
}

export default React.memo(ListingImage)