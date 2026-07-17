"use client";

import { useEffect, useState } from "react";

interface Experience {
  id?: string;
  company: string;
  position: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description: string;
  logo?: string | null;
}

const EMPTY: Experience = {
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  logo: "",
};

interface Props {
  open: boolean;
  experience: Experience | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ExperienceModal({ open, experience, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Experience>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (experience) {
      setForm({
        ...experience,
        startDate: experience.startDate ? experience.startDate.slice(0, 7) : "",
        endDate: experience.endDate ? experience.endDate.slice(0, 7) : "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [experience, open]);

  if (!open) return null;

  function set<K extends keyof Experience>(key: K, value: Experience[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...form,
        startDate: form.startDate ? `${form.startDate}-01` : null,
        endDate: form.endDate ? `${form.endDate}-01` : null,
      };

      const isEdit = !!experience?.id;
      const url = isEdit ? `/api/experience/${experience!.id}` : "/api/experience";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{experience ? "Edit Experience" : "Tambah Experience"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Riwayat pekerjaan / magang</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-7 py-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Perusahaan *</label>
                <input required value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="PT. ABC Indonesia"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-100 transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Posisi *</label>
                <input required value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="Frontend Developer"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-100 transition" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Lokasi</label>
              <input value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="Jakarta, Indonesia (Remote)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-100 transition" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Mulai (Bulan/Tahun) *</label>
                <input required type="month" value={form.startDate} onChange={(e) => set("startDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-100 transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Selesai (kosong = Present)</label>
                <input type="month" value={form.endDate ?? ""} onChange={(e) => set("endDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-100 transition" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Deskripsi *</label>
              <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Tanggung jawab dan pencapaian selama bekerja di sini..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-100 transition resize-none" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Logo URL</label>
              <input type="url" value={form.logo ?? ""} onChange={(e) => set("logo", e.target.value)} placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-100 transition" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              {loading ? "Menyimpan..." : experience ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
