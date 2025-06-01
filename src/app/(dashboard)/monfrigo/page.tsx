"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useUser from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import {
  Plus,
  Trash2,
  Search,
  AlertCircle,
  List,
  LayoutGrid,
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

export default function MonFrigoPage() {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterExpiry, setFilterExpiry] = useState<"all" | "expired" | "soon" | "ok">("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "type">("date");
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const bind = useGesture({
    onDrag: ({ movement: [x, y] }) => {
      setDragPosition({ x, y });
    },
    onDragEnd: ({ movement: [x, y], velocity }) => {
      if (Math.abs(x) > 100 || Math.abs(y) > 100 || velocity > 0.3) {
        setIsZoomedIn(false);
        setDragPosition({ x: 0, y: 0 });
      } else {
        setDragPosition({ x: 0, y: 0 });
      }
    },
  });

  useEffect(() => {
    if (!user) return;

    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, `users/${user.uid}/fridgeItems`));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FridgeItem[];
      setItems(data);
      setIsLoading(false);
    };

    fetchItems();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !quantity || !type || !expiresAt) return;

    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/fridgeItems`), {
        name,
        quantity,
        type,
        expiresAt,
        createdAt: new Date(),
      });

      setItems([...items, {
        id: docRef.id,
        name,
        quantity,
        type,
        expiresAt,
        createdAt: new Date(),
      }]);

      setName("");
      setQuantity("");
      setType("");
      setExpiresAt("");
      toast.success("Aliment ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'aliment");
    }
  };

  const handleUpdate = async (id: string, updatedItem: Partial<FridgeItem>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, `users/${user.uid}/fridgeItems/${id}`), updatedItem, { merge: true });
      setItems(items.map(item => item.id === id ? { ...item, ...updatedItem } : item));
      toast.success("Aliment mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const filterAndSortItems = () => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterExpiry !== "all") {
      filtered = filtered.filter(item => {
        const daysUntilExpiry = Math.ceil(
          (new Date(item.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (filterExpiry === "expired") return daysUntilExpiry <= 0;
        if (filterExpiry === "soon") return daysUntilExpiry > 0 && daysUntilExpiry <= 3;
        return daysUntilExpiry > 3;
      });
    }

    if (filterType !== "all") {
      filtered = filtered.filter(item => item.type === filterType);
    }

    return filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
    });
  };

  const filteredItems = filterAndSortItems();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Mon Frigo 🧊</h1>
        <p className="text-green-50">
          Gérez facilement vos aliments et évitez le gaspillage
        </p>
      </div>

      <AnimatePresence>
        {!isZoomedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isZoomedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative"
        animate={{
          scale: isZoomedIn ? 1.5 : 1,
          y: isZoomedIn ? -100 : 0,
          x: dragPosition.x,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        }}
        style={{ touchAction: "none" }}
        {...bind()}
      >
        <div
          className="fridge h-[600px] w-full relative cursor-pointer"
          onClick={() => !isOpen && setIsZoomedIn(!isZoomedIn)}
        >
          <motion.div
            className={`fridge-door ${isOpen ? 'animate-door-open' : 'animate-door-close'}`}
            animate={{ rotateY: isOpen ? -105 : 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="fridge-handle"></div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="absolute left-1/2 top-4 -translate-x-1/2 bg-white text-gray-600"
            >
              {isOpen ? 'Fermer' : 'Ouvrir'}
            </Button>
          </motion.div>

          <div className="p-8 h-full relative">
            <div className="fridge-shelf" style={{ top: '25%' }}></div>
            <div className="fridge-shelf" style={{ top: '50%' }}></div>
            <div className="fridge-shelf" style={{ top: '75%' }}></div>

            <AnimatePresence>
              {isOpen && filteredItems.map((item, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const top = `${25 * row + 10}%`;
                const left = `${33 * col + 10}%`;

                return (
                  <motion.div
                    key={item.id}
                    className="fridge-item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      top,
                      left,
                      backgroundColor: getItemColor(item.type),
                    }}
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(item.id, item);
                    }}
                  >
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-white/80">{item.quantity}</p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
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