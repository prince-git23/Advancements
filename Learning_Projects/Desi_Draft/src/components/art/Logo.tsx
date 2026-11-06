/**
 * Swappable brush-script wordmark. Replace the <text> node with converted
 * SVG glyph paths when the final logo is drawn — nothing else changes.
 */
export function Logo({
  className = '',
  color = 'currentColor',
  strokeWidth = 0,
  title = 'desi draft',
}: {
  className?: string;
  color?: string;
  strokeWidth?: number;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 120"
      className={className}
      role="img"
      aria-label={title}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <title>{title}</title>
      <text
        x="200"
        y="84"
        textAnchor="middle"
        fontFamily="Yellowtail, 'Brush Script MT', cursive"
        fontSize="78"
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
        paintOrder="stroke"
        strokeLinejoin="round"
        transform="rotate(-2 200 60)"
      >
        desi draft
      </text>
    </svg>
  );
}
