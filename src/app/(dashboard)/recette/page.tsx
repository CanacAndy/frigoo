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
  Search,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("generate");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const fridgeRef = collection(db, `users/${user.uid}/fridgeItems`);
        const fridgeSnapshot = await getDocs(fridgeRef);
        const items = fridgeSnapshot.docs.map((doc) => doc.data().name);
        setIngredients(items);

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
      setActiveTab("current");
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
    setActiveTab("current");
  };

  const filteredSavedRecipes = savedRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Recettes Personnalisées 👨‍🍳</h1>
        <p className="text-blue-50">
          Découvrez des recettes uniques avec les ingrédients de votre frigo
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="generate">
            <ChefHat className="mr-2 h-4 w-4" />
            Générer
          </TabsTrigger>
          <TabsTrigger value="current">
            <Clock className="mr-2 h-4 w-4" />
            Recette actuelle
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Heart className="mr-2 h-4 w-4" />
            Sauvegardées
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
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
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
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
                  {showMealTypeSelector ? (
                    <div className="space-y-4">
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
                      <Button
                        onClick={handleGenerateRecipe}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Génération en cours...
                          </>
                        ) : (
                          "Confirmer et générer"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGenerateRecipe}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      Générer une recette
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current" className="space-y-6">
          {recipe ? (
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
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Aucune recette générée</p>
                <p className="text-sm mt-2">
                  Générez une nouvelle recette ou consultez vos recettes
                  sauvegardées
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Recettes sauvegardées
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSavedRecipes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Aucune recette sauvegardée</p>
                  <p className="text-sm mt-2">
                    Sauvegardez des recettes pour les retrouver ici
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredSavedRecipes.map((savedRecipe) => (
                    <Card
                      key={savedRecipe.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}