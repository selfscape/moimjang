import React from "react";
import FadeLoader from "react-spinners/FadeLoader";
import styles from "./Spinner.module.css";

interface FadeLoaderCustomProps {
  color?: string;
  cssOverride?: React.CSSProperties;
  height?: number | string;
  loading?: boolean;
  margin?: number | string;
  radius?: number | string;
  speedMultiplier?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

const defaultOptions: FadeLoaderCustomProps = {
  color: "#1a1111",
  cssOverride: {},
  height: 12,
  loading: true,
  margin: 2,
  radius: 3,
  speedMultiplier: 1,
  width: 6,
};

export default function Spinners(props: FadeLoaderCustomProps) {
  return (
    <div className={styles.loadingWrapper} style={props.style}>
      <FadeLoader
        {...defaultOptions}
        color={props.color}
        cssOverride={props.cssOverride}
        height={props.height}
        loading={props.loading}
        margin={props.margin}
        radius={props.radius}
        speedMultiplier={props.speedMultiplier}
        width={props.width}
      />
    </div>
  );
}
