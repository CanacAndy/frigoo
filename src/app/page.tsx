// app/page.tsx
"use client";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log("Firebase Auth Instance :", auth);
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Bienvenue sur Frigoo 👋</h1>
      <p>Firebase est bien connecté ✅</p>
    </main>
  );
}
