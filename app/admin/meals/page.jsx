"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/utils/image";

export default function ManageMeals() {
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchMeals = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("https://nutrijoy-backend.onrender.com/api/meals/getAllMeals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        if (res.status === 404 && data.message) {
          setMeals([]);
        } else {
          setFetchError(data.message || "Failed to load meals");
        }
      } else {
        const list = Array.isArray(data) ? data : data.meals || [];
        setMeals(list);
      }
    } catch (err) {
      setFetchError("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;

    try {
      setDeletingId(id);
      const token = getToken();
      const res = await fetch(
        `https://nutrijoy-backend.onrender.com/api/meals/deleteMeal/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setMeals((prev) => prev.filter((meal) => meal._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Loading meals...</p>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Meals</h1>

        <button
          onClick={() => router.push("/admin/meals/addMeal")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Meal
        </button>
      </div>

      {fetchError && <p className="text-red-600 mb-4">{fetchError}</p>}

      {meals.length === 0 ? (
        <p className="text-gray-500">No meals right now</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Base Quantity</th>
              <th className="p-3 text-left">Calories per Base</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id} className="border-b">
                <td className="p-3">
                  <img
                    src={getImageUrl(meal.imageUrl)}
                    alt={meal.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3">{meal.name}</td>
                <td className="p-3">{meal.category}</td>
                <td className="p-3">
                  {meal.baseQuantityValue && meal.baseQuantityUnit
                    ? `${meal.baseQuantityValue} ${meal.baseQuantityUnit}`
                    : "-"}
                </td>
                <td className="p-3">
                  {meal.caloriesPerBase != null
                    ? `${meal.caloriesPerBase} kcal`
                    : "-"}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/admin/meals/addMeal?id=${meal._id}`)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    disabled={deletingId === meal._id}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    {deletingId === meal._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
