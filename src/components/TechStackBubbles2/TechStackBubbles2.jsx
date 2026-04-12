"use client";

import { useEffect, useRef } from "react";
import Bubble from "./Bubble2";
import "./bubbles2.css";

// ─── Tool Configuration ──────────────────────────────────────────────────────
const TOOLS = [
  { name: "React",      devicon: "react/react-original",                              color: "#61DAFB", size: 96  },
  { name: "Docker",     devicon: "docker/docker-original",                            color: "#2496ED", size: 88  },
  { name: "MongoDB",    devicon: "mongodb/mongodb-original",                          color: "#47A248", size: 92  },
  { name: "PostgreSQL", devicon: "postgresql/postgresql-original",                    color: "#336791", size: 84  },
  { name: "AWS",        devicon: "amazonwebservices/amazonwebservices-plain-wordmark", color: "#FF9900", size: 100 },
  { name: "Azure",      devicon: "azure/azure-original",                              color: "#0089D6", size: 90  },
  { name: "GCP",        devicon: "googlecloud/googlecloud-original",                  color: "#4285F4", size: 86  },
  { name: "Python",     devicon: "python/python-original",                            color: "#FFD43B", size: 94  },
  { name: "GitHub",     devicon: "github/github-original",                            color: "#ffffff", size: 84, invertIcon: true },
  { name: "VS Code",    devicon: "vscode/vscode-original",                            color: "#007ACC", size: 90  },
  { name: "Slack",      devicon: "slack/slack-original",                              color: "#E01E5A", size: 82  },
  { name: "Jira",       devicon: "jira/jira-original",                                color: "#0052CC", size: 86  },
  { name: "Postman",    devicon: "postman/postman-original",                          color: "#FF6C37", size: 88  },
  { name: "LangChain",  devicon: null, initials: "LC",  color: "#1DB954",            size: 90 },
  { name: "OpenAI",     devicon: null, initials: "OAI", color: "#10A37F",            size: 94 },
  { name: "Gemini",     devicon: null, initials: "GEM", color: "#8E75B2",            size: 88 },
];

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";

// ─── Collision gap between bubble edges (px) ─────────────────────────────────
const BUBBLE_GAP = 6;

// ─────────────────────────────────────────────────────────────────────────────
// Place bubbles one-by-one, retrying each until it doesn't overlap any already-
// placed bubble. Falls back to best non-overlapping spot after maxAttempts.
// ─────────────────────────────────────────────────────────────────────────────
function placeNoOverlap(tool, placed, w, h, maxAttempts = 300) {
  const r = tool.size / 2;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Random center
    const cx = r + Math.random() * Math.max(0, w - tool.size);
    const cy = r + Math.random() * Math.max(0, h - tool.size);

    let ok = true;
    for (const other of placed) {
      const or  = other.sz / 2;
      const ocx = other.x + or;
      const ocy = other.y + or;
      const dx  = cx - ocx;
      const dy  = cy - ocy;
      if (Math.sqrt(dx * dx + dy * dy) < r + or + BUBBLE_GAP) {
        ok = false;
        break;
      }
    }

    if (ok) return { x: cx - r, y: cy - r }; // top-left origin
  }

  // Fallback: just return a random position (rare, only when container is tiny)
  return {
    x: Math.random() * Math.max(0, w - tool.size),
    y: Math.random() * Math.max(0, h - tool.size),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Resolve circle-circle collisions for every pair (i, j) where i < j.
//
// Algorithm:
//  1. Compute distance between centres.
//  2. If dist < ra + rb + GAP → circles overlap.
//  3. Push both apart along the collision normal so they just touch.
//  4. Exchange velocity components along the normal (equal-mass elastic).
//  5. If one bubble is being dragged the other bounces off it like a wall.
// ─────────────────────────────────────────────────────────────────────────────
function resolveCollisions(physics) {
  const n = physics.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = physics[i];
      const b = physics[j];

      const ra = a.sz / 2;
      const rb = b.sz / 2;

      // Centres
      const ax = a.x + ra;
      const ay = a.y + ra;
      const bx = b.x + rb;
      const by = b.y + rb;

      const dx   = bx - ax;
      const dy   = by - ay;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001; // avoid ÷0
      const minD = ra + rb + BUBBLE_GAP;

      if (dist >= minD) continue; // no collision

      // ── Collision normal (unit vector from a → b) ──────────────────────
      const nx = dx / dist;
      const ny = dy / dist;

      // ── Positional correction: push circles apart so they don't overlap ─
      const overlap = (minD - dist) * 0.5;

      if (a.drag && !b.drag) {
        // Only move b (a is being held by the user)
        b.x += nx * overlap * 2;
        b.y += ny * overlap * 2;
      } else if (b.drag && !a.drag) {
        // Only move a
        a.x -= nx * overlap * 2;
        a.y -= ny * overlap * 2;
      } else {
        // Move both equally
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;
      }

      // ── Velocity resolution ────────────────────────────────────────────
      if (!a.drag && !b.drag) {
        // Relative velocity projected onto collision normal
        const dvx = b.vx - a.vx;
        const dvy = b.vy - a.vy;
        const dot = dvx * nx + dvy * ny;

        // Only resolve if the circles are approaching each other
        if (dot < 0) {
          // Equal-mass elastic: exchange normal-component of velocity
          a.vx += dot * nx;
          a.vy += dot * ny;
          b.vx -= dot * nx;
          b.vy -= dot * ny;
        }
      } else if (a.drag && !b.drag) {
        // Treat a as a moving wall: reflect b off the normal
        const dot = b.vx * nx + b.vy * ny;
        if (dot < 0) {
          b.vx -= 2 * dot * nx;
          b.vy -= 2 * dot * ny;
        }
      } else if (b.drag && !a.drag) {
        // Treat b as a moving wall: reflect a
        const dot = a.vx * nx + a.vy * ny;
        if (dot > 0) {
          a.vx -= 2 * dot * nx;
          a.vy -= 2 * dot * ny;
        }
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TechStackBubbles() {
  const containerRef = useRef(null);
  const domRefs      = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const physics   = [];
    let dragState   = null;
    let rafId       = null;

    const getSize = () => {
      const r = container.getBoundingClientRect();
      return { w: r.width, h: r.height };
    };

    // ── Init: place bubbles without overlapping each other ────────────────
    const init = () => {
      const { w, h } = getSize();
      const placed   = [];

      TOOLS.forEach((t, i) => {
        const { x, y } = placeNoOverlap(t, placed, w, h);
        const p = {
          x,
          y,
          vx:   (Math.random() < 0.5 ? 1 : -1) * (0.5 + Math.random() * 1.0),
          vy:   (Math.random() < 0.5 ? 1 : -1) * (0.5 + Math.random() * 1.0),
          sz:   t.size,
          drag: false,
        };
        physics[i] = p;
        placed.push(p);

        const d = domRefs.current[i];
        if (d) d.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
    };

    // ── Animation tick ────────────────────────────────────────────────────
    const tick = () => {
      const { w, h } = getSize();
      const MAX = 3;

      // 1. Move all free bubbles + wall bounce
      physics.forEach((p) => {
        if (p.drag) return;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0)             { p.x = 0;        p.vx =  Math.abs(p.vx); }
        else if (p.x >= w - p.sz) { p.x = w - p.sz; p.vx = -Math.abs(p.vx); }
        if (p.y <= 0)             { p.y = 0;        p.vy =  Math.abs(p.vy); }
        else if (p.y >= h - p.sz) { p.y = h - p.sz; p.vy = -Math.abs(p.vy); }

        p.vx = Math.max(-MAX, Math.min(MAX, p.vx));
        p.vy = Math.max(-MAX, Math.min(MAX, p.vy));
      });

      // 2. Resolve bubble-bubble collisions (runs every frame)
      resolveCollisions(physics);

      // 3. Clamp again after collision push (safety pass)
      physics.forEach((p) => {
        if (p.drag) return;
        p.vx = Math.max(-MAX, Math.min(MAX, p.vx));
        p.vy = Math.max(-MAX, Math.min(MAX, p.vy));
      });

      // 4. Write positions to DOM
      physics.forEach((p, i) => {
        const d = domRefs.current[i];
        if (d) d.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
      });

      rafId = requestAnimationFrame(tick);
    };

    // ── Pointer down ──────────────────────────────────────────────────────
    const handlePointerDown = (e, index) => {
      e.preventDefault();
      e.stopPropagation();
      const p = physics[index];
      if (!p) return;

      const rect = container.getBoundingClientRect();
      dragState = {
        index,
        ox: e.clientX - rect.left - p.x,
        oy: e.clientY - rect.top  - p.y,
        vx: 0,
        vy: 0,
      };
      p.drag = true;

      domRefs.current.forEach((d, j) => {
        if (d) d.style.zIndex = j === index ? "30" : "10";
      });
    };

    // ── Pointer move ──────────────────────────────────────────────────────
    const handlePointerMove = (e) => {
      if (!dragState) return;
      const p = physics[dragState.index];
      if (!p) return;

      const rect     = container.getBoundingClientRect();
      const { w, h } = getSize();
      const nx = Math.max(0, Math.min(e.clientX - rect.left - dragState.ox, w - p.sz));
      const ny = Math.max(0, Math.min(e.clientY - rect.top  - dragState.oy, h - p.sz));

      dragState.vx = nx - p.x;
      dragState.vy = ny - p.y;
      p.x = nx;
      p.y = ny;

      const d = domRefs.current[dragState.index];
      if (d) d.style.transform = `translate3d(${nx}px,${ny}px,0)`;
    };

    // ── Pointer up ────────────────────────────────────────────────────────
    const handlePointerUp = () => {
      if (!dragState) return;
      const p = physics[dragState.index];
      if (p) {
        p.drag = false;
        const clamp = (v, m) => Math.max(-m, Math.min(m, v));
        p.vx = clamp(dragState.vx, 3) || (Math.random() - 0.5) * 1.5;
        p.vy = clamp(dragState.vy, 3) || (Math.random() - 0.5) * 1.5;
      }
      dragState = null;
    };

    // ── Attach per-bubble listeners ────────────────────────────────────────
    const cleanups = domRefs.current.map((d, i) => {
      if (!d) return null;
      const handler = (e) => handlePointerDown(e, i);
      d.addEventListener("pointerdown", handler);
      return () => d.removeEventListener("pointerdown", handler);
    });

    window.addEventListener("pointermove",   handlePointerMove);
    window.addEventListener("pointerup",     handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    const timer = setTimeout(() => {
      init();
      rafId = requestAnimationFrame(tick);
    }, 80);

    return () => {
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove",   handlePointerMove);
      window.removeEventListener("pointerup",     handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      cleanups.forEach((fn) => fn?.());
    };
  }, []);

  return (
    <section className="tsb-section">
      <div className="tsb-nebula tsb-nebula--purple" />
      <div className="tsb-nebula tsb-nebula--blue"   />
      <div className="tsb-nebula tsb-nebula--cyan"    />

      <div className="tsb-header">
        <h2 className="tsb-title">
          Tools &amp; Software <em>We Use</em>
        </h2>
        <p className="tsb-subtitle">Our Technology Stack</p>
        <p className="tsb-hint">✦ drag the bubbles ✦</p>
      </div>

      <div ref={containerRef} className="tsb-container">
        {TOOLS.map((tool, i) => (
          <Bubble
            key={tool.name}
            ref={(el) => { domRefs.current[i] = el; }}
            tool={tool}
            deviconBase={DEVICON_BASE}
          />
        ))}
      </div>
    </section>
  );
}