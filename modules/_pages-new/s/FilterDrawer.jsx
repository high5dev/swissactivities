import { FaFilter } from "react-icons/fa";
import { useI18n } from "next-localization";
import Drawer from "../../_components/Drawer";
import React from "react";
import Filters from "./Filters";
import { useDrawerStore } from "../../../store/drawerStore";

export const FilterDrawer = () => {
  const { t } = useI18n();
  const setOpen = useDrawerStore((state) => state.setOpen);

  return (
    <>
      <div
        onClick={() => setOpen("search-filter")}
        role="button"
        className={`fixed bottom-6 left-1/2 z-40 flex flex -translate-x-1/2 cursor-pointer items-center rounded-full bg-black px-6 py-3 text-white filter lg:hidden`}
      >
        <FaFilter className="mr-3" />
        {t("filter.filter")}
      </div>
      <Drawer ident="search-filter" title={t("header.navigation")}>
        <Filters type="drawer" />
      </Drawer>
    </>
  );
};
