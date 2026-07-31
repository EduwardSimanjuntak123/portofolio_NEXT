"use client";

import { useEffect, useState } from "react";
import TechnologyModal from "./TechnologyModal";

interface Technology {
  id: string;
  name: string;
  logo?: string | null;
  category?: string | null;
  _count?: { skills: number; projects: number };
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Frontend:   { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  Backend:    { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  Mobile:     { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
  Database:   { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
  DevOps:     { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  Tools:      { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
  "Programming Language": { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  Design:     { bg: "#fdf2f8", text: "#db2777", border: "#fbcfe8" },
};

const CATEGORIES = ["Semua", "Frontend", "Backend", "Mobile", "Database", "DevOps", "Tools", "Programming Language", "Design"];

export default function TechnologyPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Technology | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/technologies");
      const data = await res.json();
      setTechnologies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = technologies.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "Semua" || t.category === categoryFilter;
    return matchSearch && matchCat;
  });

  async function handleDelete(id: string) {
    try {
      setDeleting(true);
      await fetch(`/api/technologies/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      load();
    } catch {
      alert("Gagal menghapus teknologi.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-500/70 mb-1">Admin · Portfolio</p>
            <h1 className="text-3xl font-bold text-slate-800">Technology</h1>
            <p className="text-slate-500 mt-1 text-sm">Kelola teknologi yang dipakai di skills & projects.</p>
          </div>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><path d="M12 5v14M5 12h14" /></svg>
            Tambah Teknologi
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari teknologi..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${categoryFilter === cat ? "text-white border-transparent" : "text-slate-500 border-slate-200 hover:border-slate-300"}`}
                  style={categoryFilter === cat ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 mx-auto mb-4 opacity-30">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
            </svg>
            <p className="text-base font-medium">Belum ada teknologi</p>
            <p className="text-sm mt-1">Klik &quot;Tambah Teknologi&quot; untuk mulai.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tech) => {
              const catColor = categoryColors[tech.category || ""] ?? { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" };
              return (
                <div key={tech.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                        style={{ background: catColor.bg, border: `1px solid ${catColor.border}` }}
                      >
                        {tech.logo ? (
                          <img src={tech.logo} alt={tech.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-xl font-bold" style={{ color: catColor.text }}>{tech.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{tech.name}</p>
                        {tech.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 inline-block"
                            style={{ background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}>
                            {tech.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => { setSelected(tech); setModalOpen(true); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(tech.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Usage stats */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      {tech._count?.skills ?? 0} skills
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6" /></svg>
                      {tech._count?.projects ?? 0} projects
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-slate-400 text-center">{filtered.length} teknologi ditampilkan</p>
        )}
      </div>

      <TechnologyModal
        open={modalOpen}
        technology={selected}
        onClose={() => setModalOpen(false)}
        onSuccess={load}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" className="w-7 h-7">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Teknologi?</h3>
            <p className="text-sm text-slate-500 mb-6">Teknologi ini akan dihapus dari semua skill & project yang menggunakannya.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={deleting} className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white disabled:opacity-50 transition-colors">
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
