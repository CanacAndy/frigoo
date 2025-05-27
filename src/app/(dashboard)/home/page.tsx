"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Salad, Refrigerator, User, Bot } from "lucide-react";

export default function HomeDashboard() {
  return (
    <main className="max-w-6xl mx-auto py-12 px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow">
        <Link href="/monfrigo">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Mon Frigo</CardTitle>
            <Refrigerator className="w-6 h-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Ajouter, consulter ou supprimer les aliments de mon frigo.
            </p>
          </CardContent>
        </Link>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <Link href="/recipes">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recettes</CardTitle>
            <Bot className="w-6 h-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Obtiens des recettes personnalisées avec OpenAI.
            </p>
          </CardContent>
        </Link>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <Link href="/profile ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Mon Profil</CardTitle>
            <User className="w-6 h-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Voir ou modifier mes infos personnelles.
            </p>
          </CardContent>
        </Link>
      </Card>
    </main>
  );
}
