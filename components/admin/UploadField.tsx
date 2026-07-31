"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const BUCKET = "skill-icons";

type AcceptType = "image" | "file" | "any";

interface UploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: AcceptType;
  placeholder?: string;
  previewType?: "image" | "none";
  accentColor?: string; // tailwind class like "indigo" or "emerald"
}

function getAccept(type: AcceptType) {
  if (type === "image") return "image/*";
  if (type === "file") return ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,application/*";
  return "*/*";
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "📄";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return "🖼️";
  return "📁";
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadField({
  label,
  value,
  onChange,
  accept = "image",
  placeholder = "https://...",
  previewType = "image",
  accentColor = "indigo",
}: UploadFieldProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const ring = {
    indigo: "focus:border-indigo-400 focus:ring-indigo-100",
    emerald: "focus:border-emerald-400 focus:ring-emerald-100",
    amber: "focus:border-amber-400 focus:ring-amber-100",
    violet: "focus:border-violet-400 focus:ring-violet-100",
    slate: "focus:border-slate-400 focus:ring-slate-100",
  }[accentColor] ?? "focus:border-indigo-400 focus:ring-indigo-100";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");
    setErrorMsg("");
    setProgress(10);

    try {
      const ext = file.name.split(".").pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      setProgress(40);

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(uniqueName, file, { upsert: false });

      if (error) throw error;

      setProgress(80);

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(uniqueName);

      setProgress(100);
      onChange(data.publicUrl);
      setStatus("success");

      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload gagal.";
      setErrorMsg(msg);
      setStatus("error");
      setProgress(0);
    }
  }

  function handleClear() {
    onChange("");
    setStatus("idle");
    setFileName("");
    setProgress(0);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const isImage = accept === "image";
  const showPreview = previewType === "image" && value && isImage;

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
        {label}
      </label>

      {/* URL input + upload button row */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="url"
            value={value}
            onChange={(e) => { onChange(e.target.value); setStatus("idle"); }}
            placeholder={placeholder}
            className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 transition pr-8 ${ring}`}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              title="Hapus"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Upload button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 text-slate-500 hover:text-slate-700 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {status === "uploading" ? (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
          Upload
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={getAccept(accept)}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Status bar */}
      {status === "uploading" && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="4" />
                <path className="opacity-75" fill="#6366f1" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Mengupload {getFileIcon(fileName)} {fileName && <span className="font-medium text-slate-700 truncate max-w-[140px]">{fileName}</span>}
            </span>
            <span className="font-semibold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(to right, #6366f1, #8b5cf6)",
              }}
            />
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>Upload berhasil — {getFileIcon(fileName)} <span className="font-medium">{fileName}</span></span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Image preview */}
      {showPreview && (
        <div className="relative group w-fit">
          <img
            src={value}
            alt="preview"
            className="h-14 w-auto max-w-[160px] object-contain rounded-xl border border-slate-200 bg-slate-50 p-1"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-2.5 h-2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
