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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Shield,
  Settings,
  AlertCircle,
  Mail,
  UserCircle,
  MessageSquare,
} from "lucide-react";

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
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

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
    setError("");
    setSuccessMessage("");

    try {
      const ref = doc(db, `users/${user.uid}`);
      await setDoc(ref, { profile }, { merge: true });
      setSuccessMessage("Profil mis à jour avec succès !");
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour du profil.");
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    if (!currentPassword) {
      setError("Veuillez saisir votre mot de passe actuel pour confirmer.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSuccessMessage("Mot de passe mis à jour avec succès !");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (err: any) {
      console.error(err);
      setError(
        "Erreur lors du changement de mot de passe. Vérifiez votre mot de passe actuel."
      );
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
        <p className="text-purple-50">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings className="w-4 h-4 mr-2" />
            Préférences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-500" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email
                  </Label>
                  <Input
                    type="text"
                    value={user.email || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-gray-500" />
                    Nom complet
                  </Label>
                  <Input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    placeholder="Votre nom complet"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Pseudo
                  </Label>
                  <Input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    placeholder="Votre pseudo"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    Bio
                  </Label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    placeholder="Parlez-nous un peu de vous..."
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Sauvegarder les modifications
              </Button>

              {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-600">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                Sécurité du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mot de passe actuel</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Votre mot de passe actuel"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Votre nouveau mot de passe"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confirmer le nouveau mot de passe</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                </div>
              </div>

              <Button
                onClick={handlePasswordChange}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Modifier le mot de passe
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                Préférences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Les préférences seront bientôt disponibles...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}