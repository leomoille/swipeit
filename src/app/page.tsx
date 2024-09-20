"use client";

import Button from "@/components/Button";
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
        <Button onClick={startGame} label="Jouer 👆" />
      </div>
    </div>
  );
}
