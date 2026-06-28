import { useState, useRef, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiExternalLink, HiCode, HiEye } from "react-icons/hi";
import ProjectShowcase from "./ProjectShowcase";
import DashboardShowcase from "./DashboardShowcase";

const PROJECTS = [
  {
    id: 1,
    title: "AI Assistant Platform",
    short_description: "AI-powered chatbot with user authentication, conversation history, role-based access",
    description: "Full-stack AI chatbot platform with user authentication, conversation history persistence, role-based access control, and OpenAI/Groq integration. Built with React.js frontend and Django REST Framework backend with PostgreSQL.",
    tech_stack: ["React.js", "Django", "OpenAI API", "PostgreSQL", "JWT"],
    github_url: "https://github.com/17akow/ai-assistant",
    demo_url: null,
    featured: true,
    category: "Full-Stack",
    year: "2025",
    gradient: "from-purple-600/20 to-blue-600/20",
    iconColor: "text-purple-400/40",
    previewImage: "/projects/Image1.png",
  },
  {
    id: 2,
    title: "Full Stack Dashboard",
    short_description: "Responsive admin dashboard with charts, analytics, user management",
    description: "Responsive admin dashboard featuring interactive charts and analytics, user management interface, and a secure REST API. Built with React.js frontend and Django REST Framework backend with PostgreSQL and Tailwind CSS styling.",
    tech_stack: ["React.js", "Django REST", "PostgreSQL", "Tailwind CSS", "Chart.js"],
    github_url: "https://github.com/17akow/dashboard",
    demo_url: null,
    featured: true,
    category: "Full-Stack",
    year: "2025",
    gradient: "from-blue-600/20 to-cyan-600/20",
    iconColor: "text-blue-400/40",
    previewImage: "/projects/dashboard/dashboard-hero.png",
  },
  {
    id: 3,
    title: "E-commerce Web Application",
    short_description: "Full-stack e-commerce with product management, cart, checkout, payment simulation",
    description: "Full-stack e-commerce platform with product management, shopping cart, checkout flow, and payment simulation. Features JWT authentication, PostgreSQL database, and a responsive React.js frontend.",
    tech_stack: ["React.js", "Django", "PostgreSQL", "JWT", "Tailwind CSS"],
    github_url: "https://github.com/17akow/ecommerce",
    demo_url: null,
    featured: false,
    category: "Full-Stack",
    year: "2025",
    gradient: "from-green-600/20 to-teal-600/20",
    iconColor: "text-green-400/40",
  },
  {
    id: 4,
    title: "Personal Portfolio Website",
    short_description: "Modern portfolio website to showcase skills and experience",
    description: "Modern personal portfolio website built with React, TypeScript, and Tailwind CSS. Showcases skills, projects, and professional experience with a clean responsive design and glassmorphism UI.",
    tech_stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github_url: null,
    demo_url: "https://akbarbek.dev",
    featured: true,
    category: "Frontend",
    year: "2025",
    gradient: "from-orange-600/20 to-pink-600/20",
    iconColor: "text-orange-400/40",
  },
];

export default function Projects() {
  const [filter, setFilter] = useState<string | null>(null);
  const [showcaseProject, setShowcaseProject] = useState<(typeof PROJECTS)[number] | null>(null);

  const categories = [...new Set(PROJECTS.map((p) => p.category).filter(Boolean))];

  const filtered = filter
    ? PROJECTS.filter((p) => p.category === filter)
    : PROJECTS;

  return (
    <section id="projects" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            Portfolio
          </span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Featured Projects
          </h2>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter(null)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
              filter === null
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "border border-white/10 text-gray-400 hover:border-primary/30 hover:text-white"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                filter === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "border border-white/10 text-gray-400 hover:border-primary/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter ?? "all"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onShowcase={project.id === 1 || project.id === 2 ? () => setShowcaseProject(project) : undefined} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {showcaseProject?.id === 2 ? (
        <DashboardShowcase project={showcaseProject} onClose={() => setShowcaseProject(null)} />
      ) : (
        <ProjectShowcase project={showcaseProject} onClose={() => setShowcaseProject(null)} />
      )}
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onShowcase,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  onShowcase?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div
        ref={cardRef}
        onClick={() => setExpanded(!expanded)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="gradient-border-glow group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.04]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`relative aspect-video overflow-hidden bg-gradient-to-br ${project.gradient}`}
          style={{ transform: "translateZ(20px)" }}
        >
          {project.previewImage ? (
            <>
              <img
                src={project.previewImage}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <HiCode size={40} className={project.iconColor} />
            </div>
          )}
        </div>

        <div className="p-5" style={{ transform: "translateZ(30px)" }}>
          <div className="mb-2 flex items-center gap-2">
            {project.featured && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
                Featured
              </span>
            )}
            {project.year && (
              <span className="text-[10px] font-medium text-gray-500">
                {project.year}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-100">
            {project.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400">
            {project.short_description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech_stack?.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-400"
              >
                {tech}
              </span>
            ))}
            {(project.tech_stack?.length ?? 0) > 4 && (
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                +{project.tech_stack!.length - 4}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            {onShowcase && (
              <button
                onClick={(e) => { e.stopPropagation(); onShowcase(); }}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg shadow-primary/10 transition-all hover:shadow-xl hover:shadow-primary/20"
              >
                <HiEye size={14} />
                Showcase
              </button>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary-dark"
              >
                <HiExternalLink size={14} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-b-2xl border-x border-b border-white/5 bg-white/[0.01]"
          >
            <div className="px-5 pb-5 pt-2">
              <p className="text-sm leading-relaxed text-gray-400">
                {project.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
