import StaticImage from "../../Image";

const Images = ({ images }) => {
  return (
    <div className={`mt-4 w-full overflow-x-auto`}>
      <div
        className={`grid max-w-full auto-cols-[minmax(300px,1fr)] grid-flow-col gap-4`}
      >
        {images.map((img) => {
          return (
            <div key={img.url} className={`image-wrap`}>
              <StaticImage
                src={img.url}
                alt={img.alt || img.caption}
                layout="responsive"
                quality={40}
                width={650}
                height={400}
              />
              <span
                className={`inline-block text-xs font-medium text-gray-700`}
              >
                {img.caption || img.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Images;
