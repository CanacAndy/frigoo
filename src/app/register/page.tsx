"use client";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (err: any) {
      const errorMessage =
        err.code === "auth/email-already-in-use"
          ? "Cette adresse email est déjà utilisée"
          : err.code === "auth/weak-password"
          ? "Le mot de passe doit contenir au moins 6 caractères"
          : "Une erreur s'est produite lors de l'inscription";

      setError(errorMessage);
      throw err;
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <AuthForm type="register" onSubmit={handleRegister} error={error} />
      </div>
    </div>
  );
}
