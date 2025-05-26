// app/(dashboard)/layout.tsx
"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Plus } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useUser();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-green-600 animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (fixe, non scrollable) */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Mon Frigo</h2>

          <nav className="space-y-2">
            <Button variant="ghost" onClick={() => router.push("/home")}>
              <Home className="w-4 h-4 mr-2" /> Accueil
            </Button>
            <Button variant="ghost" onClick={() => router.push("/recipes")}>
              <Plus className="w-4 h-4 mr-2" /> Recettes
            </Button>
          </nav>
        </div>
        <Button
          variant="outline"
          className="text-red-600 border-red-300"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> Déconnexion
        </Button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
    </div>
  );
}
