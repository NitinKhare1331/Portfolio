"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { Mail, Phone, Github, Linkedin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";

/* ─── Floating background orb ────────────────────────────── */
function FloatingOrb({ className, style, duration = 12, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={style}
      animate={{
        scale:  [1, 1.15, 0.95, 1.08, 1],
        x:      [0, 30, -20, 12, 0],
        y:      [0, -20, 28, -10, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── Glassmorphic input ─────────────────────────────────── */
function GlassInput({
  id, label, type = "text", placeholder, value, onChange, error, disabled, multiline = false,
}) {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? "textarea" : "input";

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
        {label}
      </label>
      <div className="relative">
        {/* Glow border */}
        <div
          className="absolute -inset-px rounded-xl transition-all duration-300 pointer-events-none"
          style={{
            background: focused
              ? "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(34,211,238,0.3))"
              : error
              ? "linear-gradient(135deg, rgba(239,68,68,0.5), rgba(239,68,68,0.2))"
              : "transparent",
            opacity: 1,
          }}
        />
        <Tag
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={multiline ? 4 : undefined}
          className="relative w-full px-5 py-3.5 rounded-xl text-white placeholder-gray-600 text-sm outline-none transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: focused
              ? "rgba(20,12,40,0.95)"
              : "rgba(12,8,24,0.8)",
            border: `1px solid ${
              error ? "rgba(239,68,68,0.4)" :
              focused ? "rgba(139,92,246,0.6)" :
              "rgba(255,255,255,0.06)"
            }`,
            boxShadow: focused
              ? "0 0 0 4px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────────── */
function Toast({ status, message }) {
  if (status === "idle" || status === "sending") return null;
  return (
    <AnimatePresence>
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        className="flex items-start gap-3 p-4 rounded-2xl border"
        style={
          status === "success"
            ? { background: "rgba(5,46,22,0.8)", borderColor: "rgba(52,211,153,0.3)", boxShadow: "0 0 30px rgba(52,211,153,0.1)" }
            : { background: "rgba(50,10,10,0.8)", borderColor: "rgba(239,68,68,0.3)", boxShadow: "0 0 30px rgba(239,68,68,0.1)" }
        }
      >
        {status === "success"
          ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          : <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        }
        <p className={`text-sm leading-relaxed ${status === "success" ? "text-emerald-200" : "text-red-300"}`}>
          {message}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Main Section ───────────────────────────────────────── */
export default function ContactSection() {
  /* Section spotlight */
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(700px circle at ${mouseX}px ${mouseY}px, rgba(124,58,237,0.07), transparent 80%)`;

  const handleMouseMove = useCallback((e) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  }, [mouseX, mouseY]);

  /* Form state */
  const [form,   setForm]   = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [toast,  setToast]  = useState("");

  const updateField = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  /* Client-side validation */
  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    return e;
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("sending");
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || "Failed to send.");
      }

      setStatus("success");
      setToast(data.message || "Message sent! You'll receive a confirmation email shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setToast(err.message || "Something went wrong. Please try again.");
    } finally {
      setTimeout(() => setStatus("idle"), 5500);
    }
  };

  const sending = status === "sending";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-28 bg-[#000000] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Global spotlight */}
      <motion.div className="pointer-events-none absolute inset-0 z-0" style={{ background: spotlight }} />

      {/* Floating background orbs */}
      <FloatingOrb
        duration={16} delay={0}
        className="w-[600px] h-[600px] blur-[160px] -top-20 -left-32"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
      />
      <FloatingOrb
        duration={12} delay={3}
        className="w-[500px] h-[500px] blur-[140px] bottom-0 right-0"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)" }}
      />
      <FloatingOrb
        duration={20} delay={6}
        className="w-[300px] h-[300px] blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)" }}
      />

      {/* Grid dots */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

          {/* ── LEFT: Hero Text ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
              Initiate Contact
            </div>

            <h2 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
              Let&apos;s Build<br />
              Something{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #f472b6, #60a5fa)" }}
              >
                Amazing
              </span>
            </h2>

            <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-md font-light">
              Open to full-time roles, freelance projects, and ambitious collaborations. 
              Drop me a message and I&apos;ll get back within 24 hours.
            </p>

            {/* Contact links */}
            <div className="space-y-5 mb-12">
              {[
                {
                  icon: Mail,
                  href: "mailto:nitin.khare.03.13.2001@gmail.com",
                  label: "nitin.khare.03.13.2001@gmail.com",
                  color: "#a78bfa",
                },
                {
                  icon: Phone,
                  href: "tel:+917355079179",
                  label: "+91 7355 079 179",
                  color: "#34d399",
                },
              ].map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={href}
                  href={href}
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="flex items-center gap-5 group"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `rgba(${color === "#a78bfa" ? "167,139,250" : "52,211,153"},0.1)`,
                      border: `1px solid rgba(${color === "#a78bfa" ? "167,139,250" : "52,211,153"},0.2)`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors text-base font-medium">
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex gap-4">
              {[
                { icon: Linkedin, href: "www.linkedin.com/in/13-nitin-khare", color: "#0077b5", label: "LinkedIn" },
                { icon: Github,   href: "https://github.com/NitinKhare1331",       color: "#ffffff", label: "GitHub" },
              ].map(({ icon: Icon, href, color, label }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = color === "#0077b5" ? "rgba(0,119,181,0.2)" : "rgba(255,255,255,0.15)";
                    e.currentTarget.style.borderColor = color === "#0077b5" ? "rgba(0,119,181,0.5)" : "rgba(255,255,255,0.3)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Glassmorphic Form Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="relative group"
          >
            {/* Animated gradient border */}
            <div
              className="absolute -inset-px rounded-3xl transition-opacity duration-700 opacity-60 group-hover:opacity-100"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(34,211,238,0.2), rgba(244,114,182,0.3))",
              }}
            />

            {/* Card */}
            <div
              className="relative rounded-3xl p-8 sm:p-10"
              style={{
                background: "rgba(6,4,16,0.94)",
                backdropFilter: "blur(40px)",
                boxShadow: "0 0 80px rgba(139,92,246,0.12), 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Card header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Send className="w-4 h-4 text-violet-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl">Send a Message</h3>
                </div>
                <p className="text-gray-500 text-sm">
                  Fill in the form below. You&apos;ll receive a confirmation email immediately.
                </p>
              </div>

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <GlassInput
                  id="contact-name"
                  label="Your Name"
                  placeholder="Nitin Khare"
                  value={form.name}
                  onChange={updateField("name")}
                  error={errors.name}
                  disabled={sending}
                />

                <GlassInput
                  id="contact-email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField("email")}
                  error={errors.email}
                  disabled={sending}
                />

                <GlassInput
                  id="contact-message"
                  label="Your Message"
                  placeholder="Tell me about your project, role, or just say hello..."
                  value={form.message}
                  onChange={updateField("message")}
                  error={errors.message}
                  disabled={sending}
                  multiline
                />

                {/* Toast feedback */}
                {status !== "idle" && status !== "sending" && (
                  <Toast status={status} message={toast} />
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={sending || status === "success"}
                  whileHover={!sending && status !== "success" ? { scale: 1.02 } : {}}
                  whileTap={!sending && status !== "success" ? { scale: 0.98 } : {}}
                  className="relative w-full py-4 rounded-xl font-bold text-base overflow-hidden transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  style={{
                    background:
                      status === "success"
                        ? "linear-gradient(135deg, #065f46, #0891b2)"
                        : status === "error"
                        ? "linear-gradient(135deg, #7f1d1d, #991b1b)"
                        : sending
                        ? "rgba(139,92,246,0.4)"
                        : "linear-gradient(135deg, #7c3aed, #5b21b6)",
                    color: "#ffffff",
                    boxShadow:
                      !sending && status === "idle"
                        ? "0 0 30px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)"
                        : "none",
                  }}
                >
                  {/* Shimmer */}
                  {!sending && status === "idle" && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)" }}
                    />
                  )}

                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : status === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-gray-700">
                  Your data is only used to respond to your message.
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
