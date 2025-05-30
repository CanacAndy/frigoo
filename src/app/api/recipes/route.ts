// app/api/recipes/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { items, mealType } = await req.json();

    const messages = [
      {
        role: "system",
        content:
          "Tu es un assistant culinaire. Réponds toujours en JSON avec la structure suivante : { \"title\": string, \"description\": string, \"mealType\": string, \"ingredients\": [ { \"name\": string, \"quantity\": string } ], \"steps\": [string] }. Donne des quantités et une recette claire.",
      },
      {
        role: "user",
        content: `Voici les ingrédients dans mon frigo : ${items.join(", ")}. Je veux une recette pour ${mealType}. Donne-moi une recette simple avec une description.`,
      },
    ];

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mistral API error:", errorText);
      return NextResponse.json({ error: "Erreur Mistral API" }, { status: 500 });
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0]?.message?.content || "{}");
    content.mealType = mealType; 

    return NextResponse.json(content);
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}