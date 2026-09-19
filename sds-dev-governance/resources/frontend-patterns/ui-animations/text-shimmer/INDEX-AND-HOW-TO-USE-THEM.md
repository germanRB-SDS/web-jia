# Text Shimmer

## 1. What This Pattern Is

An animated horizontal gradient highlight clipped to text. A bright band travels slowly across the
glyphs, giving a premium "shimmer" on a word or phrase without moving layout. Default palette is warm
(orange); it is fully token-driven and works on any text.

## 2. When To Use It

Use it to draw attention to a single word or short phrase: a brand/partner name, a key benefit, a
badge. Best on a small amount of text over a dark or neutral surface.

## 3. When Not To Use It

Do not use it on body copy, long paragraphs, primary CTAs, error/validation text, or anywhere the
moving gradient would hurt readability. Apply it to the specific words, never the whole sentence.

## 4. Source Anchors

- Extracted from the Auragenda home: header and footer "South Desert Studio" highlight
  (`.sds-name`). Same technique, generalized here to `.text-shimmer` with tokens.

## 5. Files In This Example

- `html/text-shimmer.html`
- `css/text-shimmer.css`

## 6. Integration Steps For Another Project

1. Add the `text-shimmer` class to the span wrapping only the words to highlight.
2. Override `--shimmer-from`, `--shimmer-mid`, `--shimmer-highlight` with the project's design tokens.
3. Keep the surrounding text in its normal color; wrap only the target words.
4. Tune `--shimmer-duration` (slower reads as more elegant; 6–8s is a good range).

## 7. Accessibility Checklist

- Contrast of the gradient against the background remains legible (AA).
- Shimmer is decorative; it must not be the only way meaning is conveyed.
- If the text is a link, the gradient must not remove the affordance (keep underline or context).

## 8. Responsiveness Checklist

- Works at any font size; `background-size` is relative.
- No horizontal scroll introduced.
- On very small screens, consider hiding the effect or shortening the highlighted text.

## 9. Reduced-Motion Behavior

Under `prefers-reduced-motion: reduce` the animation stops and the gradient is parked at a static
position (still readable, no motion).

## 10. Constants/i18n/token Adaptation Notes

Use project color tokens for the gradient stops. The highlighted text itself must come from the
target project's copy/i18n layer, not be hardcoded in the pattern.

## 11. Common Failure Modes

- Forgetting `-webkit-text-fill-color: transparent` (text stays solid in WebKit/Blink).
- Applying the class to the whole sentence instead of the target words.
- Too-fast duration (looks frantic) or low contrast (illegible).

## 12. Minimal Verification Checklist

- Only the target words shimmer; the rest of the text is unaffected.
- The gradient band visibly moves across the glyphs at a calm pace.
- Reduced-motion mode is static and readable.
