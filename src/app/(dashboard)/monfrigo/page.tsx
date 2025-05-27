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
import { Plus, Trash2 } from "lucide-react";

export default function MonFrigoPage() {
  const user = useUser();
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

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

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen text-green-600 text-lg animate-pulse">
        Chargement...
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">🧊 Mon Frigo</h1>

      {/* Formulaire d'ajout */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ajouter un aliment</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4"
          >
            <Input
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder="Quantité"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <Input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />
            <Button type="submit" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Liste des aliments */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des aliments ({items.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun aliment pour le moment.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-muted">
                    <AvatarFallback className="text-xs">
                      {item.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                      <Badge variant="outline">
                        Quantité : {item.quantity}
                      </Badge>
                      <span>
                        Expire le :{" "}
                        {new Date(item.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}
