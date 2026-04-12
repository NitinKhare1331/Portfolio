// Next.js Home Page
import HoverBackgroundEffect from "../components/HoverBackgroundEffect";
// import TechStackBubbles from "../components/TechStackBubbles/TechStackBubbles";
// import TechStackBubbles2 from "../components/TechStackBubbles2/TechStackBubbles2";
import AboutSection from "../components/About/AboutSection";
import ToolsSection from "../components/Tools/ToolsSection";
import ExperienceSection from "../components/Experience/ExperienceSection";
import SystemMind from "../components/SystemMind/SystemMind";
import ProjectsSection from "../components/Projects/ProjectsSection";
import ContactSection from "../components/Contact/ContactSection";
import { TOOL_ASSETS } from "./utils/toolsAsset";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#030303] overflow-x-hidden selection:bg-violet-500/30">
      <HoverBackgroundEffect
        assets={TOOL_ASSETS}
        iconSize={80}
        spawnRate={200}
        lifetime={1000}
        maxIcons={20}
        className="min-h-screen w-full flex items-center justify-center bg-[#020202]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.15) 0%, transparent 70%), #020202",
        }}
      >
        {/* ── Page content ───────────────────────────────────── */}
        <main className="flex flex-col items-center justify-center px-6 text-center z-10">
          <div className="mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-bold uppercase tracking-widest backdrop-blur-md animate-pulse">
            Welcome to my ecosystem
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-7xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Hello, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400">Nitin Khare</span>
          </h1>

          <p className="mt-4 max-w-2xl text-xl leading-relaxed text-gray-400 font-light">
            Software Development Engineer | <span className="font-semibold text-gray-200">Full Stack</span>
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <a
              href="#projects"
              className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-violet-400 hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
            >
              Explore Architecture
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-gray-300 transition-all hover:border-violet-500 hover:bg-violet-500/10 hover:text-white backdrop-blur-md"
            >
              Initiate Contact
            </a>
          </div>
        </main>
      </HoverBackgroundEffect>

      <AboutSection />

      {/* Kept commented as requested by the user */}
      {/* <TechStackBubbles /> */}
      {/* <div className="h-[100vh] w-full">
        <TechStackBubbles2 />
      </div> */}

      <ToolsSection />

      <SystemMind />

      <ExperienceSection />
      
      <ProjectsSection />

      <ContactSection />
    </div>
  );
}
