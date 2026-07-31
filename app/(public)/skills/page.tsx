"use client";

import { useEffect, useRef, useState } from "react";

interface Technology {
  id: string;
  name: string;
  logo?: string | null;
  category?: string | null;
}

interface Skill {
  id: string;
  category: string;
  percentage: number;
  technologies: { technology: Technology }[];
}

const catColors: Record<string, { from: string; to: string; text: string; border: string }> = {
  Frontend:   { from: "#6366f1", to: "#818cf8", text: "#a5b4fc", border: "rgba(99,102,241,0.25)" },
  Backend:    { from: "#10b981", to: "#34d399", text: "#6ee7b7", border: "rgba(16,185,129,0.25)" },
  Mobile:     { from: "#8b5cf6", to: "#a78bfa", text: "#c4b5fd", border: "rgba(139,92,246,0.25)" },
  Database:   { from: "#f59e0b", to: "#fbbf24", text: "#fde68a", border: "rgba(245,158,11,0.25)" },
  DevOps:     { from: "#ef4444", to: "#f87171", text: "#fca5a5", border: "rgba(239,68,68,0.25)" },
  Tools:      { from: "#64748b", to: "#94a3b8", text: "#cbd5e1", border: "rgba(100,116,139,0.25)" },
  "Programming Language": { from: "#f97316", to: "#fb923c", text: "#fdba74", border: "rgba(249,115,22,0.25)" },
  Design:     { from: "#ec4899", to: "#f472b6", text: "#fbcfe8", border: "rgba(236,72,153,0.25)" },
  Lainnya:    { from: "#64748b", to: "#94a3b8", text: "#cbd5e1", border: "rgba(100,116,139,0.25)" },
};

const fallback = { from: "#6366f1", to: "#818cf8", text: "#a5b4fc", border: "rgba(99,102,241,0.25)" };

function AnimatedBar({ percentage }: { percentage: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setWidth(percentage); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [percentage]);

  return (
    <div ref={ref} className="progress-bar mt-3">
      <div className="progress-fill" style={{ width: `${width}%` }} />
    </div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((d) => setSkills(Array.isArray(d) ? d : []))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];
  const filtered = active === "All" ? skills : skills.filter((s) => s.category === active);

  const levelLabel = (p: number) => p >= 90 ? "Expert" : p >= 70 ? "Advanced" : p >= 50 ? "Intermediate" : p >= 30 ? "Beginner" : "Novice";

  return (
    <>
      <div className="aurora" />
      <section className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="section-label mb-3">What I Know</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              My <span className="grad">Skills</span>
            </h1>
            <p className="text-slate-400 mt-4 max-w-xl">Technologies and tools I work with on a daily basis.</p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active === cat ? "text-white shadow-lg" : "text-slate-400 glass hover:text-white border"
                }`}
                style={
                  active === cat
                    ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }
                    : { borderColor: "rgba(99,102,241,0.15)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-3xl p-6 animate-pulse">
                  <div className="h-5 bg-slate-800 rounded w-1/2 mb-4" />
                  <div className="h-3 bg-slate-800 rounded w-3/4 mb-3" />
                  <div className="h-1.5 bg-slate-800 rounded-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-500">
              <div className="text-5xl mb-4">🛠️</div>
              <p>No skills added yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((skill) => {
                const c = catColors[skill.category] ?? fallback;
                const label = levelLabel(skill.percentage);
                return (
                  <div
                    key={skill.id}
                    className="glass glass-hover rounded-3xl p-6 group"
                    style={{ border: `1px solid ${c.border}` }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-white text-base">{skill.category}</h3>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block"
                          style={{ background: `${c.from}20`, color: c.text, border: `1px solid ${c.border}` }}
                        >
                          {label}
                        </span>
                      </div>
                      <span
                        className="text-2xl font-black"
                        style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                      >
                        {skill.percentage}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <AnimatedBar percentage={skill.percentage} />

                    {/* Technologies */}
                    {skill.technologies.length > 0 && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <div className="flex flex-wrap gap-1.5">
                          {skill.technologies.map(({ technology: t }) => (
                            <span
                              key={t.id}
                              className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full"
                              style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                              {t.logo && <img src={t.logo} alt={t.name} className="w-3 h-3 object-contain" />}
                              {t.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}