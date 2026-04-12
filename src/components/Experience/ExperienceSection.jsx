"use client";

import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring,
  useMotionValue, useMotionTemplate,
  useInView,
} from "framer-motion";
import { X, Calendar, MapPin, Zap, ChevronRight, ArrowUpRight } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE DATA
═══════════════════════════════════════════════════════════ */
const EXPERIENCES = [
  {
    id: "pragetx",
    role: "Software Development Engineer II",
    company: "PragetX Technology",
    period: "Nov 2025 – Present",
    location: "Ahmedabad, India",
    type: "Full-Time",
    narrative: "Leading Systems",
    narrativeSub: "Engineering at scale — production impact",
    color: "#a78bfa", rgb: "167,139,250",
    badge: "Current Role",
    badgeGlow: true,
    summary: "Driving full-stack engineering across multiple production client projects as SDE II, including Familiya Connect and Wah Smart Deals.",
    highlights: [
      "Architected modular frontend component systems deployed to production clients.",
      "Built and maintained Express.js microservices and REST APIs with external integrations.",
      "Implemented real-time WebSocket workflows and cloud messaging pipelines.",
      "Integrated secure payment processing and push notification systems across projects.",
    ],
    skills: ["React.js", "Node.js", "Express.js", "MongoDB", "WebSockets", "AWS"],
  },
  {
    id: "naag_dev",
    role: "Web Developer",
    company: "Naag Foundation Trust",
    period: "Nov 2024 – Present",
    location: "Remote",
    type: "Contract",
    narrative: "Scaling Systems",
    narrativeSub: "Social impact through tech",
    color: "#f472b6", rgb: "244,114,182",
    badge: "Active",
    badgeGlow: true,
    summary: "Designed and developed interactive donor transparency dashboards and scaled the NGO's platform.",
    highlights: [
      "Designed and developed interactive donor transparency dashboards using React.js and Tailwind CSS, ensuring accurate fund utilization tracking for contributors.",
      "Collaborated with backend teams to integrate Express.js REST APIs for real-time data visualization and donor activity updates.",
      "Implemented new dashboard features and enhancements, improving usability, performance, and transparency across multiple social initiatives.",
      "Optimized existing UI components, reduced bugs, and improved page responsiveness to ensure a seamless experience across devices."
    ],
    skills: ["React.js", "Tailwind CSS", "Express.js", "REST APIs"],
  },
  {
    id: "naag_trainee",
    role: "Web Developer Trainee",
    company: "Naag Foundation Trust",
    period: "Nov 2023 – Oct 2024",
    location: "Remote",
    type: "Internship",
    narrative: "Starting Point",
    narrativeSub: "Where the journey began",
    color: "#60a5fa", rgb: "96,165,250",
    badge: "Completed",
    badgeGlow: false,
    summary: "Built and optimized MERN-based applications and integrated APIs for the core NGO platform.",
    highlights: [
      "Built and optimized MERN-based applications (MongoDB, Express.js, React.js, Node.js) for NGO platform.",
      "Integrated RESTful APIs, ensuring smooth data flow and consistent UI performance across devices.",
      "Collaborated on live projects improving load times, UI consistency, and data-driven content rendering."
    ],
    skills: ["MongoDB", "Express.js", "React.js", "Node.js"],
  }
];

/* ═══════════════════════════════════════════════════════════
   3D TILT CARD  (magnetic + tilt on mouse)
═══════════════════════════════════════════════════════════ */
function TiltCard({ exp, index, onOpen }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  /* Mouse-tracking tilt */
  const rotX = useSpring(useMotionValue(0), { stiffness: 220, damping: 28 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 220, damping: 28 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(260px circle at ${glowX}% ${glowY}%, rgba(${exp.rgb},0.18), transparent 70%)`;

  const handleMouseMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const nx = (e.clientX - r.left) / r.width  - 0.5;
    const ny = (e.clientY - r.top)  / r.height - 0.5;
    rotX.set(-ny * 10);
    rotY.set( nx * 10);
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top)  / r.height) * 100);
  }, [rotX, rotY, glowX, glowY]);

  const handleMouseLeave = useCallback(() => {
    rotX.set(0); rotY.set(0);
    glowX.set(50); glowY.set(50);
  }, [rotX, rotY, glowX, glowY]);

  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 20 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
      className="relative cursor-pointer select-none"
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(exp)}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl overflow-hidden group"
      >
        {/* Glare layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 rounded-2xl"
          style={{ background: glare }}
        />

        {/* Card body */}
        <div
          className="relative rounded-2xl p-6 sm:p-7 transition-all duration-300"
          style={{
            background: "rgba(10,10,20,0.88)",
            border: `1px solid rgba(${exp.rgb},0.22)`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 0 0 1px rgba(${exp.rgb},0.06), 0 8px 32px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Top row: badge + type */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{
                color: exp.color,
                borderColor: `rgba(${exp.rgb},0.35)`,
                background: `rgba(${exp.rgb},0.1)`,
                boxShadow: exp.badgeGlow ? `0 0 12px rgba(${exp.rgb},0.3)` : "none",
              }}
            >
              {exp.badge}
            </span>
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">{exp.type}</span>
          </div>

          {/* Role & Company */}
          <h3
            className="text-lg sm:text-xl font-black text-white leading-tight mb-1 group-hover:transition-colors duration-300"
            style={{ textShadow: "0 0 20px rgba(255,255,255,0.05)" }}
          >
            {exp.role}
          </h3>
          <p className="font-bold text-sm mb-4" style={{ color: exp.color }}>{exp.company}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 mb-5">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />{exp.period}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />{exp.location}
            </span>
          </div>

          {/* Summary */}
          <p className="text-gray-400 text-[13px] leading-relaxed mb-5">{exp.summary}</p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {exp.skills.slice(0, 4).map(s => (
              <span
                key={s}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ background: `rgba(${exp.rgb},0.1)`, color: exp.color + "cc" }}
              >
                {s}
              </span>
            ))}
            {exp.skills.length > 4 && (
              <span className="text-[10px] text-gray-600 px-2 py-0.5">+{exp.skills.length - 4}</span>
            )}
          </div>

          {/* Expand hint */}
          <div
            className="flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ color: exp.color }}
          >
            <Zap className="w-3 h-3" />
            Click to explore full details
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NODE DOT (center path node)
═══════════════════════════════════════════════════════════ */
function NodeDot({ exp, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative flex items-center justify-center w-10 h-10 shrink-0 z-20 mx-auto">
      {/* Outer pulse ring */}
      {isInView && (
        <motion.div
          className="absolute w-10 h-10 rounded-full"
          style={{ border: `2px solid rgba(${exp.rgb},0.4)` }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
        />
      )}
      {/* Mid ring */}
      <motion.div
        className="absolute w-6 h-6 rounded-full"
        style={{ border: `1.5px solid rgba(${exp.rgb},0.5)` }}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ type: "spring", delay: 0.2 }}
      />
      {/* Core dot */}
      <motion.div
        className="w-3 h-3 rounded-full z-10"
        style={{
          background: exp.color,
          boxShadow: `0 0 14px 4px rgba(${exp.rgb},0.6)`,
        }}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS PATH (SVG vertical line that fills on scroll)
═══════════════════════════════════════════════════════════ */
function JourneyPath({ pathRef, scrollProgress }) {
  const pathLength = useSpring(scrollProgress, { stiffness: 60, damping: 22 });

  return (
    <svg
      ref={pathRef}
      className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none z-10"
      style={{ width: 4, height: "100%" }}
      preserveAspectRatio="none"
    >
      {/* Track */}
      <line x1="2" y1="0" x2="2" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
      {/* Filled progress */}
      <motion.line
        x1="2" y1="0" x2="2" y2="100%"
        stroke="url(#pathGrad)"
        strokeWidth="2"
        style={{ pathLength }}
        strokeDasharray="0 1"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#60a5fa" />
          <stop offset="33%"  stopColor="#a78bfa" />
          <stop offset="66%"  stopColor="#f472b6" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   NARRATIVE LABEL (appears above each card)
═══════════════════════════════════════════════════════════ */
function NarrativeLabel({ exp, isLeft }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={`mb-3 ${isLeft ? "text-right pr-1" : "text-left pl-1"}`}
    >
      <span className="text-[10px] font-black uppercase tracking-[3px]" style={{ color: exp.color }}>
        {exp.narrative}
      </span>
      <p className="text-[11px] text-gray-600 mt-0.5 font-medium">{exp.narrativeSub}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DETAIL MODAL
═══════════════════════════════════════════════════════════ */
function DetailModal({ exp, onClose }) {
  // Close on backdrop click
  const handleBackdrop = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!exp) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdrop}
    >
      <motion.div
        initial={{ scale: 0.88, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden"
        style={{
          background: "rgba(8,8,20,0.97)",
          border: `1px solid rgba(${exp.rgb},0.35)`,
          backdropFilter: "blur(40px)",
          boxShadow: `0 0 80px rgba(${exp.rgb},0.2), 0 40px 80px rgba(0,0,0,0.8)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-20 pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${exp.color}, transparent)` }}
        />

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Inner Scrollable Container */}
        <div className="overflow-y-auto w-full h-full p-8 modal-scroll">
          {/* Header */}
          <div className="mb-6 pr-12">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                style={{
                  color: exp.color,
                  borderColor: `rgba(${exp.rgb},0.35)`,
                  background: `rgba(${exp.rgb},0.12)`,
                  boxShadow: exp.badgeGlow ? `0 0 14px rgba(${exp.rgb},0.3)` : "none",
                }}
              >
                {exp.badge}
              </span>
              <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">{exp.type}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{exp.role}</h2>
            <p className="font-bold text-lg mt-1" style={{ color: exp.color }}>{exp.company}</p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 pb-6 border-b mb-6" style={{ borderColor: `rgba(${exp.rgb},0.12)` }}>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" style={{ color: exp.color }} />{exp.period}
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" style={{ color: exp.color }} />{exp.location}
            </span>
          </div>

        {/* Body */}
        <div className="space-y-6">
          {/* Narrative */}
          <div
            className="px-5 py-4 rounded-2xl"
            style={{ background: `rgba(${exp.rgb},0.07)`, border: `1px solid rgba(${exp.rgb},0.15)` }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: exp.color }}>
              {exp.narrative}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{exp.summary}</p>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-600 mb-4">Key Contributions</h4>
            <ul className="space-y-3">
              {exp.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ background: exp.color, boxShadow: `0 0 6px ${exp.color}` }}
                  />
                  <span className="text-gray-300 text-[14px] leading-relaxed">{h}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-600 mb-3">Stack Used</h4>
            <div className="flex flex-wrap gap-2">
              {exp.skills.map(s => (
                <span
                  key={s}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                  style={{
                    background: `rgba(${exp.rgb},0.1)`,
                    border: `1px solid rgba(${exp.rgb},0.2)`,
                    color: exp.color,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CURSOR SPOTLIGHT
═══════════════════════════════════════════════════════════ */
function CursorSpotlight({ sectionRef }) {
  const mouseX = useMotionValue(-600);
  const mouseY = useMotionValue(-600);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(139,92,246,0.06), transparent 80%)`;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      mouseX.set(e.clientX - r.left);
      mouseY.set(e.clientY - r.top);
    };
    const leave = () => { mouseX.set(-600); mouseY.set(-600); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [sectionRef, mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0"
      style={{ background: spotlight }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════════ */
export default function ExperienceSection() {
  const sectionRef  = useRef(null);
  const journeyRef  = useRef(null);
  const pathSvgRef  = useRef(null);
  const [activeExp, setActiveExp] = useState(null);

  /* Scroll-linked path fill */
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start 70%", "end 60%"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  /* Scroll progress bar (left of section) */
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 bg-[#040408] border-t border-white/[0.04] overflow-hidden"
    >
      <CursorSpotlight sectionRef={sectionRef} />

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px]"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px]"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      {/* Vertical Scroll Progress Bar (Left Side) */}
      <div className="absolute left-0 md:left-2 top-0 bottom-0 z-50 w-[2px] bg-white/5">
        <motion.div
          className="w-full"
          style={{ height: progressHeight, background: "linear-gradient(to bottom, #60a5fa, #a78bfa, #f472b6, #34d399)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm"
          >
            The Journey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-4"
          >
            Experience{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400">
              Path
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm"
          >
            Scroll to explore · Click any card to dive deeper
          </motion.p>
        </div>

        {/* ── Journey Grid ── */}
        <div ref={journeyRef} className="relative">

          {/* SVG path — hidden on mobile */}
          <div className="hidden md:block absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <JourneyPath pathRef={pathSvgRef} scrollProgress={smoothProgress} />
          </div>

          {/* Mobile: left border line */}
          <div className="md:hidden absolute left-5 top-0 bottom-0 w-px bg-white/5 z-0" />
          <motion.div
            className="md:hidden absolute left-5 top-0 w-px z-0 origin-top"
            style={{ height: progressHeight, background: "linear-gradient(to bottom, #60a5fa, #a78bfa, #f472b6, #34d399)" }}
          />

          <div className="space-y-16 md:space-y-20">
            {EXPERIENCES.map((exp, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={exp.id} className="relative">

                  {/* DESKTOP: 3-column grid */}
                  <div className="hidden md:grid md:grid-cols-[1fr_48px_1fr] items-center gap-4">

                    {/* Left column */}
                    <div className={isLeft ? "pr-6" : ""}>
                      {isLeft ? (
                        <>
                          <NarrativeLabel exp={exp} isLeft={true} />
                          <TiltCard exp={exp} index={index} onOpen={setActiveExp} />
                        </>
                      ) : <div />}
                    </div>

                    {/* Center node */}
                    <NodeDot exp={exp} index={index} />

                    {/* Right column */}
                    <div className={!isLeft ? "pl-6" : ""}>
                      {!isLeft ? (
                        <>
                          <NarrativeLabel exp={exp} isLeft={false} />
                          <TiltCard exp={exp} index={index} onOpen={setActiveExp} />
                        </>
                      ) : <div />}
                    </div>
                  </div>

                  {/* MOBILE: single-column with left dot */}
                  <div className="md:hidden flex items-start gap-5 pl-10">
                    {/* Mobile node dot — absolute to left border */}
                    <div className="absolute left-[14px] top-2 w-3 h-3 rounded-full shrink-0"
                      style={{ background: exp.color, boxShadow: `0 0 10px rgba(${exp.rgb},0.7)` }}
                    />
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[2px]" style={{ color: exp.color }}>
                          {exp.narrative}
                        </span>
                      </div>
                      <TiltCard exp={exp} index={index} onOpen={setActiveExp} />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ── End of path marker ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mt-20 gap-3"
        >
          <motion.div
            className="w-5 h-5 rounded-full border-2 border-violet-500/50"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <p className="text-xs text-gray-700 uppercase tracking-widest font-semibold">Journey continues…</p>
        </motion.div>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeExp && (
          <DetailModal key={activeExp.id} exp={activeExp} onClose={() => setActiveExp(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
