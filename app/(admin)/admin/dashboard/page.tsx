"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  stats: {
    projectCount: number;
    skillCount: number;
    experienceCount: number;
    certificateCount: number;
    blogCount: number;
    unreadCount: number;
  };
  recent: {
    recentProjects: { id: string; title: string; createdAt: string }[];
    recentExperiences: { id: string; company: string; position: string; createdAt: string }[];
    recentMessages: { id: string; name: string; subject: string; isRead: boolean; createdAt: string }[];
  };
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

const statConfig = [
  {
    key: "projectCount" as const,
    label: "Projects",
    href: "/admin/projects",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    shadow: "rgba(99,102,241,0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    ),
  },
  {
    key: "skillCount" as const,
    label: "Teknologi",
    href: "/admin/technology",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    shadow: "rgba(16,185,129,0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    key: "experienceCount" as const,
    label: "Experience",
    href: "/admin/experience",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    shadow: "rgba(245,158,11,0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    key: "unreadCount" as const,
    label: "Pesan Baru",
    href: "/admin/contact",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    shadow: "rgba(239,68,68,0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
        <polyline points="4,4 12,13 20,4" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allRecent = [
    ...(data?.recent?.recentProjects ?? []).map((p) => ({
      label: `Project ditambahkan: "${p.title}"`,
      time: p.createdAt,
      color: "#6366f1",
      href: "/admin/projects",
    })),
    ...(data?.recent?.recentExperiences ?? []).map((e) => ({
      label: `Experience: "${e.position}" di ${e.company}`,
      time: e.createdAt,
      color: "#f59e0b",
      href: "/admin/experience",
    })),
    ...(data?.recent?.recentMessages ?? []).map((m) => ({
      label: `Pesan dari "${m.name}": ${m.subject}`,
      time: m.createdAt,
      color: m.isRead ? "#94a3b8" : "#ef4444",
      href: "/admin/contact",
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-indigo-500/70 mb-1">Portfolio · Admin</p>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1.5 text-sm">Selamat datang kembali. Berikut ringkasan portofolio kamu.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statConfig.map((cfg) => (
          <Link
            key={cfg.key}
            href={cfg.href}
            className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: cfg.gradient, boxShadow: `0 6px 20px ${cfg.shadow}` }}
              >
                {cfg.icon}
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            {loading ? (
              <div className="h-9 w-16 rounded-lg bg-slate-100 animate-pulse mb-1" />
            ) : (
              <p className="text-4xl font-bold text-slate-800 leading-none">
                {data?.stats?.[cfg.key] ?? 0}
              </p>
            )}
            <p className="text-sm text-slate-500 mt-1.5">{cfg.label}</p>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800 text-lg">Aktivitas Terbaru</h2>
            <span className="text-xs text-slate-400 font-mono">{allRecent.length} item</span>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-slate-200 mt-1 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : allRecent.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mx-auto mb-3 opacity-30">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              <p className="text-sm">Belum ada aktivitas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allRecent.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-start gap-3.5 group"
                >
                  <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ring-2 ring-white" style={{ background: item.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(item.time)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 text-lg mb-5">Aksi Cepat</h2>
          <div className="space-y-2.5">
            {[
              { label: "Tambah Project Baru", href: "/admin/projects", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
              { label: "Tambah Teknologi", href: "/admin/technology", gradient: "linear-gradient(135deg, #10b981, #059669)" },
              { label: "Tambah Skill", href: "/admin/skills", gradient: "linear-gradient(135deg, #14b8a6, #0d9488)" },
              { label: "Tambah Experience", href: "/admin/experience", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
              { label: "Lihat Pesan Masuk", href: "/admin/contact", gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
              { label: "Edit Profil", href: "/admin/about", gradient: "linear-gradient(135deg, #0f172a, #1e293b)" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: action.gradient }} />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-auto text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Messages preview */}
      {data && data.recent.recentMessages.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800 text-lg">Pesan Terbaru</h2>
            <Link href="/admin/contact" className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
              Lihat semua →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.recent.recentMessages.map((msg) => (
              <Link
                key={msg.id}
                href="/admin/contact"
                className="group p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-500">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  {!msg.isRead && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />
                  )}
                </div>
                <p className="font-medium text-slate-700 text-sm truncate">{msg.name}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{msg.subject}</p>
                <p className="text-xs text-slate-300 mt-2">{timeAgo(msg.createdAt)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}