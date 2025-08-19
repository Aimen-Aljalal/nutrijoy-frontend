"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login...");
          router.push("/login");
          return;
        }

        const res = await fetch("https://nutrijoy-backend.onrender.com/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.log("Profile fetch failed, redirecting to login...");
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (data.role?.toLowerCase() !== "admin") {
          console.log("User is not admin, redirecting to dashboard...");
          router.push("/dashboard");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Error checking admin:", err);
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Checking permissions...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/users">Manage Users</Link>
          <Link href="/admin/meals">Manage Meals</Link>
          <Link href="/admin/add-meal">Add Meal</Link>
          <Link href="/admin/stats">Statistics</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
