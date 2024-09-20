"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const login = () => {
    router.push("/login");
  };

  const signup = () => {
    router.push("/signup");
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 to-indigo-700 p-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Bienvenue sur Swipe It !
        </h1>
        <p className="text-lg sm:text-xl text-white mb-8">
          Prêt à découvrir <b>vos préférences</b> ? <br />
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button onClick={login} label="Connexion" />
          <Button onClick={signup} label="Inscription" />
        </div>
      </div>
    </div>
  );
}
