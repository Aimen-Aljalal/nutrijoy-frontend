"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function DashboardPage() {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const calculateTDEE = (user) => {
    if (!user) return 0;

    const weight = Number(user.weight_kg);
    const height = Number(user.height_cm);
    const age = Number(user.age);
    const gender = user.gender?.toLowerCase();
    const activity = user.activity_level?.toLowerCase() || "sedentary";

    let bmr = 0;
    if (gender === "male") bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    else if (gender === "female")
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;

    let multiplier = 1.2;
    if (activity === "light") multiplier = 1.375;
    else if (activity === "moderate") multiplier = 1.55;
    else if (activity === "active") multiplier = 1.725;
    else if (activity === "very active") multiplier = 1.9;

    let tdee = bmr * multiplier;
    const goal = user.goal?.toLowerCase() || "maintain weight";
    if (goal === "lose weight") tdee *= 0.8;
    else if (goal === "gain weight") tdee *= 1.2;

    return Math.round(tdee);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
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
        setFormData(data);
      } catch (error) {
        console.error(error);
        logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, logout]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://nutrijoy-backend.onrender.com/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          age: formData.age,
          weight_kg: formData.weight_kg,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setIsEditing(false);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const BMI_MAX = 40;
  const ticks = [0, 18, 25, 30, 35, 40];
  const toPct = (v) => (v / BMI_MAX) * 100;
  const tickPercents = ticks.map(toPct);
  const rawBmi = Number(user.bmi ?? 0);
  const clampedBmi = Math.max(0, Math.min(rawBmi, BMI_MAX));
  const arrowLeftPct = toPct(clampedBmi);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-700 to-green-900 shadow-lg py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Welcome, <span className="text-yellow-200">{user.username}</span>
        </h1>
        <button
          onClick={() => router.push("/dashboard/edit")}
          className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-semibold py-2 px-4 rounded-lg shadow"
        >
          Edit Profile
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            Your Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
            <p>
              <span className="font-semibold text-green-700">Username:</span>{" "}
              {user.username}
            </p>
            <p>
              <span className="font-semibold text-green-700">Email:</span>{" "}
              {user.email}
            </p>
            <p>
              <span className="font-semibold text-green-700">Age:</span>{" "}
              {user.age}
            </p>
            <p>
              <span className="font-semibold text-green-700">Gender:</span>{" "}
              {user.gender}
            </p>
            <p>
              <span className="font-semibold text-green-700">Height:</span>{" "}
              {user.height_cm} cm
            </p>
            <p>
              <span className="font-semibold text-green-700">Weight:</span>{" "}
              {user.weight_kg} kg
            </p>
            <p>
              <span className="font-semibold text-green-700">
                Ideal Weight:
              </span>{" "}
              {user.idealWeight} kg
            </p>
            <p>
              <span className="font-semibold text-green-700">BMI:</span>{" "}
              {user.bmi} ({user.bmiCategory})
            </p>
            <p>
              <span className="font-semibold text-green-700">
                Activity Level:
              </span>{" "}
              {user.activity_level}
            </p>
            <p>
              <span className="font-semibold text-green-700">Goal:</span>{" "}
              {user.goal}
            </p>
            <p>
              <span className="font-semibold text-green-700">
                Daily Calories:
              </span>{" "}
              {calculateTDEE(user)} kcal
            </p>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            BMI Meter
          </h2>
          <div className="relative w-full h-8 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="bg-blue-400 h-full" style={{ flex: 18 }} />
              <div className="bg-green-400 h-full" style={{ flex: 7 }} />
              <div className="bg-yellow-400 h-full" style={{ flex: 5 }} />
              <div className="bg-orange-400 h-full" style={{ flex: 5 }} />
              <div className="bg-red-500 h-full" style={{ flex: 5 }} />
            </div>
            {tickPercents.slice(1, -1).map((p, i) => (
              <div
                key={`tickline-${i}`}
                className="absolute top-0 bottom-0 w-px bg-white/70"
                style={{ left: `${p}%` }}
              />
            ))}
            <div
              className="absolute -top-12 font-extrabold drop-shadow-lg"
              style={{
                left: `${arrowLeftPct}%`,
                transform: "translateX(-50%)",
                fontSize: "4rem",
                color: "black",
              }}
            >
              ↑
            </div>
          </div>
          <div className="relative w-full mt-3 h-6">
            {ticks.map((t, i) => (
              <span
                key={`tick-${t}`}
                className="absolute text-sm text-gray-700"
                style={{
                  left: `${tickPercents[i]}%`,
                  transform: "translateX(-50%)",
                }}
              >
                {i === ticks.length - 1 ? "40+" : t}
              </span>
            ))}
          </div>
          <p className="mt-6 text-center text-gray-700">
            Your BMI:{" "}
            <span className="font-bold text-green-800">{user.bmi}</span> (
            {user.bmiCategory})
          </p>
          <div className="mt-2 text-center text-xs text-gray-500">
            <span className="mr-3">Underweight: 0–18</span>
            <span className="mr-3">Normal: 18–25</span>
            <span className="mr-3">Overweight: 25–30</span>
            <span className="mr-3">Obesity I: 30–35</span>
            <span>Obesity II: 35+</span>
          </div>
        </div>
      </main>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-green-800">
              Edit Profile
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                placeholder="Username"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <input
                type="number"
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
                placeholder="Age"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <input
                type="number"
                name="weight_kg"
                value={formData.weight_kg || ""}
                onChange={handleChange}
                placeholder="Weight (kg)"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
