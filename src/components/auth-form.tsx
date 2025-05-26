import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, LogIn, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string;
}

export function AuthForm({ type, onSubmit, error }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      // Error is handled by the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Button
        variant="ghost"
        className="absolute -top-12 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à l'accueil
      </Button>

      <Card className="w-full shadow-lg border-green-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {type === "login" ? "Connexion" : "Créer un compte"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {type === "login"
              ? "Connectez-vous à votre compte Frigoo"
              : "Rejoignez Frigoo pour gérer votre frigo et découvrir des recettes"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full transition-all duration-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={
                  type === "login"
                    ? "Votre mot de passe"
                    : "Choisissez un mot de passe sécurisé"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full transition-all duration-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                "Chargement..."
              ) : type === "login" ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  S'inscrire
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          {type === "login" ? (
            <p className="text-sm text-gray-600">
              Pas encore de compte?{" "}
              <Link
                href="/register"
                className="text-green-600 hover:text-green-700 hover:underline font-medium"
              >
                Créer un compte
              </Link>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Déjà un compte?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 hover:underline font-medium"
              >
                Se connecter
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
