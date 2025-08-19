"use client";

import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout } = useContext(AuthContext);

  const linkClass = (path) =>
    pathname === path
      ? "bg-white text-green-800 font-semibold px-4 py-2 rounded-full shadow"
      : "text-white font-medium hover:underline transition duration-200";

  return (
    <header className="bg-gradient-to-r from-green-700 to-green-900 shadow-lg py-6 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1
          className="text-3xl md:text-4xl font-extrabold text-white tracking-wide cursor-pointer"
          onClick={() => router.push("/")}
        >
          Nutri<span className="text-yellow-200">Joy</span>
        </h1>

        <nav className="space-x-4">
          {!token ? (
            <>
              <a href="/login" className={linkClass("/login")}>
                Login
              </a>
              <a href="/signup" className={linkClass("/signup")}>
                Sign Up
              </a>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
