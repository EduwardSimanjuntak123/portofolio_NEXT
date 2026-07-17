"use client";

import { usePathname } from "next/navigation";

const pageNames: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/skills": "Skills",
  "/admin/experience": "Experience",
  "/admin/contact": "Contact",
  "/admin/about": "About",
};

export default function Header() {
  const pathname = usePathname();
  const currentPage = pageNames[pathname] ?? "Admin";

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">Admin</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-slate-300">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="font-semibold text-slate-700">{currentPage}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold text-slate-700 leading-none">Administrator</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Portfolio Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}