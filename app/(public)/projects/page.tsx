"use client";

import { useEffect, useState } from "react";

interface Technology {
  id: string;
  name: string;
  logo?: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  startYear: number;
  endYear?: number | null;
  thumbnail?: string | null;
  github?: string | null;
  demo?: string | null;
  featured: boolean;
  technologies: { technology: Technology }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    <>
      <div className="aurora" />
      <section className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12">
            <p className="section-label mb-3">What I&apos;ve Built</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              My <span className="grad">Projects</span>
            </h1>
            <p className="text-slate-400 mt-4 max-w-xl">A selection of real-world applications I&apos;ve designed and built.</p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-10">
            {(["all", "featured"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize ${filter === f ? "text-white shadow-lg" : "glass text-slate-400 hover:text-white border"}`}
                style={filter === f ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" } : { borderColor: "rgba(99,102,241,0.15)" }}>
                {f === "all" ? "All Projects" : "⭐ Featured"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-800" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-800 rounded w-2/3" />
                    <div className="h-4 bg-slate-800 rounded w-full" />
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-500">
              <div className="text-5xl mb-4">📂</div>
              <p>No projects found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <div
                  key={project.id}
                  className="group glass glass-hover rounded-3xl overflow-hidden flex flex-col"
                  style={{ border: "1px solid rgba(99,102,241,0.12)" }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden shrink-0">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="1" className="w-16 h-16">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M9 9h6M9 12h6M9 15h4" />
                        </svg>
                      </div>
                    )}
                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="badge">⭐ Featured</span>
                      </div>
                    )}
                    {/* Year badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300"
                      style={{ background: "rgba(5,11,24,0.8)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      {project.startYear}{project.endYear && project.endYear !== project.startYear ? `–${project.endYear}` : ""}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-bold text-white text-lg mb-2 leading-snug">{project.title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">{project.description}</p>

                    {/* Technologies */}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.technologies.slice(0, 4).map(({ technology: t }) => (
                          <span key={t.id} className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                            {t.logo && <img src={t.logo} alt={t.name} className="w-3 h-3 object-contain" />}
                            {t.name}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-[11px] text-slate-500 px-2.5 py-1">+{project.technologies.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-3 mt-5 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.6-.2.6-.43v-1.68c-2.5.55-3.03-1.13-3.03-1.13-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.63.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.78.92-2.4-.09-.23-.4-1.15.09-2.4 0 0 .75-.24 2.46.92a8.5 8.5 0 0 1 4.48 0c1.71-1.16 2.46-.92 2.46-.92.49 1.25.18 2.17.09 2.4.57.62.92 1.42.92 2.4 0 3.45-2.1 4.2-4.11 4.43.33.29.62.85.62 1.72v2.55c0 .24.15.52.61.43A9 9 0 0 0 12 3z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ml-auto">
                          Live Demo
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}