"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RefreshCcw,
  Menu,
  X,
  User,
  LogIn,
  Home,
  Refrigerator,
} from "lucide-react";
import { useState } from "react";
import useUser from "@/hooks/useUser";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const user = useUser();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
    closeMenu();
  };

  const navLinks = [
    {
      name: "Accueil",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
      showWhen: "always",
    },
    {
      name: "Mon Frigo",
      href: "/home",
      icon: <Refrigerator className="h-4 w-4 mr-2" />,
      showWhen: "authenticated",
    },
    {
      name: "Connexion",
      href: "/login",
      icon: <LogIn className="h-4 w-4 mr-2" />,
      showWhen: "unauthenticated",
    },
    {
      name: "Inscription",
      href: "/register",
      icon: <User className="h-4 w-4 mr-2" />,
      showWhen: "unauthenticated",
    },
  ];

  const filteredLinks = navLinks.filter((link) => {
    if (link.showWhen === "always") return true;
    if (link.showWhen === "authenticated" && user) return true;
    if (link.showWhen === "unauthenticated" && !user) return true;
    return false;
  });

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={closeMenu}
            >
              <RefreshCcw className="h-6 w-6 text-green-600" />
              <span className="font-bold text-xl text-green-600">Frigoo</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {user && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                Se déconnecter
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-base font-medium",
                pathname === link.href
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              )}
              onClick={closeMenu}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          {user && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <X className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
