// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import de Link pour la navigation vers l'inscription
import { logEvent } from "firebase/analytics";
import { analytics } from "@/lib/firebase";

export default function Login() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      router.push("/menu"); // Rediriger vers le menu si déjà connecté
    }

    if (analytics && process.env.NODE_ENV === "production") {
      logEvent(analytics, "page_view", {
        page_title: "Login",
        page_path: "/login",
      });
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Enregistrement de l'événement de connexion dans Google Analytics
      if (analytics) {
        logEvent(analytics, "login", { method: "email_password" });
      }
      router.push("/menu");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Erreur lors de la connexion : ${error.message}`);
      } else {
        console.error("Erreur inconnue lors de la connexion");
      }
      setError("Erreur de connexion. Vérifiez vos identifiants.");
    }
  };

  if (user) {
    return <div>Redirection en cours...</div>; // Afficher un message de redirection pendant le transfert
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-purple-700 to-indigo-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-white bg-opacity-10 p-10 rounded-lg shadow-2xl backdrop-blur-lg text-center"
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Connexion</h1>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-gray-900 rounded-lg bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 text-gray-900 rounded-lg bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Connexion
        </button>
        <p className="mt-4 text-gray-200">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Inscrit-toi ici !
          </Link>
        </p>
      </form>
    </div>
  );
}
