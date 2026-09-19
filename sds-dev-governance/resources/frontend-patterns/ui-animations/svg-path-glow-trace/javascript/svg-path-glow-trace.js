/* Optional generator for SVG Path Glow Trace.
   Use at build/server render time when possible; the output is plain SVG markup. */

export function createSvgPathGlowTrail({
  motionPathId,
  gradientId,
  className = 'svg-path-glow-trace__particle',
  duration = 3.2,
  begin = 0.3,
  trail = 10,
  step = 0.055,
  headRadius = 20,
  tailRadius = 8,
  opacityPower = 1.65,
  repeatCount = '1',
  growDuration = 0,
} = {}) {
  if (!motionPathId || !gradientId) {
    throw new Error('createSvgPathGlowTrail requires motionPathId and gradientId.');
  }

  const safeTrail = Math.max(1, Math.floor(trail));
  const durationText = `${duration}s`;
  const growDurationText = `${growDuration}s`;

  return Array.from({ length: safeTrail }, (_, index) => {
    const t = safeTrail === 1 ? 0 : index / (safeTrail - 1);
    const itemBegin = (begin + index * step).toFixed(3);
    const radius = Math.round(headRadius + (tailRadius - headRadius) * t);
    const peak = Math.pow(1 - t, opacityPower).toFixed(3);
    const grow = growDuration > 0
      ? `
          <animate attributeName="r" begin="${itemBegin}s" dur="${growDurationText}"
            values="0;${radius}" keyTimes="0;1" calcMode="spline"
            keySplines="0.22 1 0.36 1" fill="freeze"/>`
      : '';

    return `<circle class="${className}" r="${radius}" fill="url(#${gradientId})" opacity="0">
          <animateMotion begin="${itemBegin}s" dur="${durationText}" repeatCount="${repeatCount}"
            calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1" fill="remove">
            <mpath href="#${motionPathId}"/>
          </animateMotion>
          <animate attributeName="opacity" begin="${itemBegin}s" dur="${durationText}"
            repeatCount="${repeatCount}" values="0;${peak};${peak};0"
            keyTimes="0;0.16;0.86;1" fill="remove"/>${grow}
        </circle>`;
  }).join('\n        ');
}
