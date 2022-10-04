import { AiOutlineLoading } from "react-icons/ai";
import classNames from "classnames";

export const Loader = ({ color = "text-black", center, size = "md" }) => {
  return (
    <AiOutlineLoading
      className={classNames(`animate-spin`, color, {
        "fixed left-0 right-0 mx-auto my-0": center,
        "text-3xl": size === "md",
        "text-2xl": size === "sm",
      })}
    />
  );
};
