import { isObject } from "lodash";
import classNames from "classnames";
import StaticImage from "../../Image";

export const LogoGrid = ({ items, infinite, duration = "60s" }) => {
  const Render = () => {
    return items.map((item, index) => {
      return isObject(item) ? (
        <a
          key={`image-${index}`}
          target="_blank"
          href={item.url}
          rel="noreferrer"
        >
          <StaticImage
            layout="responsive"
            width="100%"
            height="100%"
            src={item.img}
          />
        </a>
      ) : (
        <div
          key={`image-${index}`}
          className={classNames({
            "infinite relative rounded-lg border border-solid border-gray-100":
              infinite,
          })}
        >
          <StaticImage
            width="100%"
            height="100%"
            key={`image-${index}`}
            src={item}
          />
        </div>
      );
    });
  };

  return (
    <>
      {infinite && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    @keyframes scroll${infinite} {
                        0 % {
                            transform: translateX(0);
                        }
                        100% {
                        transform: translateX(calc(-160px * ${items.length}))
                      }
                    }
                    .logo-grid-slide-${infinite} {
                        animation: scroll${infinite} ${duration} linear infinite;
                        width: calc(160px * ${items.length});
                    }
                    `,
          }}
        />
      )}
      <div
        className={`logo-grid flex flex-wrap items-center items-center justify-center gap-8 sm:gap-x-10 md:gap-x-12 lg:gap-x-14 xl:gap-x-16`}
      >
        {infinite ? (
          <div
            className={`logo-grid-slide-${infinite} grid h-16 auto-cols-[128px] grid-flow-col items-center justify-center gap-8`}
          >
            {[1, 2, 3, 4, 5].map((item, index) => {
              return <Render key={`logo-grid-${index}`} />;
            })}
          </div>
        ) : (
          <Render />
        )}
      </div>
    </>
  );
};
