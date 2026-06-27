import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HiArrowDown,
  HiCube,
  HiCode,
  HiServer,
  HiChip,
} from "react-icons/hi";

const TYPING_TITLES = [
  "Full Stack Developer",
  "React.js Developer",
  "Django Developer",
  "AI Integration Specialist",
];

const geometricShapes = [
  { type: "cube", x: "8%", y: "15%", delay: 0, size: 48, rotation: 0 },
  { type: "sphere", x: "75%", y: "20%", delay: 0.8, size: 36, rotation: 45 },
  { type: "tetra", x: "20%", y: "72%", delay: 1.5, size: 42, rotation: 30 },
  { type: "cube", x: "85%", y: "70%", delay: 0.3, size: 32, rotation: 60 },
  { type: "sphere", x: "50%", y: "10%", delay: 2, size: 28, rotation: 90 },
  { type: "tetra", x: "65%", y: "85%", delay: 1.2, size: 38, rotation: 15 },
];

const techIcons = [
  { Icon: HiCode, x: "12%", y: "35%", delay: 0.5, size: 24 },
  { Icon: HiServer, x: "88%", y: "40%", delay: 1, size: 20 },
  { Icon: HiCube, x: "10%", y: "55%", delay: 1.5, size: 22 },
  { Icon: HiChip, x: "82%", y: "60%", delay: 2, size: 26 },
];

const ShapeComponent = ({
  type,
  size,
  rotation,
}: {
  type: string;
  size: number;
  rotation: number;
}) => {
  const base =
    "absolute border border-primary/20 shadow-lg shadow-primary/5";

  if (type === "sphere") {
    return (
      <div
        className={`${base} rounded-full bg-gradient-to-br from-primary/5 to-accent/5`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (type === "tetra") {
    return (
      <div
        className={`${base} bg-gradient-to-tr from-primary/5 to-transparent`}
        style={{
          width: size,
          height: size,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          transform: `rotate(${rotation}deg)`,
        }}
      />
    );
  }

  return (
    <div
      className={`${base} bg-gradient-to-br from-accent/5 to-transparent`}
      style={{
        width: size,
        height: size,
        borderRadius: "4px",
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
};

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const currentTitle = TYPING_TITLES[titleIndex] ?? "";

  useEffect(() => {
    let pause: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      if (!deleting && charIndex < currentTitle.length) {
        setCharIndex((i) => i + 1);
      } else if (!deleting && charIndex === currentTitle.length) {
        pause = setTimeout(() => setDeleting(true), 1500);
      } else if (deleting && charIndex > 0) {
        setCharIndex((i) => i - 1);
      } else if (deleting && charIndex === 0) {
        setDeleting(false);
        setTitleIndex((i) => (i + 1) % TYPING_TITLES.length);
      }
    };

    const timeout = setTimeout(tick, deleting ? 30 : 60);

    return () => {
      clearTimeout(timeout);
      if (pause) clearTimeout(pause);
    };
  }, [charIndex, deleting, titleIndex, currentTitle.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <div className="animated-gradient pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, rgba(6,182,212,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(168,85,247,0.12) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="geo-shape absolute inset-0 overflow-hidden">
        {geometricShapes.map((shape, i) => (
          <motion.div
            key={i}
            className="float-slow"
            style={{ left: shape.x, top: shape.y, position: "absolute" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: shape.delay, duration: 1.5, ease: "easeOut" }}
          >
            <ShapeComponent
              type={shape.type}
              size={shape.size}
              rotation={shape.rotation}
            />
          </motion.div>
        ))}
      </div>

      {techIcons.map(({ Icon, x, y, delay, size }) => (
        <motion.div
          key={`${x}-${y}`}
          className="pointer-events-none absolute text-primary/8"
          style={{ left: x, top: y }}
          animate={{ y: [0, -16, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-medium tracking-wider text-primary uppercase shadow-lg shadow-primary/5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse mr-2" />
            Available for hire
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-6 text-5xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl tracking-tight"
        >
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent glow-text bg-[length:200%_auto] animate-pulse-glow">
            Akbarbek
          </span>
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mt-6 flex items-center justify-center gap-1.5 text-2xl sm:text-3xl md:text-4xl"
        >
          <span className="text-primary/50 font-mono">&gt;</span>
          <span className="min-h-[1.2em] font-mono text-gray-200 font-light">
            {currentTitle.slice(0, charIndex)}
          </span>
          <span className="cursor-blink inline-block h-[1.1em] w-[3px] bg-primary" />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg"
        >
          Motivated Full Stack Developer and Computer Science student with 2+
          years of experience building modern web applications and AI-powered
          solutions. Open to remote opportunities worldwide.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-105"
          >
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-300 group-hover:translate-x-full" />
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-gray-300 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-primary/10"
          >
            Get in Touch
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 transition-colors hover:text-primary"
      >
        <HiArrowDown className="float-animation" size={24} />
      </motion.a>
    </section>
  );
}
