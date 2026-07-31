"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface About {
  fullName: string;
  title: string;
  description: string;
  photo?: string | null;
  resume?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  website?: string | null;
}

interface Technology {
  id: string;
  name: string;
  logo?: string | null;
  category?: string | null;
}

const TYPEWRITER_WORDS = ["Software Engineer", "AI Developer", "Full Stack Developer", "Flutter Developer"];

function useTypewriter(words: string[], speed = 80, pause = 1600) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx % words.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, display.length + 1));
        if (display.length + 1 === word.length) setTimeout(() => setDeleting(true), pause);
      } else {
        setDisplay(word.slice(0, display.length - 1));
        if (display.length === 0) { setDeleting(false); setIdx((i) => i + 1); }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [display, deleting, idx, words, speed, pause]);

  return display;
}

export default function HomePage() {
  const [about, setAbout] = useState<About | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [mounted, setMounted] = useState(false);
  const title = useTypewriter(TYPEWRITER_WORDS);

  useEffect(() => {
    setMounted(true);
    fetch("/api/about").then((r) => r.json()).then(setAbout).catch(() => null);
    fetch("/api/technologies").then((r) => r.json()).then((d) => setTechnologies(Array.isArray(d) ? d.slice(0, 12) : [])).catch(() => null);
  }, []);

  const name = about?.fullName ?? "Eduward Gilbert Simanjuntak";
  const desc = about?.description ?? "Passionate in building web applications, mobile applications, and AI Agent systems.";

  return (
    <>
      {/* Aurora BG */}
      <div className="aurora" />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Text content */}
          <div className={`space-y-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border"
              style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for freelance &amp; full-time
            </div>

            {/* Name */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
                Hi, I&apos;m{" "}
                <span className="grad">{name.split(" ")[0]}</span>
                <br />
                <span className="text-slate-200">{name.split(" ").slice(1).join(" ")}</span>
              </h1>

              {/* Typewriter */}
              <div className="mt-4 h-8 flex items-center">
                <span className="text-xl sm:text-2xl font-semibold text-indigo-300 font-mono">
                  {title}
                  <span className="ml-0.5 inline-block w-0.5 h-6 bg-indigo-400 animate-pulse align-middle" />
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              {desc}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}
              >
                View Projects
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
              </Link>
              {about?.resume && (
                <a
                  href={about.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-slate-300 border border-slate-700 hover:border-indigo-500/50 hover:text-white transition-all hover:-translate-y-1"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  Download CV
                </a>
              )}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4 pt-2">
              {about?.github && (
                <a href={about.github} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.6-.2.6-.43v-1.68c-2.5.55-3.03-1.13-3.03-1.13-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.63.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.78.92-2.4-.09-.23-.4-1.15.09-2.4 0 0 .75-.24 2.46.92a8.5 8.5 0 0 1 4.48 0c1.71-1.16 2.46-.92 2.46-.92.49 1.25.18 2.17.09 2.4.57.62.92 1.42.92 2.4 0 3.45-2.1 4.2-4.11 4.43.33.29.62.85.62 1.72v2.55c0 .24.15.52.61.43A9 9 0 0 0 12 3z" />
                  </svg>
                </a>
              )}
              {about?.linkedin && (
                <a href={about.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
              {about?.instagram && (
                <a href={about.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {about?.email && (
                <a href={`mailto:${about.email}`}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
                    <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                    <polyline points="4,4 12,13 20,4" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* RIGHT: 3D Photo */}
          <div className={`flex justify-center lg:justify-end transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="photo-3d-wrapper relative">
              {/* Decorative rings */}
              <div className="absolute inset-[-20px] rounded-full border border-indigo-500/10 animate-spin" style={{ animationDuration: "20s" }} />
              <div className="absolute inset-[-40px] rounded-full border border-purple-500/8 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }} />

              {/* Floating tech orbs */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl glass flex items-center justify-center float" style={{ animationDelay: "0s" }}>
                <svg viewBox="0 0 24 24" fill="#61dafb" className="w-6 h-6"><circle cx="12" cy="12" r="2" /><path stroke="#61dafb" strokeWidth="1.5" fill="none" d="M12 1C6.5 1 4.5 5.5 4.5 12S6.5 23 12 23s7.5-4.5 7.5-11S17.5 1 12 1z" /></svg>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-2xl glass flex items-center justify-center float" style={{ animationDelay: "1.5s" }}>
                <svg viewBox="0 0 24 24" fill="#38bdf8" className="w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <div className="absolute top-1/2 -right-8 w-10 h-10 rounded-xl glass flex items-center justify-center float" style={{ animationDelay: "0.8s" }}>
                <span className="text-xs font-bold text-purple-400">AI</span>
              </div>

              {/* Photo */}
              <div className="photo-3d float" style={{ animationDelay: "0.4s" }}>
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[2rem] overflow-hidden glow-ring"
                  style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))" }}>

                  {about?.photo ? (
                    <img
                      src={about.photo}
                      alt={about.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    /* Placeholder if no photo */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 flex items-center justify-center text-5xl font-black text-indigo-300">
                        {name.charAt(0)}
                      </div>
                      <p className="text-xs text-slate-500">Add photo in admin</p>
                    </div>
                  )}

                  {/* Overlay shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 via-transparent to-transparent" />
                </div>

                {/* Bottom info card */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max glass rounded-2xl px-5 py-3 flex items-center gap-3"
                  style={{ border: "1px solid rgba(99,102,241,0.25)" }}>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  {/* <div>
                    <p className="text-xs font-bold text-white">{about?.title || "Software Engineer"}</p>
                    {about?.location && <p className="text-[10px] text-slate-400 mt-0.5">{about.location}</p>}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-indigo-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* TECH TICKER */}
      {technologies.length > 0 && (
        <section className="py-12 border-y" style={{ borderColor: "rgba(99,102,241,0.1)" }}>
          <div className="max-w-7xl mx-auto px-6">
            <p className="section-label text-center mb-6">Tech Stack</p>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech) => (
                <div key={tech.id} className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-slate-300 font-medium">
                  {tech.logo && <img src={tech.logo} alt={tech.name} className="w-4 h-4 object-contain" />}
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* QUICK SECTIONS PREVIEW */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">What I Do</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Building <span className="grad">digital experiences</span> that matter
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "💻",
                title: "Full Stack Dev",
                desc: "From backend APIs to beautiful frontends — complete end-to-end solutions.",
                gradient: "from-indigo-500/20 to-violet-500/10",
                border: "rgba(99,102,241,0.2)",
              },
              {
                icon: "📱",
                title: "Mobile Apps",
                desc: "Cross-platform Flutter apps with smooth UX and native performance.",
                gradient: "from-sky-500/20 to-indigo-500/10",
                border: "rgba(56,189,248,0.2)",
              },
              {
                icon: "🤖",
                title: "AI & Agents",
                desc: "Multi-agent systems, LLM integrations, and intelligent automation.",
                gradient: "from-violet-500/20 to-purple-500/10",
                border: "rgba(139,92,246,0.2)",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`group glass glass-hover rounded-3xl p-8 bg-gradient-to-br ${item.gradient}`}
                style={{ border: `1px solid ${item.border}` }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects" className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold hover:text-white transition-colors">
              View all projects
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}