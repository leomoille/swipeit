"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export default function Signup() {
  const { signup, loginWithGoogle, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      router.push("/menu");
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
      if (analytics && process.env.NODE_ENV === "production") {
        logEvent(analytics, "sign_up", { method: "email_password" });
      }
      router.push("/menu");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Erreur lors de l'inscription : ${error.message}`);
      } else {
        console.error("Erreur inconnue lors de l'inscription");
      }
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      if (analytics && process.env.NODE_ENV === "production") {
        logEvent(analytics, "sign_up", { method: "google" });
      }
      router.push("/menu");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Erreur lors de l'inscription avec Google : ${error.message}`
        );
      } else {
        console.error("Erreur inconnue lors de l'inscription avec Google");
      }
      setError("Erreur lors de l'inscription avec Google. Veuillez réessayer.");
    }
  };

  if (user) {
    return <div>Redirection en cours...</div>;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-purple-700 to-indigo-900 text-white">
      <div className="bg-white bg-opacity-10 p-10 rounded-lg shadow-2xl backdrop-blur-lg text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-white">Inscription</h1>
        <form onSubmit={handleSignup} className="mb-4">
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
        </form>
        <div className="relative mb-4">
          <hr className="border-t border-gray-300" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-opacity-10 bg-white px-2 text-sm text-gray-200">
            ou
          </span>
        </div>
        <button
          onClick={handleGoogleSignup}
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center mb-4"
        >
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          S&apos;inscrire avec Google
        </button>
        <p className="mt-4 text-gray-200">
          Tu as déjà un compte ?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Connexion !
          </Link>
        </p>
      </div>
    </div>
  );
}
