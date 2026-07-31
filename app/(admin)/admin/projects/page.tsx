"use client";

import { useEffect, useState } from "react";
import ProjectModal from "./ProjectModal";

interface Technology {
  id: string;
  name: string;
  logo?: string | null;
  category?: string | null;
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
  technologyIds?: string[];
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    try {
      setDeleting(true);
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDeleteConfirm(null);
      load();
    } catch {
      alert("Gagal menghapus project.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-500/70 mb-1">Admin · Portfolio</p>
            <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
            <p className="text-slate-500 mt-1 text-sm">Kelola seluruh project portofolio kamu.</p>
          </div>
          <button
            onClick={() => { setSelectedProject(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah Project
          </button>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Search bar */}
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari project..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teknologi</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tahun</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-50 animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                      <td className="px-4 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                      <td className="px-4 py-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                      <td className="px-4 py-4"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
                      <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl w-24 mx-auto" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mx-auto mb-3 opacity-30">
                        <path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                        <path d="M9 9h6M9 12h6M9 15h4" />
                      </svg>
                      <p className="text-sm font-medium">Belum ada project</p>
                      <p className="text-xs mt-1">Klik &quot;Tambah Project&quot; untuk memulai</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((project) => (
                    <tr key={project.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {project.thumbnail ? (
                            <img src={project.thumbnail} alt={project.title} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-sm text-slate-800">{project.title}</p>
                            <p className="text-xs text-slate-400 font-mono">{project.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                          {project.technologies.slice(0, 3).map((t) => (
                            <span key={t.technology.id} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              {t.technology.logo && <img src={t.technology.logo} alt="" className="w-3 h-3 object-contain" />}
                              {t.technology.name}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {project.startYear}{project.endYear ? `–${project.endYear}` : "–Now"}
                      </td>
                      <td className="px-4 py-4">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setSelectedProject(project); setModalOpen(true); }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(project.id)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3.5 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs text-slate-400">{filtered.length} project ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        open={modalOpen}
        project={selectedProject}
        onClose={() => setModalOpen(false)}
        onSuccess={load}
      />

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" className="w-7 h-7">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Project?</h3>
            <p className="text-sm text-slate-500 mb-6">Tindakan ini tidak dapat dibatalkan. Project akan dihapus permanen dari database.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white disabled:opacity-50 transition-colors"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}