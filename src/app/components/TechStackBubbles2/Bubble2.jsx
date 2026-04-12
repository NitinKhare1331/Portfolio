import { forwardRef, useState } from "react";

/**
 * Bubble — renders a single crystal-glass technology bubble.
 *
 * Props:
 *  tool         — { name, devicon, color, size, invertIcon?, initials? }
 *  deviconBase  — CDN base URL string
 *  onPointerDown — (PointerEvent) => void
 */
const Bubble = forwardRef(function Bubble({ tool, deviconBase, onPointerDown }, ref) {
  const { name, devicon, color, size, invertIcon, initials } = tool;
  const [iconFailed, setIconFailed] = useState(false);

  const iconSize  = Math.round(size * 0.44);
  const initSize  = Math.round(size * 0.20);
  const nameSize  = Math.round(size * 0.115);

  const innerShadow = [
    "0 8px 32px rgba(0,0,0,.55)",
    "inset 0 1.5px 0 rgba(255,255,255,.48)",
    "inset 0 -1px 0 rgba(0,0,0,.28)",
    `0 0 18px ${color}38`,
    `0 0 36px ${color}18`,
  ].join(", ");

  return (
    <div
      ref={ref}
      className="tsb-bubble"
      style={{ width: size, height: size }}
      onPointerDown={onPointerDown}
      title={name}
      aria-label={name}
      role="img"
    >
      {/* Outer decorative rings */}
      <div className="tsb-ring tsb-ring--1" />
      <div className="tsb-ring tsb-ring--2" />

      {/* Crystal sphere body */}
      <div className="tsb-inner" style={{ boxShadow: innerShadow }}>

        {/* Icon / fallback initials */}
        {devicon && !iconFailed ? (
          <img
            className={`tsb-icon${invertIcon ? " tsb-icon--invert" : ""}`}
            src={`${deviconBase}/${devicon}.svg`}
            alt={name}
            width={iconSize}
            height={iconSize}
            draggable={false}
            onError={() => setIconFailed(true)}
          />
        ) : (
          <span
            className="tsb-initials"
            style={{
              color,
              fontSize: initSize,
              textShadow: `0 0 16px ${color}90`,
            }}
          >
            {initials ?? name.slice(0, 2).toUpperCase()}
          </span>
        )}

        {/* Label */}
        <span className="tsb-label" style={{ fontSize: nameSize }}>
          {name}
        </span>

        {/* Highlight reflection (rendered via CSS ::before / ::after on .tsb-inner) */}
      </div>
    </div>
  );
});

export default Bubble;