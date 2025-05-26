import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  RefreshCcw,
  UtensilsCrossed,
  ListChecks,
  CookingPot,
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <RefreshCcw className="mr-1 h-4 w-4" />
                <span>Révolutionnez votre cuisine</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Transformez votre frigo en source d'inspiration culinaire
              </h1>
              <p className="text-lg text-gray-600">
                Frigoo vous permet de suivre vos aliments et vous propose des
                recettes délicieuses adaptées à ce que vous avez déjà chez vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Se connecter
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Aliments frais dans un frigo"
                className="rounded-lg shadow-lg object-cover h-[500px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Comment Frigoo fonctionne
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En trois étapes simples, transformez votre façon de cuisiner et
              réduisez le gaspillage alimentaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-green-100 text-green-600 mb-4">
                <ListChecks className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Enregistrez vos aliments
              </h3>
              <p className="text-gray-600">
                Ajoutez facilement les ingrédients que vous avez dans votre
                frigo et votre garde-manger.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-orange-100 text-orange-600 mb-4">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Découvrez des recettes</h3>
              <p className="text-gray-600">
                Frigoo vous suggère des recettes personnalisées basées sur ce
                que vous avez déjà chez vous.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                <CookingPot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cuisinez et savourez</h3>
              <p className="text-gray-600">
                Suivez les instructions étape par étape et régalez-vous avec vos
                créations culinaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Frigoo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui transforment leur façon
              de cuisiner
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-green-600 mb-2">30%</p>
              <p className="text-gray-600">
                Réduction du gaspillage alimentaire
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-green-600 mb-2">500+</p>
              <p className="text-gray-600">Recettes disponibles</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-green-600 mb-2">15min</p>
              <p className="text-gray-600">Temps moyen de préparation</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-green-600 mb-2">5K+</p>
              <p className="text-gray-600">Utilisateurs satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre façon de cuisiner ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Inscrivez-vous gratuitement aujourd'hui et commencez à cuisiner de
            délicieuses recettes avec ce que vous avez déjà chez vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                S'inscrire gratuitement
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-green-600"
              >
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <RefreshCcw className="h-6 w-6 text-green-500" />
                <span className="font-bold text-xl text-white">Frigoo</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Transformez votre frigo en source d'inspiration culinaire et
                réduisez le gaspillage alimentaire.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Lorem</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Lorem
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Lorem
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Lorem
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Lorem</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Lorem
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Lorem
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Lorem
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Lorem</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Lorem
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Lorem
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-400 transition-colors"
                    >
                      Lorem
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Frigoo. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
