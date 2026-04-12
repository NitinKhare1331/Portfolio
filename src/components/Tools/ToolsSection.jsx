"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { X, Star, Lock, Zap, ChevronDown, ChevronUp } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & DATA
═══════════════════════════════════════════════════════════ */

// Virtual canvas dimensions (all positions defined in this space)
const VW = 1560;
const VH = 780;
const NR = 34; // node radius px (in virtual coords)

const CATEGORIES = {
  root:     { color: "#a78bfa", glow: "rgba(167,139,250,0.8)", bg: "#1e1230" },
  frontend: { color: "#818cf8", glow: "rgba(129,140,248,0.7)", bg: "#0f1130" },
  backend:  { color: "#34d399", glow: "rgba(52,211,153,0.7)",  bg: "#0a2318" },
  database: { color: "#fb923c", glow: "rgba(251,146,60,0.7)",  bg: "#251507" },
  cloud:    { color: "#22d3ee", glow: "rgba(34,211,238,0.7)",  bg: "#031a25" },
  security: { color: "#f472b6", glow: "rgba(244,114,182,0.7)", bg: "#230a18" },
};

const NODES = [
  /* ROOT */
  { id:"root",         label:"Full Stack",   sub:"Engineer",        x:780,  y:60,  cat:"root",     parent:null,       level:10, always:true,
    desc:"Core identity as a Full Stack Software Engineer with 2.6+ years building production systems across the entire stack." },

  /* CATEGORY HUBS */
  { id:"frontend",     label:"Frontend",     sub:"Hub",             x:180,  y:210, cat:"frontend",  parent:"root",     level:9,
    desc:"Crafting responsive, performant, and beautiful user interfaces with modern JavaScript frameworks." },
  { id:"backend",      label:"Backend",      sub:"Hub",             x:500,  y:210, cat:"backend",   parent:"root",     level:9,
    desc:"Architecting scalable server-side systems, APIs, and microservice ecosystems." },
  { id:"database",     label:"Database",     sub:"Hub",             x:780,  y:210, cat:"database",  parent:"root",     level:8,
    desc:"Designing and managing relational and NoSQL data stores for production systems." },
  { id:"cloud",        label:"Cloud",        sub:"& DevOps",        x:1080, y:210, cat:"cloud",     parent:"root",     level:7,
    desc:"Deploying, scaling, and monitoring applications on cloud infrastructure." },
  { id:"security",     label:"Security",     sub:"& Integrations",  x:1380, y:210, cat:"security",  parent:"root",     level:7,
    desc:"Implementing secure auth flows and integrating mission-critical third-party services." },

  /* FRONTEND BRANCH */
  { id:"js",           label:"JavaScript",  sub:"ES6+",             x:60,   y:380, cat:"frontend",  parent:"frontend", level:9,
    desc:"Deep expertise in ES6+ patterns: closures, async/await, event loops and module systems." },
  { id:"ts",           label:"TypeScript",  sub:"Types",            x:60,   y:530, cat:"frontend",  parent:"js",       level:8,
    desc:"Strong typing, generics, discriminated unions, and type-safe architecture design." },
  { id:"react",        label:"React.js",    sub:"v18+",             x:220,  y:380, cat:"frontend",  parent:"frontend", level:9,
    desc:"Hooks, context, memoization, concurrent features, and custom component systems." },
  { id:"nextjs",       label:"Next.js",     sub:"App Router",       x:200,  y:530, cat:"frontend",  parent:"react",    level:8,
    desc:"SSR, SSG, ISR, API routes, edge runtime and full-stack Next.js architecture." },
  { id:"tailwind",     label:"Tailwind",    sub:"CSS",              x:140,  y:670, cat:"frontend",  parent:"react",    level:8,
    desc:"Utility-first styling, custom design systems, animations and responsive layouts." },

  /* BACKEND BRANCH */
  { id:"nodejs",       label:"Node.js",     sub:"Runtime",          x:420,  y:380, cat:"backend",   parent:"backend",  level:9,
    desc:"Event-driven architecture, streams, child processes, and performance optimization." },
  { id:"express",      label:"Express.js",  sub:"Framework",        x:420,  y:530, cat:"backend",   parent:"nodejs",   level:9,
    desc:"REST API design, middleware composition, routing, and error handling patterns." },
  { id:"microservices",label:"Microservices",sub:"Architecture",    x:360,  y:670, cat:"backend",   parent:"express",  level:7,
    desc:"TypeScript-based service decomposition with clear boundaries and inter-service communication." },
  { id:"websockets",   label:"WebSockets",  sub:"Real-time",        x:570,  y:380, cat:"backend",   parent:"backend",  level:8,
    desc:"Bidirectional real-time communication using Socket.io for live features." },
  { id:"python",       label:"Python",      sub:"Language",         x:620,  y:530, cat:"backend",   parent:"backend",  level:7,
    desc:"Scripting, data manipulation, and backend service development." },
  { id:"fastapi",      label:"FastAPI",     sub:"Python",           x:560,  y:670, cat:"backend",   parent:"python",   level:7,
    desc:"High-performance async Python APIs with auto-generated OpenAPI documentation." },

  /* DATABASE BRANCH */
  { id:"mongodb",      label:"MongoDB",     sub:"NoSQL",            x:700,  y:380, cat:"database",  parent:"database", level:9,
    desc:"Schema design, aggregation pipelines, indexing strategies, and Mongoose ODM." },
  { id:"postgresql",   label:"PostgreSQL",  sub:"Relational",       x:870,  y:380, cat:"database",  parent:"database", level:8,
    desc:"Complex queries, joins, transactions, constraints, and relational data modeling." },
  { id:"firebase",     label:"Firebase",    sub:"BaaS",             x:785,  y:530, cat:"database",  parent:"database", level:7,
    desc:"Firestore, Auth, Cloud Storage, Realtime Database, and FCM push notifications." },

  /* CLOUD BRANCH */
  { id:"git",          label:"Git",         sub:"& GitHub",         x:1000, y:380, cat:"cloud",     parent:"cloud",    level:9,
    desc:"Branch strategies, PR reviews, CI/CD hooks, and collaborative version control." },
  { id:"aws_s3",       label:"AWS S3",      sub:"Storage",          x:1110, y:380, cat:"cloud",     parent:"cloud",    level:7,
    desc:"Object storage, presigned URLs, CORS policies, and CDN-backed file delivery." },
  { id:"aws_ec2",      label:"AWS EC2",     sub:"Compute",          x:1110, y:530, cat:"cloud",     parent:"aws_s3",   level:6,
    desc:"Server provisioning, security groups, SSH access, and production deployments." },
  { id:"vercel",       label:"Vercel",      sub:"Edge Deploy",      x:1220, y:380, cat:"cloud",     parent:"cloud",    level:8,
    desc:"Edge deployments, serverless functions, domain config, and Next.js hosting." },
  { id:"postman",      label:"Postman",     sub:"API Testing",      x:1160, y:670, cat:"cloud",     parent:"git",      level:8,
    desc:"Collection management, environment variables, and automated test suite workflows." },

  /* SECURITY BRANCH */
  { id:"jwt",          label:"JWT Auth",    sub:"Tokens",           x:1320, y:380, cat:"security",  parent:"security", level:8,
    desc:"Token-based auth flows, refresh tokens, role-based access, and session security." },
  { id:"stripe",       label:"Stripe",      sub:"Payments",         x:1460, y:380, cat:"security",  parent:"security", level:7,
    desc:"Payment intents, webhook validation, subscriptions, and async transaction handling." },
  { id:"keycloak",     label:"KeyCloak",    sub:"IAM",              x:1320, y:530, cat:"security",  parent:"jwt",      level:6,
    desc:"Enterprise SSO, OAuth2/OIDC flows, and centralized identity management." },
  { id:"fcm",          label:"FCM",         sub:"Push Notify",      x:1460, y:530, cat:"security",  parent:"stripe",   level:7,
    desc:"Firebase Cloud Messaging for iOS/Android/Web real-time push notification delivery." },
];

// Auto-build edge list from parent references
const EDGES = NODES.filter(n => n.parent).map(n => ({ from: n.parent, to: n.id }));

// Index for quick lookup
const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]));

/* ═══════════════════════════════════════════════════════════
   LEVEL BAR
═══════════════════════════════════════════════════════════ */
function LevelBar({ level, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 uppercase tracking-wider w-12">Lv {level}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(level / 10) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{level * 10}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SVG CONNECTOR
   Draws a smooth cubic-bezier between two nodes.
═══════════════════════════════════════════════════════════ */
function Connector({ fromId, toId, unlocked, active }) {
  const from = NODE_MAP[fromId];
  const to   = NODE_MAP[toId];
  if (!from || !to) return null;

  const x1 = from.x, y1 = from.y;
  const x2 = to.x,   y2 = to.y;

  // Control points: curve midway vertically
  const midY = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

  const strokeColor = active
    ? CATEGORIES[to.cat]?.color || "#fff"
    : unlocked
      ? "#ffffff20"
      : "#ffffff08";

  const strokeWidth = active ? 2.5 : 1.5;

  return (
    <g>
      {/* Base line */}
      <path d={d} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Animated energy pulse when active */}
      {active && (
        <path
          d={d}
          fill="none"
          stroke={CATEGORIES[to.cat]?.color || "#fff"}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="12 80"
          opacity={0.7}
        >
          <animate attributeName="stroke-dashoffset" from="200" to="0" dur="1.5s" repeatCount="indefinite" />
        </path>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKILL NODE
═══════════════════════════════════════════════════════════ */
function SkillNode({ node, unlocked, canUnlock, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORIES[node.cat] || CATEGORIES.root;

  const isRoot = node.cat === "root";
  const isHub  = ["frontend","backend","database","cloud","security"].includes(node.id);

  // Size variants
  const radius = isRoot ? NR + 10 : isHub ? NR + 4 : NR;
  const fontSize = isRoot ? 11 : isHub ? 10 : 9;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      style={{ cursor: canUnlock ? "pointer" : unlocked ? "pointer" : "default" }}
      onClick={() => onClick(node)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer pulsing aura */}
      {active && (
        <circle r={radius + 14} fill="none" stroke={cat.color} strokeWidth="1" opacity="0.35">
          <animate attributeName="r" values={`${radius + 8};${radius + 18};${radius + 8}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Hover ring */}
      {hovered && (
        <circle r={radius + 8} fill="none" stroke={cat.color} strokeWidth="1.5" opacity="0.5" />
      )}

      {/* Node body */}
      <circle
        r={radius}
        fill={unlocked ? cat.bg : "#0a0a0a"}
        stroke={unlocked ? cat.color : "#ffffff15"}
        strokeWidth={active ? 2.5 : 1.5}
        opacity={unlocked ? 1 : 0.45}
        filter={active ? `drop-shadow(0 0 12px ${cat.color})` : undefined}
      />

      {/* Inner shimmer for unlocked */}
      {unlocked && (
        <circle r={radius * 0.6} fill={cat.color} opacity={active ? 0.2 : 0.08} />
      )}

      {/* Lock icon for locked & not-hovered */}
      {!unlocked && !hovered && (
        <text textAnchor="middle" dominantBaseline="central" fontSize={14} fill="#ffffff30">🔒</text>
      )}

      {/* Label */}
      {(unlocked || hovered) && (
        <>
          <text
            textAnchor="middle"
            dominantBaseline="central"
            dy={node.sub ? -7 : 0}
            fontSize={fontSize + 1}
            fontWeight="700"
            fill={unlocked ? cat.color : "#ffffff60"}
            style={{ pointerEvents: "none", fontFamily: "system-ui, sans-serif" }}
          >
            {node.label}
          </text>
          {node.sub && (
            <text
              textAnchor="middle"
              dominantBaseline="central"
              dy={8}
              fontSize={fontSize - 1}
              fill={unlocked ? cat.color + "aa" : "#ffffff35"}
              style={{ pointerEvents: "none", fontFamily: "system-ui, sans-serif" }}
            >
              {node.sub}
            </text>
          )}
        </>
      )}

      {/* Unlock affordance on hover when can unlock */}
      {canUnlock && !unlocked && hovered && (
        <>
          <circle r={radius} fill={cat.color} opacity={0.15} />
          <text textAnchor="middle" dominantBaseline="central" fontSize={10} fill={cat.color} fontWeight="bold" style={{ pointerEvents: "none" }}>
            UNLOCK
          </text>
        </>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════
   DETAIL PANEL
═══════════════════════════════════════════════════════════ */
function DetailPanel({ node, onClose }) {
  if (!node) return null;
  const cat = CATEGORIES[node.cat] || CATEGORIES.root;

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="absolute top-4 right-4 w-72 rounded-2xl bg-[#0d0d12] border backdrop-blur-xl z-30 shadow-2xl overflow-hidden"
        style={{ borderColor: cat.color + "40", boxShadow: `0 0 30px ${cat.glow}40` }}
      >
        {/* Color accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${cat.color}, transparent)` }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-white font-black text-xl mb-0.5">{node.label}</h3>
              {node.sub && <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: cat.color }}>{node.sub}</p>}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-6">{node.desc}</p>

          <LevelBar level={node.level} color={cat.color} />

          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-sm"
                  style={{ background: i < node.level ? cat.color + "cc" : "#ffffff08" }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">Proficiency Rating</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════
   MOBILE ACCORDION
═══════════════════════════════════════════════════════════ */
const MOBILE_GROUPS = [
  {
    name: "Frontend",
    cat: "frontend",
    skills: [
      { label: "JavaScript (ES6+)", level: 9 },
      { label: "TypeScript",         level: 8 },
      { label: "React.js",           level: 9 },
      { label: "Next.js",            level: 8 },
      { label: "Tailwind CSS",       level: 8 },
    ],
  },
  {
    name: "Backend",
    cat: "backend",
    skills: [
      { label: "Node.js",            level: 9 },
      { label: "Express.js",         level: 9 },
      { label: "REST APIs",          level: 9 },
      { label: "Microservices",      level: 7 },
      { label: "WebSockets",         level: 8 },
      { label: "Python / FastAPI",   level: 7 },
    ],
  },
  {
    name: "Database",
    cat: "database",
    skills: [
      { label: "MongoDB",            level: 9 },
      { label: "PostgreSQL",         level: 8 },
      { label: "Firebase",           level: 7 },
    ],
  },
  {
    name: "Cloud & DevOps",
    cat: "cloud",
    skills: [
      { label: "Git & GitHub",       level: 9 },
      { label: "AWS S3",             level: 7 },
      { label: "AWS EC2",            level: 6 },
      { label: "Vercel",             level: 8 },
      { label: "Postman",            level: 8 },
    ],
  },
  {
    name: "Security & Auth",
    cat: "security",
    skills: [
      { label: "JWT Auth",           level: 8 },
      { label: "Stripe API",         level: 7 },
      { label: "KeyCloak / IAM",     level: 6 },
      { label: "Firebase FCM",       level: 7 },
    ],
  },
];

function MobileAccordion() {
  const [open, setOpen] = useState("frontend");

  return (
    <div className="space-y-3">
      {MOBILE_GROUPS.map((group) => {
        const cat = CATEGORIES[group.cat];
        const isOpen = open === group.cat;
        return (
          <div
            key={group.cat}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: isOpen ? cat.color + "50" : "#ffffff10", background: "#0a0a0c" }}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : group.cat)}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
                <span className="font-bold text-white text-lg">{group.name}</span>
                <span className="text-xs text-gray-500">{group.skills.length} skills</span>
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">
                    {group.skills.map((skill) => (
                      <div key={skill.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-200 text-sm font-medium">{skill.label}</span>
                          <span className="text-xs font-bold" style={{ color: cat.color }}>Lv {skill.level}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level * 10}%` }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(to right, ${cat.color}bb, ${cat.color})` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════ */
export default function ToolsSection() {
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(1000);
  const [isMobile, setIsMobile] = useState(false);

  // Unlocked node IDs
  const [unlocked, setUnlocked] = useState(new Set(["root"]));
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current) setContainerW(containerRef.current.offsetWidth);
    };
    check();
    const ro = new ResizeObserver(check);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Scale virtual canvas to fit actual container
  const scale = Math.min(containerW / VW, 1);
  const canvasH = VH * scale;

  // Determine which nodes are eligible to unlock (parent is unlocked)
  const canUnlockSet = useMemo(() => {
    const s = new Set();
    EDGES.forEach(({ from, to }) => {
      if (unlocked.has(from) && !unlocked.has(to)) s.add(to);
    });
    NODES.forEach(n => { if (n.always) s.add(n.id); });
    return s;
  }, [unlocked]);

  const handleNodeClick = useCallback((node) => {
    if (node.always || unlocked.has(node.id)) {
      // Already unlocked — just show detail
      setActiveNode(prev => prev?.id === node.id ? null : node);
      return;
    }
    if (canUnlockSet.has(node.id)) {
      setUnlocked(prev => new Set([...prev, node.id]));
      setActiveNode(node);
    }
  }, [unlocked, canUnlockSet]);

  // Progress
  const progress = Math.round((unlocked.size / NODES.length) * 100);

  // Edges that should show "active" energy flow (both endpoints unlocked)
  const activeEdges = useMemo(
    () => new Set(EDGES.filter(e => unlocked.has(e.from) && unlocked.has(e.to)).map(e => `${e.from}-${e.to}`)),
    [unlocked]
  );

  return (
    <section id="tools" className="py-24 bg-[#06060a] relative border-t border-white/[0.03] overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Subtle ambient bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-900/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-semibold uppercase tracking-widest mb-5 backdrop-blur-md"
          >
            Skill Tree
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-5"
          >
            Technical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300">
              Mastery
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-base"
          >
            {isMobile
              ? "Browse skills by category below."
              : "Click nodes to unlock the tree · Explore 28 skills across 5 disciplines."}
          </motion.p>
        </div>

        {/* Progress Bar (desktop) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8 max-w-sm"
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Star className="w-4 h-4 text-violet-400" />
              <span>Progress</span>
            </div>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <span className="text-sm font-bold text-violet-300">{progress}%</span>
          </motion.div>
        )}

        {/* ── MOBILE VIEW ── */}
        {isMobile ? (
          <MobileAccordion />
        ) : (
          /* ── DESKTOP SKILL TREE ── */
          <div ref={containerRef} className="relative w-full">
            <div
              style={{ width: VW * scale, height: canvasH, position: "relative" }}
            >
              {/* SVG connector layer */}
              <svg
                width={VW * scale}
                height={canvasH}
                viewBox={`0 0 ${VW} ${VH}`}
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 pointer-events-none"
              >
                {EDGES.map(({ from, to }) => {
                  const edgeKey = `${from}-${to}`;
                  const active = activeEdges.has(edgeKey);
                  const toUnlocked = unlocked.has(to);
                  return (
                    <Connector
                      key={edgeKey}
                      fromId={from}
                      toId={to}
                      unlocked={toUnlocked}
                      active={active}
                    />
                  );
                })}
              </svg>

              {/* Node layer */}
              <svg
                width={VW * scale}
                height={canvasH}
                viewBox={`0 0 ${VW} ${VH}`}
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0"
              >
                {NODES.map((node) => (
                  <SkillNode
                    key={node.id}
                    node={node}
                    unlocked={unlocked.has(node.id)}
                    canUnlock={canUnlockSet.has(node.id)}
                    active={unlocked.has(node.id) && activeEdges.has(`${node.parent}-${node.id}`)}
                    onClick={handleNodeClick}
                  />
                ))}
              </svg>

              {/* Detail panel overlay */}
              <AnimatePresence>
                {activeNode && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="pointer-events-auto absolute top-4 right-4">
                      <DetailPanel node={activeNode} onClose={() => setActiveNode(null)} />
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 pointer-events-none">
                {Object.entries(CATEGORIES).filter(([k]) => k !== "root").map(([key, cat]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: cat.color, boxShadow: `0 0 5px ${cat.color}` }} />
                    <span className="text-xs text-gray-500 capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unlock all helper hint */}
            {unlocked.size < 3 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-violet-500" />
                Click glowing nodes to unlock pathways and reveal skill details.
              </motion.p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
