"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Home, LogOut, ChefHat, Settings, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="p-8 rounded-2xl">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 bg-green-200 rounded-full"></div>
            <div className="h-4 w-32 bg-green-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const navigationItems = [
    {
      name: "Accueil",
      icon: Home,
      href: "/home",
    },
    {
      name: "Mon Frigo",
      icon: ChefHat,
      href: "/monfrigo",
    },
    {
      name: "Profil",
      icon: Settings,
      href: "/profile",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 p-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <span className="text-white text-xl font-bold">F</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Frigoo
          </h2>
        </div>

        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-green-600 hover:bg-green-50"
              onClick={() => router.push(item.href)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Button>
          ))}
        </nav>

        <div className="pt-6 border-t">
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white text-lg font-bold">F</span>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Frigoo
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-t border-gray-200 bg-white"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-green-600 hover:bg-green-50"
                  onClick={() => {
                    router.push(item.href);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Button>
              ))}
              <Button
                variant="destructive"
                className="w-full justify-start mt-4"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Déconnexion
              </Button>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}