/**
 * "JIA — Tinta de frontera" icon family (JIA_IDENTIDAD_VISUAL.md §7), drawn on a
 * 64-unit grid. Hat, compass and lantern are linear (stroke 2.5); the cactus is
 * a filled silhouette. Colour comes from `currentColor`; all are decorative
 * (aria-hidden) and always accompany a text label.
 */
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

export function HatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 38V24c0-7 5-11 11-11s11 4 11 11v14" />
      <path d="M21 31h22" />
      <path d="M7 39c7 6 16 8 25 8s18-2 25-8c-5 3-12 5-25 5S12 42 7 39Z" />
      <path d="M28 14c1-2 2.5-3 4-3s3 1 4 3" />
    </svg>
  );
}

export function CactusIcon(props: IconProps) {
  const p = base(props);
  return (
    <svg {...p} stroke="none" fill="currentColor">
      <path d="M28 8h8a4 4 0 0 1 4 4v44h-16V12a4 4 0 0 1 4-4Z" />
      <path d="M12 22a3.5 3.5 0 0 1 7 0v10a2 2 0 0 0 2 2h3v7h-5a7 7 0 0 1-7-7V22Z" />
      <path d="M45 16a3.5 3.5 0 0 1 7 0v14a7 7 0 0 1-7 7h-5v-7h3a2 2 0 0 0 2-2V16Z" />
      <path d="M18 57h28v3H18z" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="32" cy="32" r="21" />
      <circle cx="32" cy="32" r="3" />
      <path d="M32 6v9M32 49v9M6 32h9M49 32h9" />
      <path d="M32 14l5 15-5 3-5-3 5-15Z" fill="currentColor" stroke="none" />
      <path d="M32 50l-5-15 5-3 5 3-5 15Z" />
      <path d="M14 32l15-5 3 5-3 5-15-5Z" />
      <path d="M50 32l-15 5-3-5 3-5 15 5Z" />
    </svg>
  );
}

export function LanternIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M27 15v-4a5 5 0 0 1 10 0v4" />
      <path d="M22 21h20l-2-6H24l-2 6Z" />
      <path d="M25 21h14v22H25z" />
      <path d="M25 21l14 22M39 21 25 43" />
      <path d="M21 43h22l2 7H19l2-7Z" />
      <path d="M32 50v7" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base({ size: 18, ...props })} strokeWidth={3}>
      <path d="M10 32h42" />
      <path d="M38 18l14 14-14 14" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base({ size: 24, ...props })} strokeWidth={4}>
      <path d="M10 18h44M10 32h44M10 46h44" />
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

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base({ size: 14, ...props })} strokeWidth={4}>
      <path d="M14 24l18 18 18-18" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  const p = base({ size: 12, ...props });
  return (
    <svg {...p} stroke="none" fill="currentColor">
      <path d="M32 4l7.6 18.6L60 24.4 44.6 37.6 49.2 58 32 47.2 14.8 58l4.6-20.4L4 24.4l20.4-1.8L32 4Z" />
    </svg>
  );
}

/**
 * Sheriff's badge for the hero's primary action ([50-0]): a five-pointed star with a rounded boss on each tip, drawn
 * on the family's 64-unit grid and filled with `currentColor`. It is not `StarIcon`, the plain star the hero already
 * uses above the title; this one is a badge and only a button wears it.
 */
export function SheriffStarIcon(props: IconProps) {
  const p = base({ size: 18, ...props });
  return (
    <svg {...p} stroke="none" fill="currentColor">
      <path d="M32 7l6.2 16.5L55.8 24.3 42 35.2l4.7 17L32 42.5 17.3 52.2 22 35.2 8.2 24.3l17.6-.8L32 7Z" />
      <circle cx="32" cy="7" r="3.4" />
      <circle cx="55.8" cy="24.3" r="3.4" />
      <circle cx="46.7" cy="52.2" r="3.4" />
      <circle cx="17.3" cy="52.2" r="3.4" />
      <circle cx="8.2" cy="24.3" r="3.4" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base({ size: 16, ...props })} strokeWidth={4}>
      <path d="M26 12H12v40h40V38" />
      <path d="M36 10h18v18" />
      <path d="M54 10 30 34" />
    </svg>
  );
}

/** Circular arrow for "play again" controls: one open ring with an arrowhead, same stroke as the family. */
export function ReplayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M50 34a18 18 0 1 1-6.5-13.9" />
      <path d="M45 12v10H35" />
    </svg>
  );
}

/** Media controls of the intro video: same grid and stroke as the family. */
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

export function SoundOnIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={4}>
      <path d="M10 26v12h9l13 10V16L19 26z" fill="currentColor" />
      <path d="M41 24a11 11 0 0 1 0 16M47 17a20 20 0 0 1 0 30" />
    </svg>
  );
}

export function SoundOffIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={4}>
      <path d="M10 26v12h9l13 10V16L19 26z" fill="currentColor" />
      <path d="M42 25l13 14M55 25L42 39" />
    </svg>
  );
}

/** Fullscreen: four corners opening out; its exit twin, four corners closing in. */
export function FullscreenIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={4}>
      <path d="M14 26V14h12M38 14h12v12M50 38v12H38M26 50H14V38" />
    </svg>
  );
}

export function FullscreenExitIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={4}>
      <path d="M26 14v12H14M50 26H38V14M38 50V38h12M14 38h12v12" />
    </svg>
  );
}

/** Picture in picture: the screen with a small one set into its corner; and, to leave it, the small one's arrow
    back into the screen. Same grid and stroke as the controls. */
export function PictureInPictureIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={4}>
      <path d="M54 30V14H10v36h18" />
      <path d="M36 38h18v14H36z" />
    </svg>
  );
}

export function PictureInPictureExitIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={4}>
      <path d="M54 30V14H10v36h18" />
      <path d="M36 38h18v14H36z" />
      <path d="M30 34 18 22M18 32V22h10" />
    </svg>
  );
}

/** Share: an arrow rising out of an open tray (the phone's own sign), same grid and stroke as the controls. */
export function ShareIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={4}>
      <path d="M32 38V10M21 21l11-11 11 11" />
      <path d="M22 30h-8v24h36V30h-8" />
    </svg>
  );
}

/** "Download": an arrow into a tray, same grid and stroke as the family. */
export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M32 12v28M21 30l11 11 11-11" />
      <path d="M14 50h36" />
    </svg>
  );
}
