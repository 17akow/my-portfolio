import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiExternalLink, HiCode } from "react-icons/hi";
import { useApi } from "../hooks/useApi";
import { api } from "../api/client";
import type { Project } from "../types";

export default function Projects() {
  const { data: projects, loading } = useApi(() => api.getProjects(), []);
  const [filter, setFilter] = useState<string | null>(null);

  const categories = projects
    ? [...new Set(projects.map((p) => p.category).filter(Boolean))]
    : [];

  const filtered = filter
    ? projects?.filter((p) => p.category === filter)
    : projects;

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

        {loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <div className="mb-4 h-40 rounded-xl bg-white/10" />
                <div className="h-5 w-3/4 rounded bg-white/10" />
                <div className="mt-2 h-4 w-full rounded bg-white/5" />
                <div className="mt-4 flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-white/10" />
                  <div className="h-6 w-16 rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={filter ?? "all"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered?.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:border-primary/20 hover:bg-white/[0.04]"
      >
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10">
          <HiCode size={40} className="text-primary/30" />
        </div>

        <div className="p-5">
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
            {project.short_description || project.description}
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
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-white"
              >
                <HiCode size={14} />
                Source
              </a>
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
