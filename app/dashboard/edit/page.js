"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function EditProfilePage() {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("https://nutrijoy-backend.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          logout();
          router.push("/");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, logout, token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("https://nutrijoy-backend.onrender.com/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          weight_kg: Number(user.weight_kg),
          height_cm: Number(user.height_cm),  
          age: Number(user.age),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("Profile updated successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-700 to-green-900 shadow-lg py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={user.age}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                min="10"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="height_cm"
                value={user.height_cm}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                min="100"
                max="250"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight_kg"
              value={user.weight_kg}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              min="30"
              max="300"
              required
            />
          </div>

           <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
