"use client";

import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Trash2, Search, AlertCircle } from "lucide-react";

export default function MonFrigoPage() {
  const user = useUser();
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/fridgeItems`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !quantity || !expiresAt) return;

    await addDoc(collection(db, `users/${user.uid}/fridgeItems`), {
      name,
      quantity,
      expiresAt,
      createdAt: serverTimestamp(),
    });

    setName("");
    setQuantity("");
    setExpiresAt("");
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/fridgeItems/${id}`));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.expiresAt);
    const dateB = new Date(b.expiresAt);
    return dateA.getTime() - dateB.getTime();
  });

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Mon Frigo 🧊</h1>
        <p className="text-green-50">
          Gérez facilement vos aliments et évitez le gaspillage
        </p>
      </div>

      {/* Formulaire d'ajout */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un aliment</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4"
          >
            <Input
              placeholder="Nom de l'aliment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-green-500 focus:border-green-500"
            />
            <Input
              placeholder="Quantité"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-green-500 focus:border-green-500"
            />
            <Input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-green-500 focus:border-green-500"
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher un aliment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des aliments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des aliments ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedItems.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Aucun aliment pour le moment</p>
              <p className="text-gray-400 text-sm">
                Ajoutez des aliments pour commencer à gérer votre frigo
              </p>
            </div>
          )}

          {sortedItems.map((item) => {
            const expiryDate = new Date(item.expiresAt);
            const today = new Date();
            const daysUntilExpiry = Math.ceil(
              (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );

            let badgeColor = "default";
            if (daysUntilExpiry <= 0) {
              badgeColor = "destructive";
            } else if (daysUntilExpiry <= 3) {
              badgeColor = "secondary";
            }

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white border hover:border-green-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-100 text-green-600">
                      {item.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">Quantité : {item.quantity}</Badge>
                      <Badge
                        variant={
                          badgeColor as "default" | "destructive" | "secondary"
                        }
                      >
                        {daysUntilExpiry <= 0
                          ? "Expiré"
                          : `Expire dans ${daysUntilExpiry} jours`}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}