"use client";

import { useEffect, useState, type ReactElement } from "react";

interface AboutForm {
  id?: string;
  fullName: string;
  title: string;
  description: string;
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
  | "quill";

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
          value={value}
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
  ].filter((s) => s.value.trim().length > 0);

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
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-800/30 text-[15px] font-semibold text-teal-200">
                        {initials}
                      </div>
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