import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiExternalLink, HiCalendar } from "react-icons/hi";
import type { Certification } from "./Certifications";

export default function CertificationModal({
  cert,
  onClose,
}: {
  cert: Certification | null;
  onClose: () => void;
}) {
  const [imgZoom, setImgZoom] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (cert) {
      window.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [cert, onClose]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={cert.title}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl" />

          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/[0.06] bg-deep-navy/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
              aria-label="Close modal"
            >
              <HiX size={18} />
            </button>

            <div className="grid md:grid-cols-5">
              <div className="relative col-span-3 flex items-center justify-center bg-deep-navy p-3">
                <motion.img
                  src={cert.image}
                  alt={cert.title}
                  onClick={() => setImgZoom(!imgZoom)}
                  className={`max-h-[50vh] w-full rounded-2xl object-contain transition-all duration-500 md:max-h-[75vh] ${
                    imgZoom ? "scale-110 cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.style.display = "none";
                    if (t.parentElement) {
                      t.parentElement.classList.add(
                        "flex",
                        "items-center",
                        "justify-center",
                        "min-h-[250px]",
                      );
                      const fb = document.createElement("div");
                      fb.className =
                        "flex flex-col items-center gap-3 text-gray-500";
                      fb.innerHTML = `
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                        </svg>
                        <span class="text-sm">Preview not available</span>
                      `;
                      t.parentElement.appendChild(fb);
                    }
                  }}
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <span className="text-[11px] font-medium text-text-muted/60">
                    Click image to zoom
                  </span>
                </div>
              </div>

              <div className="col-span-2 flex flex-col justify-center p-6 md:p-8">
                <div className="mb-3 flex items-center gap-2.5">
                  <span
                    className={
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider uppercase " +
                      (cert.issuer === "Google"
                        ? "bg-blue-500/10 text-blue-400"
                        : cert.issuer === "IBM"
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "bg-accent/10 text-accent")
                    }
                  >
                    {cert.issuer}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/10" />
                  <span className="text-xs text-text-muted">{cert.provider}</span>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">
                  {cert.title}
                </h3>

                <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
                  <HiCalendar size={14} />
                  <span>{cert.completionDate}</span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  {cert.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary/8 px-3 py-1.5 text-[11px] font-medium text-primary/70 border border-primary/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={onClose}
                    className="rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary/15 transition-all hover:shadow-xl hover:shadow-primary/25"
                  >
                    Close
                  </button>
                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-2.5 text-xs font-semibold text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
                    >
                      Verify on {cert.provider}
                      <HiExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
