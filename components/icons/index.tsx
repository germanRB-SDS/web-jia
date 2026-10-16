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

/* ---- Filled silhouettes supplied by the promoter ([67-0], originals in assets/icons/) ----
   Unlike the linear family they are solid shapes (fill, no stroke), each on its own drawing's box; the svg keeps the
   size the caller asks for and centres the shape in it. Used by the hero's shortcuts (Waypoints). */
function filled({ size = 40, ...rest }: IconProps, viewBox: string) {
  return {
    width: size,
    height: size,
    viewBox,
    fill: "currentColor",
    fillRule: "evenodd" as const,
    clipRule: "evenodd" as const,
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

const BOARD_PATH = "M32.87 28.24h123.11l7.6-26.95h30.66l-7.05 26.95h45.74V2.61h30.3v25.63h45.23L297.68 0h31.85l10.98 28.24h121.62c9 0 17.2 3.69 23.18 9.65l.06.06c5.94 5.97 9.63 14.17 9.63 23.16v254.4c0 9.01-3.7 17.21-9.65 23.19l-.07.06c-5.97 5.94-14.17 9.63-23.15 9.63h-43.32l44.9 163.48H432.6l-20.15-73.06H263.23v69.04h-30.3v-69.04H81.14l-20.21 72.67H29.76l45.21-163.09h-42.1c-9 0-17.21-3.7-23.18-9.65l-.07-.07C3.68 332.7 0 324.5 0 315.51V61.11c0-9 3.69-17.21 9.65-23.18l.07-.07c5.97-5.94 14.16-9.62 23.15-9.62zm371.22 380.27-16.58-60.12H263.23v60.12h140.86zm-171.16 0v-60.12H106.28l-16.72 60.12h143.37zM32.87 39.25h429.26c12.02 0 21.85 9.84 21.85 21.86v254.4c0 12.03-9.83 21.86-21.85 21.86H32.87c-12.02 0-21.85-9.83-21.85-21.86V61.11c0-12.02 9.83-21.86 21.85-21.86z";
/** Also stamped by the wagon trail behind «Programa» ([68-0]). */
export const HORSESHOE_PATH = "M25,80.18A33.31,33.31,0,0,0,36.67,94.3a38.86,38.86,0,0,0,43.44.09A33.37,33.37,0,0,0,92,80.18c5.83-13.42,4.56-36.7-1.84-50-1.67-3.46-3.81-6.34-7.25-12.4C80.1,13,78.79,8.63,83.73,4.59A22,22,0,0,1,97.47,0c4.67.14,7.54,3.4,9.14,7.61,1.07,2.78,2.25,8.35,1.5,11.35-.37,1.53-1.16,2-1.65,3-.72,1.46.09,2.95,1.18,5.07,16.4,32,11,69.78-15.88,86.81-17.14,10.86-41.64,11.89-60,3.55C-.75,102.61-8.4,61.46,9.27,27c1.08-2.12,1.89-3.61,1.17-5.07-.49-1-1.27-1.42-1.65-3-.74-3,.44-8.57,1.5-11.35C11.89,3.41,14.76.15,19.43,0A22,22,0,0,1,33.17,4.59c4.94,4,3.63,8.36.87,13.23-3.43,6.06-5.57,8.94-7.25,12.4-6.4,13.26-7.66,36.54-1.84,50ZM21.87,12.29a3.3,3.3,0,1,1-3.3,3.3,3.29,3.29,0,0,1,3.3-3.3Zm36.58,94.77a3.66,3.66,0,1,1-3.65,3.66,3.65,3.65,0,0,1,3.65-3.66Zm41-19.31a3.66,3.66,0,1,1-3.65,3.65,3.65,3.65,0,0,1,3.65-3.65Zm-81.9,0a3.66,3.66,0,1,1-3.65,3.65,3.66,3.66,0,0,1,3.65-3.65Zm88.76-26.1a3.65,3.65,0,1,1-3.66,3.65,3.65,3.65,0,0,1,3.66-3.65Zm-95.61,0A3.65,3.65,0,1,1,7,65.3a3.65,3.65,0,0,1,3.66-3.65Zm91.87-26.11a3.66,3.66,0,1,1-3.66,3.66,3.66,3.66,0,0,1,3.66-3.66Zm-88.13,0a3.66,3.66,0,1,1-3.66,3.66,3.66,3.66,0,0,1,3.66-3.66ZM95,12.29a3.3,3.3,0,1,1-3.3,3.3,3.29,3.29,0,0,1,3.3-3.3Z";
const LAMP_PATH = "M49.13,41.83H17.46c-1,3.33-2.13,6.93-3.35,10.66-3.54,10.9-7.49,23-7.63,33.07-.16,11.34,5,20.23,22.58,21.58h4.49a1.31,1.31,0,0,1-.48-1l-.43-1.29A33,33,0,0,1,27.2,100l-.95-1.15C13.7,82.71,34,65.1,30.24,57.18h0c13.65,11.71,21.59,28,11.6,41.56L41,99.87a33.51,33.51,0,0,1-5,4.84v1.41a1.32,1.32,0,0,1-.49,1h5.59c14.72-1.35,19.71-8.65,20.08-18.24.41-10.58-4.27-24.15-8.4-36.17-1.31-3.82-2.57-7.48-3.62-10.9ZM33.83,0a10.68,10.68,0,0,1,7.55,18.24h0a10.41,10.41,0,0,1-1.29,1.1v.91H52.16a2.23,2.23,0,0,1,2.22,2.22v5.66h3a2.23,2.23,0,0,1,2.22,2.22v6.18a2.24,2.24,0,0,1-2.22,2.22H54.63c1.07,3.63,2.48,7.71,3.95,12,4.3,12.51,9.16,26.63,8.71,38.39-.29,7.63-2.66,14.17-8.46,18.55.41.45.68,1.12,1.09,1.69l2,2.77c4,2,6.52,4.77,6.52,8.53a2.24,2.24,0,0,1-2.22,2.22h-64A2.23,2.23,0,0,1,0,120.66c0-2,1.59-3.79,4.27-5.4l4.24-5.9a13.2,13.2,0,0,1,1.22-1.83c-7.1-5-9.51-12.93-9.39-22,.15-11,4.25-23.6,7.92-34.9,1.36-4.19,2.67-8.19,3.67-11.84H10.36a2.23,2.23,0,0,1-2.21-2.22V30.35a2.22,2.22,0,0,1,2.21-2.22h3V22.47a2.23,2.23,0,0,1,2.22-2.22H27.61v-.87a9.73,9.73,0,0,1-1.34-1.14l-.13-.14A10.68,10.68,0,0,1,33.83,0Zm4.29,6.4a6.07,6.07,0,0,0-9.62,7.2H39.15a6.09,6.09,0,0,0-1-7.2ZM32,73.63C39.65,81,44.11,91.29,38.5,99.81l-.5.72-2.23,3-2.44.07a18.64,18.64,0,0,1-3-3l-.54-.72c-7-10.17,4.35-21.26,2.24-26.25Z";

/** The classroom's blackboard on its easel (assets/icons/board-icon.svg). */
export function BoardIcon(props: IconProps) {
  return (
    <svg {...filled(props, "0 0 495 511.87")}>
      <path d={BOARD_PATH} />
    </svg>
  );
}

/** The oil lamp (assets/icons/lantern-icon.svg). */
export function LampIcon(props: IconProps) {
  return (
    <svg {...filled(props, "0 0 68.43 122.88")}>
      <path d={LAMP_PATH} />
    </svg>
  );
}

const ARROWS_PATH = "M38.65,13.42H94.1V4A3.93,3.93,0,0,1,95.67.62c2.64-1.76,5.54.64,7.37,2.3,5.19,4.73,15.65,15.42,18.37,17.76a3.85,3.85,0,0,1,0,6.05c-2.81,2.41-13.82,13.69-18.87,18.18-1.75,1.55-4.42,3.48-6.87,1.86a3.94,3.94,0,0,1-1.57-3.35V34H59.4c-1.33,0-2,.48-1.88,1.6V54.42l0,2.87a2,2,0,0,1-2,2H37.74a2,2,0,0,1-2-2V15.44a2,2,0,0,1,2-2Zm45.58,75.2H28.78v9.46a3.94,3.94,0,0,1-1.57,3.35c-2.64,1.75-5.54-.65-7.37-2.31C14.66,94.39,4.19,83.7,1.47,81.36a3.84,3.84,0,0,1,0-6c2.81-2.41,13.82-13.69,18.87-18.19,1.75-1.55,4.42-3.48,6.87-1.86a4,4,0,0,1,1.57,3.35v9.43h34.7c1.33,0,2-.47,1.88-1.6V47.63l0-2.87a2,2,0,0,1,2-2H85.14a2,2,0,0,1,2,2V86.61a2,2,0,0,1-2,2Z";

/** Two arrows swapping ways (assets/icons/change-arrow-icon.svg): the «Bandos», where the news of the jornadas is
    posted. */
export function ArrowsIcon(props: IconProps) {
  return (
    <svg {...filled(props, "0 0 122.88 102.04")}>
      <path d={ARROWS_PATH} />
    </svg>
  );
}

/** Two horseshoes (assets/icons/horseshoe-icon.svg) as a horse's steps: staggered, toes forward (up), the second a
    stride ahead of the first and a little turned, like prints left on the sand. */
export function HoofprintsIcon(props: IconProps) {
  return (
    <svg {...filled(props, "0 0 64 64")}>
      <path d={HORSESHOE_PATH} transform="translate(19 46) rotate(172) scale(0.25) translate(-58.45 -61.44)" />
      <path d={HORSESHOE_PATH} transform="translate(45 18) rotate(190) scale(0.25) translate(-58.45 -61.44)" />
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
