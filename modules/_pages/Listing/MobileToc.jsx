import { BsListUl, BsX } from "react-icons/bs";
import { Nav } from "./Nav";
import Drawer from "../../_components/Drawer";
import { useI18n } from "next-localization";
import { useDrawerStore } from "../../../store/drawerStore";

export const MobileToc = ({ headings, current }) => {
  const { t } = useI18n();
  const isOpen = useDrawerStore((state) => state.isOpen);
  const setOpen = useDrawerStore((state) => state.setOpen);

  return (
    <>
      <div
        onClick={() => setOpen("listing")}
        role="button"
        className="fixed right-8 bottom-8 z-50 flex h-[50px] w-[50px] select-none items-center justify-center rounded-full border border-solid border-gray-200 bg-white text-black shadow-lg lg:hidden"
      >
        <svg
          className="absolute -rotate-90 transform"
          width="66px"
          height="66px"
          style={{
            fill: "transparent",
            transform: "scale(0.79) rotate(-90deg)",
          }}
        >
          <circle r="32px" cx="33px" cy="33px" className="track" />
          <circle
            id="toc-progress"
            r="31px"
            cx="33px"
            cy="33px"
            className="progress"
            style={{
              strokeDasharray: 194.779,
              strokeDashoffset: 194.779,
              strokeWidth: "4px",
              strokeLinecap: "round",
              stroke: "#ff385c",
            }}
          />
        </svg>
        {isOpen ? (
          <BsX className={`text-2xl`} />
        ) : (
          <BsListUl className={`text-lg`} />
        )}
      </div>
      <Drawer
        ident="listing"
        title={t("pages.listing.tableOfContent")}
      >
        <Nav current={current} headings={headings} type="sm" />
      </Drawer>
    </>
  );
};
