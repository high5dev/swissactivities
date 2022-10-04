import React, { forwardRef } from "react";
import classnames from "classnames";
import Icon from "../Icon";

const Button = (
  {
    title,
    customStyle,
    value,
    icon,
    active,
    iconStyle = false,
    subStyle,
    outline,
    component: Component = "button",
    ...props
  },
  ref
) => {
  return (
    <Component
      className={classnames("btn-main", { "btn--outline": outline }, customStyle)}
      {...props}
      ref={ref}
    >
      <div className={classnames("btn-subItem", subStyle)}>
        {icon && (
          <Icon
            icon={icon}
            color={active || !iconStyle ? "#FE504F" : "#878787"}
          />
        )}
        {value && !iconStyle ? value : title}
      </div>
    </Component>
  );
};
export default forwardRef(Button);
