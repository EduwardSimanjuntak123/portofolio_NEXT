"use client";

import { useEffect, useState } from "react";
import SkillModal, { Skill } from "./SkillModal";

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Frontend: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  Backend: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  Mobile: { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
  Database: { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
  DevOps: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  Tools: { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
  "Programming Language": { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  Design: { bg: "#fdf2f8", text: "#db2777", border: "#fbcfe8" },
  Lainnya: { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
};

const CATEGORIES = ["Semua", "Frontend", "Backend", "Mobile", "Database", "DevOps", "Tools", "Programming Language", "Design", "Lainnya"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadSkills() {
    try {
      setLoading(true);
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSkills(); }, []);

  const filtered = skills.filter((s) =>
    categoryFilter === "Semua" || s.category === categoryFilter
  );

  async function handleDelete(id: string) {
    try {
      setDeleting(true);
      const res = await fetch("/api/skills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      setDeleteConfirm(null);
      loadSkills();
    } catch {
      alert("Gagal menghapus skill.");
    } finally {
      setDeleting(false);
    }
  }

  const levelLabel = (p: number) =>
    p >= 90 ? "Expert" : p >= 70 ? "Advanced" : p >= 50 ? "Intermediate" : p >= 30 ? "Beginner" : "Novice";
  const levelColor = (p: number) =>
    p >= 70 ? "#10b981" : p >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-600/70 mb-1">Admin · Portfolio</p>
            <h1 className="text-3xl font-bold text-slate-800">Skills</h1>
            <p className="text-slate-500 mt-1 text-sm">Kelola kategori keahlian dan teknologi yang dikuasai.</p>
          </div>
          <button
            onClick={() => { setSelectedSkill(null); setOpenModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 15px rgba(16,185,129,0.4)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><path d="M12 5v14M5 12h14" /></svg>
            Tambah Skill
          </button>
        </div>

        {/* Category filter */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${categoryFilter === cat ? "text-white border-transparent" : "text-slate-500 border-slate-200 hover:border-slate-300"}`}
                style={categoryFilter === cat ? { background: "linear-gradient(135deg, #10b981, #059669)" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 mx-auto mb-4 opacity-30">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <p className="text-base font-medium">Tidak ada skill ditemukan</p>
            <p className="text-sm mt-1">Klik &quot;Tambah Skill&quot; untuk menambahkan.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((skill) => {
              const catColor = categoryColors[skill.category] ?? { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" };
              const color = levelColor(skill.percentage);
              const techs = skill.technologies || [];
              return (
                <div key={skill.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: catColor.bg, border: `1px solid ${catColor.border}` }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke={catColor.text} strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{skill.category}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}>
                          {levelLabel(skill.percentage)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setSelectedSkill(skill); setOpenModal(true); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(skill.id!)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-400">Penguasaan</span>
                      <span className="text-xs font-bold" style={{ color }}>{skill.percentage}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.percentage}%`, background: `linear-gradient(to right, ${color}99, ${color})` }} />
                    </div>
                  </div>

                  {/* Technologies */}
                  {techs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {techs.slice(0, 5).map((st) => (
                          <span key={st.technology.id} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {st.technology.logo && <img src={st.technology.logo} alt="" className="w-3 h-3 object-contain" />}
                            {st.technology.name}
                          </span>
                        ))}
                        {techs.length > 5 && (
                          <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">+{techs.length - 5}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-slate-400 text-center">{filtered.length} skill ditampilkan</p>
        )}
      </div>

      <SkillModal
        open={openModal}
        skill={selectedSkill}
        onClose={() => setOpenModal(false)}
        onSuccess={loadSkills}
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
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Skill?</h3>
            <p className="text-sm text-slate-500 mb-6">Skill ini akan dihapus permanen dari database.</p>
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