"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Profile" },
    { href: "/dashboard/planing", label: "Meal Planning" },
    { href: "/dashboard/yourhistory", label: "Your History" },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-64 bg-green-900 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg ${
                pathname === item.href
                  ? "bg-green-700 font-semibold"
                  : "hover:bg-green-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <header className="w-full bg-green-900 text-white p-4 flex justify-end md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded bg-green-700 hover:bg-green-600 focus:outline-none"
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </header>

      {open && (
        <div className="md:hidden bg-green-900 text-white flex flex-col p-4 space-y-2 shadow-md">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-lg ${
                pathname === item.href
                  ? "bg-green-700 font-semibold"
                  : "hover:bg-green-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
