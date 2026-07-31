export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-32 border-t" style={{ borderColor: "rgba(99,102,241,0.12)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            E
          </div>
          <span className="text-slate-400 text-sm">
            © {year} <span className="text-white font-medium">Eduward Gilbert Simanjuntak</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <span>Built with</span>
          <span className="text-red-400 mx-0.5">♥</span>
          <span>using Next.js &amp; Supabase</span>
        </div>
      </div>
    </footer>
  );
}