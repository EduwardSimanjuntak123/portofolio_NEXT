"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

type Filter = "all" | "unread" | "read";

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function ContactPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string, isRead: boolean) {
    await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead } : m));
  }

  async function handleDelete(id: string) {
    try {
      setDeleting(true);
      await fetch(`/api/contact/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setDeleteConfirm(null);
      if (expanded === id) setExpanded(null);
    } catch {
      alert("Gagal menghapus pesan.");
    } finally {
      setDeleting(false);
    }
  }

  function handleExpand(id: string, isRead: boolean) {
    setExpanded(expanded === id ? null : id);
    if (!isRead) markRead(id, true);
  }

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.isRead;
    if (filter === "read") return m.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-red-500/70 mb-1">Admin · Portfolio</p>
            <h1 className="text-3xl font-bold text-slate-800">Pesan Masuk</h1>
            <p className="text-slate-500 mt-1 text-sm">
              {unreadCount > 0 ? (
                <span className="text-red-500 font-medium">{unreadCount} pesan belum dibaca</span>
              ) : (
                "Semua pesan sudah dibaca."
              )}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-white rounded-xl border border-slate-200 p-1">
            {(["all", "unread", "read"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
                style={filter === f ? { background: "linear-gradient(135deg, #ef4444, #dc2626)" } : {}}
              >
                {f === "all" ? "Semua" : f === "unread" ? "Belum Dibaca" : "Sudah Dibaca"}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 text-xs bg-white/30 px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Messages list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 mx-auto mb-4 opacity-30">
              <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
              <polyline points="4,4 12,13 20,4" />
            </svg>
            <p className="text-base font-medium">Tidak ada pesan</p>
            <p className="text-sm mt-1">
              {filter === "unread" ? "Semua pesan sudah dibaca." : "Belum ada pesan masuk."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl border shadow-sm transition-all overflow-hidden ${
                  !msg.isRead ? "border-red-200 shadow-red-50" : "border-slate-100"
                }`}
              >
                {/* Summary row */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => handleExpand(msg.id, msg.isRead)}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{
                      background: !msg.isRead
                        ? "linear-gradient(135deg, #ef4444, #dc2626)"
                        : "linear-gradient(135deg, #94a3b8, #64748b)",
                    }}
                  >
                    {msg.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-sm truncate ${!msg.isRead ? "text-slate-800" : "text-slate-600"}`}>
                        {msg.name}
                      </p>
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${!msg.isRead ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                      {msg.subject}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400">{timeAgo(msg.createdAt)}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded === msg.id ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>

                {/* Expanded content */}
                {expanded === msg.id && (
                  <div className="px-5 pb-5 border-t border-slate-100">
                    <div className="pt-4 grid sm:grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                        <a href={`mailto:${msg.email}`} className="text-sm text-indigo-600 hover:underline">{msg.email}</a>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Diterima</p>
                        <p className="text-sm text-slate-600">{new Date(msg.createdAt).toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pesan</p>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => markRead(msg.id, !msg.isRead)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                          msg.isRead
                            ? "text-slate-600 border-slate-200 hover:bg-slate-50"
                            : "text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                        }`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          {msg.isRead ? <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /> : <path d="M20 6L9 17l-5-5" />}
                        </svg>
                        {msg.isRead ? "Tandai Belum Dibaca" : "Tandai Dibaca"}
                      </button>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" /><polyline points="4,4 12,13 20,4" />
                        </svg>
                        Balas via Email
                      </a>
                      <button
                        onClick={() => setDeleteConfirm(msg.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" className="w-7 h-7">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Pesan?</h3>
            <p className="text-sm text-slate-500 mb-6">Pesan ini akan dihapus permanen.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={deleting} className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white disabled:opacity-50 transition-colors">
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}