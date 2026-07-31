"use client";

import { useEffect, useState } from "react";

interface Technology {
  id: string;
  name: string;
  logo?: string | null;
  category?: string | null;
}

export interface Skill {
  id?: string;
  category: string;
  percentage: number;
  technologies?: { technology: Technology }[];
  technologyIds?: string[];
}

interface SkillModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  skill?: Skill | null;
}

const CATEGORIES = ["Frontend", "Backend", "Mobile", "Database", "DevOps", "Tools", "Programming Language", "Design", "Lainnya"];

const initialForm = { category: "", percentage: 70, technologyIds: [] as string[] };

export default function SkillModal({ open, onClose, onSuccess, skill }: SkillModalProps) {
  const [form, setForm] = useState(initialForm);
  const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(false);
  const [techSearch, setTechSearch] = useState("");

  useEffect(() => {
    fetch("/api/technologies")
      .then((r) => r.json())
      .then((data) => setAllTechnologies(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (skill) {
      setForm({
        category: skill.category,
        percentage: skill.percentage,
        technologyIds: skill.technologyIds || skill.technologies?.map((t) => t.technology.id) || [],
      });
    } else {
      setForm(initialForm);
    }
    setTechSearch("");
  }, [skill, open]);

  if (!open) return null;

  function toggleTech(id: string) {
    setForm((prev) => ({
      ...prev,
      technologyIds: prev.technologyIds.includes(id)
        ? prev.technologyIds.filter((t) => t !== id)
        : [...prev.technologyIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const isEdit = !!skill?.id;
      const body = isEdit ? { id: skill!.id, ...form } : form;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch("/api/skills", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  const levelLabel = form.percentage >= 90 ? "Expert" : form.percentage >= 70 ? "Advanced" : form.percentage >= 50 ? "Intermediate" : form.percentage >= 30 ? "Beginner" : "Novice";
  const levelColors = { Expert: ["#dcfce7","#16a34a"], Advanced: ["#dbeafe","#2563eb"], Intermediate: ["#fef9c3","#ca8a04"], Beginner: ["#ffedd5","#ea580c"], Novice: ["#fee2e2","#dc2626"] };
  const [bgColor, textColor] = levelColors[levelLabel as keyof typeof levelColors];

  const filteredTechs = allTechnologies.filter((t) =>
    t.name.toLowerCase().includes(techSearch.toLowerCase())
  );
  const selectedTechs = allTechnologies.filter((t) => form.technologyIds.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{skill ? "Edit Skill" : "Tambah Skill Baru"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Kategori keahlian & teknologi terkait</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Kategori Skill *</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition"
            >
              <option value="">Pilih Kategori</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Percentage slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Level Keahlian</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700">{form.percentage}%</span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ background: bgColor, color: textColor }}>{levelLabel}</span>
              </div>
            </div>
            <input
              type="range" min={5} max={100} step={5}
              value={form.percentage}
              onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #10b981 ${form.percentage}%, #e2e8f0 ${form.percentage}%)` }}
            />
            <div className="flex justify-between text-xs text-slate-300 mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {/* Technology picker */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Teknologi Terkait
              {form.technologyIds.length > 0 && (
                <span className="ml-2 text-emerald-600 font-bold">{form.technologyIds.length} dipilih</span>
              )}
            </label>

            {/* Selected tags */}
            {selectedTechs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedTechs.map((t) => (
                  <span key={t.id} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-medium">
                    {t.logo && <img src={t.logo} alt="" className="w-3.5 h-3.5 object-contain" />}
                    {t.name}
                    <button type="button" onClick={() => toggleTech(t.id)} className="hover:text-red-500 transition-colors ml-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3 h-3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search + List */}
            <div className="relative mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                placeholder="Cari teknologi..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-emerald-400 focus:bg-white transition"
              />
            </div>

            {allTechnologies.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">Belum ada teknologi. Tambah dulu di halaman Technology.</p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                {filteredTechs.map((tech) => {
                  const isSelected = form.technologyIds.includes(tech.id);
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => toggleTech(tech.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left transition-colors ${isSelected ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50 text-slate-700"}`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}>
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

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
              {loading ? "Menyimpan..." : skill ? "Update Skill" : "Tambah Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}