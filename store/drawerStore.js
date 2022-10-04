import create from "zustand";
import { gsap } from "gsap";
import { disableBodyLock, enableBodyLock } from "../utils/bodylock";

export const useDrawerStore = create((set, get) => ({
  isOpen: "",
  setOpen: (isOpen) => {
    let scroll = window.pageYOffset;
    if (isOpen !== "") {
      enableBodyLock(true);
      document.body.style.top = -scroll + "px";
    } else {
      if (
        !document.body.classList.contains("is-map-search") &&
        !document.body.classList.contains("is-filter-open")
      ) {
        disableBodyLock(true);
      }
    }
    set({ isOpen, scroll });
  },
  close: (element = false) => {
    const el = document.querySelector(`[data-drawer="${get().isOpen}"]`);
    const ease = "power2.inOut";
    gsap.to(el.querySelector('[data-drawer="overlay"]'), {
      opacity: 0,
      duration: 0.25,
      ease,
    });
    gsap.to(el.querySelector('[data-drawer="drawer"]'), {
      y: "100%",
      duration: 0.25,
      ease,
    });
    gsap.to(el.querySelector('[data-drawer="inner"]'), {
      opacity: 0,
      duration: 0.25,
      ease,
    });

    setTimeout(() => {
      set({ isOpen: "" });
      if (
        !document.body.classList.contains("is-map-search") &&
        !document.body.classList.contains("is-filter-open")
      ) {
        disableBodyLock(true);
      }
      if (element) {
        element.scrollIntoView({
          behavior: "auto",
        });
      } else {
        window.scrollTo(0, get().scroll);
      }
    }, 250);
  },
  scroll: 0,
}));
