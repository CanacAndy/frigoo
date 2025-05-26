"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ?? null);
    });
    return () => unsubscribe();
  }, []);

  return user;
}
