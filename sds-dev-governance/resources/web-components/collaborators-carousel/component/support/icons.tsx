// Decorative controls extracted from the source icon set.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 40, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base({ size: 14, ...props })} strokeWidth={4}>
      <path d="M14 24l18 18 18-18" />
    </svg>
  );
}
