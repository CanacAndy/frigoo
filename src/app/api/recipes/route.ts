export async function POST(req: Request) {
  const { items } = await req.json();

  const prompt = `Voici les ingrédients dans mon frigo : ${items.join(", ")}. Donne-moi une recette simple et concise.`;

  const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Hugging Face API error:", errorText);
    return new Response(JSON.stringify({ error: "Erreur Hugging Face API" }), { status: 500 });
  }

  const data = await response.json();

  const recipe = data[0]?.generated_text || "Aucune recette générée.";

  return new Response(JSON.stringify({ recipe }));
}
