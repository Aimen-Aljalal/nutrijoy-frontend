"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) return;

    try {
      const userObj = JSON.parse(user);

      if (userObj.role === "admin") {
        router.replace("/admin");
      } else if (userObj.role === "user") {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
    </>
  );
}
