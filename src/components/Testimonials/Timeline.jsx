"use client";
import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";

const AV_ACTIVE   = 60;
const AV_INACTIVE = 40;

// Use window width to determine if mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ── DESKTOP POSITIONS (Vertical Right-Bowing Semicircle) ──
// Deeper curve, expanded vertical spacing to allow 3-line text wrapping: 
// M 0 -40 Q 240 180 0 400
function getDesktopX(y) {
  const t = (y + 40) / 440;
  return 480 * t * (1 - t);
}

const DESK_POSITIONS = {
  "-2": { dist: -2, y: -40,  scale: 0.4, opacity: 0   },
  "-1": { dist: -1, y: 70,   scale: 0.7, opacity: 0.5 },
   "0": { dist:  0, y: 180,  scale: 1.0, opacity: 1.0 },
   "1": { dist:  1, y: 290,  scale: 0.7, opacity: 0.5 },
   "2": { dist:  2, y: 400,  scale: 0.4, opacity: 0   },
};
Object.values(DESK_POSITIONS).forEach(p => { p.x = getDesktopX(p.y); });

// ── MOBILE POSITIONS (Horizontal Bottom-Bowing U-Arc) ──
// Deeper curve: M -20 -40 Q 150 200 320 -40
function getMobileY(x) {
  const t = (x + 20) / 340; // normalized 0 to 1
  return 480 * t * (1 - t) - 40;
}

const MOB_POSITIONS = {
  "-2": { dist: -2, x: -80, scale: 0.4, opacity: 0   },
  "-1": { dist: -1, x: 30,  scale: 0.7, opacity: 0.5 },
   "0": { dist:  0, x: 150, scale: 1.0, opacity: 1.0 },
   "1": { dist:  1, x: 270, scale: 0.7, opacity: 0.5 },
   "2": { dist:  2, x: 380, scale: 0.4, opacity: 0   },
};
Object.values(MOB_POSITIONS).forEach(p => { p.y = getMobileY(p.x); });

const DESKTOP_OFFSET_X = 10; // Less space from the left
const MOBILE_OFFSET_Y  = 50; // Shifted heavily downwards to prevent top-curve cropping

const Timeline = memo(function Timeline({ testimonials, activeIndex, onSelect }) {
  const total = testimonials.length;
  const isMobile = useIsMobile();
  
  // Render sliding window
  const windowItems = [];
  for (let dist = -2; dist <= 2; dist++) {
    const absIndex = activeIndex + dist;
    const dataIndex = ((absIndex % total) + total) % total;
    windowItems.push({ absIndex, dataIndex, dist, item: testimonials[dataIndex] });
  }

  // Dimensions
  const width  = isMobile ? 300 : 310;
  const height = isMobile ? 220 : 360; // Expanded both to prevent text truncation

  return (
    <div 
      style={{ 
        position: "relative", 
        width: "100%", 
        maxWidth: width, 
        height, 
        marginTop: isMobile ? 0 : -40, // Match updated top bound
        margin: isMobile ? "0 auto" : undefined,
        zIndex: 10,
        overflow: "visible" // allow mobile text to show if it dips
      }}
    >
      {/* ── Background SVG Arc ── */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        style={isMobile ? { top: MOBILE_OFFSET_Y, left: 0 } : { left: DESKTOP_OFFSET_X, top: 0 }}
      >
        <path
          d={isMobile ? "M -20 -40 Q 150 200 320 -40" : "M 0 -40 Q 240 180 0 400"}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Floating Avatars ── */}
      <AnimatePresence>
        {windowItems.map((slot) => {
          const { absIndex, dist, item } = slot;
          const pos = isMobile ? MOB_POSITIONS[dist] : DESK_POSITIONS[dist];
          if (!pos) return null;

          const isActive = dist === 0;
          const avSize = isActive ? AV_ACTIVE : AV_INACTIVE;
          
          let initialX, initialY, exitX, exitY;
          if (isMobile) {
             initialX = dist > 0 ? 380 : -80;
             initialY = getMobileY(initialX);
             exitX    = dist > 0 ? -80 : 380;
             exitY    = getMobileY(exitX);
          } else {
             initialY = dist > 0 ? 400 : -40;
             initialX = getDesktopX(initialY);
             exitY    = dist > 0 ? -40 : 400;
             exitX    = getDesktopX(exitY);
          }

          const targetX = isMobile ? pos.x : pos.x + DESKTOP_OFFSET_X;
          const targetY = isMobile ? pos.y + MOBILE_OFFSET_Y : pos.y;

          return (
             <motion.div
               key={absIndex}
               initial={{ x: isMobile ? initialX : initialX + DESKTOP_OFFSET_X, y: isMobile ? initialY + MOBILE_OFFSET_Y : initialY, opacity: 0, scale: 0.4 }}
               animate={{ x: targetX, y: targetY, opacity: pos.opacity, scale: pos.scale }}
               exit={{ x: isMobile ? exitX : exitX + DESKTOP_OFFSET_X, y: isMobile ? exitY + MOBILE_OFFSET_Y : exitY, opacity: 0, scale: 0.4 }}
               transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
               style={{
                 position: "absolute",
                 top: 0,
                 left: 0,
                 zIndex: isActive ? 20 : 10,
               }}
             >
              <div style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
                <button
                  onClick={() => onSelect(absIndex)}
                  className="relative flex items-center justify-center focus:outline-none"
                  style={{ width: AV_ACTIVE, height: AV_ACTIVE, background: "transparent", border: "none", cursor: isActive ? "default" : "pointer" }}
                  aria-label={`Select review by ${item.authorName}`}
                >
                  {/* Removed Green Circular Ring per user request */}
                  
                  {/* Avatar Icon */}
                  <div className="rounded-full shadow-md overflow-hidden bg-white">
                    <Avatar
                      name={item.authorName}
                      imageUrl={item.authorImageUrl}
                      size={avSize}
                    />
                  </div>
                </button>

                <div
                  className={`absolute flex flex-col justify-center pointer-events-none transition-all duration-300
                    ${isMobile ? "top-[100%] left-1/2 -translate-x-1/2 mt-2 items-center text-center" : "left-[100%] ml-4 top-1/2 -translate-y-1/2"}
                  `}
                  style={{
                    opacity: isMobile ? (isActive ? 1 : 0) : pos.opacity,
                    width: isMobile ? 220 : 160, // allow more room for text
                  }}
                >
                  <span
                    className={`block font-semibold leading-tight line-clamp-2 break-words whitespace-normal w-full ${
                      isActive ? "text-gray-900 text-sm" : "text-gray-500 text-[11px]"
                    }`}
                  >
                    {item.authorName}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 mt-0.5 line-clamp-2 wrap-break-word whitespace-normal w-full ${isMobile ? "justify-center" : ""} ${
                      isActive ? "text-gray-500 text-xs" : "text-gray-400 text-[10px]"
                    }`}
                  >
                    <span>{item.authorTitle}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
});

export default Timeline;
