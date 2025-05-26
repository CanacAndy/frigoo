"use client";
import useUser from "@/hooks/useUser";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const handleLogout = async () => {
  await signOut(auth);
};

export default function Home() {
  const user = useUser();

  if (user === undefined) return <p>Chargement...</p>;
  if (!user) return <p>Veuillez vous connecter.</p>;

  return (
    <div>
      <h1>Bienvenue, {user.email} 👋</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Se déconnecter
      </button>
    </div>
  );
}
