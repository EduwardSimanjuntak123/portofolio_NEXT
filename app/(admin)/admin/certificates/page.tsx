"use client";

import { useEffect, useState } from "react";
import CertificateModal from "./CertificateModal";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credential?: string | null;
  image?: string | null;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "long" });
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/certificates");
      const data = await res.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = certificates.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    try {
      setDeleting(true);
      await fetch(`/api/certificates/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      load();
    } catch {
      alert("Gagal menghapus sertifikat.");
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
            <p className="text-xs font-mono uppercase tracking-widest text-amber-600/70 mb-1">Admin · Portfolio</p>
            <h1 className="text-3xl font-bold text-slate-800">Sertifikat</h1>
            <p className="text-slate-500 mt-1 text-sm">Kelola sertifikasi dan penghargaan.</p>
          </div>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 4px 15px rgba(245,158,11,0.4)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><path d="M12 5v14M5 12h14" /></svg>
            Tambah Sertifikat
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="relative max-w-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari sertifikat..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-amber-300 focus:bg-white focus:ring-2 focus:ring-amber-100 transition" />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="h-32 bg-slate-100 rounded-xl mb-4" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 mx-auto mb-4 opacity-30">
              <path d="M12 15l-2-2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-5l-2 2z" />
              <path d="M9 7h6M9 10h6" />
            </svg>
            <p className="text-base font-medium">Belum ada sertifikat</p>
            <p className="text-sm mt-1">Klik &quot;Tambah Sertifikat&quot; untuk menambahkan.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cert) => (
              <div key={cert.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Image */}
                {cert.image ? (
                  <div className="h-40 bg-slate-50 border-b border-slate-100 overflow-hidden">
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-slate-100 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="w-16 h-16 opacity-40">
                      <path d="M12 15l-2-2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-5l-2 2z" />
                      <path d="M9 7h6M9 10h6" />
                    </svg>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug">{cert.title}</h3>
                      <p className="text-amber-600 text-xs font-semibold mt-1">{cert.issuer}</p>
                      <p className="text-slate-400 text-xs mt-1">{formatDate(cert.issueDate)}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => { setSelected(cert); setModalOpen(true); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeleteConfirm(cert.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {cert.credential && (
                    <a href={cert.credential} target="_blank" rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Lihat Credential
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CertificateModal open={modalOpen} certificate={selected} onClose={() => setModalOpen(false)} onSuccess={load} />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" className="w-7 h-7">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Sertifikat?</h3>
            <p className="text-sm text-slate-500 mb-6">Sertifikat ini akan dihapus permanen.</p>
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
