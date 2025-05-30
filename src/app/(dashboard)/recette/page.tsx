"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useUser from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  ChefHat,
  Clock,
  UtensilsCrossed,
  Heart,
  HeartOff,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  id?: string;
  title: string;
  description: string;
  mealType: string;
  ingredients: Ingredient[];
  steps: string[];
  saved?: boolean;
}

export default function RecipesPage() {
  const user = useUser();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mealType, setMealType] = useState<string>("dîner");
  const [showMealTypeSelector, setShowMealTypeSelector] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Récupérer les ingrédients
        const fridgeRef = collection(db, `users/${user.uid}/fridgeItems`);
        const fridgeSnapshot = await getDocs(fridgeRef);
        const items = fridgeSnapshot.docs.map((doc) => doc.data().name);
        setIngredients(items);

        // Récupérer les recettes sauvegardées
        const savedRef = collection(db, `users/${user.uid}/savedRecipes`);
        const savedSnapshot = await getDocs(savedRef);
        const saved = savedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        setSavedRecipes(saved);
      } catch (err) {
        console.error("Erreur récupération données :", err);
        setError("Impossible de récupérer les données.");
      }
    };

    fetchData();
  }, [user]);

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError("Ajoutez d'abord des ingrédients dans votre frigo !");
      return;
    }

    if (!showMealTypeSelector) {
      setShowMealTypeSelector(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: ingredients, mealType }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la génération de la recette");
      }

      const data = await res.json();
      setRecipe(data);
      setShowMealTypeSelector(false);
    } catch (err) {
      console.error("Erreur API :", err);
      setError("Une erreur est survenue lors de la génération de la recette.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!user || !recipe) return;

    try {
      const recipeToSave = { ...recipe, saved: true };
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/savedRecipes`),
        recipeToSave
      );
      setSavedRecipes([...savedRecipes, { ...recipeToSave, id: docRef.id }]);
      setRecipe({ ...recipe, saved: true });
    } catch (err) {
      console.error("Erreur sauvegarde recette :", err);
      setError("Impossible de sauvegarder la recette.");
    }
  };

  const handleRemoveSavedRecipe = async (recipeId: string) => {
    if (!user) return;

    try {
      await setDoc(doc(db, `users/${user.uid}/savedRecipes`, recipeId), {
        saved: false,
      });
      setSavedRecipes(savedRecipes.filter((r) => r.id !== recipeId));
      if (recipe?.id === recipeId) {
        setRecipe({ ...recipe, saved: false });
      }
    } catch (err) {
      console.error("Erreur suppression recette :", err);
      setError("Impossible de supprimer la recette.");
    }
  };

  const loadSavedRecipe = (savedRecipe: Recipe) => {
    setRecipe(savedRecipe);
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
                  onClick={() => (window.location.href = "/monfrigo")}
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
          <CardContent className="space-y-4">
            {showMealTypeSelector && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Type de repas
                </label>
                <Select
                  value={mealType}
                  onValueChange={(value: string) => setMealType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un type de repas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petit-déjeuner">
                      Petit-déjeuner
                    </SelectItem>
                    <SelectItem value="déjeuner">Déjeuner</SelectItem>
                    <SelectItem value="dîner">Dîner</SelectItem>
                    <SelectItem value="goûter">Goûter</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="encas">En-cas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
              ) : showMealTypeSelector ? (
                "Confirmer et générer"
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
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-green-500" />
                {recipe.title}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Pour: {recipe.mealType}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={
                recipe.saved
                  ? () => recipe.id && handleRemoveSavedRecipe(recipe.id)
                  : handleSaveRecipe
              }
            >
              {recipe.saved ? (
                <HeartOff className="w-5 h-5 text-red-500" />
              ) : (
                <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {recipe.description && (
              <p className="text-gray-700">{recipe.description}</p>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingrédients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="font-medium">{ingredient.quantity}:</span>
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Préparation</h3>
              <ol className="space-y-3 list-decimal list-inside">
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {savedRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Vos recettes sauvegardées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {savedRecipes.map((savedRecipe) => (
                <Card
                  key={savedRecipe.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => loadSavedRecipe(savedRecipe)}
                >
                  <CardHeader className="flex flex-row justify-between items-center p-4">
                    <div>
                      <CardTitle className="text-lg">
                        {savedRecipe.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {savedRecipe.mealType}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        savedRecipe.id &&
                          handleRemoveSavedRecipe(savedRecipe.id);
                      }}
                    >
                      <HeartOff className="w-4 h-4 text-red-500" />
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
