"use client";

import { useEffect, useState } from "react";

interface About {
  fullName: string;
  title: string;
  description: string;
  photo?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  website?: string | null;
  resume?: string | null;
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 rounded-xl glass glass-hover border transition-all"
      style={{ borderColor: "rgba(99,102,241,0.15)" }}
    >
      <span className="text-indigo-400">{icon}</span>
      <span className="text-sm text-slate-300 font-medium">{label}</span>
    </a>
  );
}

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => setAbout(d))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="aurora" />
      <section className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-16">
            <p className="section-label mb-3">Get to Know Me</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              About <span className="grad">Me</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* Photo card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                {about?.photo ? (
                  <img src={about.photo} alt={about.fullName} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))" }}>
                    <div className="text-8xl font-black text-indigo-300 opacity-30">
                      {about?.fullName?.charAt(0) ?? "E"}
                    </div>
                  </div>
                )}
                <div className="p-6 space-y-2">
                  <h2 className="text-xl font-bold text-white">{about?.fullName ?? "—"}</h2>
                  <p className="text-indigo-400 font-semibold text-sm">{about?.title ?? "—"}</p>
                  {about?.location && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                        <path d="M12 21s6.5-5.7 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.3 6.5 11 6.5 11z" />
                        <circle cx="12" cy="10" r="2.3" />
                      </svg>
                      {about.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact info */}
              <div className="glass rounded-3xl p-6 space-y-3" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Contact</h3>
                {about?.email && (
                  <a href={`mailto:${about.email}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4 shrink-0">
                      <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                      <polyline points="4,4 12,13 20,4" />
                    </svg>
                    <span className="truncate">{about.email}</span>
                  </a>
                )}
                {about?.phone && (
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4 shrink-0">
                      <path d="M6 3.5c1 0 2.4 2.6 2.4 3.4S7 8.5 7 9.4c0 1.8 2.8 4.6 4.6 6.4.8 0 2.1-1.4 2.9-1.4.8 0 3.4 1.4 3.4 2.4 0 1.4-1.6 3.2-3 3.2C10.7 20 4 13.3 4 9c0-1.4 1.8-3 3.2-3z" />
                    </svg>
                    {about.phone}
                  </div>
                )}
                {about?.resume && (
                  <a
                    href={about.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Download CV
                  </a>
                )}
              </div>

              {/* Social links */}
              {(about?.github || about?.linkedin || about?.instagram) && (
                <div className="glass rounded-3xl p-6 space-y-3" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Socials</h3>
                  {about?.github && (
                    <SocialLink href={about.github} label="GitHub" icon={
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.6-.2.6-.43v-1.68c-2.5.55-3.03-1.13-3.03-1.13-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.63.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.78.92-2.4-.09-.23-.4-1.15.09-2.4 0 0 .75-.24 2.46.92a8.5 8.5 0 0 1 4.48 0c1.71-1.16 2.46-.92 2.46-.92.49 1.25.18 2.17.09 2.4.57.62.92 1.42.92 2.4 0 3.45-2.1 4.2-4.11 4.43.33.29.62.85.62 1.72v2.55c0 .24.15.52.61.43A9 9 0 0 0 12 3z" />
                      </svg>
                    } />
                  )}
                  {about?.linkedin && (
                    <SocialLink href={about.linkedin} label="LinkedIn" icon={
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
                      </svg>
                    } />
                  )}
                  {about?.instagram && (
                    <SocialLink href={about.instagram} label="Instagram" icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                      </svg>
                    } />
                  )}
                </div>
              )}
            </div>

            {/* Bio + details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="glass rounded-3xl p-8" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">My Story</h3>
                <p className="text-slate-300 leading-relaxed text-[15px]">
                  {about?.description ?? "No description yet. Add it from the admin panel."}
                </p>
              </div>

              {/* Quick facts */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: "🎓", label: "Focus Area", value: about?.title ?? "—" },
                  { icon: "📍", label: "Location", value: about?.location ?? "—" },
                  { icon: "📧", label: "Email", value: about?.email ?? "—" },
                  { icon: "🌐", label: "Website", value: about?.website ?? "—" },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-2xl p-5" style={{ border: "1px solid rgba(99,102,241,0.12)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">{item.label}</p>
                        <p className="text-sm text-slate-300 font-medium truncate">
                          {item.value === "—" ? <span className="text-slate-600 italic">Not set</span> : item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}