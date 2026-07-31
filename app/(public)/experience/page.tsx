"use client";

import { useEffect, useState } from "react";

interface Experience {
  id: string;
  position: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/experience")
      .then((r) => r.json())
      .then((d) => setExperiences(Array.isArray(d) ? d : []))
      .catch(() => setExperiences([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="aurora" />
      <section className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="mb-16">
            <p className="section-label mb-3">My Journey</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              Work <span className="grad">Experience</span>
            </h1>
            <p className="text-slate-400 mt-4 max-w-xl">My professional journey and the companies I&apos;ve had the privilege to work with.</p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass rounded-3xl p-7 animate-pulse">
                  <div className="h-5 bg-slate-800 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-slate-800 rounded w-1/4 mb-4" />
                  <div className="h-3 bg-slate-800 rounded w-full" />
                </div>
              ))}
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-24 text-slate-500">
              <div className="text-5xl mb-4">💼</div>
              <p>No experience added yet.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-8 bottom-8 w-px"
                style={{ background: "linear-gradient(to bottom, rgba(99,102,241,0.6), transparent)" }} />

              <div className="space-y-8 pl-16 relative">
                {experiences.map((exp, i) => (
                  <div key={exp.id} className="relative">
                    {/* Dot */}
                    <div
                      className="absolute -left-[52px] top-6 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: i === 0 && exp.current ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(99,102,241,0.2)",
                        border: "2px solid rgba(99,102,241,0.4)",
                        boxShadow: i === 0 && exp.current ? "0 0 12px rgba(99,102,241,0.5)" : "none",
                      }}
                    >
                      {i === 0 && exp.current && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div className="glass glass-hover rounded-3xl p-7" style={{ border: "1px solid rgba(99,102,241,0.12)" }}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h2 className="text-lg font-bold text-white">{exp.position}</h2>
                          <p className="text-indigo-400 font-semibold mt-0.5">{exp.company}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm text-slate-400 font-medium">
                            {formatDate(exp.startDate)} — {exp.current ? (
                              <span className="text-emerald-400 font-bold">Present</span>
                            ) : exp.endDate ? formatDate(exp.endDate) : "—"}
                          </p>
                          {exp.location && (
                            <p className="text-xs text-slate-500 mt-1 flex items-center justify-end gap-1">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3">
                                <path d="M12 21s6.5-5.7 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.3 6.5 11 6.5 11z" />
                                <circle cx="12" cy="10" r="2.3" />
                              </svg>
                              {exp.location}
                            </p>
                          )}
                          {exp.current && (
                            <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2.5 py-1 rounded-full"
                              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Current
                            </span>
                          )}
                        </div>
                      </div>

                      {exp.description && (
                        <p className="mt-4 text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}