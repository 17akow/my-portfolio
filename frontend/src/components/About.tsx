import { motion } from "framer-motion";
import { HiCode, HiLightningBolt, HiColorSwatch } from "react-icons/hi";

const HIGHLIGHTS = [
  {
    icon: HiCode,
    title: "Clean Code",
    description: "Write readable, maintainable code that scales.",
  },
  {
    icon: HiLightningBolt,
    title: "Fast Delivery",
    description: "Ship production-ready features with confidence.",
  },
  {
    icon: HiColorSwatch,
    title: "Pixel Perfect",
    description: "Craft beautiful, responsive UIs that users love.",
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
              I'm a full-stack developer and AI engineer with{" "}
              <span className="text-gray-200">5+ years</span> of experience
              building products from idea to production. I specialize in
              Python, TypeScript, and cloud-native architectures.
            </p>
            <p>
              My work spans fintech, edtech, and developer tooling — from
              real-time analytics dashboards handling millions of events to
              ML model serving platforms running at scale.
            </p>
            <p>
              When I'm not coding, I contribute to open source projects,
              write technical articles, and explore the latest in AI and
              systems design.
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
                className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-primary/20 hover:bg-primary/[0.03]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
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
