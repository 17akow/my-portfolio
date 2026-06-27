import { motion } from "framer-motion";
import { HiCode, HiLightningBolt, HiAcademicCap } from "react-icons/hi";

const HIGHLIGHTS = [
  {
    icon: HiCode,
    title: "Full Stack Development",
    description: "2+ years building responsive UIs with React.js and REST APIs with Django.",
    gradient: "from-primary to-cyan-400",
  },
  {
    icon: HiLightningBolt,
    title: "AI Integration",
    description: "Experience integrating OpenAI, Groq LLMs, and building AI-powered chatbots.",
    gradient: "from-accent to-purple-400",
  },
  {
    icon: HiAcademicCap,
    title: "Computer Science",
    description: "1st-year BSc CS student at WIUT with Google IT Support certification.",
    gradient: "from-primary to-accent",
  },
];

export default function About() {
  return (
    <section id="about" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            About Me
          </span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Building the future,{" "}
            <span className="text-gray-400">one line at a time</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5 text-base leading-relaxed text-gray-400"
          >
            <p>
              I'm a{" "}
              <span className="text-gray-200">Full Stack Developer</span> and
              Computer Science student with 2+ years of experience building
              modern web applications and AI-powered solutions. I specialize in
              React.js, JavaScript, Python, Django, and REST API development.
            </p>
            <p>
              I've developed 10+ web projects including landing pages,
              portfolios, dashboards, and full-stack e-commerce platforms.
              I'm proficient in React.js, Tailwind CSS, Django REST Framework,
              PostgreSQL, and JWT authentication.
            </p>
            <p>
              I also hold a{" "}
              <span className="text-gray-200">Google IT Support Professional Certificate</span>
              {" "}and speak Uzbek (native), Russian (fluent), and English
              (IELTS 6.0). I'm open to remote opportunities worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-4"
          >
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="glass-card group flex items-start gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
                >
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
