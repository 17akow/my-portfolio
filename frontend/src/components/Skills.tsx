import { motion } from "framer-motion";
import { useApi } from "../hooks/useApi";
import { api } from "../api/client";

const proficiencyMap: Record<number, { label: string; color: string }> = {
  1: { label: "Beginner", color: "bg-red-500" },
  2: { label: "Elementary", color: "bg-orange-500" },
  3: { label: "Intermediate", color: "bg-yellow-500" },
  4: { label: "Advanced", color: "bg-green-500" },
  5: { label: "Expert", color: "bg-primary" },
};

export default function Skills() {
  const { data: categories, loading } = useApi(() => api.getSkills(), []);

  return (
    <section id="skills" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            Skills & Expertise
          </span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Technologies I work with
          </h2>
        </motion.div>

        {loading && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <div className="h-5 w-24 rounded bg-white/10" />
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-1.5">
                    <div className="h-3 w-20 rounded bg-white/10" />
                    <div className="h-2.5 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {categories && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, catIdx) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10"
              >
                <h3 className="mb-5 text-sm font-semibold tracking-wider text-primary uppercase">
                  {cat.category}
                </h3>
                <div className="space-y-4">
                  {cat.skills.map((skill) => {
                    const meta = proficiencyMap[skill.proficiency] ?? proficiencyMap[3]!;
                    return (
                      <div key={skill.id}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-300">
                            {skill.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {meta.label}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency * 20}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: catIdx * 0.1,
                              ease: "easeOut",
                            }}
                            className={`h-full rounded-full ${meta.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
