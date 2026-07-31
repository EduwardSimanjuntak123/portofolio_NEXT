"use client";

import { useEffect, useState } from "react";
import UploadField from "@/components/admin/UploadField";

interface Technology {
  id: string;
  name: string;
  logo?: string | null;
  category?: string | null;
}

interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string;
  startYear: number;
  endYear?: number | null;
  thumbnail?: string | null;
  github?: string | null;
  demo?: string | null;
  featured: boolean;
  technologies?: { technology: Technology }[];
  technologyIds?: string[];
}

const EMPTY: Omit<Project, "id"> = {
  title: "",
  slug: "",
  description: "",
  startYear: new Date().getFullYear(),
  endYear: null,
  thumbnail: "",
  github: "",
  demo: "",
  featured: false,
  technologyIds: [],
};

interface Props {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProjectModal({ open, project, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);
  const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);
  const [techSearch, setTechSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/technologies")
      .then((r) => r.json())
      .then((data) => setAllTechnologies(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (project) {
      const technologyIds = project.technologyIds ||
        project.technologies?.map((t) => t.technology.id) || [];
      setForm({ ...project, technologyIds });
    } else {
      setForm(EMPTY);
    }
    setTechSearch("");
  }, [project, open]);

  if (!open) return null;

  function set<K extends keyof typeof EMPTY>(key: K, value: typeof EMPTY[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !project) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function toggleTech(id: string) {
    const ids = form.technologyIds || [];
    set("technologyIds", ids.includes(id) ? ids.filter((t) => t !== id) : [...ids, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const isEdit = !!project?.id;
      const url = isEdit ? `/api/projects/${project!.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const selectedTechs = allTechnologies.filter((t) => (form.technologyIds || []).includes(t.id));
  const filteredTechs = allTechnologies.filter((t) =>
    t.name.toLowerCase().includes(techSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{project ? "Edit Project" : "Tambah Project Baru"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{project ? "Perbarui informasi project" : "Isi detail project baru"}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-7 py-6 space-y-5">
            {/* Title + Slug */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Judul Project *</label>
                <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Nama Project"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Slug (URL)</label>
                <input required value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="nama-project"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition font-mono" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Deskripsi *</label>
              <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Ceritakan tentang project ini..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition resize-none" />
            </div>

            {/* Year */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Tahun Mulai *</label>
                <input required type="number" value={form.startYear} onChange={(e) => set("startYear", Number(e.target.value))} min={2000} max={2100}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Tahun Selesai</label>
                <input type="number" value={form.endYear ?? ""} onChange={(e) => set("endYear", e.target.value ? Number(e.target.value) : null)}
                  min={2000} max={2100} placeholder="Kosongkan jika ongoing"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
            </div>

            {/* Links */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">GitHub URL</label>
                <input type="url" value={form.github ?? ""} onChange={(e) => set("github", e.target.value)} placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Demo URL</label>
                <input type="url" value={form.demo ?? ""} onChange={(e) => set("demo", e.target.value)} placeholder="https://demo.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
            </div>

            {/* Thumbnail */}
            <UploadField
              label="Thumbnail"
              value={form.thumbnail ?? ""}
              onChange={(url) => set("thumbnail", url)}
              accept="image"
              placeholder="https://..."
              previewType="image"
              accentColor="indigo"
            />

            {/* Technologies */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Teknologi
                {(form.technologyIds?.length ?? 0) > 0 && (
                  <span className="ml-2 text-indigo-600 font-bold">{form.technologyIds?.length} dipilih</span>
                )}
              </label>

              {selectedTechs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedTechs.map((t) => (
                    <span key={t.id} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full text-xs font-medium">
                      {t.logo && <img src={t.logo} alt="" className="w-3.5 h-3.5 object-contain" />}
                      {t.name}
                      <button type="button" onClick={() => toggleTech(t.id)} className="hover:text-red-500 transition-colors ml-0.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3 h-3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative mb-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input value={techSearch} onChange={(e) => setTechSearch(e.target.value)} placeholder="Cari teknologi..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition" />
              </div>

              {allTechnologies.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">Belum ada teknologi. Tambah dulu di halaman Technology.</p>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-36 overflow-y-auto">
                  {filteredTechs.map((tech) => {
                    const isSelected = (form.technologyIds || []).includes(tech.id);
                    return (
                      <button key={tech.id} type="button" onClick={() => toggleTech(tech.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left transition-colors ${isSelected ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-700"}`}>
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-300"}`}>
                          {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" className="w-2.5 h-2.5"><path d="M20 6L9 17l-5-5" /></svg>}
                        </div>
                        {tech.logo && <img src={tech.logo} alt="" className="w-4 h-4 object-contain shrink-0" />}
                        <span className="font-medium">{tech.name}</span>
                        {tech.category && <span className="ml-auto text-xs text-slate-400">{tech.category}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div onClick={() => set("featured", !form.featured)}
                className={`w-11 h-6 rounded-full transition-all duration-200 relative ${form.featured ? "bg-indigo-500" : "bg-slate-200"}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.featured ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">Tampilkan sebagai Featured Project</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              {loading ? "Menyimpan..." : project ? "Update Project" : "Buat Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
