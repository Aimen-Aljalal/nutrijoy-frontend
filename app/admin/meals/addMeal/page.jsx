"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddOrEditMeal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mealId = searchParams.get("id");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("fried");
  const [baseQuantityValue, setBaseQuantityValue] = useState("");
  const [baseQuantityUnit, setBaseQuantityUnit] = useState("g");
  const [caloriesPerBase, setCaloriesPerBase] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (mealId) {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      fetch(`https://nutrijoy-backend.onrender.com/api/meals/getMeal/${mealId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setName(data.name || "");
          setCategory(data.category || "fried");
          setBaseQuantityValue(data.baseQuantityValue || "");
          setBaseQuantityUnit(data.baseQuantityUnit || "g");
          setCaloriesPerBase(data.caloriesPerBase || "");
          setImageUrl(data.imageUrl || "");
        })
        .catch(() => setMessage("Failed to fetch meal data"));
    }
  }, [mealId]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !name ||
      !category ||
      !baseQuantityValue ||
      !baseQuantityUnit ||
      !caloriesPerBase ||
      (!imageFile && !imageUrl)
    ) {
      setMessage("Please fill all fields and select an image.");
      return;
    }

    setUploading(true);

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await fetch("https://nutrijoy-backend.onrender.com/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const mealData = {
        name: name.trim(),
        category,
        baseQuantityValue: Number(baseQuantityValue),
        baseQuantityUnit,
        caloriesPerBase: Number(caloriesPerBase),
        imageUrl: finalImageUrl,
      };

      let res;
      if (mealId) {
        res = await fetch(
          `https://nutrijoy-backend.onrender.com/api/meals/updateMeal/${mealId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(mealData),
          }
        );
      } else {
        res = await fetch("https://nutrijoy-backend.onrender.com/api/meals/addMeal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(mealData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save meal");
      }

      setMessage(
        mealId ? "Meal updated successfully!" : "Meal added successfully!"
      );
      if (!mealId) {
        setName("");
        setCategory("fried");
        setBaseQuantityValue("");
        setBaseQuantityUnit("g");
        setCaloriesPerBase("");
        setImageFile(null);
        setImageUrl("");
        e.target.reset();
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-6">
        {mealId ? "Edit Meal" : "Add Meal"}
      </h2>

      <label className="block mb-4">
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2 mt-1"
          required
        />
      </label>

      <label className="block mb-4">
        Category
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded p-2 mt-1"
          required
        >
          <option value="fried">Fried</option>
          <option value="baked">Baked</option>
          <option value="legumes">Legumes</option>
          <option value="snacks">Snacks</option>
          <option value="desserts">Desserts</option>
          <option value="grilled">Grilled</option>
          <option value="salads">Salads</option>
          <option value="soups">Soups</option>
          <option value="beverages">Beverages</option>
          <option value="others">Others</option>
        </select>
      </label>

      <label className="block mb-4">
        Base Quantity
        <div className="flex gap-2">
          <input
            type="number"
            value={baseQuantityValue}
            onChange={(e) => setBaseQuantityValue(e.target.value)}
            placeholder="e.g., 100"
            className="w-1/2 border rounded p-2 mt-1"
            min={1}
            required
          />
          <select
            value={baseQuantityUnit}
            onChange={(e) => setBaseQuantityUnit(e.target.value)}
            className="w-1/2 border rounded p-2 mt-1"
            required
          >
            <option value="g">grams (g)</option>
            <option value="kg">kilograms (kg)</option>
            <option value="piece">piece</option>
            <option value="slice">slice</option>
            <option value="cup">cup</option>
            <option value="ml">milliliters (ml)</option>
            <option value="l">liters (l)</option>
          </select>
        </div>
      </label>

      <label className="block mb-4">
        Calories per Base
        <input
          type="number"
          value={caloriesPerBase}
          onChange={(e) => setCaloriesPerBase(e.target.value)}
          placeholder="e.g., 208"
          className="w-full border rounded p-2 mt-1"
          min={0}
          required
        />
      </label>

      <label className="block mb-4">
        Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mt-1"
        />
        {imageUrl && (
          <img
            src={`https://nutrijoy-backend.onrender.com${imageUrl}`}
            alt="Meal"
            className="mt-2 w-24 h-24 object-cover rounded"
          />
        )}
      </label>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
      >
        {uploading
          ? mealId
            ? "Updating..."
            : "Uploading..."
          : mealId
          ? "Update Meal"
          : "Add Meal"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
}
