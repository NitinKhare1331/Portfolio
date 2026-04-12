"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Layout, Server, Database, Zap, Cloud, Activity, Cpu } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   NODE DATA
═══════════════════════════════════════════════════════════ */
const ICONS = { Layout, Server, Database, Zap, Cloud, Activity };

const NODES = [
  {
    id: "frontend",
    label: "Frontend",
    sublabel: "UI Engineering",
    color: "#60a5fa", rgb: "96,165,250",
    icon: "Layout",
    explanation: "Translating design systems into modular, accessible React components — pixel-perfect and performant across all platforms.",
    tools: ["React.js", "Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: "backend",
    label: "Backend",
    sublabel: "API Architecture",
    color: "#34d399", rgb: "52,211,153",
    icon: "Server",
    explanation: "Architecting scalable REST APIs and microservices at the center of every system — bridging UI with data and real-time seamlessly.",
    tools: ["Node.js", "Express.js", "FastAPI", "Microservices"],
  },
  {
    id: "database",
    label: "Database",
    sublabel: "Data Architecture",
    color: "#fb923c", rgb: "251,146,60",
    icon: "Database",
    explanation: "Modeling data for durability and speed — choosing the right engine per domain and optimizing queries under production load.",
    tools: ["MongoDB", "PostgreSQL", "CRDB", "Redis"],
  },
  {
    id: "realtime",
    label: "Real-Time",
    sublabel: "Live Data Systems",
    color: "#f472b6", rgb: "244,114,182",
    icon: "Zap",
    explanation: "Engineering bidirectional, event-driven communication layers powering live notifications, collaborative UIs and streaming pipelines.",
    tools: ["WebSockets", "Socket.io", "FCM", "Streams"],
  },
  {
    id: "devops",
    label: "DevOps",
    sublabel: "Cloud & Ops",
    color: "#a78bfa", rgb: "167,139,250",
    icon: "Cloud",
    explanation: "Provisioning, deploying and monitoring cloud infrastructure — maintaining zero-downtime CI/CD pipelines and stable production environments.",
    tools: ["AWS EC2", "AWS S3", "Docker", "Vercel"],
  },
  {
    id: "performance",
    label: "Performance",
    sublabel: "Scaling",
    color: "#fbbf24", rgb: "251,191,36",
    icon: "Activity",
    explanation: "Profiling, benchmarking and optimizing at every layer — from frontend bundle sizes to complex server-side query plans.",
    tools: ["Profiling", "Caching", "CDN", "Load Testing"],
  },
];

/* ═══════════════════════════════════════════════════════════
   HELPER MATH
   Calculate the base structural angle for node index
═══════════════════════════════════════════════════════════ */
const getTheta = (index, total) => (index / total) * Math.PI * 2;

// The target rotation required to place a given node "in front" (where relative angle is PI/2, i.e., bottom center of ellipse)
const getFrontAngleForNode = (index, total) => {
  return Math.PI / 2 - getTheta(index, total);
};

/* ═══════════════════════════════════════════════════════════
   ORBITAL NODE COMPONENT
═══════════════════════════════════════════════════════════ */
function OrbitalNode({ node, index, total, systemAngleSpring, Rx, Ry, active, onClick }) {
  const Icon = ICONS[node.icon] || Server;
  const theta = getTheta(index, total);

  // We use Framer Motion useSpring to get super smooth dynamic positional updates
  const [pos, setPos] = useState({ x: 0, y: 0, scale: 1, zIndex: 10, opacity: 1 });

  useEffect(() => {
    // Unsubscribe listener tracking the spring value
    const unsubscribe = systemAngleSpring.on("change", (sysAngle) => {
      // Calculate absolute angle for this node on the ellipse
      const a = theta + sysAngle;
      
      const x = Math.cos(a) * Rx;
      const y = Math.sin(a) * Ry;
      
      // Math.sin(a) ranges from -1 (top/back) to +1 (bottom/front).
      // Scale: 0.6 in back -> 1.1 in front
      const scale = 0.6 + ((Math.sin(a) + 1) / 2) * 0.5;
      
      // Opacity: 0.3 in back -> 1.0 in front
      const opacity = Math.min(1, 0.2 + ((Math.sin(a) + 1) / 2) * 1.5);
      
      // Z-Index: 0 in back up to 200 in front. Core is at 100.
      const zIndex = Math.round(((Math.sin(a) + 1) / 2) * 200);

      setPos({ x, y, scale, zIndex, opacity });
    });
    return () => unsubscribe();
  }, [systemAngleSpring, theta, Rx, Ry]);

  return (
    <>
      {/* Dynamic Laser Beam to Core */}
      <motion.div
        className="absolute pointer-events-none origin-left"
        style={{
          left: 0, top: 0,
          width: Math.sqrt(pos.x*pos.x + pos.y*pos.y) - 60, // Subtract radius of core & node so it doesn't overlap text
          height: 1.5,
          background: `linear-gradient(90deg, rgba(${node.rgb}, 0.8), transparent)`,
          transform: `translate(40px, 0) rotate(${Math.atan2(pos.y, pos.x)}rad)`,
          opacity: active ? 1 : 0,
          zIndex: 50,
          transition: "opacity 0.4s ease"
        }}
      />
      {active && (
         <motion.div
           className="absolute pointer-events-none origin-left flex items-center"
           style={{
             left: 0, top: 0,
             width: Math.sqrt(pos.x*pos.x + pos.y*pos.y),
             height: 2,
             transform: `rotate(${Math.atan2(pos.y, pos.x)}rad)`,
             zIndex: 51,
           }}
         >
            <motion.div 
               className="w-12 h-full bg-white shadow-[0_0_10px_#fff]"
               animate={{ x: [0, Math.sqrt(pos.x*pos.x + pos.y*pos.y)] }}
               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
         </motion.div>
      )}

      {/* Floating Node */}
      <motion.div
        className="absolute flex flex-col items-center justify-center cursor-pointer pointer-events-auto group w-[100px]"
        style={{
          left: 0 - 50, // Center on the exact x,y coordinate 
          top: 0 - 50,
          x: pos.x,
          y: pos.y,
          scale: pos.scale,
          zIndex: pos.zIndex,
          opacity: pos.opacity,
        }}
        onClick={() => onClick(index)}
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500 relative bg-black/60 backdrop-blur-xl"
          style={{
             borderColor: active ? node.color : `rgba(${node.rgb}, 0.3)`,
             color: active ? '#fff' : node.color,
             boxShadow: active ? `0 0 45px rgba(${node.rgb}, 0.8), inset 0 0 20px rgba(${node.rgb}, 0.4)` : `inset 0 0 10px rgba(${node.rgb}, 0.1)`,
          }}
        >
          <Icon className="w-6 h-6 z-10 drop-shadow-md" />
          
          {/* Active Glowing Aura */}
          {active && <span className="absolute inset-0 rounded-full animate-ping opacity-50 pointer-events-none" style={{ background: node.color }} />}
          
          {/* Hover highlight */}
          <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="mt-4 text-center px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 pointer-events-none"
             style={{ 
               background: active ? `rgba(${node.rgb}, 0.15)` : 'rgba(0,0,0,0.7)',
               borderColor: active ? `rgba(${node.rgb},0.5)` : 'rgba(255,255,255,0.08)' 
             }}>
           <h3 className="text-white font-bold text-[12px] tracking-wide leading-tight group-hover:text-white transition-colors">{node.label}</h3>
           <p className="text-[9px] uppercase tracking-widest font-black mt-1" style={{ color: node.color }}>{node.sublabel}</p>
        </div>
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   INFO PANEL (SIDE/BOTTOM HUD) 
═══════════════════════════════════════════════════════════ */
function ModernInfoPanel({ node }) {
  if (!node) return null;
  const Icon = ICONS[node.icon] || Server;

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      transition={{ type: "spring", stiffness: 280, damping: 25 }}
      className="p-6 sm:p-8 rounded-[2rem] border relative overflow-hidden backdrop-blur-3xl shadow-2xl w-full"
      style={{
        background: "rgba(10,10,18,0.7)",
        borderColor: `rgba(${node.rgb}, 0.25)`,
        boxShadow: `0 40px 100px -20px rgba(${node.rgb}, 0.15), inset 0 0 0 1px rgba(255,255,255,0.05)`,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${node.color}, transparent)` }} />
      <div className="absolute top-[-50%] right-[-10%] w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: node.color }} />

      <div className="flex items-center gap-5 mb-8 relative z-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border border-white/10" 
             style={{ background: `linear-gradient(135deg, rgba(${node.rgb}, 0.2) 0%, rgba(0,0,0,0.5) 100%)`, color: node.color }}>
          <Icon className="w-7 h-7 drop-shadow-md" />
        </div>
        <div>
          <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{node.label}</h3>
          <p className="font-bold tracking-widest uppercase text-[10px]" style={{ color: node.color }}>{node.sublabel}</p>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-7" />

      <p className="text-gray-300 leading-relaxed text-sm sm:text-[15px] mb-8 font-medium relative z-10">
        {node.explanation}
      </p>

      <div className="relative z-10">
        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Core Stack</h4>
        <div className="flex flex-wrap gap-2.5">
          {node.tools.map((tool, i) => (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + (i * 0.05) }}
              key={tool} 
              className="px-3.5 py-1.5 rounded-xl border text-[11px] font-bold tracking-wide shadow-sm"
              style={{ 
                borderColor: `rgba(${node.rgb}, 0.25)`, 
                color: "white", 
                background: `linear-gradient(180deg, rgba(${node.rgb}, 0.15) 0%, rgba(${node.rgb}, 0.05) 100%)` 
              }}
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function SystemMind() {
  const [activeIndex, setActiveIndex] = useState(0); // 0 = frontend
  const [isMobile, setIsMobile] = useState(false);
  
  const demoRef = useRef(null);
  const userActiveRef = useRef(false);

  // The mathematical system angle, elegantly interpolated using Framer spring mechanics
  const systemAngleSpring = useSpring(getFrontAngleForNode(activeIndex, NODES.length), {
    stiffness: 40,
    damping: 18,
    mass: 1.2
  });

  useEffect(() => {
    // Check mobile dimension for ellipse radius tuning
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Determine the shortest path to target rotation.
    // getFrontAngleForNode(index) might wrap around. 
    // Wait, useSpring will automatically animate from current value to new value seamlessly.
    systemAngleSpring.set(getFrontAngleForNode(activeIndex, NODES.length));
  }, [activeIndex, systemAngleSpring]);

  const startDemo = () => {
    if (demoRef.current) clearInterval(demoRef.current);
    demoRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % NODES.length);
    }, 3800);
  };

  useEffect(() => {
    startDemo();
    return () => clearInterval(demoRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInteract = (index) => {
    userActiveRef.current = true;
    clearInterval(demoRef.current);
    setActiveIndex(index);
    
    // Resume cycle after inactivity to keep the page feeling alive
    setTimeout(() => {
      userActiveRef.current = false;
      startDemo();
    }, 10000);
  };

  const activeNode = NODES[activeIndex];
  const ellipseRx = isMobile ? 130 : 250;
  const ellipseRy = isMobile ? 55 : 90;

  return (
    <section id="system-mind" className="relative py-24 bg-[#020205] overflow-hidden border-t border-white/[0.04]">
      {/* Deep Space Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
           style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Header (Span Full Width) */}
        <div className="text-center mb-20 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-sm font-semibold uppercase tracking-widest mb-5 backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.1)]"
          >
            System Mind
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6"
          >
            How I{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500">
              Architect
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm sm:text-base font-medium max-w-xl mx-auto"
          >
            An interactive orbital map of full-stack ecosystems. The entire pipeline—from 
            databases to UI engineering—revolves around seamless integration.
          </motion.p>
        </div>

        {/* ── Core Layout Split (Orbital Vis Left, Info HUD Right) ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* L: 3D Visualization */}
          <div className="w-full lg:w-[60%] h-[55vh] lg:h-[650px] relative rounded-[3rem] border border-white/5 bg-black/40 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Ambient Nebula Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(96,165,250,0.06)_0%,_transparent_70%)] pointer-events-none" />

            {/* Orbital Rings (Draw 2D elliptical paths just for visuals) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.15] pointer-events-none">
                <svg width={ellipseRx * 2 + 100} height={ellipseRy * 2 + 100} className="overflow-visible">
                   <ellipse 
                     cx={ellipseRx + 50} 
                     cy={ellipseRy + 50} 
                     rx={ellipseRx} 
                     ry={ellipseRy} 
                     fill="none" 
                     stroke="#ffffff" 
                     strokeWidth="1.5"
                     strokeDasharray="4 12" 
                   />
                </svg>
            </div>

            {/* The Central Reference Coordinate (0,0) */}
            <div className="absolute top-1/2 left-1/2 w-0 h-0">
               {/* Center Core Engine */}
               <div 
                 className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-green-500/30 flex items-center justify-center pointer-events-none"
                 style={{ 
                   background: 'radial-gradient(circle at 30% 30%, rgba(34,197,94,0.15) 0%, rgba(2,6,23,0.95) 100%)', 
                   boxShadow: '0 0 60px rgba(34,197,94,0.1), inset 0 0 30px rgba(34,197,94,0.2)', 
                   zIndex: 100 // This ensures it correctly overlaps nodes in the back (`zIndex < 100`) and gets overlapped by nodes in the front (`zIndex > 100`)!
                 }}
               >
                 <div className="relative z-10 flex flex-col items-center">
                    <Cpu className="w-6 h-6 text-green-400 mb-2 opacity-80" />
                    <div className="text-green-400 font-extrabold tracking-[0.25em] uppercase text-[10px] text-center leading-tight">
                        SYSTEM<br/>CORE
                    </div>
                 </div>
                 {/* Energy Rings */}
                 <span className="absolute inset-[-10px] rounded-full border border-green-500/20" />
                 <span className="absolute inset-[-25px] rounded-full border border-green-500/10" style={{ borderStyle: 'dashed' }} />
               </div>

               {/* Render Orbital Nodes & Data Beams */}
               {NODES.map((node, index) => (
                 <OrbitalNode 
                   key={node.id} 
                   node={node} 
                   index={index} 
                   total={NODES.length}
                   systemAngleSpring={systemAngleSpring}
                   Rx={ellipseRx}
                   Ry={ellipseRy}
                   active={activeIndex === index} 
                   onClick={handleInteract} 
                 />
               ))}
            </div>

            {/* Mode Switcher Display */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center gap-2 pointer-events-none z-[900]">
               <span className={`w-2 h-2 rounded-full ${userActiveRef.current ? 'bg-orange-400' : 'bg-green-400 animate-ping'}`} />
               <span className="text-[10px] text-white font-medium uppercase tracking-widest">{userActiveRef.current ? 'Manual Orbit' : 'Auto Scanning'}</span>
            </div>
          </div>

          {/* R: Dynamic Info Panel */}
          <div className="w-full lg:w-[40%] relative min-h-[350px]">
            <AnimatePresence mode="wait">
              {activeNode && (
                <ModernInfoPanel key={activeNode.id} node={activeNode} />
              )}
            </AnimatePresence>
            
            {!userActiveRef.current && (
              <div className="hidden lg:flex absolute -bottom-10 left-4 items-center gap-3 opacity-40 mix-blend-screen pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Live Data Stream Active</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
