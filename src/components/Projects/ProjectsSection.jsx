"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useAnimationFrame } from "framer-motion";
import { ExternalLink, Github, X, Rocket, Star, Zap, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: "famNme",
    title: "Familiya Connect",
    subtitle: "famNme",
    category: "Travel & Astrology Platform",
    duration: "02/2026 – Present",
    description:
      "A comprehensive platform offering travel journey management coupled with personalized astrology prediction services based on user birth details.",
    highlights: [
      "TypeScript-based Express.js microservice architecture for modular, scalable services.",
      "Integrated third-party astrology APIs for daily/monthly horoscope generation.",
      "Firebase Cloud Messaging (FCM) for real-time push notifications and background token management.",
      "Reusable React + TypeScript UI modules with clean component boundaries.",
    ],
    techStack: ["React.js", "TypeScript", "Express.js", "Firebase", "FCM", "REST APIs"],
    link: "#",
    github: "#",
    // Position in the space map (percentage of canvas)
    x: 28,
    y: 38,
    // Planet visual config
    size: 100,
    color: "#7c3aed",
    glow: "rgba(124,58,237,0.6)",
    ringColor: "rgba(167,139,250,0.3)",
    icon: <Rocket className="w-6 h-6" />,
    orbitRadius: 38,
    orbitSpeed: 12, // seconds per orbit
    moonLabel: "FCM",
  },
  {
    id: "wahDeals",
    title: "Wah Smart Deals",
    subtitle: "Coupon Marketplace",
    category: "US Retail Deals Platform",
    duration: "11/2025 – 01/2026",
    description:
      "A community-driven marketplace enabling local US retail vendors to publish promotional offers and manage digital coupon campaigns.",
    highlights: [
      "Frontend React.js architecture built pixel-perfect from Figma designs.",
      "Python FastAPI REST APIs for dynamic deal listings and vendor onboarding.",
      "WebSockets for real-time instant coupon validation.",
      "Stripe payment gateway with webhook handling for asynchronous transactions.",
      "Production deployment pipeline on AWS EC2.",
    ],
    techStack: ["React.js", "WebSockets", "Stripe", "FastAPI", "AWS EC2", "Figma"],
    link: "#",
    github: "#",
    x: 65,
    y: 55,
    size: 86,
    color: "#0891b2",
    glow: "rgba(8,145,178,0.6)",
    ringColor: "rgba(103,232,249,0.3)",
    icon: <Globe className="w-6 h-6" />,
    orbitRadius: 32,
    orbitSpeed: 8,
    moonLabel: "Stripe",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STAR FIELD (canvas-based, lightweight)
───────────────────────────────────────────────────────────────────────────── */
function StarField({ width, height }) {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const count = Math.floor((width * height) / 3000);
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      twinkleSpeed: Math.random() * 2 + 1,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }, [width, height]);

  useAnimationFrame((t) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    starsRef.current.forEach((star) => {
      const opacity = star.opacity * (0.5 + 0.5 * Math.sin(t / 1000 * star.twinkleSpeed + star.twinkleOffset));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx.fill();
    });
  });

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ORBITING MOON
───────────────────────────────────────────────────────────────────────────── */
function OrbitingMoon({ radius, speed, label, color }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        animation: `orbit ${speed}s linear infinite`,
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: radius * 2, height: radius * 2 }}
      >
        {/* orbit path */}
        <div
          className="absolute inset-0 rounded-full border border-dashed border-white/10"
        />
        {/* moon dot */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider whitespace-nowrap"
          style={{ backgroundColor: color + "aa", color: "#fff", border: `1px solid ${color}` }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PLANET NODE
───────────────────────────────────────────────────────────────────────────── */
function PlanetNode({ project, onClick, visited, scale }) {
  const [hovered, setHovered] = useState(false);
  const sz = project.size / scale;

  return (
    <div
      className="absolute select-none"
      style={{
        left: `${project.x}%`,
        top: `${project.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: hovered ? 30 : 20,
      }}
    >
      {/* Ambient glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          scale: hovered ? [1, 1.25, 1] : [1, 1.08, 1],
          opacity: hovered ? [0.6, 0.9, 0.6] : [0.2, 0.4, 0.2],
        }}
        transition={{ repeat: Infinity, duration: hovered ? 1.2 : 2.5, ease: "easeInOut" }}
        style={{
          width: sz + 32,
          height: sz + 32,
          top: -(16),
          left: -(16),
          background: `radial-gradient(circle, ${project.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Orbit ring */}
      <OrbitingMoon
        radius={project.orbitRadius}
        speed={project.orbitSpeed}
        label={project.moonLabel}
        color={project.color}
      />

      {/* Planet Sphere */}
      <motion.button
        aria-label={`Open ${project.title}`}
        onClick={() => onClick(project)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { repeat: Infinity, duration: 3.5 + project.id.length * 0.3, ease: "easeInOut" } }}
        style={{
          width: sz,
          height: sz,
          background: `radial-gradient(circle at 35% 35%, ${project.color}cc, ${project.color}44)`,
          border: `2px solid ${project.color}66`,
          boxShadow: hovered
            ? `0 0 40px 10px ${project.glow}, inset 0 2px 10px rgba(255,255,255,0.2)`
            : `0 0 20px 4px ${project.glow}55, inset 0 2px 6px rgba(255,255,255,0.1)`,
        }}
        className="relative rounded-full flex items-center justify-center cursor-pointer transition-shadow duration-300 focus:outline-none"
      >
        {/* Specular highlight */}
        <div
          className="absolute top-[12%] left-[18%] w-[35%] h-[22%] rounded-full opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.8), transparent)" }}
        />

        {/* Visited badge */}
        {visited && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-black flex items-center justify-center z-10">
            <Star className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        )}

        <div className="text-white/90 drop-shadow-md relative z-10">
          {project.icon}
        </div>
      </motion.button>

      {/* Label tag below planet */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 mt-2 text-center whitespace-nowrap pointer-events-none"
        style={{ top: sz + 8 }}
        animate={{ opacity: hovered ? 1 : 0.55 }}
      >
        <p className="text-white text-xs font-bold tracking-wide">{project.title}</p>
        <p className="text-gray-400 text-[10px] tracking-widest uppercase">{project.subtitle}</p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT MODAL
───────────────────────────────────────────────────────────────────────────── */
function ProjectModal({ project, onClose }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  if (!project) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-[#0d0d0d] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
          style={{ boxShadow: `0 0 80px ${project.glow}` }}
        >
          {/* Close - Absolute inside modal wrapper so it floats over content */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Area - inset by padding so scrollbar looks premium */}
          <div className="overflow-y-auto w-full h-full p-8 sm:p-10 modal-scroll">

          {/* Planet preview mini */}
          <div className="flex items-center gap-5 mb-8">
            <div
              className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-xl"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${project.color}cc, ${project.color}44)`,
                boxShadow: `0 0 30px ${project.glow}`,
              }}
            >
              {project.icon}
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-0.5">{project.title}</h3>
              <p
                className="text-sm font-semibold tracking-wide"
                style={{ color: project.color }}
              >
                {project.category} · <span className="text-gray-400 font-normal">{project.duration}</span>
              </p>
            </div>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-8">{project.description}</p>

          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Key Highlights</h4>
            <ul className="space-y-3">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 items-start text-gray-300 text-sm leading-relaxed">
                  <Zap className="w-4 h-4 mt-0.5 shrink-0" style={{ color: project.color }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border text-gray-200"
                  style={{ borderColor: project.color + "44", backgroundColor: project.color + "18" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href={project.github}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              <Github className="w-4 h-4" /> View Code
            </a>
            <a
              href={project.link}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:brightness-110 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}aa)` }}
            >
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE CARDS FALLBACK
───────────────────────────────────────────────────────────────────────────── */
function MobileCards({ projects, visited, onVisit }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeModal, setActiveModal] = useState(null);

  const handleOpen = (project) => {
    onVisit(project.id);
    setActiveModal(project);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      {/* Carousel indicator + arrows */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveIdx((p) => Math.max(0, p - 1))}
          disabled={activeIdx === 0}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-gray-500 text-sm">
          {activeIdx + 1} / {projects.length}
        </span>
        <button
          onClick={() => setActiveIdx((p) => Math.min(projects.length - 1, p + 1))}
          disabled={activeIdx === projects.length - 1}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-white/10 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {projects.map((p, i) =>
          i === activeIdx ? (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="w-full max-w-sm rounded-3xl bg-white/[0.03] border border-white/10 p-7"
              style={{ boxShadow: `0 0 40px ${p.glow}40` }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-white"
                  style={{ background: `radial-gradient(circle at 35% 35%, ${p.color}cc, ${p.color}44)`, boxShadow: `0 0 20px ${p.glow}` }}
                >
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{p.title}</h3>
                  <p className="text-xs font-semibold" style={{ color: p.color }}>{p.category}</p>
                </div>
                {visited.has(p.id) && (
                  <div className="ml-auto w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-green-400 fill-green-400" />
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{p.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {p.techStack.slice(0, 4).map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-xs font-medium rounded-full border text-gray-300" style={{ borderColor: p.color + "44", backgroundColor: p.color + "18" }}>
                    {t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleOpen(p)}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm cursor-pointer transition-all hover:brightness-110"
                style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}88)` }}
              >
                Explore Mission
              </button>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {activeModal && <ProjectModal project={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN: SPACE MAP
───────────────────────────────────────────────────────────────────────────── */
export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [visited, setVisited] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Canvas dragging state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Zoom
  const [scale, setScale] = useState(1);

  const mapRef = useRef(null);
  const [mapSize, setMapSize] = useState({ width: 1200, height: 600 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      setMapSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    if (mapRef.current) ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, []);

  const handlePlanetClick = useCallback((project) => {
    setVisited((prev) => new Set([...prev, project.id]));
    setSelectedProject(project);
  }, []);

  // Mouse dragging for desktop
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const nx = e.clientX - dragStart.current.x;
    const ny = e.clientY - dragStart.current.y;
    const clamped = {
      x: Math.max(-400, Math.min(400, nx)),
      y: Math.max(-300, Math.min(300, ny)),
    };
    offsetRef.current = clamped;
    setOffset({ ...clamped });
  };

  const handleMouseUp = () => { isDragging.current = false; };

  // Scroll zoom
  const handleWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.max(0.6, Math.min(1.8, s - e.deltaY * 0.001)));
  };

  return (
    <>
      <section id="projects" className="relative bg-[#010108] overflow-hidden">
        {/* Section Header */}
        <div className="pt-24 pb-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-semibold uppercase tracking-widest mb-5 backdrop-blur-md"
          >
            Mission Control
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4"
          >
            Project{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              Universe
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-base max-w-md mx-auto"
          >
            {isMobile ? "Swipe through the missions below." : "Drag to explore · Scroll to zoom · Click a planet to land."}
          </motion.p>
        </div>

        {/* ── MOBILE FALLBACK ── */}
        {isMobile ? (
          <div className="pb-24">
            <MobileCards
              projects={PROJECTS}
              visited={visited}
              onVisit={(id) => setVisited((p) => new Set([...p, id]))}
            />
          </div>
        ) : (
          /* ── DESKTOP SPACE MAP ── */
          <div
            ref={mapRef}
            className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{ height: "75vh", minHeight: 500 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Star field canvas layer */}
            <StarField width={mapSize.width} height={mapSize.height} />

            {/* Deep nebula volumes (parallax bg, slower) */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                x: offset.x * 0.2,
                y: offset.y * 0.2,
              }}
            >
              <div className="absolute top-[20%] left-[15%] w-[500px] h-[300px] bg-violet-900/15 rounded-full blur-[100px]" />
              <div className="absolute bottom-[15%] right-[20%] w-[400px] h-[250px] bg-cyan-900/12 rounded-full blur-[80px]" />
              <div className="absolute top-[55%] left-[50%] w-[300px] h-[200px] bg-fuchsia-900/10 rounded-full blur-[80px]" />
            </motion.div>

            {/* Foreground map content (planets) — drag offset applied */}
            <motion.div
              className="absolute inset-0"
              style={{ x: offset.x, y: offset.y, scale }}
              transition={{ type: "spring", stiffness: 200, damping: 40 }}
            >
              {PROJECTS.map((project) => (
                <PlanetNode
                  key={project.id}
                  project={project}
                  onClick={handlePlanetClick}
                  visited={visited.has(project.id)}
                  scale={scale}
                />
              ))}
            </motion.div>

            {/* Zoom controls */}
            <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
              <button
                onClick={() => setScale((s) => Math.min(1.8, s + 0.15))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center text-xl font-bold hover:bg-white/10 transition-all"
              >
                +
              </button>
              <button
                onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center text-xl font-bold hover:bg-white/10 transition-all"
              >
                −
              </button>
              <button
                onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); offsetRef.current = { x: 0, y: 0 }; }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center hover:bg-white/10 transition-all text-xs font-bold"
                title="Reset"
              >
                ↺
              </button>
            </div>

            {/* Visited legend */}
            {visited.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-6 z-20 px-4 py-2 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs text-gray-400"
              >
                <Star className="w-3.5 h-3.5 text-green-400 fill-green-400" />
                {visited.size} mission{visited.size > 1 ? "s" : ""} explored
              </motion.div>
            )}
          </div>
        )}
      </section>

      {/* Global Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* orbit keyframe */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </>
  );
}
