"use client";

import { useCallback, useRef, useState } from "react";

/**
 * HoverBackgroundEffect
 *
 * Wraps any children and tracks mouse movement inside the container.
 * As the cursor moves, tool icons spawn near the cursor, drift outward,
 * and fade away — replicating the floating-icon trail seen in the reference.
 *
 * Props:
 *  - children        (ReactNode)  – content to render inside the wrapper
 *  - assets          (string[])   – array of image paths from /public/tools/
 *  - iconSize        (number)     – base icon size in px          (default: 52)
 *  - spawnRate       (number)     – minimum ms between spawns     (default: 120)
 *  - lifetime        (number)     – how long each icon lives (ms) (default: 1200)
 *  - maxIcons        (number)     – maximum live icons at once    (default: 18)
 *  - className       (string)     – forwarded to the outer wrapper
 */
export default function HoverBackgroundEffect({
  children,
  assets = [],
  iconSize = 52,
  spawnRate = 120,
  lifetime = 1200,
  maxIcons = 18,
  className = "",
}) {
  const [icons, setIcons] = useState([]);
  const lastSpawnAt = useRef(0);
  const idRef = useRef(0);

  const handleMouseMove = useCallback(
    (e) => {
      const now = Date.now();

      // Limit spawn frequency
      if (now - lastSpawnAt.current < spawnRate) return;

      if (!assets || assets.length === 0) return;

      lastSpawnAt.current = now;

      const rect = e.currentTarget.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn close to cursor
      const offsetX = (Math.random() - 0.5) * iconSize * 0.6;
      const offsetY = (Math.random() - 0.5) * iconSize * 0.6;

      // Drift movement
      const driftX = (Math.random() - 0.5) * 60;
      const driftY = -40 - Math.random() * 40;

      const asset = assets[Math.floor(Math.random() * assets.length)];

      const icon = {
        id: crypto.randomUUID(),
        asset,
        x: x + offsetX,
        y: y + offsetY,
        driftX,
        driftY,
        rotation: (Math.random() - 0.5) * 30,
        scale: 0.7 + Math.random() * 0.6,
        born: now,
      };

      setIcons((prev) => {
        // Remove expired icons
        const alive = prev.filter((i) => now - i.born < lifetime);

        const next = [...alive, icon];

        // Limit max icons
        if (next.length > maxIcons) {
          return next.slice(next.length - maxIcons);
        }

        return next;
      });
    },
    [assets, iconSize, spawnRate, lifetime, maxIcons],
  );

  const handleMouseLeave = useCallback(() => {
    // Fade all out by letting their lifetimes expire naturally
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMoveCapture={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background animation layer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {icons.map((icon) => (
          <FloatingIcon
            key={icon.id}
            icon={icon}
            size={iconSize}
            lifetime={lifetime}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}

/** Individual floating icon — handles its own enter/exit animation */
function FloatingIcon({ icon, size, lifetime }) {
  const { x, y, driftX, driftY, rotation, scale, asset } = icon;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute select-none will-change-transform will-change-opacity"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        animation: `iconFloat ${lifetime}ms cubic-bezier(0.22,1,0.36,1) forwards`,
        "--drift-x": `${driftX}px`,
        "--drift-y": `${driftY}px`,
        "--rotation": `${rotation}deg`,
        "--scale": scale,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset}
        alt=""
        draggable={false}
        className="w-full h-full object-contain drop-shadow-lg"
        style={{ borderRadius: "18%" }}
      />
    </span>
  );
}
