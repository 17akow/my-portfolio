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
  HiLightningBolt,
  HiColorSwatch,
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
    label: "Landing",
    title: "Hero Section & Brand Identity",
    description: "A cinematic hero section with interactive Three.js particle system, animated typewriter text, and a glowing gradient accent. Sets the Iron Man / JARVIS futuristic tone with Apple Vision Pro glassmorphism.",
    image: "/projects/portfolio/portfolio-hero.png",
    metrics: [
      { label: "Lighthouse Perf", value: "97" },
      { label: "Bundle Size", value: "223 KB" },
      { label: "Animations", value: "24+" },
      { label: "3D Components", value: "3" },
    ],
    type: "image",
  },
  {
    id: "about",
    label: "About",
    title: "Professional Profile",
    description: "A personal introduction section combining a profile image, bio, and key statistics. Clean typography with glassmorphism cards displaying experience, projects completed, and technologies used.",
    image: "/projects/portfolio/portfolio-about.png",
    features: [
      "Profile image with glassmorphism frame and glow effect",
      "Bio section with role, location, and professional summary",
      "Statistics cards (experience, projects, technologies)",
      "Smooth scroll-triggered fade-in animations",
    ],
    type: "image",
  },
  {
    id: "skills",
    label: "Skills",
    title: "Technical Expertise",
    description: "Interactive skill grid organized by category with animated progress bars, icon badges, and hover effects. Visual hierarchy from expert to proficient skill levels.",
    image: "/projects/portfolio/portfolio-skills.png",
    type: "image",
  },
  {
    id: "certifications",
    label: "Certifications",
    title: "Verified Credentials",
    description: "A CoverFlow-style carousel of professional certifications with interactive flip cards, verification badges, and a timeline. Includes Google IT Support, IBM Technical Support, Scrimba AI, and Wix certificates.",
    image: "/projects/portfolio/portfolio-certifications.png",
    metrics: [
      { label: "Certifications", value: "4" },
      { label: "Platforms", value: "4" },
      { label: "Verify Links", value: "1" },
      { label: "Interactive Earth", value: "R3F" },
    ],
    type: "image",
  },
  {
    id: "projects",
    label: "Projects",
    title: "Featured Work",
    description: "Project showcase grid with 3D hover tilt cards, preview images, technology tags, and action buttons. Each card links to a full-screen premium showcase modal with detailed project walkthroughs.",
    image: "/projects/portfolio/portfolio-projects.png",
    features: [
      "3D tilt card effect on mouse hover",
      "Full-screen showcase modal for each project",
      "Filterable by category (Full-Stack, Frontend)",
      "Preview images with lazy loading and gradient overlays",
    ],
    type: "image",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Get In Touch",
    description: "A functional contact form with validation, animated submit button, and social media links. Form submissions are routed through a Django backend on Railway with reCAPTCHA protection.",
    image: "/projects/portfolio/portfolio-contact.png",
    type: "image",
  },
  {
    id: "mobile",
    label: "Mobile",
    title: "Responsive Design",
    description: "Fully responsive layout optimized for mobile, tablet, and desktop. Touch-friendly interactions, adaptive grid layouts, and consistent glassmorphism across all breakpoints.",
    type: "mobile-grid",
  },
  {
    id: "tech-stack",
    label: "Technology Stack",
    title: "Built With",
    description: "Modern frontend technology stack engineered for performance, accessibility, and stunning visual experiences.",
    type: "tech",
  },
  {
    id: "performance",
    label: "Performance",
    title: "Performance & Accessibility",
    description: "Optimized for Lighthouse 95+ scores with code splitting, lazy loading, manual chunks for large libraries, and semantic HTML with ARIA attributes.",
    image: "/projects/portfolio/portfolio-performance.png",
    features: [
      "Lighthouse performance score of 97",
      "Code splitting with React.lazy for Three.js components",
      "Manual chunks for three.js (303 KB gzip) and GSAP (27 KB gzip)",
      "IntersectionObserver for viewport-gated animations",
    ],
    type: "image",
  },
];

const FEATURES_LIST = [
  { icon: "sparkles", text: "Apple Vision Pro-inspired glassmorphism interface with backdrop blur" },
  { icon: "chart", text: "Three.js interactive particle system and Earth visualization" },
  { icon: "server", text: "GSAP-powered scroll animations and counter transitions" },
  { icon: "database", text: "Framer Motion spring physics for modal and hover interactions" },
  { icon: "shield", text: "Lighthouse 97 performance with optimized bundle splitting" },
  { icon: "clock", text: "Lazy-loaded R3F canvases with IntersectionObserver gating" },
  { icon: "cube", text: "CoverFlow carousel with certificate verification badges" },
  { icon: "terminal", text: "Typed animation hero with gradient accent glow effects" },
  { icon: "chip", text: "Responsive grid layouts adapting from mobile to ultrawide" },
  { icon: "mobile", text: "Touch-optimized interactions with 3D tilt card effects" },
];

const TECH_GROUPS = [
  { category: "Framework", items: ["React 18", "TypeScript", "Vite 6", "Tailwind CSS v4"] },
  { category: "Animation", items: ["Framer Motion", "GSAP", "React Three Fiber", "Drei"] },
  { category: "3D Graphics", items: ["Three.js", "React Three Fiber", "Drei", "OrbitControls"] },
  { category: "Routing", items: ["React Router", "Hash Navigation", "Scroll Events", "IntersectionObserver"] },
  { category: "Icons", items: ["React Icons (Heroicons)", "Custom SVG", "CSS Gradients", "Glassmorphism"] },
  { category: "Deployment", items: ["Vercel", "Railway", "Docker", "GitHub Actions"] },
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
  color: <HiColorSwatch />,
  bolt: <HiLightningBolt />,
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
    { src: "/projects/portfolio/portfolio-mobile.png", label: "Mobile Full Page" },
    { src: "/projects/portfolio/portfolio-hero.png", label: "Hero" },
    { src: "/projects/portfolio/portfolio-about.png", label: "About" },
    { src: "/projects/portfolio/portfolio-skills.png", label: "Skills" },
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
      <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">Responsive Design</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
        Fully responsive layout optimized for mobile, tablet, and desktop. Touch-friendly interactions, adaptive grid layouts, and consistent glassmorphism across all breakpoints.
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
        Modern frontend technology stack engineered for performance, accessibility, and stunning visual experiences.
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
        Premium features engineered for the Personal Portfolio Website.
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

export default function PortfolioShowcase({
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
