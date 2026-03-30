"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/scanner");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center animate-pulse">
        <h1 className="text-6xl font-bold text-white mb-4">
          🛡️ ShadowAI Detector
        </h1>
      </div>
    </div>
  );
}
