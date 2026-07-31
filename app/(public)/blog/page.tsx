"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  cover?: string | null;
  content: string;
  published: boolean;
  createdAt: string;
}

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function excerpt(content: string, max = 140) {
  const clean = content.replace(/[#*_`[\]()]/g, "").trim();
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d.filter((b: Blog) => b.published) : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <div className="aurora" />
      <section className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-16">
            <p className="section-label mb-3">Thoughts &amp; Ideas</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              My <span className="grad">Blog</span>
            </h1>
            <p className="text-slate-400 mt-4 max-w-xl">Articles, tutorials, and insights on software development.</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-800" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-800 rounded w-3/4" />
                    <div className="h-4 bg-slate-800 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 text-slate-500">
              <div className="text-5xl mb-4">✍️</div>
              <p>No blog posts published yet.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Featured post */}
              {featured && (
                <div className="glass glass-hover rounded-3xl overflow-hidden lg:flex"
                  style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
                  {featured.cover ? (
                    <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden shrink-0">
                      <img src={featured.cover} alt={featured.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="lg:w-1/3 h-48 lg:h-auto flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))" }}>
                      <span className="text-6xl">✍️</span>
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <span className="badge mb-4 self-start">Latest Post</span>
                    <h2 className="text-2xl font-black text-white leading-tight mb-3">{featured.title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{excerpt(featured.content, 200)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{timeAgo(featured.createdAt)}</span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-white transition-colors">
                        Read more
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of posts */}
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <div key={post.id} className="group glass glass-hover rounded-3xl overflow-hidden flex flex-col"
                      style={{ border: "1px solid rgba(99,102,241,0.1)" }}>
                      {post.cover ? (
                        <div className="h-40 overflow-hidden shrink-0">
                          <img src={post.cover} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center shrink-0"
                          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))" }}>
                          <span className="text-4xl opacity-40">✍️</span>
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-white text-base leading-snug mb-2">{post.title}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed flex-1">{excerpt(post.content)}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                          <span className="text-xs text-slate-500">{timeAgo(post.createdAt)}</span>
                          <span className="text-xs font-semibold text-indigo-400">Read →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
