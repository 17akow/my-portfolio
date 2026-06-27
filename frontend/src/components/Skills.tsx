import { motion } from "framer-motion";

const SKILL_CATEGORIES = [
  {
    category: "Frontend",
    skills: [
      { name: "HTML5", proficiency: 5 },
      { name: "CSS3 / Tailwind CSS", proficiency: 5 },
      { name: "JavaScript ES6+", proficiency: 5 },
      { name: "React.js", proficiency: 5 },
      { name: "Redux Toolkit", proficiency: 4 },
      { name: "React Router", proficiency: 4 },
      { name: "Axios / Fetch API", proficiency: 4 },
      { name: "TypeScript (Basic)", proficiency: 3 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Python", proficiency: 5 },
      { name: "Django", proficiency: 4 },
      { name: "Django REST Framework", proficiency: 4 },
      { name: "PostgreSQL", proficiency: 4 },
      { name: "JWT Authentication", proficiency: 4 },
      { name: "API Development", proficiency: 4 },
    ],
  },
  {
    category: "AI & Tools",
    skills: [
      { name: "OpenAI API", proficiency: 4 },
      { name: "AI Chatbots", proficiency: 4 },
      { name: "Prompt Engineering", proficiency: 4 },
      { name: "Git & GitHub", proficiency: 4 },
      { name: "Linux / Bash", proficiency: 3 },
      { name: "Docker (Basic)", proficiency: 2 },
    ],
  },
];

const proficiencyMap: Record<number, { label: string; color: string }> = {
  1: { label: "Beginner", color: "bg-red-500" },
  2: { label: "Elementary", color: "bg-orange-500" },
  3: { label: "Intermediate", color: "bg-yellow-500" },
  4: { label: "Advanced", color: "bg-green-500" },
  5: { label: "Expert", color: "bg-primary" },
};

export default function Skills() {
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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((cat, catIdx) => (
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
                    <div key={skill.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {meta.label}
                        </span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-white/5"
                        role="progressbar"
                        aria-valuenow={skill.proficiency}
                        aria-valuemin={1}
                        aria-valuemax={5}
                        aria-label={`${skill.name}: ${meta.label}`}
                      >
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
      </div>
    </section>
  );
}
