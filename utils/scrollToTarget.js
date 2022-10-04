export const scrollToTarget = (el, target = window) => {
  const element = document.querySelector(el);
  if (element) {
    const headerOffset =
      Number(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--h-header")
          .replace("px", "")
      ) + 16;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - (target === window ? headerOffset : 16);

    target.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
