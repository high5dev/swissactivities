import { Loader } from "./index";
import classNames from "classnames";

export const LoaderScreen = ({ fixed, blur }) => {
  return (
    <div
      className={classNames(
        `left-0 top-0 flex h-full w-full items-center justify-center bg-white/80`,
        {
          "fixed z-[100000]": fixed,
          "absolute z-10": !fixed,
          "backdrop-blur-sm": blur,
        }
      )}
    >
      <Loader />
    </div>
  );
};
