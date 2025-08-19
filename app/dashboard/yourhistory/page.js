"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HistoryDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userRes = await fetch("https://nutrijoy-backend.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();
        setUser(userData);

        const historyRes = await fetch(
          "https://nutrijoy-backend.onrender.com/api/dailyConsumption/history",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!historyRes.ok) throw new Error("Failed to fetch history");
        const historyData = await historyRes.json();
        setHistory(historyData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <p>Loading history...</p>;

  const tdee = calculateTDEE(user);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">History</h1>

      {history.length === 0 && <p>No records found.</p>}

      {history.map((record) => {
        const remaining = tdee - record.totalCalories;
        const remainingColor = remaining >= 0 ? "green" : "red";

        return (
          <div
            key={record._id}
            className="mb-4 p-4 bg-gray-100 rounded-lg shadow"
          >
            <h2 className="font-semibold mb-2">
              {new Date(record.date).toLocaleDateString("en-GB")}
            </h2>

            <ul className="mb-2">
              {record.meals.map((meal) => (
                <li key={meal._id} className="flex justify-between">
                  <span>
                    {meal.name || meal.customName} - {meal.calories} kcal
                  </span>
                </li>
              ))}
            </ul>

            <p
              className={`font-semibold text-${
                remaining >= 0 ? "green" : "red"
              }-600`}
            >
              Remaining:{" "}
              <span style={{ color: remainingColor }}>{remaining} kcal</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
