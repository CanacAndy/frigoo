"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD
import {
  Refrigerator,
  ChefHat,
  User,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
=======
import { Refrigerator, ChefHat, User, ArrowRight, UtensilsCrossed } from "lucide-react";
>>>>>>> e54e1ef70b8a4181f3fac87a3a47e710c52153fe

export default function HomeDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Bienvenue sur Frigoo 👋</h1>
        <p className="text-green-50">
<<<<<<< HEAD
          Gérez votre frigo intelligemment et découvrez des recettes
          personnalisées
=======
          Gérez votre frigo intelligemment et découvrez des recettes personnalisées
>>>>>>> e54e1ef70b8a4181f3fac87a3a47e710c52153fe
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/monfrigo">
          <Card className="group hover:shadow-lg hover:shadow-green-100 transition-all duration-300 border-2 hover:border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold text-gray-800">
                Mon Frigo
              </CardTitle>
              <div className="p-2 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Refrigerator className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gérez les aliments de votre frigo facilement
              </p>
              <div className="flex items-center text-green-600 group-hover:text-green-500">
                <span className="text-sm font-medium">Accéder</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/recette">
          <Card className="group hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 border-2 hover:border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold text-gray-800">
                Recettes
              </CardTitle>
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Découvrez des recettes personnalisées
              </p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-500">
                <span className="text-sm font-medium">Explorer</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profile">
          <Card className="group hover:shadow-lg hover:shadow-purple-100 transition-all duration-300 border-2 hover:border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold text-gray-800">
                Mon Profil
              </CardTitle>
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <User className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gérez vos informations personnelles
              </p>
              <div className="flex items-center text-purple-600 group-hover:text-purple-500">
                <span className="text-sm font-medium">Modifier</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/aide">
          <Card className="group hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 border-2 hover:border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold text-gray-800">
                Aide
              </CardTitle>
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <ChefHat className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Besoin d'aide ? On est là pour vous !
              </p>
              <div className="flex items-center text-orange-600 group-hover:text-orange-500">
                <span className="text-sm font-medium">Consulter</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-0">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">30%</div>
            <p className="text-sm text-gray-600">Réduction du gaspillage</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-0">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">500+</div>
            <p className="text-sm text-gray-600">Recettes disponibles</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-0">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">15min</div>
            <p className="text-sm text-gray-600">Temps de préparation</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-0">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">5K+</div>
            <p className="text-sm text-gray-600">Utilisateurs actifs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}