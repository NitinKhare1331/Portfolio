import HoverBackgroundEffect from "./components/HoverBackgroundEffect";
import TechStackBubbles from "./components/TechStackBubbles/TechStackBubbles";
import TechStackBubbles2 from "./components/TechStackBubbles2/TechStackBubbles2";
import { IndustrySolutionsContainer } from "../components/IndustrySolutions/IndustrySolutionsContainer";
import TestimonialsSection from "../components/Testimonials/TestimonialsSection";

// All tool assets from /public/tools/
const TOOL_ASSETS = [
  "/tools/react.png",
  "/tools/nextjs.png",
  "/tools/python.png",
  "/tools/javascript.png",
  "/tools/docker.png",
  "/tools/mongodb.png",
  "/tools/postgresql.png",
  "/tools/github.png",
  "/tools/aws.png",
  "/tools/azure.png",
  "/tools/google-cloud.png",
  "/tools/vercel.png",
  "/tools/vscode.png",
  "/tools/postman.png",
  "/tools/jira.png",
  "/tools/slack.png",
  "/tools/gemini.png",
  "/tools/chatgpt.png",
  "/tools/copilot.png",
  "/tools/androidstudio.png",
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-neutral-950">
      <HoverBackgroundEffect
        assets={TOOL_ASSETS}
        iconSize={80}
        spawnRate={200}
        lifetime={1000}
        maxIcons={20}
        className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-neutral-900"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(109,40,217,0.12) 0%, transparent 70%), #f5f5f7",
        }}
      >
        {/* ── Page content ───────────────────────────────────── */}
        <main className="flex flex-col items-center justify-center px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-500">
            Move your mouse around
          </p>

          <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Hello, I&apos;m <span className="text-violet-600">Nitin</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
            Full-stack developer &amp; designer with a passion for building
            beautiful, performant web experiences.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#works"
              className="rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 hover:shadow-violet-300"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition hover:border-violet-400 hover:text-violet-600"
            >
              Contact Me
            </a>
          </div>
        </main>
      </HoverBackgroundEffect>

      <TechStackBubbles />

      <div className="h-[100vh] w-full">
        <TechStackBubbles2 />
      </div>

      {/* <IndustrySolutionsContainer /> */}

      <TestimonialsSection />
    </div>
  );
}
