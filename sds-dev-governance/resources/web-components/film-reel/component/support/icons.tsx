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

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base({ size: 18, ...props })} strokeWidth={3}>
      <path d="M10 32h42" />
      <path d="M38 18l14 14-14 14" />
    </svg>
  );
}


export function CloseIcon(props: IconProps) {
  return (
    <svg {...base({ size: 24, ...props })} strokeWidth={4}>
      <path d="M16 16l32 32M48 16 16 48" />
    </svg>
  );
}


export function PauseIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={5}>
      <path d="M24 18v28M40 18v28" />
    </svg>
  );
}


export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" strokeWidth={3}>
      <path d="M24 16l26 16-26 16z" />
    </svg>
  );
}
