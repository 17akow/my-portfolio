import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  type MouseEvent,
} from "react";
import { motion, useMotionValue } from "framer-motion";
import {
  HiCalendar,
  HiStar,
  HiExternalLink,
  HiBadgeCheck,
  HiSparkles,
  HiCode,
  HiChevronLeft,
  HiChevronRight,
  HiAcademicCap,
} from "react-icons/hi";
import { SiGoogle, SiCoursera, SiScrimba } from "react-icons/si";
import gsap from "gsap";
import CertificationModal from "./CertificationModal";
import { useCursorPosition } from "../hooks/useCursorPosition";
import { useAudio } from "../hooks/useAudio";

const ThreeBackground = lazy(() => import("./ThreeBackground"));
const InteractiveEarth = lazy(() => import("./InteractiveEarth"));

/* ───── Types ───── */

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  provider: string;
  providerIcon: "google" | "coursera" | "scrimba" | "ibm";
  completionDate: string;
  description: string;
  skills: string[];
  image: string;
  verifyUrl?: string;
  credlyUrl?: string;
}

/* ───── Data ───── */

const CERTIFICATIONS: Certification[] = [
  {
    id: "google-it-support",
    title: "Google IT Support Professional Certificate",
    issuer: "Google",
    provider: "Coursera",
    providerIcon: "google",
    completionDate: "July 12, 2024",
    description:
      "5-course professional certificate covering IT fundamentals, networking, operating systems, system administration, and security. Hands-on labs and real-world scenarios prepared for entry-level IT support roles.",
    skills: [
      "Technical Support",
      "Networking",
      "Operating Systems",
      "SysAdmin",
      "Security",
    ],
    image: "/Google-IT-Certificate.png",
    verifyUrl: "https://coursera.org/share/62c343f60b3420e388ec03d88bc11f4f",
  },
  {
    id: "ibm-technical-support",
    title: "Introduction to Technical Support",
    issuer: "IBM",
    provider: "Coursera",
    providerIcon: "ibm",
    completionDate: "July 12, 2024",
    description:
      "Foundational course covering IT support fundamentals, troubleshooting methodologies, customer service skills, and essential technical support tools used in enterprise environments.",
    skills: [
      "Troubleshooting",
      "Customer Service",
      "IT Fundamentals",
      "Ticketing Systems",
    ],
    image: "/IBM-Technical-Support.png",
  },
  {
    id: "build-ai-apps",
    title: "Build AI Apps with ChatGPT, DALL·E and GPT-4",
    issuer: "Scrimba",
    provider: "Coursera",
    providerIcon: "scrimba",
    completionDate: "March 13, 2026",
    description:
      "Hands-on course on building AI-powered applications using OpenAI APIs including ChatGPT, DALL·E for image generation, and GPT-4 for advanced text processing and automation.",
    skills: [
      "OpenAI API",
      "Prompt Engineering",
      "AI Integration",
      "DALL·E",
      "GPT-4",
    ],
    image: "/Build-with-ai-Scrimba.png",
  },
  {
    id: "wix-landing-page",
    title: "Build an Automated Landing Page using AI from Wix ADI",
    issuer: "Coursera Project",
    provider: "Coursera",
    providerIcon: "coursera",
    completionDate: "April 16, 2024",
    description:
      "Project-based course on creating AI-driven landing pages using Wix ADI (Artificial Design Intelligence). Learned to leverage AI for automated web design, layout generation, and content optimization.",
    skills: ["Wix ADI", "AI Design", "Landing Pages", "Web Design", "No-Code"],
    image: "/Automated-landing-page.png",
  },
];

const PROVIDER_ICONS: Record<string, (size: number) => React.ReactNode> = {
  google: (s) => <SiGoogle size={s} />,
  coursera: (s) => <SiCoursera size={s} />,
  scrimba: (s) => <SiScrimba size={s} />,
  ibm: () => <span className="text-[10px] font-bold tracking-tight">IBM</span>,
};

const FLOATING_ICONS_DATA = [
  { Icon: SiGoogle, label: "Google", x: "10%", y: "15%", delay: 0, size: 24 },
  { Icon: SiCoursera, label: "Coursera", x: "85%", y: "20%", delay: 1, size: 24 },
  { Icon: SiScrimba, label: "Scrimba", x: "90%", y: "70%", delay: 2, size: 20 },
  { Icon: HiBadgeCheck, label: "Certified", x: "8%", y: "75%", delay: 0.5, size: 22 },
  { Icon: HiSparkles, label: "AI", x: "50%", y: "10%", delay: 1.5, size: 18 },
  { Icon: HiCode, label: "Code", x: "50%", y: "88%", delay: 2.5, size: 20 },
  { Icon: HiAcademicCap, label: "Learning", x: "92%", y: "45%", delay: 3, size: 22 },
];

const COUNTERS = [
  { label: "Certificates", target: 4, suffix: "+" },
  { label: "Learning Hours", target: 280, suffix: "+" },
  { label: "Skills Acquired", target: 18, suffix: "+" },
  { label: "Platforms", target: 3, suffix: "" },
];

const TIMELINE_EVENTS = [...CERTIFICATIONS].sort(
  (a, b) =>
    new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime(),
);

const BADGES = [
  { label: "Google Certified", color: "from-blue-500 to-cyan-500" },
  { label: "IBM Certified", color: "from-indigo-500 to-blue-500" },
  { label: "AI Certified", color: "from-purple-500 to-pink-500" },
  { label: "Continuous Learner", color: "from-primary to-accent" },
];

/* ───── Image Preloader ───── */

function ImagePreloader({ images }: { images: string[] }) {
  useEffect(() => {
    for (const src of images) {
      const img = new Image();
      img.src = src;
    }
  }, [images]);
  return null;
}

/* ───── 2D Particle Field with cursor interaction ───── */

const ParticleField = React.memo(function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursor = useCursorPosition();
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number; baseX: number; baseY: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(55, Math.floor(window.innerWidth / 22));
    particlesRef.current = Array.from({ length: count }, () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      return {
        x, y, baseX: x, baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.4,
        opacity: Math.random() * 0.35 + 0.06,
        hue: Math.random() > 0.5 ? 190 : 270,
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = cursor.x * (canvas.width / window.innerWidth);
      const cy = cursor.y * (canvas.height / window.innerHeight);

      for (const p of particlesRef.current) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += dx * force * 0.04;
          p.y += dy * force * 0.04;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 75%, 60%, ${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        const pi = particlesRef.current[i];
        if (!pi) continue;
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const pj = particlesRef.current[j];
          if (!pj) continue;
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.03 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [cursor]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }} />;
});

/* ───── Cursor Spotlight ───── */

const CursorSpotlight = React.memo(function CursorSpotlight() {
  const cursor = useCursorPosition();
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-all duration-200"
      style={{
        background: `radial-gradient(900px at ${cursor.x}px ${cursor.y}px, rgba(6,182,212,0.035) 0%, transparent 60%)`,
      }}
    />
  );
});

/* ───── Scroll Progress ───── */

const ScrollProgress = React.memo(function ScrollProgress({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + rect.top;
      const scrolled = -rect.top;
      const p = Math.min(100, Math.max(0, (scrolled / (total - window.innerHeight)) * 100));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRef]);

  return (
    <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/[0.03]" role="progressbar" aria-valuenow={Math.round(progress)} aria-label="Section scroll progress">
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
});

/* ───── Glow Orbs ───── */

const GlowOrbs = React.memo(function GlowOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb-float absolute -top-40 -left-40 h-80 w-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />
      <div className="orb-float absolute -bottom-40 -right-40 h-96 w-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", animationDelay: "-4s" }} />
      <div className="orb-float absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", animationDelay: "-8s" }} />
    </div>
  );
});

/* ───── Floating Logos ───── */

const FloatingLogos = React.memo(function FloatingLogos() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {FLOATING_ICONS_DATA.map((item) => (
        <motion.div
          key={item.label}
          className="absolute text-white/[0.06]"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.1, 0.05, 0.1, 0.07], y: [0, -18, -8, -22, -4], scale: 1 }}
          transition={{ duration: 7, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}
    </div>
  );
});

/* ───── Floating Achievement Badges ───── */

const FloatingBadges = React.memo(function FloatingBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {BADGES.map((badge, i) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="relative group"
        >
          <div className={`rounded-full bg-gradient-to-r ${badge.color} p-[1px]`}>
            <div className="rounded-full bg-deep-navy/90 backdrop-blur-sm px-4 py-1.5 transition-colors group-hover:bg-deep-navy/70">
              <span className="text-xs font-semibold text-white/90">{badge.label}</span>
            </div>
          </div>
          <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${badge.color} opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30`} />
        </motion.div>
      ))}
    </div>
  );
});

/* ───── Holographic Label ───── */

const HolographicLabel = React.memo(function HolographicLabel({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span className="text-primary/40 text-[10px] font-mono tracking-[0.25em] uppercase">{text}</span>
      <span className="absolute inset-0 text-primary/15 text-[10px] font-mono tracking-[0.25em] uppercase blur-[2px] select-none">{text}</span>
      <span className="absolute -inset-x-2 inset-y-0 text-primary/5 text-[10px] font-mono tracking-[0.25em] uppercase blur-[4px] select-none scale-x-110">{text}</span>
    </span>
  );
});

/* ───── Learning Timeline ───── */

const LearningTimeline = React.memo(function LearningTimeline() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="relative">
      <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px bg-gradient-to-b from-primary via-accent/60 to-transparent" />
      {TIMELINE_EVENTS.map((event, i) => {
        const isLeft = i % 2 === 0;
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className={`relative flex items-start mb-10 last:mb-0 ${isMobile ? "pl-10" : isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
          >
            <div className="absolute left-[9px] md:left-1/2 md:-translate-x-1/2 top-1 z-10">
              <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(6,182,212,0.4)] border-2 border-deep-navy" />
            </div>
            <div className={`${isMobile ? "w-full" : "md:w-[calc(50%-28px)]"} ${isLeft && !isMobile ? "md:pr-8 md:text-right" : !isMobile ? "md:pl-8" : ""}`}>
              <div className="glass-card rounded-xl p-4 border border-white/[0.04] hover:border-primary/20 transition-colors">
                <HolographicLabel text={event.completionDate} />
                <h4 className="text-sm font-bold text-white mt-2 leading-snug">{event.title}</h4>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[11px] font-medium text-accent/80">{event.issuer}</span>
                  <span className="text-white/10">•</span>
                  <span className="text-[11px] text-text-muted">{event.provider}</span>
                </div>
                <p className="text-xs text-text-muted/70 mt-2 line-clamp-2">{event.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

/* ───── Magnetic Hover ───── */

const MagneticWrap = React.memo(function MagneticWrap({ children, className, strength = 0.2 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }, [strength, x, y]);

  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ x, y }} className={className}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.1 }}>
      {children}
    </motion.div>
  );
});

/* ───── GSAP Animated Counter ───── */

const AnimatedCounter = React.memo(function AnimatedCounter({ target, label, suffix }: { target: number; label: string; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || counted.current) return;
      counted.current = true;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2.5, ease: "power3.out",
        onUpdate: () => { if (valueRef.current) valueRef.current.textContent = Math.floor(obj.val).toString(); },
      });
      observer.unobserve(el);
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="flex items-baseline justify-center gap-0.5">
        <span ref={valueRef} className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">0</span>
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent sm:text-2xl">{suffix}</span>
      </div>
      <p className="mt-1 text-[10px] font-medium tracking-wide text-text-muted uppercase sm:text-xs">{label}</p>
    </div>
  );
});

/* ───── Skeleton Box ───── */

const SkeletonBox = React.memo(function SkeletonBox() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl bg-white/[0.015]">
      <div className="absolute inset-0 -translate-x-full skeleton-shimmer" />
    </div>
  );
});

/* ───── Certification Card ───── */

const CertificationCard = React.memo(function CertificationCard({ cert, onView, isCompact = false }: {
  cert: Certification; onView: () => void; isCompact?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    cardRef.current.style.transform = `perspective(1200px) rotateX(${((y - cy) / cy) * -5}deg) rotateY(${((x - cx) / cx) * 5}deg) scale3d(1.015, 1.015, 1.015)`;
    const shine = cardRef.current.querySelector(".card-shine-glow") as HTMLElement | null;
    if (shine) shine.style.background = `radial-gradient(circle at ${(x / r.width) * 100}% ${(y / r.height) * 100}%, rgba(6,182,212,0.1) 0%, transparent 60%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    const shine = cardRef.current.querySelector(".card-shine-glow") as HTMLElement | null;
    if (shine) shine.style.background = "transparent";
  }, []);

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      className={`gradient-border-glow card-shine group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.015] transition-shadow duration-300 hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.15)] ${isCompact ? "h-[380px]" : "h-[580px]"} flex flex-col`}
      style={{ transformStyle: "preserve-3d", willChange: "transform", backfaceVisibility: "hidden" }}>
      <div className="card-shine-glow absolute inset-0 pointer-events-none transition-all duration-300" />
      <div className={`relative overflow-hidden shrink-0 ${isCompact ? "h-[180px]" : "h-[240px]"}`} style={{ transform: "translateZ(12px)" }}>
        {!imgLoaded && !imgError && <SkeletonBox />}
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/[0.01] to-white/[0.03]">
            <div className="flex flex-col items-center gap-2 text-text-muted">
              <HiCode size={28} className="opacity-30" />
              <span className="text-xs opacity-50">{cert.title}</span>
            </div>
          </div>
        ) : (
          <img src={cert.image} alt={cert.title}
            className={`h-full w-full object-contain transition-all duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy" decoding="async" onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }} />
        )}
        <div className="absolute right-3 top-3" style={{ transform: "translateZ(20px)" }}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm border border-white/[0.06]">
            {PROVIDER_ICONS[cert.providerIcon]?.(10) ?? null}
            <span>{cert.provider}</span>
          </span>
        </div>
        <div className="absolute left-3 bottom-3" style={{ transform: "translateZ(18px)" }}>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-primary uppercase backdrop-blur-sm border border-primary/10">
            <HiStar size={8} />
            {cert.issuer === "Google" ? "Google Certified" : "Professional"}
          </span>
        </div>
      </div>
      <div className={isCompact ? "p-4" : "p-5"} style={{ transform: "translateZ(22px)" }}>
        <h3 className={`font-bold text-gray-100 transition-colors group-hover:text-primary line-clamp-2 ${isCompact ? "text-sm" : "text-base sm:text-lg"}`}>
          {cert.title}
        </h3>
        <div className={`mt-2 flex items-center gap-2 text-text-muted ${isCompact ? "text-[10px]" : "text-xs"}`}>
          <HiCalendar size={isCompact ? 10 : 12} />
          <span>{cert.completionDate}</span>
          <span className="text-white/[0.06]">|</span>
          <span className="font-medium text-accent/70">{cert.issuer}</span>
          {!isCompact && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/15">
              <HiBadgeCheck size={8} />
              Verified
            </span>
          )}
        </div>
        {!isCompact && (
          <>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-400">{cert.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {cert.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-gray-400 border border-white/[0.04]">{skill}</span>
              ))}
              {cert.skills.length > 4 && <span className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-gray-500">+{cert.skills.length - 4}</span>}
            </div>
          </>
        )}
        <div className={`flex items-center gap-3 ${isCompact ? "mt-4" : "mt-5"}`}>
          <MagneticWrap className="min-w-0 flex-1" strength={0.15}>
            <button onClick={onView} className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary/10 transition-all hover:shadow-xl hover:shadow-primary/20" aria-label={`View ${cert.title}`}>
              {isCompact ? "View" : "View Certificate"}
            </button>
          </MagneticWrap>
          {(cert.verifyUrl || cert.credlyUrl) && (
            <MagneticWrap strength={0.1}>
              <a href={cert.verifyUrl ?? cert.credlyUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-gray-400 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:border-white/20 hover:text-primary"
                aria-label={`Verify ${cert.title}`} title="Verify on provider site">
                <HiExternalLink size={14} />
              </a>
            </MagneticWrap>
          )}
        </div>
      </div>
    </div>
  );
});

/* ───── CoverFlow Carousel ───── */

const CoverFlow = React.memo(function CoverFlow({ cards, onViewCert }: { cards: Certification[]; onViewCert: (c: Certification) => void }) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const goPrev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const goNext = useCallback(() => setCurrent((c) => Math.min(cards.length - 1, c + 1)), [cards.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => { touchStartX.current = e.touches[0]!.clientX; }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0]!.clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  }, [goNext, goPrev]);
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  }, [goPrev, goNext]);

  return (
    <div ref={containerRef} className="relative select-none min-h-[380px] md:min-h-[580px]" role="region" aria-label="Certificate carousel" onKeyDown={handleKeyDown}>
      <div className={`relative flex items-center justify-center ${isMobile ? "overflow-hidden" : "overflow-visible"}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {cards.map((cert, i) => {
          const offset = i - current;
          const anim = isMobile
          ? { x: `${offset * 100}%`, scale: offset === 0 ? 1 : 0.9, opacity: offset === 0 ? 1 : 0 }
          : offset === 0
          ? { x: 0, scale: 1, rotateY: 0, opacity: 1 }
          : Math.abs(offset) === 1
          ? { x: offset * 360, scale: 0.75, rotateY: offset * -15, opacity: 0.4 }
          : Math.abs(offset) === 2
          ? { x: offset * 450, scale: 0.55, rotateY: offset * -20, opacity: 0.15 }
          : { x: offset * 520, scale: 0.4, rotateY: offset * -25, opacity: 0 };
          return (
            <motion.div key={cert.id} animate={anim}
              transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.7 }}
              className="absolute cursor-pointer inset-x-0 mx-auto w-[calc(100%-32px)] sm:w-[350px] overflow-hidden rounded-2xl" style={{ transformStyle: "preserve-3d", willChange: "transform", backfaceVisibility: "hidden", zIndex: offset === 0 ? 30 : Math.abs(offset) === 1 ? 15 : Math.abs(offset) === 2 ? 5 : 0, filter: isMobile ? "none" : offset === 0 ? "none" : Math.abs(offset) === 1 ? "blur(0.5px)" : "blur(1.5px)" }}
              onClick={() => { if (i !== current) setCurrent(i); else onViewCert(cert); }}
              role="button" tabIndex={i === current ? 0 : -1}
              aria-label={`${cert.title}${i === current ? " (active)" : ""}`} aria-current={i === current ? "true" : undefined}>
              <CertificationCard cert={cert} onView={() => onViewCert(cert)} isCompact={isMobile} />
            </motion.div>
          );
        })}
      </div>
      {!isMobile && current > 0 && (
        <button onClick={goPrev} className="absolute left-0 top-1/2 z-30 -translate-y-1/2 -translate-x-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] text-gray-400 backdrop-blur-sm border border-white/[0.06] transition-all hover:bg-white/10 hover:text-primary hover:border-primary/30" aria-label="Previous certificate">
          <HiChevronLeft size={20} />
        </button>
      )}
      {!isMobile && current < cards.length - 1 && (
        <button onClick={goNext} className="absolute right-0 top-1/2 z-30 -translate-y-1/2 translate-x-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] text-gray-400 backdrop-blur-sm border border-white/[0.06] transition-all hover:bg-white/10 hover:text-primary hover:border-primary/30" aria-label="Next certificate">
          <HiChevronRight size={20} />
        </button>
      )}
      <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Certificate navigation">
        {cards.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-gradient-to-r from-primary to-accent shadow-[0_0_8px_rgba(6,182,212,0.3)]" : "w-2 bg-white/[0.12] hover:bg-white/30"}`}
            role="tab" aria-selected={i === current} aria-label={`Go to certificate ${i + 1}`} />
        ))}
      </div>
    </div>
  );
});

/* ───── Main Section ───── */

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { play } = useAudio();

  const openModal = useCallback((cert: Certification) => {
    play({ type: "open" });
    setSelectedCert(cert);
  }, [play]);

  const closeModal = useCallback(() => {
    play({ type: "close" });
    setSelectedCert(null);
  }, [play]);

  return (
    <section id="certifications" ref={sectionRef} className="relative overflow-hidden px-6 pt-48 pb-24 scroll-mt-20">
      <ImagePreloader images={CERTIFICATIONS.map((c) => c.image)} />
      <ScrollProgress sectionRef={sectionRef} />
      <Suspense fallback={<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden />}><ThreeBackground /></Suspense>
      <ParticleField />
      <CursorSpotlight />
      <GlowOrbs />
      <FloatingLogos />

      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.03) 0%, transparent 60%)" }} />
      <div className="cert-grid-pattern absolute inset-0 pointer-events-none opacity-20" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
          <HolographicLabel text="Certifications" />
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Continuous{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent shimmer-text">Learning</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
            Professional certifications demonstrating expertise in IT support, AI application development, and modern web technologies.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4 rounded-2xl border border-white/[0.04] bg-white/[0.015] px-5 py-7 backdrop-blur-sm sm:px-6 sm:py-8">
          {COUNTERS.map((c) => (
            <AnimatedCounter key={c.label} target={c.target} label={c.label} suffix={c.suffix} />
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex items-center justify-center gap-3">
          <div className="pulse-ring h-2 w-2 rounded-full bg-primary" />
          <span className="text-xs font-medium tracking-wider text-text-muted uppercase">Continuous Learner — Always expanding my skill set</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14">
          <div className="flex items-center gap-3 mb-6">
            <HolographicLabel text="Learning Journey" />
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 via-accent/20 to-transparent" />
          </div>
          <LearningTimeline />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mt-16">
          <div className="flex items-center gap-3 mb-6">
            <HolographicLabel text="Certificate Gallery" />
            <div className="h-px flex-1 bg-gradient-to-r from-accent/30 via-primary/20 to-transparent" />
          </div>
          <CoverFlow cards={CERTIFICATIONS} onViewCert={openModal} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12">
          <FloatingBadges />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <HolographicLabel text="Global Reach" />
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <Suspense fallback={<div className="relative h-[350px] md:h-[420px] w-full overflow-hidden rounded-3xl" />}><InteractiveEarth /></Suspense>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-12 text-center">
          <p className="text-xs text-text-muted">
            Certifications from <span className="font-medium text-primary">Google</span>,{" "}
            <span className="font-medium text-accent">IBM</span>, and industry leaders
          </p>
        </motion.div>
      </div>

      <CertificationModal cert={selectedCert} onClose={closeModal} />
    </section>
  );
}
