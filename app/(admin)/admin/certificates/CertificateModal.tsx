"use client";

import { useEffect, useState } from "react";
import UploadField from "@/components/admin/UploadField";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credential?: string | null;
  image?: string | null;
}

interface CertificateModalProps {
  open: boolean;
  certificate: Certificate | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm = { title: "", issuer: "", issueDate: "", credential: "", image: "" };

export default function CertificateModal({ open, certificate, onClose, onSuccess }: CertificateModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (certificate) {
      setForm({
        title: certificate.title,
        issuer: certificate.issuer,
        issueDate: certificate.issueDate ? certificate.issueDate.slice(0, 10) : "",
        credential: certificate.credential || "",
        image: certificate.image || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [certificate, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const isEdit = !!certificate?.id;
      const url = isEdit ? `/api/certificates/${certificate!.id}` : "/api/certificates";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{certificate ? "Edit Sertifikat" : "Tambah Sertifikat"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sertifikasi dan penghargaan</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Judul Sertifikat *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AWS Certified Developer"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Penerbit *</label>
              <input required value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Amazon Web Services"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Tanggal Terbit *</label>
              <input required type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">URL Credential</label>
            <input type="url" value={form.credential} onChange={(e) => setForm({ ...form, credential: e.target.value })} placeholder="https://verify.example.com/..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition" />
          </div>

          {/* Image upload */}
          <UploadField
            label="Gambar Sertifikat"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            accept="image"
            placeholder="https://example.com/cert.jpg"
            previewType="image"
            accentColor="amber"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              {loading ? "Menyimpan..." : certificate ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
