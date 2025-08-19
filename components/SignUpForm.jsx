"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    activity_level: "",
    goal: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const errs = {};

    if (!form.username.trim()) errs.username = "Username is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Valid email is required.";
    if (form.password.length < 3)
      errs.password = "Password must be at least 3 characters.";
    if (!form.age || isNaN(form.age) || form.age < 10 || form.age > 100)
      errs.age = "Age must be between 10 and 100.";
    if (!["male", "female"].includes(form.gender))
      errs.gender = "Gender is required.";
    if (
      !form.height_cm ||
      isNaN(form.height_cm) ||
      form.height_cm < 100 ||
      form.height_cm > 250
    )
      errs.height_cm = "Height must be between 100 and 250 cm.";
    if (
      !form.weight_kg ||
      isNaN(form.weight_kg) ||
      form.weight_kg < 30 ||
      form.weight_kg > 300
    )
      errs.weight_kg = "Weight must be between 30 and 300 kg.";
    if (!["sedentary", "moderate", "active"].includes(form.activity_level))
      errs.activity_level = "Activity level is required.";
    if (!["lose weight", "gain weight", "maintain weight"].includes(form.goal))
      errs.goal = "Goal is required.";
    if (!form.agreeTerms) errs.agreeTerms = "You must agree to terms.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch("https://nutrijoy-backend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({
          server:
            errorData.message || "Something went wrong. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      router.push("/login");
    } catch (error) {
      setErrors({
        server: "Failed to connect to the server. Please try again later.",
      });
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8 rounded shadow-md"
      noValidate
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-green-900">
        Create Your Account
      </h2>

      {errors.server && (
        <p className="text-red-500 text-sm mb-4 text-center">{errors.server}</p>
      )}

      <div className="mb-4">
        <label htmlFor="username" className="block font-semibold mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none ${
            errors.username ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block font-semibold mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block font-semibold mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          minLength={3}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="age" className="block font-semibold mb-1">
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={form.age}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none ${
            errors.age ? "border-red-500" : "border-gray-300"
          }`}
          min={10}
          max={100}
          disabled={isLoading}
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Gender</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleChange}
              className="cursor-pointer"
              disabled={isLoading}
            />
            Male
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleChange}
              className="cursor-pointer"
              disabled={isLoading}
            />
            Female
          </label>
        </div>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="height_cm" className="block font-semibold mb-1">
          Height (cm)
        </label>
        <input
          type="number"
          id="height_cm"
          name="height_cm"
          value={form.height_cm}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none ${
            errors.height_cm ? "border-red-500" : "border-gray-300"
          }`}
          min={100}
          max={250}
          disabled={isLoading}
        />
        {errors.height_cm && (
          <p className="text-red-500 text-sm mt-1">{errors.height_cm}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="weight_kg" className="block font-semibold mb-1">
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight_kg"
          name="weight_kg"
          value={form.weight_kg}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none ${
            errors.weight_kg ? "border-red-500" : "border-gray-300"
          }`}
          min={30}
          max={300}
          disabled={isLoading}
        />
        {errors.weight_kg && (
          <p className="text-red-500 text-sm mt-1">{errors.weight_kg}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="activity_level" className="block font-semibold mb-1">
          Activity Level
        </label>
        <select
          id="activity_level"
          name="activity_level"
          value={form.activity_level}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none ${
            errors.activity_level ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        >
          <option value="">Select an option</option>
          <option value="sedentary">Sedentary (Little or no exercise)</option>
          <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
          <option value="active">
            Active (Daily exercise or intense exercise 3-4 days/week)
          </option>
        </select>
        {errors.activity_level && (
          <p className="text-red-500 text-sm mt-1">{errors.activity_level}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="goal" className="block font-semibold mb-1">
          Goal
        </label>
        <select
          id="goal"
          name="goal"
          value={form.goal}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none ${
            errors.goal ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        >
          <option value="">Select your goal</option>
          <option value="lose weight">Lose Weight</option>
          <option value="gain weight">Gain Weight</option>
          <option value="maintain weight">Maintain Weight</option>
        </select>
        {errors.goal && (
          <p className="text-red-500 text-sm mt-1">{errors.goal}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
            className={`cursor-pointer ${
              errors.agreeTerms ? "border-red-500" : ""
            }`}
            disabled={isLoading}
          />
          <span>I agree to the terms and conditions</span>
        </label>
        {errors.agreeTerms && (
          <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>
        )}
      </div>

      <button
        type="submit"
        className={`w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded transition flex items-center justify-center ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing Up...
          </>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
}
