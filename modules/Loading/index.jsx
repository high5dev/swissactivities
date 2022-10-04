import React from "react";
import Reactloading from "react-loading";
import styles from "./styles.module.scss";

const Loading = ({
  type = "spinningBubbles",
  color = "#fff",
  width = 300,
  height = 300,
  className
}) => {
  return (
    <div className={className || styles.loadingContainer}>
      <Reactloading type={type} color={color} width={width} height={height} />
    </div>
  );
};

export default Loading;
