import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Important pour Vercel

export async function POST(req: Request) {
  try {
    const { items, mealType } = await req.json();

    // Validation des données
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "La liste d'ingrédients est vide ou invalide" },
        { status: 400 }
      );
    }

    if (!mealType) {
      return NextResponse.json(
        { error: "Le type de repas est requis" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_MISTRAL_API_KEY;
    if (!apiKey) {
      console.error("Clé API Mistral manquante");
      return NextResponse.json(
        { error: "Configuration serveur invalide" },
        { status: 500 }
      );
    }

    const messages = [
      {
        role: "system",
        content: `Tu es un chef étoilé français. Crée une recette pour ${mealType} en utilisant ces ingrédients: ${items.join(", ")}. Réponds en JSON avec cette structure:
        {
          "title": "Nom de la recette",
          "description": "Description courte",
          "mealType": "${mealType}",
          "ingredients": [{"name": "ingrédient", "quantity": "quantité"}],
          "steps": ["étape 1", "étape 2"]
        }`
      }
    ];

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Mistral:", response.status, errorText);
      return NextResponse.json(
        { error: `Erreur Mistral: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Réponse API vide");
    }

    const recipe = JSON.parse(content);
    
    // Validation de la réponse
    if (!recipe.title || !recipe.ingredients || !recipe.steps) {
      throw new Error("Réponse API incomplète");
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Erreur interne du serveur") },
      { status: 500 }
    );
  }
}