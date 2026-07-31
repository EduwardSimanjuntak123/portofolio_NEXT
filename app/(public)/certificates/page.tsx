"use client";

import { useEffect, useState } from "react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credential?: string | null;
  image?: string | null;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then((d) => setCerts(Array.isArray(d) ? d : []))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="aurora" />
      <section className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-16">
            <p className="section-label mb-3">Credentials</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              Certificates &amp; <span className="grad-gold">Awards</span>
            </h1>
            <p className="text-slate-400 mt-4 max-w-xl">Verified credentials and recognitions I&apos;ve earned along the way.</p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-slate-800" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : certs.length === 0 ? (
            <div className="text-center py-24 text-slate-500">
              <div className="text-5xl mb-4">🏆</div>
              <p>No certificates added yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert) => (
                <div
                  key={cert.id}
                  className="group glass glass-hover rounded-3xl overflow-hidden flex flex-col"
                  style={{ border: "1px solid rgba(245,158,11,0.12)" }}
                >
                  {/* Image */}
                  {cert.image ? (
                    <div className="h-44 overflow-hidden shrink-0">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="h-44 flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,179,8,0.05))" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="1" className="w-16 h-16">
                        <path d="M12 15l-2-2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-5l-2 2z" />
                        <path d="M9 7h6M9 10h4" />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                          <path d="M12 15l-2-2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-5l-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-white leading-snug">{cert.title}</h3>
                        <p className="text-amber-400 text-xs font-semibold mt-0.5">{cert.issuer}</p>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs mt-auto pt-3 border-t flex items-center gap-1.5"
                      style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formatDate(cert.issueDate)}
                    </p>

                    {cert.credential && (
                      <a
                        href={cert.credential}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:shadow-lg"
                        style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Verify Credential
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
