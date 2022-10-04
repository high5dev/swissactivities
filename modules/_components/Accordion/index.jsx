import { IoChevronDown } from "react-icons/io5";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../../_primitives/Button";
import { Text } from "../Text";

export const Accordion = ({
  item,
  children,
  type,
  open,
  large,
  className,
  classNameChildren,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = type === "desktop";

  const cls = classNames(
    "text-left cursor-pointer flex text-sm bg-white border-none items-center min-h-[56px] text-gray-700 w-full transition ease-in duration-100 sm:hover:bg-gray-50",
    { [className]: className }
  );

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const onOpen = () => {
    setIsOpen(!isOpen);
  };

  // eslint-disable-next-line react/display-name
  const ParentLink = React.forwardRef(({ onClick, href, item }, ref) => {
    return (
      <Button
        as="div"
        key={item.text}
        href={href}
        onClick={onClick}
        ref={ref}
        className={classNames(cls, "px-4 py-4 pr-6 font-medium", {
          "sm:hover:bg-white lg:min-h-0 lg:cursor-default lg:p-0 lg:pl-2 lg:text-lg lg:text-black":
            isDesktop,
        })}
      >
        {item.icon && <span className={`mr-3 flex`}>{item.icon}</span>}
        <Text
          as="span"
          bold
          className={classNames({
            "lg:hidden": large,
          })}
        >
          {item.text}
        </Text>
        {large && (
          <Text as="h2" size="md" className={`hidden lg:block`}>
            {item.text}
          </Text>
        )}
        {(item.children || item.content || children) && (
          <span
            className={classNames(
              `relative ml-auto flex origin-center transform items-center justify-center text-base`,
              {
                "rotate-180": isOpen,
                "lg:hidden": isDesktop,
              }
            )}
          >
            <IoChevronDown />
          </span>
        )}
      </Button>
    );
  });

  // eslint-disable-next-line react/display-name
  const ChildLink = React.forwardRef(({ onClick, href, item }, ref) => {
    return (
      <Button
        key={item.text}
        href={href}
        onClick={item?.onClick || onClick}
        ref={ref}
        className={classNames(
          cls,
          "block py-3 pl-11 pr-4 transition duration-100 ease-in hover:bg-gray-50"
        )}
      >
        {item.text}
      </Button>
    );
  });

  return item?.text ? (
    <li
      id={item.id}
      className={classNames(`select-none list-none`, {
        "lg:grid lg:select-text lg:grid-cols-[300px,1fr] lg:items-start":
          isDesktop,
      })}
      style={{ borderLeft: "none", borderRight: "none" }}
      key={item.text}
    >
      {item.children || children ? (
        <ParentLink item={item} onClick={onOpen} />
      ) : (
        <Link href={item.href || "#0"} passHref>
          <ParentLink item={item} />
        </Link>
      )}
      {item.children && isOpen && (
        <ul className={`mb-3`}>
          {item.children.map((itemChild) => {
            return (
              <li key={itemChild.text}>
                {itemChild.onClick ? (
                  <ChildLink item={itemChild} />
                ) : (
                  <Link href={itemChild.href || "#0"} passHref>
                    <ChildLink item={itemChild} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {children && (
        <div
          className={classNames(`px-4 pb-8 lg:pb-0`, {
            hidden: !isOpen,
            "lg:block": isDesktop,
            [classNameChildren]: classNameChildren,
          })}
        >
          {children}
        </div>
      )}
    </li>
  ) : null;
};

export default Accordion;
