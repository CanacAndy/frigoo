"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useUser from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Clock,
  UtensilsCrossed,
  Heart,
  HeartOff,
  Search,
  Filter,
  Loader2,
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
import { toast } from "sonner";

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  id?: string;
  title: string;
  description?: string;
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
  const [mealType, setMealType] = useState<string>("dîner");
  const [showMealTypeSelector, setShowMealTypeSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("generate");
  const [apiError, setApiError] = useState<string | null>(null);

  // Charger les données utilisateur
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        // Charger les ingrédients du frigo
        const fridgeRef = collection(db, `users/${user.uid}/fridgeItems`);
        const fridgeSnapshot = await getDocs(fridgeRef);
        const items = fridgeSnapshot.docs.map((doc) => doc.data().name);
        setIngredients(items);

        // Charger les recettes sauvegardées
        const savedRef = collection(db, `users/${user.uid}/savedRecipes`);
        const savedSnapshot = await getDocs(savedRef);
        const saved = savedSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "Sans titre",
          description: doc.data().description,
          mealType: doc.data().mealType || "dîner",
          ingredients: doc.data().ingredients || [],
          steps: doc.data().steps || [],
          saved: true,
        }));
        setSavedRecipes(saved);
      } catch (error) {
        console.error("Erreur Firebase:", error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    fetchUserData();
  }, [user]);

  // Générer une nouvelle recette
  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error("Ajoutez d'abord des ingrédients dans votre frigo !");
      return;
    }

    if (!showMealTypeSelector) {
      setShowMealTypeSelector(true);
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: ingredients,
          mealType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la génération");
      }

      const data = await response.json();

      if (!data.title || !data.ingredients || !data.steps) {
        throw new Error("Réponse de l'API incomplète");
      }

      setRecipe({
        title: data.title,
        description: data.description || "",
        mealType: data.mealType || mealType,
        ingredients: data.ingredients,
        steps: data.steps,
        saved: false,
      });

      setShowMealTypeSelector(false);
      setActiveTab("current");
      toast.success("Recette générée avec succès !");
    } catch (error) {
      console.error("Erreur génération recette:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder une recette
  const handleSaveRecipe = async () => {
    if (!user || !recipe) return;

    try {
      const recipeToSave = {
        title: recipe.title,
        description: recipe.description || "",
        mealType: recipe.mealType,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
      };

      const docRef = await addDoc(
        collection(db, `users/${user.uid}/savedRecipes`),
        recipeToSave
      );

      setSavedRecipes([
        ...savedRecipes,
        { ...recipeToSave, id: docRef.id, saved: true },
      ]);
      setRecipe({ ...recipe, saved: true });
      toast.success("Recette sauvegardée !");
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  // Supprimer une recette sauvegardée
  const handleRemoveSavedRecipe = async (recipeId: string) => {
    if (!user || !recipeId) return;

    try {
      await setDoc(doc(db, `users/${user.uid}/savedRecipes`, recipeId), {
        saved: false,
      });

      setSavedRecipes(savedRecipes.filter((r) => r.id !== recipeId));
      if (recipe?.id === recipeId) {
        setRecipe({ ...recipe, saved: false });
      }
      toast.success("Recette retirée des favoris");
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Charger une recette sauvegardée
  const loadSavedRecipe = (savedRecipe: Recipe) => {
    setRecipe(savedRecipe);
    setActiveTab("current");
  };

  // Filtrer les recettes sauvegardées
  const filteredSavedRecipes = savedRecipes.filter((recipe) => {
    const title = recipe.title || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Recettes Personnalisées 👨‍🍳
        </h1>
        <p className="text-blue-50">
          Découvrez des recettes uniques avec les ingrédients de votre frigo
        </p>
      </div>

      {/* Message d'erreur API */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Erreur : {apiError}
        </div>
      )}

      {/* Onglets */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="generate">
            <ChefHat className="h-4 w-4 mr-2" />
            Générer
          </TabsTrigger>
          <TabsTrigger value="current">
            <Clock className="h-4 w-4 mr-2" />
            Recette actuelle
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Heart className="h-4 w-4 mr-2" />
            Sauvegardées
          </TabsTrigger>
        </TabsList>

        {/* Onglet Génération */}
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-blue-500" />
                Ingrédients disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ingredients.length === 0 ? (
                <div className="text-center py-8">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    Aucun ingrédient dans votre frigo
                  </p>
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
                      <Select value={mealType} onValueChange={setMealType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type de repas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petit-déjeuner">
                            Petit-déjeuner
                          </SelectItem>
                          <SelectItem value="déjeuner">Déjeuner</SelectItem>
                          <SelectItem value="dîner">Dîner</SelectItem>
                          <SelectItem value="goûter">Goûter</SelectItem>
                          <SelectItem value="dessert">Dessert</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleGenerateRecipe}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Génération en cours...
                          </>
                        ) : (
                          "Générer la recette"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGenerateRecipe}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      Commencer
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Recette Actuelle */}
        <TabsContent value="current">
          {recipe ? (
            <Card className="border-green-100">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-green-500" />
                    {recipe.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Pour : {recipe.mealType}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={
                    recipe.saved && recipe.id
                      ? () => recipe.id && handleRemoveSavedRecipe(recipe.id)
                      : handleSaveRecipe
                  }
                  className={
                    recipe.saved
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-400 hover:text-red-500"
                  }
                >
                  {recipe.saved ? (
                    <HeartOff className="h-5 w-5" />
                  ) : (
                    <Heart className="h-5 w-5" />
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
                        <span className="font-medium">
                          {ingredient.quantity}:
                        </span>
                        <span>{ingredient.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Préparation</h3>
                  <ol className="space-y-3 list-decimal list-inside">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="text-gray-700">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Aucune recette générée</p>
                <p className="text-sm text-gray-400 mt-2">
                  Générez une nouvelle recette ou consultez vos recettes
                  sauvegardées
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Recettes Sauvegardées */}
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
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
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSavedRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Aucune recette sauvegardée</p>
                  <p className="text-sm text-gray-400 mt-2">
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
                          className="text-red-500 hover:text-red-600"
                        >
                          <HeartOff className="h-4 w-4" />
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
    </div>
  );
}
