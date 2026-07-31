"use client";

import { useEffect, useState, type FormEvent } from "react";

interface About {
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  github?: string | null;
  linkedin?: string | null;
}

type SendStatus = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<SendStatus>("idle");

  useEffect(() => {
    fetch("/api/about").then((r) => r.json()).then(setAbout).catch(() => null);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setStatus("sending");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass = "w-full rounded-2xl px-5 py-3.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:ring-2"
    + " focus:ring-indigo-500/30 focus:border-indigo-500/50"
    + " border"
    + " bg-slate-900/60 border-slate-700/50 hover:border-slate-600/50";

  return (
    <>
      <div className="aurora" />
      <section className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-16">
            <p className="section-label mb-3">Get in Touch</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              Contact <span className="grad">Me</span>
            </h1>
            <p className="text-slate-400 mt-4 max-w-xl">Have a project in mind or just want to say hi? I&apos;d love to hear from you.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-10">

            {/* LEFT: Info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="glass rounded-3xl p-8" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Contact Info</h3>
                <div className="space-y-5">
                  {about?.email && (
                    <a href={`mailto:${about.email}`} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
                          <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                          <polyline points="4,4 12,13 20,4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email</p>
                        <p className="text-sm text-slate-300 group-hover:text-white transition-colors break-all">{about.email}</p>
                      </div>
                    </a>
                  )}
                  {about?.phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
                          <path d="M6 3.5c1 0 2.4 2.6 2.4 3.4S7 8.5 7 9.4c0 1.8 2.8 4.6 4.6 6.4.8 0 2.1-1.4 2.9-1.4.8 0 3.4 1.4 3.4 2.4 0 1.4-1.6 3.2-3 3.2C10.7 20 4 13.3 4 9c0-1.4 1.8-3 3.2-3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</p>
                        <p className="text-sm text-slate-300">{about.phone}</p>
                      </div>
                    </div>
                  )}
                  {about?.location && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
                          <path d="M12 21s6.5-5.7 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.3 6.5 11 6.5 11z" />
                          <circle cx="12" cy="10" r="2.3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Location</p>
                        <p className="text-sm text-slate-300">{about.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Socials */}
              {(about?.github || about?.linkedin) && (
                <div className="glass rounded-3xl p-6 space-y-3" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Socials</h3>
                  {about?.github && (
                    <a href={about.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white text-sm">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
                        <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.6-.2.6-.43v-1.68c-2.5.55-3.03-1.13-3.03-1.13-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.63.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.78.92-2.4-.09-.23-.4-1.15.09-2.4 0 0 .75-.24 2.46.92a8.5 8.5 0 0 1 4.48 0c1.71-1.16 2.46-.92 2.46-.92.49 1.25.18 2.17.09 2.4.57.62.92 1.42.92 2.4 0 3.45-2.1 4.2-4.11 4.43.33.29.62.85.62 1.72v2.55c0 .24.15.52.61.43A9 9 0 0 0 12 3z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {about?.linkedin && (
                    <a href={about.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white text-sm">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT: Form */}
            <div className="lg:col-span-3">
              <div className="glass rounded-3xl p-8" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-7">Send a Message</h3>

                {status === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="w-8 h-8">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-400 text-sm">Thanks for reaching out. I&apos;ll get back to you soon.</p>
                    <button onClick={() => setStatus("idle")} className="mt-6 text-sm text-indigo-400 hover:text-white transition-colors">Send another message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Name *</label>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="John Doe" className={inputClass} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Email *</label>
                        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="john@example.com" className={inputClass} />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Subject *</label>
                      <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Project collaboration, freelance inquiry..." className={inputClass} />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Message *</label>
                      <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell me about your project or idea..." className={`${inputClass} resize-none`} />
                    </div>

                    {status === "error" && (
                      <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                    )}

                    <button type="submit" disabled={status === "sending"}
                      className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 30px rgba(99,102,241,0.3)" }}>
                      {status === "sending" ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : "Send Message →"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}