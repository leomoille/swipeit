// src/app/signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export default function Signup() {
  const { signup, user } = useAuth();
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
        page_title: "Sign up",
        page_path: "/signup",
      });
    }
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup(email, password);
      // Enregistrement de l'événement d'inscription dans Google Analytics
      if (analytics) {
        logEvent(analytics, "sign_up", { method: "email_password" });
      }
      router.push("/menu"); // Redirige après l'inscription
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Erreur lors de l'inscription : ${error.message}`);
      } else {
        console.error("Erreur inconnue lors de l'inscription");
      }
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-purple-700 to-indigo-900 text-white">
      <form
        onSubmit={handleSignup}
        className="bg-white bg-opacity-10 p-10 rounded-lg shadow-2xl backdrop-blur-lg text-center"
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Inscription</h1>
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
          S&apos;inscrire
        </button>
        <p className="mt-4 text-gray-200">
          Tu as déjà un compte ?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Connexion !
          </Link>
        </p>
      </form>
    </div>
  );
}
