"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useScroll,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { Terminal, Code2, MapPin, Sparkles, Zap } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

/* ─── DATA ─────────────────────────────────────────────── */
const ROLES = ["Problem Solver", "Full Stack Engineer", "System Thinker", "Backend Architect"];

const BIO_LINES = [
  "Bridging the gap between ambitious product visions",
  "and flawless technical execution.",
  "I architect real-time systems, robust APIs,",
  "and performant frontends that scale under pressure.",
];

/* ─── HOOK: Count Up ─────────────────────────────────── */
function useCountUp(target, decimals = 0, inView = false, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const duration = 1400;
      let startTime = null;
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setVal(parseFloat((eased * target).toFixed(decimals)));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, target, decimals, delay]);
  return val;
}

/* ─── COMPONENT: Animated Blob ───────────────────────── */
function AnimatedBlob({ className, style, duration = 12 }) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{
        scale: [1, 1.15, 0.95, 1.08, 1],
        x: [0, 20, -15, 10, 0],
        y: [0, -15, 20, -8, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── COMPONENT: Stat Card ───────────────────────────── */
function StatCard({ icon: Icon, iconColor, borderHoverColor, value, suffix, label, inView, delay }) {
  const count = useCountUp(parseFloat(value), value % 1 !== 0 ? 1 : 0, inView, delay);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group cursor-default"
    >
      {/* Hover glow */}
      <motion.div
        className="absolute -inset-2 rounded-2xl pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{ background: `radial-gradient(circle, ${iconColor}22, transparent 70%)` }}
      />

      <div
        className="relative flex flex-col border-l-2 pl-6 transition-all duration-500"
        style={{ borderColor: hovered ? iconColor + "88" : "#ffffff15" }}
      >
        <motion.div
          animate={hovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-3"
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </motion.div>

        <h4 className="text-3xl font-black text-white mb-1 tracking-tight tabular-nums">
          {count}{suffix}
        </h4>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</p>

        {/* Animated underline on hover */}
        <motion.div
          className="absolute bottom-0 left-6 h-px"
          style={{ background: iconColor }}
          animate={{ width: hovered ? "80%" : "0%" }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}

/* ─── COMPONENT: Image Frame ─────────────────────────── */
function CinematicImage({ isMobile }) {
  const frameRef = useRef(null);

  // 3D Tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 140, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 140, damping: 22 });
  const rotateX = useTransform(springY, [-0.5, 0.5], isMobile ? ["0deg", "0deg"] : ["7deg", "-7deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], isMobile ? ["0deg", "0deg"] : ["-7deg", "7deg"]);

  // Glare follows tilt
  const glareX = useTransform(springX, [-0.5, 0.5], ["80%", "20%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["80%", "20%"]);

  const handleMouseMove = useCallback((e) => {
    if (!frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  // Periodic light sweep
  const [sweeping, setSweeping] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setSweeping(true);
      setTimeout(() => setSweeping(false), 1300);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // Hover state for depth shadow + scale + RGB shift
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={frameRef}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative w-full aspect-[4/5] rounded-3xl cursor-crosshair"
    >
      {/* Animated gradient aura — shifts hue slowly */}
      <motion.div
        className="absolute -inset-6 rounded-3xl pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.35) 0%, rgba(8,145,178,0.15) 50%, transparent 70%)",
            "radial-gradient(ellipse at 70% 60%, rgba(8,145,178,0.35) 0%, rgba(244,114,182,0.15) 50%, transparent 70%)",
            "radial-gradient(ellipse at 40% 70%, rgba(167,139,250,0.30) 0%, rgba(52,211,153,0.12) 50%, transparent 70%)",
            "radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.35) 0%, rgba(8,145,178,0.15) 50%, transparent 70%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "blur(24px)" }}
      />

      {/* Main image container */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a10]"
        style={{ transform: "translateZ(24px)" }}
        animate={hovered ? { scale: 1.02, boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.2)" } : { scale: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
        transition={{ duration: 0.5 }}
      >
        {/* The actual photo */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/me/me.jpg')" }}
          animate={hovered ? { scale: 1.04 } : { scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Depth vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)" }}
        />

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
        />

        {/* Subtle glare following tilt */}
        {!isMobile && (
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: "60%",
              height: "60%",
              top: glareY,
              left: glareX,
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
            }}
          />
        )}

        {/* RGB chromatic glitch on hover — minimal & premium */}
        {hovered && !isMobile && (
          <>
            <motion.div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{ backgroundImage: "url('/me/me.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }}
              animate={{ x: [-3, 3, -2, 0], opacity: [0.18, 0.22, 0.15, 0.18] }}
              transition={{ duration: 0.4, repeat: 2, ease: "linear" }}
              // Red channel shift
              css={{ filter: "url(#red-shift)" }}
            />
          </>
        )}

        {/* Periodic Light Sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ skewX: "-20deg" }}
          initial={{ x: "-160%" }}
          animate={sweeping ? { x: ["−160%", "200%"] } : { x: "-160%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Floating badge — pops in 3D */}
      <motion.div
        className="absolute -bottom-5 -right-5 sm:-right-8 p-4 rounded-2xl bg-[#0d0d14] border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-3 pointer-events-none"
        style={{ transform: "translateZ(50px)" }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <p className="text-white font-bold text-xs leading-tight">Full Stack</p>
          <p className="text-gray-500 text-[10px] tracking-wider uppercase">Engineer</p>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      </motion.div>
    </motion.div>
  );
}

/* ─── MAIN SECTION ────────────────────────────────────── */
export default function AboutSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Parallax scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const blobY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%","0%"] : ["-6%", "6%"]);
  const textY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%","0%"] : ["4%", "-4%"]);

  // Cursor spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(124,58,237,0.07), transparent 80%)`;

  const handleSectionMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  }, [mouseX, mouseY]);

  // Text in view
  const textInView = useInView(textRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  // Role cycling
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 3200);
    return () => clearInterval(id);
  }, []);

  // Stagger variants
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
  };
  const lineVariants = {
    hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
    show: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 110, damping: 22 },
    },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 bg-[#020205] overflow-hidden"
      onMouseMove={isMobile ? undefined : handleSectionMouseMove}
    >
      {/* ── Cursor Spotlight ── */}
      {!isMobile && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: spotlight }}
        />
      )}

      {/* ── Parallax Background Blobs ── */}
      <motion.div style={{ y: blobY }} className="absolute inset-0 z-0 pointer-events-none">
        <AnimatedBlob
          duration={14}
          className="absolute top-[5%] left-[5%] w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
        />
        <AnimatedBlob
          duration={18}
          className="absolute bottom-[5%] right-[5%] w-[420px] h-[420px] rounded-full blur-[110px]"
          style={{ background: "radial-gradient(circle, rgba(8,145,178,0.14) 0%, transparent 70%)" }}
        />
        <AnimatedBlob
          duration={10}
          className="absolute top-[40%] left-[45%] w-[300px] h-[300px] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)" }}
        />
      </motion.div>

      {/* ── Subtle Grid ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-24 items-center">

          {/* ── LEFT: Cinematic Image ── */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.92, x: -40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full lg:w-5/12 flex-shrink-0"
            style={{ perspective: "1000px", y: imageY }}
          >
            <CinematicImage isMobile={isMobile} />
          </motion.div>

          {/* ── RIGHT: Text ── */}
          <motion.div
            ref={textRef}
            style={{ y: textY }}
            variants={containerVariants}
            initial="hidden"
            animate={textInView ? "show" : "hidden"}
            className="w-full lg:w-7/12 flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div
              variants={lineVariants}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-gray-400 text-xs font-semibold uppercase tracking-[0.18em] mb-8 w-max backdrop-blur-sm"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
              </span>
              Identity Reveal
            </motion.div>

            {/* Name */}
            <motion.div variants={lineVariants}>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none mb-1">
                Nitin Khare
              </h2>
              {/* Animated underline expands on load */}
              <motion.div
                className="h-[3px] rounded-full mt-3 mb-8 origin-left"
                style={{ background: "linear-gradient(to right, #7c3aed, #22d3ee, transparent)" }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={textInView ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
              />
            </motion.div>

            {/* Role cycling */}
            <motion.div variants={lineVariants} className="flex items-center gap-3 mb-8 h-10 overflow-hidden">
              <span className="text-xl sm:text-2xl font-light text-gray-500 whitespace-nowrap flex-shrink-0">
                I am a
              </span>
              <div className="relative h-10 overflow-hidden flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIdx}
                    initial={{ y: 36, opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -36, opacity: 0, filter: "blur(6px)" }}
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="absolute inset-0 flex items-center text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 whitespace-nowrap"
                  >
                    {ROLES[roleIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={lineVariants}
              className="w-10 h-px bg-white/20 mb-8"
            />

            {/* Bio lines — each line staggered */}
            <div className="mb-8 space-y-1">
              {BIO_LINES.map((line, i) => (
                <motion.p
                  key={i}
                  variants={lineVariants}
                  className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed"
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Location */}
            <motion.div variants={lineVariants} className="flex items-center gap-2.5 text-gray-500 mb-12">
              <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span className="text-sm tracking-wide">Based in India · Available Globally</span>
            </motion.div>

            {/* Stats */}
            <motion.div
              ref={statsRef}
              variants={lineVariants}
              className="grid grid-cols-2 gap-8 max-w-sm"
            >
              <StatCard
                icon={Terminal}
                iconColor="#a78bfa"
                value={2.6}
                suffix="+"
                label="Years Exp"
                inView={statsInView}
                delay={0}
              />
              <StatCard
                icon={Zap}
                iconColor="#22d3ee"
                value={100}
                suffix="%"
                label="Commitment"
                inView={statsInView}
                delay={200}
              />
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Light sweep keyframe */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes about-sweep {
          0%   { transform: translateX(-160%) skewX(-20deg); }
          100% { transform: translateX(220%)  skewX(-20deg); }
        }
      `}} />
    </section>
  );
}
