import Button from "../../_primitives/Button";
import classNames from "classnames";

export const Tag = (props) => {
  return (
    <Button
      {...props}
      className={classNames(
        "inline-block flex cursor-pointer items-center whitespace-nowrap rounded-full border-2 border-blue bg-white px-3 py-1.5 text-xs font-medium text-blue transition duration-100 ease-in hover:bg-blue hover:text-white lg:text-sm",
        {
          "!bg-blue !text-white": props.active,
        }
      )}
    >
      {props.children}
    </Button>
  );
};
