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
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  List,
  LayoutGrid,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Edit,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface FridgeItem {
  id: string;
  name: string;
  quantity: string;
  type: string;
  expiresAt: string;
  createdAt: any;
}

const foodTypes = [
  "Fruits",
  "Légumes",
  "Produits laitiers",
  "Viandes",
  "Poissons",
  "Céréales",
  "Boissons",
  "Sauces",
  "Épices",
  "Autres",
];

function EditItemForm({
  item,
  onSave,
  onCancel,
}: {
  item: FridgeItem;
  onSave: (updatedItem: Partial<FridgeItem>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [type, setType] = useState(item.type);
  const [expiresAt, setExpiresAt] = useState(item.expiresAt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      quantity,
      type,
      expiresAt,
    });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Modifier l'aliment</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-5 gap-4"
        >
          <Input
            placeholder="Nom de l'aliment"
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
          <Select
            value={type}
            onValueChange={(value) => setType(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Type d'aliment" />
            </SelectTrigger>
            <SelectContent>
              {foodTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ItemCard({
  item,
  onDelete,
  onUpdate,
}: {
  item: FridgeItem;
  onDelete: (id: string) => void;
  onUpdate: (updatedItem: Partial<FridgeItem>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSave = (updatedData: Partial<FridgeItem>) => {
    onUpdate(updatedData);
    setIsEditing(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-green-100 text-green-600">
                  {item.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600">
                    {item.type}
                  </Badge>
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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              >
                <Edit className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item.id)}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {isEditing && (
        <EditItemForm
          item={item}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
}

function ItemList({
  items,
  onDelete,
  onUpdate,
}: {
  items: FridgeItem[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedItem: Partial<FridgeItem>) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {items.map((item) => {
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
              <div key={item.id}>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white border hover:border-green-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {item.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600"
                        >
                          {item.type}
                        </Badge>
                        <Badge variant="outline">
                          Quantité : {item.quantity}
                        </Badge>
                        <Badge
                          variant={
                            badgeColor as
                              | "default"
                              | "destructive"
                              | "secondary"
                          }
                        >
                          {daysUntilExpiry <= 0
                            ? "Expiré"
                            : `Expire dans ${daysUntilExpiry} jours`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingId(item.id)}
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                {editingId === item.id && (
                  <EditItemForm
                    item={item}
                    onSave={(updatedData) => {
                      onUpdate(item.id, updatedData);
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MonFrigoPage() {
  const user = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [items, setItems] = useState<FridgeItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterExpiry, setFilterExpiry] = useState<
    "all" | "expired" | "soon" | "ok"
  >("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "type">("date");

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/fridgeItems`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FridgeItem[];
      setItems(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !quantity || !type || !expiresAt) return;

    await addDoc(collection(db, `users/${user.uid}/fridgeItems`), {
      name,
      quantity,
      type,
      expiresAt,
      createdAt: serverTimestamp(),
    });

    setName("");
    setQuantity("");
    setType("");
    setExpiresAt("");
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/fridgeItems/${id}`));
  };

  const handleUpdate = async (id: string, updatedItem: Partial<FridgeItem>) => {
    if (!user) return;
    await updateDoc(
      doc(db, `users/${user.uid}/fridgeItems/${id}`),
      updatedItem
    );
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry <= 0) return "expired";
    if (daysUntilExpiry <= 3) return "soon";
    return "ok";
  };

  const filterItemsByExpiry = (items: FridgeItem[]) => {
    let filtered = items;

    if (filterExpiry !== "all") {
      filtered = filtered.filter(
        (item) => getExpiryStatus(item.expiresAt) === filterExpiry
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    return filtered;
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAndFilteredItems = filterItemsByExpiry(
    [...filteredItems].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "type") {
        return a.type.localeCompare(b.type);
      } else {
        const dateA = new Date(a.expiresAt);
        const dateB = new Date(b.expiresAt);
        return dateA.getTime() - dateB.getTime();
      }
    })
  );

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Mon Frigo 🧊</h1>
        <p className="text-green-50">
          Gérez facilement vos aliments et évitez le gaspillage
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Tous
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Expirés
            </TabsTrigger>
            <TabsTrigger value="soon" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Bientôt
            </TabsTrigger>
            <TabsTrigger value="ok" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Valides
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <Select
              value={sortBy}
              onValueChange={(value: "date" | "name" | "type") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date d'expiration</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {foodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-gray-100" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-gray-100" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ajouter un aliment</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleAdd}
              className="grid grid-cols-1 sm:grid-cols-5 gap-4"
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
              <Select
                value={type}
                onValueChange={(value) => setType(value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type d'aliment" />
                </SelectTrigger>
                <SelectContent>
                  {foodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        <TabsContent value="all">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAndFilteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onUpdate={(updatedData) => handleUpdate(item.id, updatedData)}
                />
              ))}
            </div>
          ) : (
            <ItemList
              items={sortedAndFilteredItems}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
        </TabsContent>

        <TabsContent value="expired">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAndFilteredItems
                .filter((item) => getExpiryStatus(item.expiresAt) === "expired")
                .map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onUpdate={(updatedData) =>
                      handleUpdate(item.id, updatedData)
                    }
                  />
                ))}
            </div>
          ) : (
            <ItemList
              items={sortedAndFilteredItems.filter(
                (item) => getExpiryStatus(item.expiresAt) === "expired"
              )}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
        </TabsContent>

        <TabsContent value="soon">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAndFilteredItems
                .filter((item) => getExpiryStatus(item.expiresAt) === "soon")
                .map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onUpdate={(updatedData) =>
                      handleUpdate(item.id, updatedData)
                    }
                  />
                ))}
            </div>
          ) : (
            <ItemList
              items={sortedAndFilteredItems.filter(
                (item) => getExpiryStatus(item.expiresAt) === "soon"
              )}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
        </TabsContent>

        <TabsContent value="ok">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAndFilteredItems
                .filter((item) => getExpiryStatus(item.expiresAt) === "ok")
                .map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onUpdate={(updatedData) =>
                      handleUpdate(item.id, updatedData)
                    }
                  />
                ))}
            </div>
          ) : (
            <ItemList
              items={sortedAndFilteredItems.filter(
                (item) => getExpiryStatus(item.expiresAt) === "ok"
              )}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
        </TabsContent>

        {sortedAndFilteredItems.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  Aucun aliment pour le moment
                </p>
                <p className="text-gray-400 text-sm">
                  Ajoutez des aliments pour commencer à gérer votre frigo
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </Tabs>
    </div>
  );
}
