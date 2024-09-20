// src/context/authContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, // Import de la fonction d'inscription
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";

// Typage pour AuthContext
interface AuthContextType {
  user: User | null; // L'utilisateur peut être null si non connecté
  login: (email: string, password: string) => Promise<UserCredential>; // login retourne une promesse
  signup: (email: string, password: string) => Promise<UserCredential>; // ajout de signup
  logout: () => Promise<void>;
}

// Création du contexte avec un type explicite
const AuthContext = createContext<AuthContextType | null>(null);

// Fournisseur de contexte
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // Récupère la route actuelle

  // Définir les routes publiques accessibles sans être connecté
  const publicRoutes = ["/", "/login", "/signup"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        // Rediriger seulement si l'utilisateur essaie d'accéder à une route protégée
        if (!publicRoutes.includes(pathname)) {
          router.push("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname, publicRoutes]);

  // Fonction de connexion avec typage
  const login = (email: string, password: string): Promise<UserCredential> =>
    signInWithEmailAndPassword(auth, email, password);

  // Fonction d'inscription avec typage
  const signup = (email: string, password: string): Promise<UserCredential> =>
    createUserWithEmailAndPassword(auth, email, password);

  // Fonction de déconnexion avec typage
  const logout = (): Promise<void> =>
    signOut(auth).then(() => router.push("/login"));

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour accéder au contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
