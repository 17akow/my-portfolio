import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiX,
  HiExternalLink,
  HiCode,
  HiChat,
  HiShieldCheck,
  HiDatabase,
  HiServer,
  HiChip,
  HiLockClosed,
  HiChartBar,
  HiDeviceMobile,
  HiCube,
  HiCheckCircle,
  HiUserGroup,
  HiClock,
  HiSparkles,
  HiTerminal,
} from "react-icons/hi";

interface ShowcaseSection {
  id: string;
  label: string;
  title: string;
  description: string;
  image?: string;
  features?: string[];
  metrics?: { label: string; value: string }[];
  type: "image" | "features" | "metrics" | "tech" | "mobile-grid";
}

interface Project {
  id: number;
  title: string;
  short_description: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  category: string;
  year: string;
  gradient: string;
  iconColor: string;
}

const SECTIONS: ShowcaseSection[] = [
  {
    id: "system-init",
    label: "System Initialization",
    title: "Neural Core Interface",
    description: "The landing interface presents a real-time AI core status dashboard with model selection, system metrics, and quick-access controls for managing AI interactions.",
    image: "/projects/system-init.png",
    type: "image",
  },
  {
    id: "workspace",
    label: "Desktop Workspace",
    title: "Main Command Center",
    description: "The primary workspace features a sidebar navigation system, a central AI chat interface with threading, and real-time cognitive status panels monitoring system health.",
    image: "/projects/desktop-workspace.png",
    features: [
      "Sidebar navigation with contextual icons",
      "Real-time chat interface with AI models",
      "Cognitive status monitoring panels",
      "System control quick-actions toolbar",
    ],
    type: "image",
  },
  {
    id: "analytics",
    label: "System Analytics",
    title: "Performance & Monitoring",
    description: "Comprehensive analytics dashboard providing real-time insights into processing load, active synapses, memory latency, and neural cluster health across the distributed system.",
    image: "/projects/analytics.png",
    metrics: [
      { label: "Processing Load", value: "84.2%" },
      { label: "Active Synapses", value: "1.2M" },
      { label: "Memory Latency", value: "12ms" },
      { label: "Compute Power", value: "89.4 TFLOPS" },
    ],
    type: "image",
  },
  {
    id: "auth",
    label: "Authentication",
    title: "Bio-Security Portal",
    description: "Multi-factor authentication interface featuring biometric verification, encrypted session management, and granular role-based access controls for enterprise-grade security.",
    image: "/projects/auth-desktop.png",
    type: "image",
  },
  {
    id: "mobile",
    label: "Mobile Experience",
    title: "Responsive Interface",
    description: "Fully adaptive mobile interface maintaining full functionality across devices with optimized touch interactions and real-time data synchronization.",
    type: "mobile-grid",
  },
  {
    id: "tech-stack",
    label: "Technology Stack",
    title: "Built With",
    description: "Modern technology stack engineered for scalability, performance, and developer experience.",
    type: "tech",
  },
  {
    id: "features",
    label: "Key Features",
    title: "Platform Capabilities",
    description: "Core features that power the AI Assistant Platform.",
    type: "features",
  },
];

const FEATURES_LIST = [
  { icon: "chat", text: "Multi-model AI chat with conversation threading" },
  { icon: "shield", text: "JWT-based authentication with role-based access control" },
  { icon: "database", text: "Persistent conversation history with PostgreSQL" },
  { icon: "server", text: "Django REST Framework API with rate limiting" },
  { icon: "lock", text: "End-to-end encrypted session management" },
  { icon: "chart", text: "Real-time analytics and usage monitoring" },
  { icon: "users", text: "Multi-user support with admin dashboard" },
  { icon: "terminal", text: "OpenAI/Groq API integration with fallback" },
];

const TECH_GROUPS = [
  { category: "Frontend", items: ["React.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Django", "Django REST Framework", "Python", "Gunicorn"] },
  { category: "AI & APIs", items: ["OpenAI API", "Groq SDK", "LangChain", "Prompt Engineering"] },
  { category: "Database", items: ["PostgreSQL", "Redis Cache", "SQLAlchemy", "Alembic"] },
  { category: "Auth & Security", items: ["JWT", "OAuth 2.0", "bcrypt", "CORS"] },
  { category: "DevOps", items: ["Docker", "Railway", "GitHub Actions", "Nginx"] },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  chat: <HiChat />,
  shield: <HiShieldCheck />,
  database: <HiDatabase />,
  server: <HiServer />,
  chip: <HiChip />,
  lock: <HiLockClosed />,
  chart: <HiChartBar />,
  mobile: <HiDeviceMobile />,
  cube: <HiCube />,
  users: <HiUserGroup />,
  clock: <HiClock />,
  sparkles: <HiSparkles />,
  terminal: <HiTerminal />,
  code: <HiCode />,
};

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-primary/50">
      <span className="h-px w-6 bg-primary/30" />
      {text}
    </span>
  );
}

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {!loaded && !error && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-white/[0.015]">
          <div className="absolute inset-0 -translate-x-full skeleton-shimmer" />
        </div>
      )}
      {error ? (
        <div className="flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-white/[0.01] to-white/[0.03]">
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <HiCode size={28} className="opacity-30" />
            <span className="text-xs opacity-50">Preview unavailable</span>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full rounded-2xl border border-white/[0.04] transition-all duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true); }}
        />
      )}
    </div>
  );
}

function FeatureCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-primary/20">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        {ICON_MAP[icon] ?? <HiCheckCircle size={16} />}
      </span>
      <span className="pt-0.5 text-sm leading-relaxed text-gray-300">{text}</span>
    </div>
  );
}

function TechGroupCard({ category, items }: { category: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:bg-white/[0.04]">
      <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-accent/60">{category}</span>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {items.map((t) => (
          <span
            key={t}
            className="rounded-md bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-gray-300 border border-white/[0.05] transition-colors hover:border-primary/20 hover:text-primary/80"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function MetricBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-5 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary pulse-ring" />
        <span className="text-[10px] font-mono tracking-wider text-text-muted uppercase">{label}</span>
      </div>
      <p className="mt-1.5 bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent">
        {value}
      </p>
    </div>
  );
}

function ImageSection({ section }: { section: ShowcaseSection }) {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-20"
      id={section.id}
    >
      <SectionLabel text={section.label} />
      <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">{section.title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">{section.description}</p>

      {section.metrics && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {section.metrics.map((m) => (
            <MetricBadge key={m.label} label={m.label} value={m.value} />
          ))}
        </div>
      )}

      {section.image && <div className="mt-6"><LazyImage src={section.image} alt={section.title} /></div>}

      {section.features && (
        <motion.div
          initial={false}
          animate={{ height: showFeatures ? "auto" : 0 }}
          className="overflow-hidden"
        >
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {section.features.map((f, i) => (
              <FeatureCard key={i} icon={["chat", "terminal", "server", "database"][i % 4] ?? "chat"} text={f} />
            ))}
          </div>
        </motion.div>
      )}

      {section.features && (
        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className="mt-3 text-[11px] font-mono tracking-wider text-primary/50 hover:text-primary transition-colors"
        >
          {showFeatures ? "▲ Hide details" : "▼ Show details"}
        </button>
      )}

      <div className="mt-8 h-px bg-gradient-to-r from-primary/20 via-accent/10 to-transparent" />
    </motion.div>
  );
}

function MobileGridSection() {
  const mobileScreens = [
    { src: "/projects/mobile-init.png", label: "Onboarding" },
    { src: "/projects/mobile-stream.png", label: "Chat Interface" },
    { src: "/projects/mobile-auth.png", label: "Security" },
    { src: "/projects/mobile-analytics.png", label: "Analytics" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-20"
      id="mobile"
    >
      <SectionLabel text="Mobile Experience" />
      <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">Responsive Interface</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
        Fully adaptive mobile interface maintaining full functionality across devices with optimized touch interactions and real-time data synchronization.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {mobileScreens.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-3">
            <div className="w-full overflow-hidden rounded-[20px] border-2 border-white/[0.06] bg-deep-navy shadow-xl">
              <div className="flex items-center gap-1 border-b border-white/[0.04] px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
                <div className="h-1.5 w-1.5 rounded-full bg-green-400/60" />
              </div>
              <img
                src={s.src}
                alt={s.label}
                className="w-full"
                loading="lazy"
              />
            </div>
            <span className="text-[10px] font-mono tracking-wider text-text-muted uppercase">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 h-px bg-gradient-to-r from-primary/20 via-accent/10 to-transparent" />
    </motion.div>
  );
}

function TechStackSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-20"
      id="tech-stack"
    >
      <SectionLabel text="Technology Stack" />
      <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">Built With</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
        Carefully selected technologies engineered for scalability, performance, and developer experience.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TECH_GROUPS.map((g) => (
          <TechGroupCard key={g.category} category={g.category} items={g.items} />
        ))}
      </div>

      <div className="mt-8 h-px bg-gradient-to-r from-primary/20 via-accent/10 to-transparent" />
    </motion.div>
  );
}

function FeaturesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-20"
      id="features"
    >
      <SectionLabel text="Key Features" />
      <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">Platform Capabilities</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
        Core features engineered for the AI Assistant Platform.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {FEATURES_LIST.map((f) => (
          <FeatureCard key={f.text} icon={f.icon} text={f.text} />
        ))}
      </div>

      <div className="mt-8 h-px bg-gradient-to-r from-primary/20 via-accent/10 to-transparent" />
    </motion.div>
  );
}

export default function ProjectShowcase({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      window.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const total = el.scrollHeight - el.clientHeight;
    setScrollProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
  }, []);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 mx-2 flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-deep-navy/95 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:mx-4"
          >
            <div className="relative shrink-0 border-b border-white/[0.04] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-400/70" />
                  <div className="h-2 w-2 rounded-full bg-yellow-400/70" />
                  <div className="h-2 w-2 rounded-full bg-green-400/70" />
                </div>
                <span className="text-[11px] font-mono text-text-muted/50 tracking-wider">
                  {project.title} — Project Overview
                </span>
              </div>
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <HiX size={16} />
              </button>
            </div>

            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto"
            >
              <div className="sticky top-0 left-0 right-0 z-10 h-[2px] bg-white/[0.03] pointer-events-none">
                <div
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              <div className="mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <SectionLabel text="Project Overview" />
                  <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{project.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted">
                    {project.description}
                  </p>
                </motion.div>

                {SECTIONS.map((section) => {
                  if (section.type === "mobile-grid") return <MobileGridSection key={section.id} />;
                  if (section.type === "tech") return <TechStackSection key={section.id} />;
                  if (section.type === "features") return <FeaturesSection key={section.id} />;
                  return <ImageSection key={section.id} section={section} />;
                })}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mt-10 flex flex-wrap items-center gap-4 pb-4"
                >
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition-all hover:shadow-xl hover:shadow-primary/25"
                    >
                      <HiCode size={18} />
                      View Source Code
                    </a>
                  )}
                  {project.demo_url ? (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-semibold text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
                    >
                      <HiExternalLink size={18} />
                      Live Demo
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.01] px-6 py-3 text-sm font-medium text-text-muted cursor-not-allowed">
                      <HiExternalLink size={18} className="opacity-30" />
                      Coming Soon
                    </span>
                  )}
                  <button
                    onClick={onClose}
                    className="ml-auto inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3 text-xs font-medium text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
