import { Text } from "../../_components/Text";
import { BsListUl } from "react-icons/bs";
import classNames from "classnames";
import { useI18n } from "next-localization";
import Button from "../../_components/Button";
import { useEffect, useState } from "react";
import { Voucher } from "../../_components/Voucher";
import { useDrawerStore } from "../../../store/drawerStore";

export const Nav = ({ headings, type, current }) => {
  const { t } = useI18n();
  const isSm = type === "sm";
  const [target, setTarget] = useState("");
  const close = useDrawerStore((state) => state.close);

  useEffect(() => {
    setTarget(window.innerWidth < 768 ? "_blank" : "_self");
  }, []);

  const onClick = (anchor) => {
    if (isSm) {
      close(document.getElementById(anchor));
    }
  };

  return (
    <div className={`space-y-4`}>
      {!isSm && (
        <>
          <div className={`!mb-6 grid grid-cols-2 gap-2`}>
            <Button
              target={target}
              className={`w-full !text-xs lg:!text-sm`}
              href="/s"
              type="primary"
              text={t("pages.listing.viewAllActivities")}
            />
            <Voucher
              type="secondary"
              className={`!text-xs lg:!text-sm`}
              icon={false}
            />
          </div>
          <Text as="h3" size="md" className={`flex items-center`}>
            <BsListUl className={`mr-2 flex text-primary`} />{" "}
            {t("pages.listing.tableOfContent")}
          </Text>
        </>
      )}
      <ul className={`grid gap-4 lg:gap-3`}>
        {headings.map((heading) => {
          return (
            heading.parent.anchor && (
              <li key={heading.parent.anchor + heading.level}>
                <a
                  onClick={() => onClick(heading.parent.anchor)}
                  href={`#${heading.parent.anchor}`}
                  data-id={heading.parent.anchor}
                  className={classNames(
                    `inline-block text-sm font-medium text-gray-900 transition duration-100 ease-in`,
                    {
                      "!text-primary": current === heading.parent.anchor,
                    }
                  )}
                >
                  {heading.parent.text}
                </a>
                {heading?.children?.length >= 1 && (
                  <ul
                    data-parent={heading.parent.anchor}
                    className={classNames(`mt-1.5 space-y-1.5 lg:hidden`)}
                  >
                    {heading.children.map((child) => {
                      return (
                        <li key={child.text}>
                          <a
                            onClick={() => onClick(child.anchor)}
                            href={`#${child.anchor}`}
                            data-id={child.anchor}
                            className={classNames(
                              `text-sm font-medium text-gray-500 transition duration-100 ease-in`,
                              {
                                "!text-primary": current === child.anchor,
                              }
                            )}
                          >
                            {child.text}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
};
