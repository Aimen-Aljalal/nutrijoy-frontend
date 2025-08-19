"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/utils/image";

export default function MealPlanning() {
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [userQuantity, setUserQuantity] = useState("");
  const [calculatedCalories, setCalculatedCalories] = useState(null);
  const [dailyCalories, setDailyCalories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const [customMealOpen, setCustomMealOpen] = useState(false);
  const [customMealName, setCustomMealName] = useState("");
  const [customMealQuantity, setCustomMealQuantity] = useState("");
  const [customMealCalories, setCustomMealCalories] = useState("");

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

  const fetchDailyMeals = async (token) => {
    const dailyRes = await fetch(
      "https://nutrijoy-backend.onrender.com/api/dailyConsumption/today",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!dailyRes.ok) throw new Error("Failed to fetch daily meals");
    const dailyData = await dailyRes.json();
    setDailyCalories(dailyData.meals || []);
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

        await fetchDailyMeals(token);

        const mealsRes = await fetch(
          "https://nutrijoy-backend.onrender.com/api/meals/MealPlaning",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!mealsRes.ok) throw new Error("Failed to fetch meals");
        const mealsData = await mealsRes.json();
        setMeals(mealsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleAddClick = (meal) => {
    setSelectedMeal(meal);
    setUserQuantity("");
    setCalculatedCalories(null);
  };

  const handleCalculate = () => {
    if (!userQuantity || isNaN(userQuantity) || !selectedMeal) return;

    const calories =
      (selectedMeal.caloriesPerBase / selectedMeal.baseQuantityValue) *
      parseFloat(userQuantity).toFixed(2);

    setCalculatedCalories(calories.toFixed(2));
  };

  const handleSaveMeal = async () => {
    if (!calculatedCalories || !selectedMeal) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://nutrijoy-backend.onrender.com/api/dailyConsumption/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mealId: selectedMeal._id,
            quantity: parseFloat(userQuantity),
            calories: parseFloat(calculatedCalories),
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to save meal");

      await fetchDailyMeals(token);
      setSuccessMessage("Meal added successfully!");
      setSelectedMeal(null);
      setCalculatedCalories(null);
      setUserQuantity("");
      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setSuccessMessage("");
    }
  };

  const handleSaveCustomMeal = async () => {
    if (!customMealName || !customMealQuantity || !customMealCalories) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://nutrijoy-backend.onrender.com/api/dailyConsumption/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mealId: null,
            customName: customMealName,
            quantity: parseFloat(customMealQuantity),
            calories: parseFloat(customMealCalories),
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to save custom meal");

      await fetchDailyMeals(token);
      setSuccessMessage("Custom meal added successfully!");
      setCustomMealName("");
      setCustomMealQuantity("");
      setCustomMealCalories("");
      setCustomMealOpen(false);
      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err) {
      console.error(err);
    }
  };
  const handleFinalizeDay = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        "https://nutrijoy-backend.onrender.com/api/dailyConsumption/finalize",
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to finalize day");

      alert("Today's meals added to history!");
      setDailyCalories([]);
    } catch (err) {
      console.error(err);
      alert("Error finalizing day");
    }
  };

  const handleDeleteMeal = async (mealId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `hhttps://nutrijoy-backend.onrender.com/api/dailyConsumption/delete/${mealId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to delete meal");

      setDailyCalories((prev) => prev.filter((m) => m._id !== mealId));
    } catch (err) {
      console.error(err);
      alert("Error deleting meal");
    }
  };

  if (loading) return <p>Loading...</p>;

  const totalCalories = dailyCalories.reduce((sum, m) => sum + m.calories, 0);
  const tdee = calculateTDEE(user);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meal Planning</h1>
      <p className="mb-4 font-semibold">
        Consumed today: {totalCalories} kcal | Remaining: {tdee - totalCalories}{" "}
        kcal
      </p>

      {successMessage && (
        <div className="mb-4 text-green-700 font-bold text-center bg-green-100 p-2 rounded">
          {successMessage}
        </div>
      )}

      {dailyCalories.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Today's Meals</h2>
          <ul className="space-y-2">
            {dailyCalories.map((meal) => (
              <li
                key={meal._id}
                className="flex justify-between bg-gray-100 p-2 rounded"
              >
                <span>
                  {meal.mealId?.name
                    ? `${meal.mealId.name} - ${meal.calories} kcal`
                    : `${meal.name} - ${meal.calories} kcal`}
                </span>
                <button
                  onClick={() => handleDeleteMeal(meal._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {dailyCalories.length > 0 && (
        <button
          onClick={handleFinalizeDay}
          className="mt-4 mr-3 ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          Done
        </button>
      )}

      <button
        onClick={() => setCustomMealOpen(true)}
        className="mb-6 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600"
      >
        Add Custom Meal
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div
            key={meal._id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
          >
            {meal.imageUrl && (
              <img
                src={getImageUrl(meal.imageUrl)}
                alt={meal.name}
                className="w-32 h-32 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-lg font-semibold">{meal.name}</h2>
            <p className="text-sm text-gray-600 capitalize">{meal.category}</p>
            <p className="text-sm">
              {meal.baseQuantityValue} {meal.baseQuantityUnit} ={" "}
              {meal.caloriesPerBase} Cal
            </p>

            <button
              onClick={() => handleAddClick(meal)}
              className="mt-3 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{selectedMeal.name}</h2>
            <p className="mb-2">
              {selectedMeal.baseQuantityValue} {selectedMeal.baseQuantityUnit} ={" "}
              {selectedMeal.caloriesPerBase} Cal
            </p>

            <input
              type="number"
              placeholder={`Enter amount in ${selectedMeal.baseQuantityUnit}`}
              value={userQuantity}
              onChange={(e) => setUserQuantity(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={handleCalculate}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
              >
                Calculate
              </button>
              {calculatedCalories && (
                <button
                  onClick={handleSaveMeal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Add to daily
                </button>
              )}
            </div>

            {calculatedCalories && (
              <p className="mt-4 font-semibold">
                Calories: {calculatedCalories}
              </p>
            )}

            <button
              onClick={() => setSelectedMeal(null)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {customMealOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Custom Meal</h2>

            <input
              type="text"
              placeholder="Meal name"
              value={customMealName}
              onChange={(e) => setCustomMealName(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />

            <input
              type="number"
              placeholder="Quantity (e.g. grams)"
              value={customMealQuantity}
              onChange={(e) => setCustomMealQuantity(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />

            <input
              type="number"
              placeholder="Calories"
              value={customMealCalories}
              onChange={(e) => setCustomMealCalories(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSaveCustomMeal}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setCustomMealOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
