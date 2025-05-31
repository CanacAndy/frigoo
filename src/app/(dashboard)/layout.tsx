"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  Home,
  LogOut,
  ChefHat,
  Settings,
  Menu,
  X,
  UtensilsCrossed,
  RefreshCcw,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Accueil",
    href: "/home",
    icon: Home,
  },
  {
    name: "Mon Frigo",
    href: "/monfrigo",
    icon: ChefHat,
  },
  {
    name: "Recettes",
    href: "/recette",
    icon: UtensilsCrossed,
  },
  {
    name: "Profil",
    href: "/profile",
    icon: Settings,
  },
  {
    name: "Aide",
    href: "/aide",
    icon: HelpCircle,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200">
        <div className="p-6">
          <Link href="/home" className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <RefreshCcw className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Frigoo
            </span>
          </Link>

          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200",
                  pathname === item.href &&
                    "bg-green-50 text-green-600 font-medium"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t">
          <Button
            variant="destructive"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Link href="/home" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <RefreshCcw className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Frigoo
            </span>
          </Link>

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
          <div className="border-t border-gray-200">
            <nav className="p-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200",
                    pathname === item.href &&
                      "bg-green-50 text-green-600 font-medium"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <Button
                variant="destructive"
                className="w-full justify-start gap-3 mt-4"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Déconnexion
              </Button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}