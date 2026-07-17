"use client";

import { useEffect, useState } from "react";
import ExperienceModal from "./ExperienceModal";

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description: string;
  logo?: string | null;
}

function formatMonth(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Experience | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/experience");
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    try {
      setDeleting(true);
      await fetch(`/api/experience/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      load();
    } catch {
      alert("Gagal menghapus.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-amber-600/70 mb-1">Admin · Portfolio</p>
            <h1 className="text-3xl font-bold text-slate-800">Experience</h1>
            <p className="text-slate-500 mt-1 text-sm">Riwayat pekerjaan dan pengalaman profesional.</p>
          </div>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 4px 15px rgba(245,158,11,0.4)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah Experience
          </button>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 mx-auto mb-4 opacity-30">
              <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <p className="text-base font-medium">Belum ada data experience</p>
            <p className="text-sm mt-1">Klik &quot;Tambah Experience&quot; untuk mulai.</p>
          </div>
        ) : (
          <div className="relative space-y-0">
            {/* Timeline line */}
            <div className="absolute left-7 top-8 bottom-8 w-px bg-gradient-to-b from-amber-300 via-amber-200 to-transparent" style={{ marginLeft: "20px" }} />

            {experiences.map((exp, idx) => (
              <div key={exp.id} className="relative flex gap-6 pb-6">
                {/* Dot */}
                <div className="relative z-10 shrink-0">
                  {exp.logo ? (
                    <img src={exp.logo} alt={exp.company} className="w-11 h-11 rounded-xl object-contain border border-slate-200 bg-white shadow-sm mt-1" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm mt-1"
                      style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                      {exp.company.charAt(0)}
                    </div>
                  )}
                  {idx < experiences.length - 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-12 w-px h-full bg-amber-100" />
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-800 text-base">{exp.position}</h3>
                        {!exp.endDate && (
                          <span className="text-xs font-medium bg-green-50 text-green-600 border border-green-200 px-2.5 py-0.5 rounded-full">
                            Present
                          </span>
                        )}
                      </div>
                      <p className="text-amber-600 font-semibold text-sm mt-0.5">{exp.company}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span>
                          {formatMonth(exp.startDate)} — {exp.endDate ? formatMonth(exp.endDate) : "Present"}
                        </span>
                        {exp.location && (
                          <>
                            <span>·</span>
                            <span>{exp.location}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-2">{exp.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => { setSelected(exp); setModalOpen(true); }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-indigo-500 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(exp.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ExperienceModal
        open={modalOpen}
        experience={selected}
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
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Experience?</h3>
            <p className="text-sm text-slate-500 mb-6">Data experience ini akan dihapus permanen.</p>
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