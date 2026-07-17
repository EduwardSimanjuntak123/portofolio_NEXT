"use client";

import { useEffect, useState } from "react";

export interface Skill {
  id?: string;
  name: string;
  category: string;
  percentage: number;
  icon: string;
}

interface SkillModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  skill?: Skill | null;
}

const initialForm: Skill = {
  name: "",
  category: "",
  percentage: 50,
  icon: "",
};

const categories = ["Frontend", "Backend", "Mobile", "Database", "DevOps", "Tools", "Programming Language"];

export default function SkillModal({ open, onClose, onSuccess, skill }: SkillModalProps) {
  const [form, setForm] = useState<Skill>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(skill ? { ...skill } : initialForm);
  }, [skill, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const method = skill?.id ? "PUT" : "POST";
      const res = await fetch("/api/skills", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      onSuccess();
      onClose();
    } catch {
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  const levelLabel =
    form.percentage >= 90 ? "Expert" :
    form.percentage >= 70 ? "Advanced" :
    form.percentage >= 50 ? "Intermediate" :
    form.percentage >= 30 ? "Beginner" : "Novice";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{skill ? "Edit Skill" : "Tambah Skill Baru"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Teknologi dan keahlian</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          {/* Name & Icon */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Nama Skill *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="React JS"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-green-400 focus:bg-white focus:ring-3 focus:ring-green-100 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Icon / Emoji</label>
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="⚛️ atau FaReact"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-green-400 focus:bg-white focus:ring-3 focus:ring-green-100 transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Kategori *</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-green-400 focus:bg-white focus:ring-3 focus:ring-green-100 transition"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Percentage slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Level Keahlian</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700">{form.percentage}%</span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                  style={{
                    background: form.percentage >= 70 ? "#dcfce7" : form.percentage >= 50 ? "#fef9c3" : "#fee2e2",
                    color: form.percentage >= 70 ? "#16a34a" : form.percentage >= 50 ? "#ca8a04" : "#dc2626",
                  }}>
                  {levelLabel}
                </span>
              </div>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={form.percentage}
              onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 ${form.percentage}%, #e2e8f0 ${form.percentage}%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-300 mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
              {loading ? "Menyimpan..." : skill ? "Update Skill" : "Tambah Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}