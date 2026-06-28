import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiX,
  HiExternalLink,
  HiChartBar,
  HiUserGroup,
  HiServer,
  HiDatabase,
  HiShieldCheck,
  HiLockClosed,
  HiClock,
  HiTerminal,
  HiCube,
  HiChip,
  HiDeviceMobile,
  HiCheckCircle,
  HiSparkles,
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
    id: "hero",
    label: "Dashboard Overview",
    title: "Analytics Command Center",
    description: "A comprehensive admin dashboard featuring real-time analytics, revenue tracking, user monitoring, and system performance metrics presented through a premium glassmorphism interface.",
    image: "/projects/dashboard/dashboard-hero.png",
    metrics: [
      { label: "Total Revenue", value: "$284.5K" },
      { label: "Active Users", value: "24,850" },
      { label: "Total Sessions", value: "182.4K" },
      { label: "Bounce Rate", value: "24.8%" },
    ],
    type: "image",
  },
  {
    id: "analytics",
    label: "Advanced Analytics",
    title: "Performance Metrics",
    description: "In-depth analytics panel with interactive charts, revenue trends, user growth trajectories, and real-time system health monitoring with AI-powered insights.",
    image: "/projects/dashboard/dashboard-analytics.png",
    features: [
      "Real-time revenue tracking with trend indicators",
      "User growth analytics with predictive modeling",
      "System health monitoring with automated alerts",
      "Custom report generation with export capabilities",
    ],
    type: "image",
  },
  {
    id: "users",
    label: "User Management",
    title: "User Administration",
    description: "Full-featured user management interface with role-based access control, activity logs, and granular permission settings for enterprise-scale team management.",
    image: "/projects/dashboard/dashboard-users.png",
    type: "image",
  },
  {
    id: "charts",
    label: "Data Visualization",
    title: "Interactive Charts",
    description: "Comprehensive charting system with revenue line charts, user growth bar graphs, session distribution pie charts, and real-time data streaming visualization.",
    image: "/projects/dashboard/dashboard-overview.png",
    metrics: [
      { label: "Data Points", value: "1.2M" },
      { label: "Chart Types", value: "8" },
      { label: "Refresh Rate", value: "3s" },
      { label: "Export Formats", value: "5" },
    ],
    type: "image",
  },
  {
    id: "mobile",
    label: "Mobile Experience",
    title: "Responsive Dashboard",
    description: "Fully adaptive mobile interface optimized for on-the-go monitoring with touch-friendly interactions, push notifications, and real-time data synchronization across all devices.",
    type: "mobile-grid",
  },
  {
    id: "tech-stack",
    label: "Technology Stack",
    title: "Built With",
    description: "Modern technology stack engineered for scalability, performance, and enterprise-grade reliability.",
    type: "tech",
  },
  {
    id: "features",
    label: "Key Features",
    title: "Platform Capabilities",
    description: "Core features that power the Full Stack Dashboard platform.",
    type: "features",
  },
];

const FEATURES_LIST = [
  { icon: "chart", text: "Real-time analytics with interactive data visualization" },
  { icon: "users", text: "User management with role-based access control" },
  { icon: "server", text: "RESTful API architecture with Django REST Framework" },
  { icon: "database", text: "PostgreSQL database with optimized query performance" },
  { icon: "shield", text: "JWT authentication with secure session management" },
  { icon: "clock", text: "Real-time data updates with WebSocket integration" },
  { icon: "cube", text: "Modular component architecture with React.js" },
  { icon: "terminal", text: "Comprehensive logging and monitoring system" },
];

const TECH_GROUPS = [
  { category: "Frontend", items: ["React.js", "TypeScript", "Tailwind CSS", "Chart.js"] },
  { category: "Backend", items: ["Django", "Django REST Framework", "Python", "Gunicorn"] },
  { category: "Database", items: ["PostgreSQL", "Redis Cache", "SQLAlchemy", "Alembic"] },
  { category: "Auth & Security", items: ["JWT", "OAuth 2.0", "bcrypt", "CORS"] },
  { category: "DevOps", items: ["Docker", "Railway", "GitHub Actions", "Nginx"] },
  { category: "Monitoring", items: ["Prometheus", "Grafana", "Sentry", "Logtail"] },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  chart: <HiChartBar />,
  users: <HiUserGroup />,
  server: <HiServer />,
  database: <HiDatabase />,
  shield: <HiShieldCheck />,
  lock: <HiLockClosed />,
  clock: <HiClock />,
  terminal: <HiTerminal />,
  cube: <HiCube />,
  chip: <HiChip />,
  mobile: <HiDeviceMobile />,
  sparkles: <HiSparkles />,
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
            <HiTerminal size={28} className="opacity-30" />
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
              <FeatureCard key={i} icon={["chart", "terminal", "server", "database"][i % 4] ?? "chart"} text={f} />
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
    { src: "/projects/dashboard/dashboard-mobile.png", label: "Mobile Dashboard" },
    { src: "/projects/dashboard/dashboard-analytics.png", label: "Analytics" },
    { src: "/projects/dashboard/dashboard-hero.png", label: "Overview" },
    { src: "/projects/dashboard/dashboard-users.png", label: "Users" },
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
      <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">Responsive Dashboard</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
        Fully adaptive mobile interface optimized for on-the-go monitoring with touch-friendly interactions, push notifications, and real-time data synchronization across all devices.
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
        Carefully selected technologies engineered for scalability, performance, and enterprise-grade reliability.
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
        Core features engineered for the Full Stack Dashboard platform.
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

export default function DashboardShowcase({
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
