import { Button as B } from "../../_primitives/Button";
import classNames from "classnames";
import { Loader } from "../Loader";

export const Button = ({
  children,
  text,
  icon,
  type,
  disabled,
  loading,
  className,
  submit,
  reverse,
  ...rest
}) => {
  const isPrimary = type === "primary";
  const isSecondary = type === "secondary";
  const isTertiary = type === "tertiary";
  const isTransparent = type === "transparent";
  const isDanger = type === "danger";
  const isInstruction = type === "instruction";

  const Inner = () => {
    return (
      <>
        {icon && (
          <span
            className={classNames(`flex text-xl lg:text-lg`, {
              "mr-1.5": text && !reverse,
              "ml-1.5": text && reverse,
            })}
          >
            {icon}
          </span>
        )}
        {text && <span>{text}</span>}
        {children && children}
      </>
    );
  };

  return (
    <B
      {...rest}
      type={submit && "submit"}
      style={{ borderStyle: "solid" }}
      className={classNames(
        "group inline-flex h-[max-content] max-h-max min-h-[48px] cursor-pointer appearance-none items-center justify-center rounded-lg !border-solid px-3.5 py-2.5 text-center text-sm font-medium transition duration-100 ease-in lg:min-h-[52px] lg:text-base",
        {
          [className]: className,
          "!border-2 border-gray-400 bg-white text-gray-700 sm:hover:border-gray-500 sm:hover:bg-gray-500 sm:hover:text-white":
            isSecondary,
          "!border-2 border-primary bg-primary text-white hover:text-white sm:hover:border-dark sm:hover:bg-dark":
            isPrimary,
          "!border-2 !border-transparent text-primary sm:hover:bg-white":
            isTertiary,
          "border-transparent bg-transparent sm:hover:border-gray-100 sm:hover:bg-gray-100":
            isTransparent || isDanger,
          "text-gray-900 ": isTransparent,
          "text-primary": isDanger || isInstruction,
          "pointer-events-none !border-gray-300 !bg-gray-300": disabled,
          "!pointer-events-none !border-[#FFEBEE] !bg-[#FFEBEE]": isInstruction,
          "flex-row-reverse": reverse,
        }
      )}
    >
      {loading ? <Loader size="sm" color={loading} /> : <Inner />}
    </B>
  );
};

export default Button;
