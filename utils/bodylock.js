export const enableBodyLock = (lockDesktop = false) => {
  document.documentElement.style.height = "100vh";

  document.body.classList.add(
    "overflow-hidden",
    "fixed",
    "left-0",
    "top-0",
    "w-screen",
    "lg:static",
    "lg:overflow-auto"
  );
  if (lockDesktop) {
    document.body.classList.add("!overflow-hidden", "!w-full");
  }
};

export const disableBodyLock = (lockDesktop = false) => {
  document.body.classList.remove(
    "overflow-hidden",
    "fixed",
    "left-0",
    "top-0",
    "w-screen",
    "lg:static",
    "lg:overflow-auto"
  );

  if (lockDesktop) {
    document.body.classList.remove("!overflow-hidden", "!w-full");
  }

  document.documentElement.style.removeProperty("height");
};
