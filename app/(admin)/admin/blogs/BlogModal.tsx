"use client";

import { useEffect, useState } from "react";
import UploadField from "@/components/admin/UploadField";

interface Blog {
  id?: string;
  title: string;
  slug: string;
  cover: string;
  content: string;
  published: boolean;
}

interface BlogModalProps {
  open: boolean;
  blog: Blog | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: Blog = { title: "", slug: "", cover: "", content: "", published: false };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogModal({ open, blog, onClose, onSuccess }: BlogModalProps) {
  const [form, setForm] = useState<Blog>(initialForm);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (blog) {
      setForm({ ...blog, cover: blog.cover || "" });
    } else {
      setForm(initialForm);
    }
    setTab("write");
  }, [blog, open]);

  if (!open) return null;

  function set<K extends keyof Blog>(key: K, value: Blog[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !blog) next.slug = slugify(value as string);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const isEdit = !!blog?.id;
      const url = isEdit ? `/api/blogs/${blog!.id}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{blog ? "Edit Blog" : "Tulis Blog Post"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Artikel dan tulisan untuk blog</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-7 py-6 space-y-4">
            {/* Title + Slug */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Judul *</label>
                <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Judul artikel"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Slug</label>
                <input required value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="judul-artikel"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition font-mono" />
              </div>
            </div>

            {/* Cover — Upload Field */}
            <UploadField
              label="Cover Artikel"
              value={form.cover}
              onChange={(url) => set("cover", url)}
              accept="image"
              placeholder="https://..."
              previewType="image"
              accentColor="violet"
            />

            {/* Content with Write/Preview tabs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Konten *</label>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button type="button" onClick={() => setTab("write")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab === "write" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}>
                    Tulis
                  </button>
                  <button type="button" onClick={() => setTab("preview")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab === "preview" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}>
                    Preview
                  </button>
                </div>
              </div>
              {tab === "write" ? (
                <textarea required rows={10} value={form.content} onChange={(e) => set("content", e.target.value)}
                  placeholder="Tulis konten artikel di sini (mendukung Markdown)..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition resize-none font-mono" />
              ) : (
                <div className="min-h-[240px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap overflow-y-auto">
                  {form.content || <span className="text-slate-400">Belum ada konten...</span>}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-1 text-right">{form.content.length} karakter</p>
            </div>

            {/* Published toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => set("published", !form.published)}
                className={`w-11 h-6 rounded-full transition-all duration-200 relative ${form.published ? "bg-violet-500" : "bg-slate-200"}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.published ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">Publikasikan</span>
              {form.published && <span className="text-xs text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">Live</span>}
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
              {loading ? "Menyimpan..." : blog ? "Update Post" : "Publikasikan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
