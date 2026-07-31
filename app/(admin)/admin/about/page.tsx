"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { supabase } from "@/lib/supabase";

interface AboutForm {
  id?: string;
  fullName: string;
  title: string;
  description: string;
  photo: string;
  resume: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  instagram: string;
  website: string;
}

const initialForm: AboutForm = {
  fullName: "",
  title: "",
  description: "",
  photo: "",
  resume: "",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  instagram: "",
  website: "",
};

/* ---------- tiny inline icon set (no external deps) ---------- */

type IconName =
  | "user"
  | "briefcase"
  | "mail"
  | "phone"
  | "pin"
  | "github"
  | "linkedin"
  | "instagram"
  | "globe"
  | "check"
  | "arrow"
  | "quill"
  | "image"
  | "file";

function Icon({ name, className = "w-4 h-4" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactElement> = {
    user: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3.5" y="7.5" width="17" height="11" rx="1.6" />
        <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
        <path d="M4.5 7l7.5 6 7.5-6" />
      </>
    ),
    phone: (
      <path d="M6 3.5c1 0 2.4 2.6 2.4 3.4S7 8.5 7 9.4c0 1.8 2.8 4.6 4.6 6.4.8 0 2.1-1.4 2.9-1.4.8 0 3.4 1.4 3.4 2.4 0 1.4-1.6 3.2-3 3.2C10.7 20 4 13.3 4 9c0-1.4 1.8-3 3.2-3z" />
    ),
    pin: (
      <>
        <path d="M12 21s6.5-5.7 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.3 6.5 11 6.5 11z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),
    github: (
      <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.6-.2.6-.43v-1.68c-2.5.55-3.03-1.13-3.03-1.13-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.63.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.78.92-2.4-.09-.23-.4-1.15.09-2.4 0 0 .75-.24 2.46.92a8.5 8.5 0 0 1 4.48 0c1.71-1.16 2.46-.92 2.46-.92.49 1.25.18 2.17.09 2.4.57.62.92 1.42.92 2.4 0 3.45-2.1 4.2-4.11 4.43.33.29.62.85.62 1.72v2.55c0 .24.15.52.61.43A9 9 0 0 0 12 3z" />
    ),
    linkedin: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <circle cx="8.2" cy="8.5" r="0.4" fill="currentColor" stroke="none" />
        <path d="M8.2 11v6M8.2 11v6M12 17v-3.6c0-1.3.8-2 1.9-2s1.9.7 1.9 2V17M12 13.4V11" />
      </>
    ),
    instagram: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="16.3" cy="7.7" r="0.7" fill="currentColor" stroke="none" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.7 12h16.6M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5s1.2-6.2 3.6-8.5z" />
      </>
    ),
    check: <path d="M4.5 12.5l4.5 4.5 10.5-11" />,
    arrow: <path d="M5 12h13M13 6l6 6-6 6" />,
    quill: (
      <path d="M19 4.5c-4 0-9.8 2.6-12 8.3-.7 1.9-1.5 5-1.5 6.7 1.7 0 4.8-.8 6.7-1.5 5.7-2.2 8.3-8 8.3-12 0-.6 0-1.1-.1-1.5-.4-.1-.9-.1-1.4 0zM10 14L18 6" />
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

/* ---------- form field ---------- */

interface InputFieldProps {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  icon: IconName;
  onChange: (value: string) => void;
}

function InputField({ label, value, placeholder, type = "text", icon, onChange }: InputFieldProps) {
  return (
    <div>
      <label className="mono-label mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-stone-500">
        {label}
      </label>
      <div className="group relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-teal-800">
          <Icon name={icon} />
        </span>
        <input
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-stone-200 bg-stone-50/60 py-2.5 pl-10 pr-3.5 text-[14.5px] text-stone-800
          outline-none transition placeholder:text-stone-400
          focus:border-teal-800/40 focus:bg-white focus:ring-4 focus:ring-teal-800/[0.07]"
        />
      </div>
    </div>
  );
}

/* ---------- section shell ---------- */

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-7 sm:p-8">
      <div className="mb-6">
        <p className="mono-label text-[11px] uppercase tracking-[0.14em] text-teal-800/70">{eyebrow}</p>
        <h2 className="font-display text-[21px] text-stone-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PhotoUploadField                                                      */
/* ------------------------------------------------------------------ */

const BUCKET = "skill-icons";

type UploadStatus = "idle" | "uploading" | "success" | "error";

function PhotoUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrMsg("Hanya file gambar yang diizinkan.");
      setStatus("error");
      return;
    }
    setStatus("uploading");
    setProgress(10);
    setErrMsg("");
    try {
      const ext = file.name.split(".").pop();
      const path = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      setProgress(40);
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
      if (error) throw error;
      setProgress(85);
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      setProgress(100);
      setStatus("success");
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Upload gagal.");
      setStatus("error");
      setProgress(0);
    }
  }

  function handleFiles(files: FileList | null) {
    if (files?.[0]) upload(files[0]);
  }

  function handleClear() {
    onChange("");
    setStatus("idle");
    setProgress(0);
    setErrMsg("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <label className="mono-label mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-stone-500">
        Foto Profil
      </label>

      <div className="flex gap-4 items-start flex-wrap">
        {/* Current / preview */}
        <div className="shrink-0">
          {value ? (
            <div className="group relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-stone-200 shadow-sm">
              <img
                src={value}
                alt="Foto profil"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" className="w-8 h-8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Drop zone + URL input */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Drag-and-drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-5 py-5 text-center transition-all ${
              dragging
                ? "border-teal-600 bg-teal-50"
                : "border-stone-200 bg-stone-50/60 hover:border-teal-400 hover:bg-teal-50/30"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={dragging ? "#0d9488" : "#a8a29e"} strokeWidth="1.8" strokeLinecap="round" className="w-7 h-7">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[13px] font-medium text-stone-600">
              {dragging ? "Lepas untuk upload" : "Klik atau drag foto ke sini"}
            </p>
            <p className="text-[11px] text-stone-400">JPG, PNG, WEBP · Maks 5MB</p>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* Manual URL override */}
          <div className="relative">
            <input
              type="url"
              value={value ?? ""}
              onChange={(e) => { onChange(e.target.value); setStatus("idle"); }}
              placeholder="Atau tempel URL foto langsung..."
              className="w-full rounded-lg border border-stone-200 bg-stone-50/60 py-2.5 px-3.5 text-[13px] text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-teal-800/40 focus:bg-white focus:ring-4 focus:ring-teal-800/[0.07]"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-red-400 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status */}
          {status === "uploading" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <svg className="w-3 h-3 animate-spin text-teal-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengupload foto...
                </span>
                <span className="font-semibold text-teal-700">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          {status === "success" && (
            <p className="flex items-center gap-1.5 text-[11px] text-teal-700 font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M20 6L9 17l-5-5" /></svg>
              Foto berhasil diupload ke Supabase!
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-1.5 text-[11px] text-red-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {errMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ResumeUploadField                                                     */
/* ------------------------------------------------------------------ */

function ResumeUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setStatus("uploading");
    setProgress(10);
    setErrMsg("");
    setFileName(file.name);
    try {
      const ext = file.name.split(".").pop();
      const path = `resumes/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      setProgress(45);
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
      if (error) throw error;
      setProgress(85);
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      setProgress(100);
      setStatus("success");
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Upload gagal.");
      setStatus("error");
      setProgress(0);
    }
  }

  function handleClear() {
    onChange("");
    setStatus("idle");
    setProgress(0);
    setErrMsg("");
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <label className="mono-label mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-stone-500">
        Resume / CV
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="url"
            value={value ?? ""}
            onChange={(e) => { onChange(e.target.value); setStatus("idle"); }}
            placeholder="https://... atau upload file di bawah"
            className="w-full rounded-lg border border-stone-200 bg-stone-50/60 py-2.5 px-3.5 text-[13px] text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-teal-800/40 focus:bg-white focus:ring-4 focus:ring-teal-800/[0.07] pr-8"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-red-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={status === "uploading"}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 py-2.5 text-[13px] font-medium text-stone-500 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {status === "uploading" ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
          Upload
        </button>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-[13px] font-medium text-stone-500 hover:text-stone-700 transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Lihat
          </a>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />

      {/* Status */}
      {status === "uploading" && (
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-500 flex items-center gap-1.5">
              <svg className="w-3 h-3 animate-spin text-teal-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Mengupload <span className="font-medium text-stone-700 truncate max-w-[160px]">{fileName}</span>
            </span>
            <span className="font-semibold text-teal-700">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {status === "success" && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-teal-700 font-medium">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M20 6L9 17l-5-5" /></svg>
          <span className="font-medium">{fileName}</span> berhasil diupload!
        </p>
      )}
      {status === "error" && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {errMsg}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function AboutAdmin() {
  const [form, setForm] = useState<AboutForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  function set<K extends keyof AboutForm>(key: K, value: AboutForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch("/api/about");
      if (!res.ok) throw new Error("Gagal mengambil data.");
      const data = await res.json();
      if (data) setForm({ ...initialForm, ...data });
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2400);
    } catch {
      alert("Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  }

  const initials =
    form.fullName.trim().length > 0
      ? form.fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("")
      : "—";

  const socials = [
    { key: "github", icon: "github" as IconName, value: form.github },
    { key: "linkedin", icon: "linkedin" as IconName, value: form.linkedin },
    { key: "instagram", icon: "instagram" as IconName, value: form.instagram },
    { key: "website", icon: "globe" as IconName, value: form.website },
  ].filter((s) => (s.value ?? "").trim().length > 0);

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@500&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; font-weight: 560; letter-spacing: -0.01em; }
        .mono-label { font-family: 'IBM Plex Mono', monospace; }
        body, input, textarea, button { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      {loading ? (
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded bg-stone-200" />
            <div className="h-9 w-72 rounded bg-stone-200" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="h-64 rounded-2xl bg-stone-200" />
              <div className="h-64 rounded-2xl bg-stone-200" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-6 py-14">
          {/* header */}
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mono-label text-[11px] uppercase tracking-[0.16em] text-teal-800/70">
                Portfolio · Profil Publik
              </p>
              <h1 className="font-display mt-1.5 text-[34px] leading-none text-stone-900 sm:text-[40px]">
                Susun identitasmu
              </h1>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-stone-500">
                Informasi ini akan tampil di halaman portofoliomu — perbarui kapan pun profilmu berubah.
              </p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <Icon name="quill" className="h-9 w-9 text-teal-800/25" />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
              {/* live identity card */}
              <div className="lg:sticky lg:top-8">
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-900 text-stone-100 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
                  <div className="border-b border-white/10 px-6 pb-5 pt-6">
                    <p className="mono-label text-[10px] uppercase tracking-[0.18em] text-teal-300/70">
                      Kartu Identitas
                    </p>
                    <div className="mt-4 flex items-center gap-3.5">
                      {/* Photo avatar in card */}
                      {form.photo ? (
                        <img
                          src={form.photo}
                          alt={form.fullName || "Photo"}
                          className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-teal-400/30"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-800/30 text-[15px] font-semibold text-teal-200">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-display truncate text-[17px] text-white">
                          {form.fullName || "Nama lengkapmu"}
                        </p>
                        <p className="truncate text-[13px] text-stone-400">
                          {form.title || "Jabatan / peran"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 px-6 py-5 text-[13px] text-stone-300">
                    <div className="flex items-center gap-2.5">
                      <Icon name="mail" className="h-3.5 w-3.5 text-stone-500" />
                      <span className="truncate">{form.email || "email@contoh.com"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Icon name="phone" className="h-3.5 w-3.5 text-stone-500" />
                      <span className="truncate">{form.phone || "Nomor telepon"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Icon name="pin" className="h-3.5 w-3.5 text-stone-500" />
                      <span className="truncate">{form.location || "Lokasi"}</span>
                    </div>
                  </div>

                  {form.description && (
                    <p className="border-t border-white/10 px-6 py-4 text-[13px] leading-relaxed text-stone-400">
                      {form.description.length > 140
                        ? form.description.slice(0, 140) + "…"
                        : form.description}
                    </p>
                  )}

                  {socials.length > 0 && (
                    <div className="flex gap-2 border-t border-white/10 px-6 py-4">
                      {socials.map((s) => (
                        <span
                          key={s.key}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-stone-300"
                        >
                          <Icon name={s.icon} className="h-3.5 w-3.5" />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mono-label mt-3 px-1 text-[11px] leading-relaxed text-stone-400">
                  Pratinjau langsung — berubah seiring kamu mengetik.
                </p>
              </div>

              {/* form sections */}
              <div className="space-y-6">
                <Section eyebrow="01 · Identitas" title="Data Diri">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="Nama Lengkap"
                      icon="user"
                      placeholder="Eduward Gilbert Simanjuntak"
                      value={form.fullName}
                      onChange={(v) => set("fullName", v)}
                    />
                    <InputField
                      label="Jabatan / Profesi"
                      icon="briefcase"
                      placeholder="Software Engineer"
                      value={form.title}
                      onChange={(v) => set("title", v)}
                    />
                    <InputField
                      label="Email"
                      icon="mail"
                      type="email"
                      placeholder="email@contoh.com"
                      value={form.email}
                      onChange={(v) => set("email", v)}
                    />
                    <InputField
                      label="Nomor Telepon"
                      icon="phone"
                      placeholder="+628123456789"
                      value={form.phone}
                      onChange={(v) => set("phone", v)}
                    />
                    <div className="sm:col-span-2">
                      <InputField
                        label="Lokasi"
                        icon="pin"
                        placeholder="Jakarta, Indonesia"
                        value={form.location}
                        onChange={(v) => set("location", v)}
                      />
                    </div>
                    {/* ─── Photo Upload ─── */}
                    <div className="sm:col-span-2">
                      <PhotoUploadField
                        value={form.photo}
                        onChange={(url) => set("photo", url)}
                      />
                    </div>
                    {/* ─── Resume Upload ─── */}
                    <div className="sm:col-span-2">
                      <ResumeUploadField
                        value={form.resume}
                        onChange={(url) => set("resume", url)}
                      />
                    </div>
                  </div>
                </Section>

                <Section eyebrow="02 · Narasi" title="Tentang Saya">
                  <label className="mono-label mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-stone-500">
                    Deskripsi
                  </label>
                  <textarea
                    rows={7}
                    value={form.description}
                    placeholder="Ceritakan kepada pengunjung tentang dirimu..."
                    onChange={(e) => set("description", e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50/60 px-3.5 py-3 text-[14.5px] leading-relaxed text-stone-800
                    outline-none transition placeholder:text-stone-400
                    focus:border-teal-800/40 focus:bg-white focus:ring-4 focus:ring-teal-800/[0.07]"
                  />
                  <p className="mono-label mt-2 text-right text-[11px] text-stone-400">
                    {form.description.length} karakter
                  </p>
                </Section>

                <Section eyebrow="03 · Kanal" title="Media Sosial">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="GitHub"
                      icon="github"
                      placeholder="https://github.com/username"
                      value={form.github}
                      onChange={(v) => set("github", v)}
                    />
                    <InputField
                      label="LinkedIn"
                      icon="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedin}
                      onChange={(v) => set("linkedin", v)}
                    />
                    <InputField
                      label="Instagram"
                      icon="instagram"
                      placeholder="https://instagram.com/username"
                      value={form.instagram}
                      onChange={(v) => set("instagram", v)}
                    />
                    <InputField
                      label="Website"
                      icon="globe"
                      placeholder="https://situsmu.com"
                      value={form.website}
                      onChange={(v) => set("website", v)}
                    />
                  </div>
                </Section>
              </div>
            </div>

            {/* sticky action bar */}
            <div className="sticky bottom-6 mt-8 flex items-center justify-between rounded-2xl border border-stone-200 bg-white/90 px-6 py-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur">
              <div className="mono-label flex items-center gap-2 text-[12px] text-stone-500">
                {justSaved ? (
                  <>
                    <Icon name="check" className="h-4 w-4 text-teal-800" />
                    <span className="text-teal-800">Tersimpan</span>
                  </>
                ) : (
                  <span>Perubahan belum disimpan otomatis</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={loadData}
                  className="rounded-lg border border-stone-200 px-5 py-2.5 text-[14px] font-medium text-stone-600 transition hover:bg-stone-50"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-stone-900 px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  {!saving && <Icon name="arrow" className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}