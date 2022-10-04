import { useEffect, useState } from "react";
import classNames from "classnames";
import { Loader } from "../Loader";
import { BsX, BsXLg } from "react-icons/bs";

export const Modal = ({
  children,
  open,
  onClose,
  className,
  classNameInner,
  classNameOuter,
  size,
  loaded,
  loader,
  py,
  full,
  preload,
  type,
  z,
}) => {
  const isInfo = type === "info";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);

    return () => {
      setIsOpen(false);
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  useEffect(() => {
    isOpen && document.body.classList.add("overflow-hidden");
    !isOpen && document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < size) {
        document.body.classList.remove("overflow-hidden");
      } else {
        isOpen && document.body.classList.add("overflow-hidden");
      }
    };

    resize();
    size && window.addEventListener("resize", resize);

    return () => size && window.removeEventListener("resize", resize);
  }, [size, isOpen]);

  return (
    <div
      id="modal"
      className={classNames(
        `fixed left-0 top-0 z-[10000] flex h-screen w-full items-center justify-center overflow-y-auto`,
        className,
        {
          "pointer-events-none hidden": !isOpen,
        }
      )}
    >
      {(isOpen || preload) && (
        <>
          <div
            className={classNames(
              "fixed left-0 top-0 flex h-full w-full overflow-y-auto bg-black/80 backdrop-blur-sm",
              {
                "py-4 lg:py-8 xl:py-16": py,
                "px-4 lg:px-8 xl:px-16": !full,
                [classNameOuter]: classNameOuter,
              }
            )}
            onClick={onClose}
          >
            {loader && (
              <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
              >
                <Loader center color={`text-white`} />
              </div>
            )}
            <div
              onClick={(e) => e.stopPropagation()}
              className={classNames(
                `relative z-10 m-auto rounded-lg`,
                classNameInner,
                {
                  "max-w-[600px] bg-white p-4 lg:p-8": isInfo,
                  "!rounded-none": full,
                  hidden: !loaded,
                }
              )}
            >
              {children}
            </div>
          </div>
          <div
            style={{ borderTop: "none", borderRight: "none" }}
            role="button"
            onClick={onClose}
            className={`fixed right-0 top-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-bl border border-solid border-gray-200 bg-white text-xl text-black lg:h-12 lg:w-12`}
          >
            <BsXLg className={`hidden lg:block`} />
            <BsX className={`lg:hidden`} />
          </div>
        </>
      )}
    </div>
  );
};
