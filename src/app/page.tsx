"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const startGame = () => {
    router.push("/play"); // Redirige vers la page du jeu
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 to-indigo-700 p-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Bienvenue sur Swipe It !
        </h1>
        <p className="text-lg sm:text-xl text-white mb-8">
          Prêt à découvrir vos préférences ? <br />
          Glissez vers la droite si vous aimez, ou vers la gauche si vous
          n&apos;aimez pas.
        </p>
        <button
          onClick={startGame}
          className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg sm:text-xl rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
        >
          Jouer 👆
        </button>
      </div>
    </div>
  );
}
