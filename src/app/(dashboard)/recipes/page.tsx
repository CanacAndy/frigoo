"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { RECIPES } from "@/data/recipes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function RecipesPage() {
  const user = useUser();
  const [userIngredients, setUserIngredients] = useState<string[]>([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      if (!user) return;
      const snapshot = await getDocs(
        collection(db, `users/${user.uid}/fridgeItems`)
      );
      const names = snapshot.docs.map((doc) => doc.data().name.toLowerCase());
      setUserIngredients(names);
      setLoading(false);
    };

    fetchIngredients();
  }, [user]);

  useEffect(() => {
    if (userIngredients.length === 0) return;

    const matches = RECIPES.filter((recipe) =>
      recipe.ingredients.every((ing) =>
        userIngredients.some((userIng) => userIng.includes(ing))
      )
    );
    setSuggestedRecipes(matches);
  }, [userIngredients]);

  if (user === undefined || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-green-600">
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
        Chargement des recettes...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">
          Connecte-toi pour voir des recettes.
        </p>
      </div>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recettes suggérées 🍽️</h1>

      {suggestedRecipes.length === 0 ? (
        <p className="text-gray-600">
          Aucune recette trouvée avec les ingrédients disponibles.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedRecipes.map((recipe, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold">
                    Ingrédients :
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {recipe.ingredients.map((ing: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {ing}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-semibold mt-3">
                    Étapes :
                  </p>
                  <ol className="list-decimal list-inside text-sm space-y-1 mt-1">
                    {recipe.steps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
