import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { HiMail, HiPaperAirplane } from "react-icons/hi";
import { api } from "../api/client";
import type { ContactPayload } from "../types";

const initialForm: ContactPayload = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<ContactPayload>(initialForm);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      const res = await api.submitContact(form);
      setStatus({ type: "success", text: res.message });
      setForm(initialForm);
    } catch (err) {
      setStatus({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            Contact
          </span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-3 max-w-lg text-gray-400">
            Have a project in mind or just want to say hi? Fill out the form
            below and I'll get back to you.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-5 lg:col-span-3"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-medium text-gray-400"
                >
                  Name *
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="glass-card w-full rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-200 focus:border-primary/30 focus:bg-white/[0.06]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-gray-400"
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="glass-card w-full rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-200 focus:border-primary/30 focus:bg-white/[0.06]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-1.5 block text-xs font-medium text-gray-400"
              >
                Subject
              </label>
              <input
                id="subject"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                className="glass-card w-full rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-200 focus:border-primary/30 focus:bg-white/[0.06]"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-xs font-medium text-gray-400"
              >
                Message *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                className="glass-card w-full resize-none rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-200 focus:border-primary/30 focus:bg-white/[0.06]"
                placeholder="Tell me about your project or idea..."
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    <HiPaperAirplane size={16} className="-rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    Send Message
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-300 group-hover:translate-x-full" />
            </button>

            {status && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm ${
                  status.type === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {status.text}
              </motion.p>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                <HiMail size={22} />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">
                Let's talk
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                I'm always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </p>
              <a
                href="mailto:akbareur@gmail.com"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
              >
                akbareur@gmail.com
                <HiPaperAirplane size={14} className="-rotate-45" />
              </a>
              <p className="mt-2 text-sm text-gray-500">
                +998 94 734 51 00
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
