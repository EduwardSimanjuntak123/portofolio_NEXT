"use client";

import { useEffect, useState } from "react";
import UploadField from "@/components/admin/UploadField";

interface Technology {
  id: string;
  name: string;
  logo?: string | null;
  category?: string | null;
  _count?: { skills: number; projects: number };
}

interface TechnologyModalProps {
  open: boolean;
  technology: Technology | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = ["Frontend", "Backend", "Mobile", "Database", "DevOps", "Tools", "Programming Language", "Design"];

const initialForm = { name: "", logo: "", category: "" };

export default function TechnologyModal({ open, technology, onClose, onSuccess }: TechnologyModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (technology) {
      setForm({ name: technology.name, logo: technology.logo || "", category: technology.category || "" });
    } else {
      setForm(initialForm);
    }
  }, [technology, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const isEdit = !!technology?.id;
      const url = isEdit ? `/api/technologies/${technology!.id}` : "/api/technologies";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menyimpan.");
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  const categoryColors: Record<string, string> = {
    Frontend: "#3b82f6", Backend: "#10b981", Mobile: "#8b5cf6",
    Database: "#f59e0b", DevOps: "#ef4444", Tools: "#64748b",
    "Programming Language": "#f97316", Design: "#ec4899",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{technology ? "Edit Teknologi" : "Tambah Teknologi"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Teknologi yang digunakan di skills &amp; projects</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Nama Teknologi *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="React, Laravel, PostgreSQL..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          {/* Logo — Upload Field */}
          <UploadField
            label="Logo"
            value={form.logo}
            onChange={(url) => setForm({ ...form, logo: url })}
            accept="image"
            placeholder="https://cdn.example.com/logo.svg"
            previewType="image"
            accentColor="indigo"
          />

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Kategori</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: form.category === cat ? "" : cat })}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                  style={
                    form.category === cat
                      ? { background: categoryColors[cat] || "#6366f1", color: "white", borderColor: "transparent" }
                      : { background: "white", color: "#64748b", borderColor: "#e2e8f0" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              {loading ? "Menyimpan..." : technology ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
