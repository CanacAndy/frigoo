"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useUser from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChefHat, Clock, UtensilsCrossed } from "lucide-react";

export default function RecipesPage() {
  const user = useUser();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError("Ajoutez d'abord des ingrédients dans votre frigo !");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: ingredients }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la génération de la recette");
      }

      const data = await res.json();
      setRecipe(data.recipe);
    } catch (err) {
      console.error("Erreur API :", err);
      setError("Une erreur est survenue lors de la génération de la recette.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Recettes Personnalisées 👨‍🍳</h1>
        <p className="text-blue-50">
          Découvrez des recettes uniques avec les ingrédients de votre frigo
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-blue-500" />
              Ingrédients disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ingredients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun ingrédient dans votre frigo</p>
                <Button
                  variant="outline"
                  className="mt-4"
<<<<<<< HEAD
                  onClick={() => (window.location.href = "/monfrigo")}
=======
                  onClick={() => window.location.href = '/monfrigo'}
>>>>>>> e54e1ef70b8a4181f3fac87a3a47e710c52153fe
                >
                  Ajouter des ingrédients
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {ingredients.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-50 rounded-lg text-gray-700 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              Générer une recette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerateRecipe}
              disabled={loading || ingredients.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                "Générer une recette"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {recipe && !error && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-green-500" />
              Votre recette personnalisée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-green max-w-none">
              <div className="whitespace-pre-wrap">{recipe}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}