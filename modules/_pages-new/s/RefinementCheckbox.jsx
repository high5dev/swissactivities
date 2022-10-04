import classNames from "classnames";
import { FaCheck } from "react-icons/fa";

export const RefinementCheckbox = ({ item, refine, radio }) => {
  return (
    <button
      key={item.value}
      className={`m-0 flex w-full cursor-pointer items-center border-none bg-transparent p-0 text-left text-base text-black transition duration-100 ease-in hover:text-primary lg:text-sm`}
      onClick={(event) => {
        event.preventDefault();
        refine(item.value);
      }}
    >
      <span
        className={classNames(
          `flex h-7 w-7 items-center justify-center border border-solid text-white lg:h-5 lg:w-5`,
          {
            "border-primary bg-primary": item.isRefined,
            "border-gray-400": !item.isRefined,
            rounded: !radio,
            "rounded-full": radio,
          }
        )}
      >
        {item.isRefined && !radio ? (
          <FaCheck />
        ) : (
          item.isRefined &&
          radio && <span className={`h-2 w-2 rounded-full bg-white`} />
        )}
      </span>
      <span className={`ml-2 inline-block font-medium`}>{item.label}</span>
      <span
        className={`ml-2 rounded-sm bg-gray-50 py-0.5 px-1.5 text-xs font-medium text-gray-800`}
      >
        {item.count}
      </span>
    </button>
  );
};
