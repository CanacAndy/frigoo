"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Plus, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useUser();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background/50">
        <div className="p-8 rounded-2xl">
          <p className="text-lg text-primary animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Modern Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-64 bg-card border-r border-border/10 p-6 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-xl font-bold">F</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">Frigoo</h2>
          </div>

          <nav className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => router.push("/home")}
              className="w-full justify-start hover:bg-accent"
            >
              <Home className="w-4 h-4 mr-2" /> Accueil
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/recipes")}
              className="w-full justify-start hover:bg-accent"
            >
              <Plus className="w-4 h-4 mr-2" /> Recettes
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/profile")}
              className="w-full justify-start hover:bg-accent"
            >
              <Settings className="w-4 h-4 mr-2" /> Profile
            </Button>
          </nav>
        </div>

        <Button
          variant="ghost"
          className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> Déconnexion
        </Button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}