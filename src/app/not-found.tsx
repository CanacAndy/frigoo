import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-9xl font-bold text-green-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mt-2">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link href="/home">
            <Button className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}