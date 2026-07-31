"use client";

import { useEffect, useState } from "react";

interface SettingForm {
  websiteTitle: string;
  description: string;
  logo: string;
  favicon: string;
  cv: string;
  primaryColor: string;
}

const initialForm: SettingForm = {
  websiteTitle: "",
  description: "",
  logo: "",
  favicon: "",
  cv: "",
  primaryColor: "#2563eb",
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  function set<K extends keyof SettingForm>(key: K, value: SettingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data) setForm({ ...initialForm, ...data });
    } catch {
      // No settings yet is OK
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2400);
    } catch {
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-9 w-64 rounded bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500/70 mb-1">Admin · Portfolio</p>
        <h1 className="text-3xl font-bold text-slate-800">Pengaturan Website</h1>
        <p className="text-slate-500 mt-1 text-sm">Konfigurasi umum untuk website portofolio kamu.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
          <h2 className="font-semibold text-slate-800 text-base mb-5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
              </svg>
            </div>
            Umum
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Judul Website *</label>
              <input required value={form.websiteTitle} onChange={(e) => set("websiteTitle", e.target.value)} placeholder="Eduward Portfolio"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Deskripsi Website</label>
              <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Deskripsi singkat website untuk SEO..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition resize-none" />
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
          <h2 className="font-semibold text-slate-800 text-base mb-5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            Aset & File
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Logo URL</label>
              <input type="url" value={form.logo} onChange={(e) => set("logo", e.target.value)} placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition" />
              {form.logo && <img src={form.logo} alt="logo" className="mt-2 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Favicon URL</label>
              <input type="url" value={form.favicon} onChange={(e) => set("favicon", e.target.value)} placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition" />
              {form.favicon && <img src={form.favicon} alt="favicon" className="mt-2 h-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">CV / Resume URL</label>
              <input type="url" value={form.cv} onChange={(e) => set("cv", e.target.value)} placeholder="https://drive.google.com/..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition" />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
          <h2 className="font-semibold text-slate-800 text-base mb-5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: form.primaryColor || "#2563eb" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
              </svg>
            </div>
            Tema & Warna
          </h2>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Warna Utama</label>
            <div className="flex items-center gap-4">
              <input type="color" value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)}
                className="w-12 h-10 rounded-xl border border-slate-200 cursor-pointer p-1" />
              <div className="flex-1">
                <input value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)}
                  placeholder="#2563eb"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 transition" />
              </div>
              <div className="w-10 h-10 rounded-xl border border-slate-200 flex-shrink-0" style={{ background: form.primaryColor }} />
            </div>

            {/* Quick color presets */}
            <div className="flex flex-wrap gap-2 mt-3">
              {["#2563eb", "#7c3aed", "#059669", "#dc2626", "#d97706", "#0891b2", "#db2777"].map((color) => (
                <button key={color} type="button" onClick={() => set("primaryColor", color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${form.primaryColor === color ? "border-slate-400 scale-110" : "border-transparent"}`}
                  style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>

        {/* Sticky save bar */}
        <div className="sticky bottom-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            {justSaved ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4"><path d="M20 6L9 17l-5-5" /></svg>
                <span className="text-emerald-600">Tersimpan</span>
              </>
            ) : (
              <span>Perubahan belum disimpan otomatis</span>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={loadData}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Batalkan
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sm font-medium text-white disabled:opacity-50 transition-colors">
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
