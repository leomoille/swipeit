'use client'

import { useAuth } from "@/context/authContext"
import { analytics } from "@/lib/firebase"
import { logEvent } from "firebase/analytics"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Menu() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (analytics && process.env.NODE_ENV === "production") {
      logEvent(analytics, "page_view", {
        page_title: "Menu",
        page_path: "/menu",
      })
    }
  }, [])

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>
  }

  const goToPlay = () => router.push("/play")

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-700 text-white p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Swipe It 👆</h1>
          <p className="text-lg sm:text-2xl mb-1">
            Prêt à découvrir <strong>vos préférences</strong> ?
          </p>
          <p className="text-sm sm:text-base">
            Glissez vers <strong>la droite si vous aimez</strong>, ou vers{" "}
            <strong>la gauche si vous n&apos;aimez pas</strong>.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button
              onClick={goToPlay}
              className="w-60 bg-green-500 hover:bg-green-600 text-xl"
          >
            Jouer 🎮
          </Button>
          <Button
              onClick={logout}
              className="w-60 bg-red-500 hover:bg-red-600 text-xl"
          >
            Déconnexion
          </Button>
        </div>
      </div>
  )
}