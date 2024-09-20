// src/app/menu/page.tsx
"use client";

import { useAuth } from "@/context/authContext";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Menu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Enregistrer l'événement page_view lorsque la page est chargée
    if (analytics) {
      logEvent(analytics, "page_view", {
        page_title: "Menu",
        page_path: "/menu",
      });
    }
  }, []); // Exécuter une seule fois au chargement de la page

  if (!user) {
    return <div>Chargement...</div>; // Affichage temporaire pendant la récupération de l'utilisateur
  }

  const goToPlay = () => {
    router.push("/play"); // Redirection vers la page de jeu
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 to-indigo-700">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Swipe It 👆
        </h1>
        <p className="text-lg sm:text-xl text-white mb-8">
          Prêt à découvrir <b>vos préférences</b> ? <br />
          Glissez vers <b>la droite si vous aimez</b>, ou vers <b>la gauche si vous
          n&apos;aimez pas</b>.
        </p>
      </div>

      {/* Premier item du menu pour jouer */}
      <button
        onClick={goToPlay}
        className="w-60 p-4 bg-green-500 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-200 mb-6"
      >
        Jouer 🎮
      </button>

      {/* Bouton de déconnexion */}
      <button
        onClick={logout}
        className="mt-6 w-60 p-4 bg-red-500 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
      >
        Déconnexion
      </button>
    </div>
  );
}
