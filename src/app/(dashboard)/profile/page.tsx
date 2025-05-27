"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import useUser from "@/hooks/useUser";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const user = useUser();

  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const ref = doc(db, `users/${user.uid}`);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        if (data.profile) {
          setProfile({
            fullName: data.profile.fullName || "",
            username: data.profile.username || "",
            bio: data.profile.bio || "",
          });
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    const ref = doc(db, `users/${user.uid}`);
    await setDoc(ref, { profile }, { merge: true });

    alert("✅ Profil mis à jour !");
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    if (newPassword !== confirmPassword) {
      alert("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      alert("❌ Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    if (!currentPassword) {
      alert("❌ Veuillez saisir votre mot de passe actuel pour confirmer.");
      return;
    }

    try {
      // Ré-authentification avec l'email et le mot de passe actuel
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Mise à jour du mot de passe
      await updatePassword(user, newPassword);

      alert("✅ Mot de passe mis à jour !");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (err: any) {
      console.error(err);
      alert("❌ Erreur lors du changement de mot de passe : " + err.message);
    }
  };

  if (loading || user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <p className="text-lg animate-pulse text-green-600">Chargement...</p>
      </div>
    );
  }

  if (!user) return <p>Veuillez vous connecter.</p>;

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">Mon Profil 👤</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profil utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="text"
                value={user.email || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Nom complet</label>
              <Input
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Pseudo</label>
              <Input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="w-full border p-2 rounded text-sm"
                rows={3}
              />
            </div>

            <Button
              onClick={handleSaveProfile}
              className="bg-blue-600 text-white"
            >
              Sauvegarder le profil
            </Button>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle>Changer le mot de passe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Mot de passe actuel
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Nouveau mot de passe
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Confirmer le mot de passe
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handlePasswordChange}
              className="bg-green-600 text-white"
            >
              Modifier le mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
