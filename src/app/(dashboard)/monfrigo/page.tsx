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
  Filter,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Nom de l'aliment"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Quantité"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div>
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
            </div>
            <div>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-emerald-600"
            >
              Enregistrer
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
                onClick={() => {
                  onDelete(item.id);
                  toast.success("Aliment supprimé");
                }}
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
  const [isOpen, setIsOpen] = useState(false);

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

    try {
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
      toast.success("Aliment ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'aliment");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/fridgeItems/${id}`));
      toast.success("Aliment supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleUpdate = async (id: string, updatedItem: Partial<FridgeItem>) => {
    if (!user) return;
    try {
      await updateDoc(
        doc(db, `users/${user.uid}/fridgeItems/${id}`),
        updatedItem
      );
      toast.success("Aliment mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
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

  const filterAndSortItems = () => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterExpiry !== "all") {
      filtered = filtered.filter(
        (item) => getExpiryStatus(item.expiresAt) === filterExpiry
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "type") {
        return a.type.localeCompare(b.type);
      } else {
        return (
          new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
        );
      }
    });
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const filteredItems = filterAndSortItems();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Mon Frigo 🧊</h1>
        <p className="text-green-50">
          Gérez facilement vos aliments et évitez le gaspillage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un aliment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un aliment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={filterExpiry}
            onValueChange={(value: any) => setFilterExpiry(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filtrer par date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="expired">Expirés</SelectItem>
              <SelectItem value="soon">Bientôt expirés</SelectItem>
              <SelectItem value="ok">Valides</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
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

          <Select
            value={sortBy}
            onValueChange={(value: any) => setSortBy(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date d'expiration</SelectItem>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1">
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
      </div>

      <div className="fridge h-[600px] w-full relative">
        <div className={`fridge-door ${isOpen ? 'animate-door-open' : 'animate-door-close'}`}>
          <div className="fridge-handle"></div>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute left-1/2 top-4 -translate-x-1/2 bg-white text-gray-600"
          >
            {isOpen ? 'Fermer' : 'Ouvrir'}
          </Button>
        </div>

        <div className="p-8 h-full relative">
          <div className="fridge-shelf" style={{ top: '25%' }}></div>
          <div className="fridge-shelf" style={{ top: '50%' }}></div>
          <div className="fridge-shelf" style={{ top: '75%' }}></div>

          {filteredItems.map((item, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const top = `${25 * row + 10}%`;
            const left = `${33 * col + 10}%`;

            return (
              <div
                key={item.id}
                className="fridge-item animate-fade-in"
                style={{
                  top,
                  left,
                  backgroundColor: getItemColor(item.type),
                }}
                onClick={() => handleUpdate(item.id, item)}
              >
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-white/80">{item.quantity}</p>
              </div>
            );
          })}
        </div>
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Aucun aliment trouvé</p>
              <p className="text-gray-400 text-sm mt-2">
                Ajoutez des aliments pour commencer à gérer votre frigo
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getItemColor(type: string): string {
  const colors: { [key: string]: string } = {
    "Fruits": "#4ade80",
    "Légumes": "#22c55e",
    "Produits laitiers": "#60a5fa",
    "Viandes": "#ef4444",
    "Poissons": "#3b82f6",
    "Céréales": "#f59e0b",
    "Boissons": "#06b6d4",
    "Sauces": "#f97316",
    "Épices": "#d946ef",
    "Autres": "#6366f1"
  };
  return colors[type] || colors["Autres"];
}