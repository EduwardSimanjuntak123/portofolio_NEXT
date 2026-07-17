"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-slate-800">
            Eduward Portfolio
          </h1>

          <p className="text-slate-500 mt-2">
            Admin Dashboard
          </p>

          <p className="mt-6 text-sm text-slate-600">
            Login menggunakan akun GitHub
            untuk mengelola seluruh isi website.
          </p>

        </div>

        <button
          onClick={() =>
            signIn("github", {
              callbackUrl: "/admin/dashboard",
            })
          }
          className="mt-8 w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white py-3 rounded-xl transition"
        >
          <FaGithub size={22} />
          <span>Sign in with GitHub</span>
        </button>

      </div>

    </div>
  );
}