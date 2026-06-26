import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HiArrowDown,
  HiCode,
  HiCube,
  HiServer,
  HiChip,
} from "react-icons/hi";

const TYPING_TITLES = [
  "Full-Stack Developer",
  "AI Engineer",
  "System Architect",
  "Open Source Contributor",
];

const floatingIcons = [
  { Icon: HiCode, x: "10%", y: "20%", delay: 0, size: 28 },
  { Icon: HiCube, x: "85%", y: "30%", delay: 0.5, size: 24 },
  { Icon: HiServer, x: "15%", y: "70%", delay: 1, size: 22 },
  { Icon: HiChip, x: "80%", y: "75%", delay: 1.5, size: 26 },
];

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const currentTitle = TYPING_TITLES[titleIndex] ?? "";

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!deleting && charIndex < currentTitle.length) {
          setCharIndex((i) => i + 1);
        } else if (!deleting && charIndex === currentTitle.length) {
          setTimeout(() => setDeleting(true), 1500);
        } else if (deleting && charIndex > 0) {
          setCharIndex((i) => i - 1);
        } else if (deleting && charIndex === 0) {
          setDeleting(false);
          setTitleIndex((i) => (i + 1) % TYPING_TITLES.length);
        }
      },
      deleting ? 30 : 60
    );
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, titleIndex, currentTitle.length]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-gray-950" />

      {floatingIcons.map(({ Icon, x, y, delay, size }) => (
        <motion.div
          key={`${x}-${y}`}
          className="pointer-events-none absolute text-primary/10"
          style={{ left: x, top: y }}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-wider text-primary uppercase">
            Available for hire
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Akbar
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-4 flex items-center justify-center gap-1 text-xl sm:text-2xl md:text-3xl"
        >
          <span className="text-gray-400">{">"}</span>
          <span className="min-h-[1.2em] font-mono text-gray-200">
            {currentTitle.slice(0, charIndex)}
          </span>
          <span className="cursor-blink inline-block h-[1.1em] w-[3px] bg-primary" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg"
        >
          I build scalable web applications and AI-powered solutions.
          Passionate about clean architecture, developer experience, and
          creating products that make a difference.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:border-primary/30 hover:text-white"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 transition-colors hover:text-primary"
      >
        <HiArrowDown className="float-animation" size={24} />
      </motion.a>
    </section>
  );
}
