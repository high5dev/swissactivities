import Button from "../Button";
import { useEffect, useRef } from "react";
import { BsX } from "react-icons/bs";
import { Text } from "../Text";
import { useDrawerStore } from "../../../store/drawerStore";
import { gsap } from "gsap";
import classNames from "classnames";

const Drawer = ({ children, title, ident, padding = true }) => {
  const isOpen = useDrawerStore((state) => state.isOpen);
  const close = useDrawerStore((state) => state.close);
  const overlay = useRef(null);
  const drawer = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    const ease = "power2.inOut";
    if (isOpen === ident) {
      gsap.to(overlay.current, {
        opacity: 1,
        duration: 0.5,
        ease,
      });
      gsap.to(drawer.current, {
        y: 0,
        duration: 0.5,
        ease,
      });
      gsap.to(inner.current, {
        opacity: 1,
        duration: 0.5,
        delay: 0.5,
        ease,
      });
    }
  }, [isOpen]);

  return isOpen === ident ? (
    <>
      <div
        data-drawer={ident}
        className={`fixed top-0 left-0 z-[10000000000000] h-full w-full`}
      >
        <div
          data-drawer="overlay"
          role="button"
          onClick={() => close(false)}
          ref={overlay}
          className={`fixed top-0 left-0 flex flex h-full w-full items-start justify-end bg-black/80 opacity-0 backdrop-blur-sm`}
        >
          <Button
            className={`!min-h-[40px] !border-none !text-white`}
            type="transparent"
            icon={<BsX />}
          />
        </div>
        <div
          data-drawer="drawer"
          ref={drawer}
          className={`fixed bottom-0 top-10 left-0 h-[calc(100%-40px)] w-full translate-y-full rounded-t-2xl bg-white`}
        >
          <div className={`flex h-[48px] flex-col pt-4`}>
            <Text size="md" className={`px-6`}>
              {title}
            </Text>
            <div className={`mt-auto h-px w-full bg-gray-200`} />
          </div>
          <div
            data-drawer="inner"
            ref={inner}
            className={classNames(
              `h-[calc(100%-48px)] w-full overflow-y-auto overscroll-contain pb-12 opacity-0`,
              {
                "p-6": padding,
              }
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default Drawer;
