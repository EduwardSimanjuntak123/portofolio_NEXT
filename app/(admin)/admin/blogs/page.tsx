"use client";

import { useEffect, useState } from "react";
import BlogModal from "./BlogModal";

interface Blog {
  id: string;
  title: string;
  slug: string;
  cover?: string | null;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Blog | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = blogs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "published" ? b.published : !b.published);
    return matchSearch && matchFilter;
  });

  const publishedCount = blogs.filter((b) => b.published).length;
  const draftCount = blogs.filter((b) => !b.published).length;

  async function handleDelete(id: string) {
    try {
      setDeleting(true);
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      load();
    } catch {
      alert("Gagal menghapus blog.");
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
            <p className="text-xs font-mono uppercase tracking-widest text-violet-600/70 mb-1">Admin · Portfolio</p>
            <h1 className="text-3xl font-bold text-slate-800">Blog</h1>
            <p className="text-slate-500 mt-1 text-sm">
              <span className="text-violet-600 font-medium">{publishedCount} published</span>
              <span className="text-slate-400 mx-1.5">·</span>
              <span>{draftCount} draft</span>
            </p>
          </div>
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", boxShadow: "0 4px 15px rgba(139,92,246,0.4)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><path d="M12 5v14M5 12h14" /></svg>
            Tulis Post
          </button>
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari artikel..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100 transition" />
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(["all", "published", "draft"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  {f === "all" ? "Semua" : f === "published" ? "Published" : "Draft"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Judul</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Diperbarui</th>
                  <th className="text-center px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-50 animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48" /></td>
                      <td className="px-4 py-4"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
                      <td className="px-4 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                      <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl w-24 mx-auto" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-slate-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mx-auto mb-3 opacity-30">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <p className="text-sm font-medium">Belum ada blog post</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((blog) => (
                    <tr key={blog.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {blog.cover ? (
                            <img src={blog.cover} alt={blog.title} className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5" className="w-5 h-5 opacity-60">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-sm text-slate-800">{blog.title}</p>
                            <p className="text-xs text-slate-400 font-mono">{blog.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {blog.published ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Draft
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-400">{timeAgo(blog.updatedAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelected(blog); setModalOpen(true); }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(blog.id)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
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
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3.5 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs text-slate-400">{filtered.length} post</p>
            </div>
          )}
        </div>
      </div>

      <BlogModal open={modalOpen} blog={selected ? { ...selected, cover: selected.cover ?? "" } : null} onClose={() => setModalOpen(false)} onSuccess={load} />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" className="w-7 h-7">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Blog Post?</h3>
            <p className="text-sm text-slate-500 mb-6">Post ini akan dihapus permanen.</p>
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
