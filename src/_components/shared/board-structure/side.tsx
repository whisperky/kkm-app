import React from "react";

export default function SideSvg({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="4"
      height="4"
      viewBox="0 0 4 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path d="M0 0C0 1.33333 0.8 4 4 4H0V0Z" fill="#EDC499" />
    </svg>
  );
}
