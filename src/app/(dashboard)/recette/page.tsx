"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useUser from "@/hooks/useUser";

export default function RecipesPage() {
  const user = useUser();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Récupération des aliments
  useEffect(() => {
    if (!user) return;

    const fetchIngredients = async () => {
      try {
        const ref = collection(db, `users/${user.uid}/fridgeItems`);
        const snapshot = await getDocs(ref);
        const items = snapshot.docs.map((doc) => doc.data().name);
        setIngredients(items);
      } catch (err) {
        console.error("Erreur récupération ingrédients :", err);
        setError("Impossible de récupérer les ingrédients.");
      }
    };

    fetchIngredients();
  }, [user]);

  // 🔄 Génération de recette
  useEffect(() => {
    const fetchRecipe = async () => {
      if (ingredients.length === 0) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: ingredients }),
        });

        const text = await res.text();

        if (!res.ok) {
          let errorMessage = "Erreur lors de la génération.";
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.error || errorMessage;
          } catch {
            console.error("Réponse non JSON :", text);
          }
          throw new Error(errorMessage);
        }

        const data = JSON.parse(text);
        setRecipe(data.recipe || "Aucune recette générée.");
      } catch (err: any) {
        console.error("Erreur API :", err);
        setError(err.message || "Erreur inconnue.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [ingredients]);

  if (!user) return <p className="p-4">Veuillez vous connecter.</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recette avec mon frigo 🧑‍🍳</h1>

      <div className="mb-6">
        <p className="font-medium">Ingrédients trouvés :</p>
        <ul className="list-disc list-inside text-gray-700">
          {ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {loading && <p>🔄 Génération de la recette en cours…</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {!loading && !error && recipe && (
        <div className="whitespace-pre-wrap bg-white p-4 rounded shadow text-gray-800">
          {recipe}
        </div>
      )}
    </main>
  );
}
