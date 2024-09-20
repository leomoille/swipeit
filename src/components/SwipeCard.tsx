import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import { Heart } from 'lucide-react'

type SwipeCardProps = {
  title: string;
  onSwipe: (direction: string) => void;
};

const SwipeCard: React.FC<SwipeCardProps> = ({ title, onSwipe }) => {
  const [showIcon, setShowIcon] = useState<string | null>(null);

  // Gestion du swipe pendant l'action
  const handleSwiping = (direction: string) => {
    if (direction === "Right") {
      setShowIcon("right");
    } else if (direction === "Left") {
      setShowIcon("left");
    }
  };

  type SwipeDirection = "right" | "left" | "up" | "down";

  const handleSwipe = (direction: SwipeDirection) => {
    setShowIcon(direction); // Afficher l'icône pour un bref moment
    setTimeout(() => {
      setShowIcon(null); // Réinitialiser l'affichage de l'icône après le swipe
      onSwipe(direction);
    }, 900);
  };

  return (
      <div>
        <div className="flex justify-center items-center">
          <TinderCard
              className="absolute"
              onSwipe={handleSwipe}
              onCardLeftScreen={() => setShowIcon(null)} // Réinitialise lorsque la carte disparaît
              onSwipeRequirementFulfilled={handleSwiping} // Détecte le swipe en temps réel
              preventSwipe={["up", "down"]} // Empêche le swipe vertical
              swipeRequirementType="position" // Utilise la position pour le swipe
              swipeThreshold={100} // Seuil de 100px au lieu de 300px par défaut
          >
            {/* Carte affichée */}
            <div
                className="bg-white flex items-center justify-center w-60 h-80 sm:w-72 sm:h-96 md:w-80 md:h-100 lg:w-96 lg:h-120 border border-gray-300 rounded-lg shadow-lg p-5 m-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold select-none cursor-default">
                {title}
              </h2>
            </div>
          </TinderCard>

          {/* Afficher l'icône de swipe si showIcon est défini */}

        </div>
        {showIcon === "right" && (
            <div
                className="pointer-events-none absolute bottom-0 right-0 w-[50vw] h-[100vh] flex justify-center items-start md:items-center from-0% to-100% bg-gradient-to-r from-white/0 to-green-500 animate-fade-in-up transform text-green-500 z-50">
              <span className="text-9xl animate-bounce mt-[10vh] md:mt-[0vh]" role="img" aria-label="Emoji confetti">🎉</span>

            </div>
        )}
        {showIcon === "left" && (
            <div
                className="pointer-events-none absolute bottom-0 left-0 w-[50vw] h-[100vh] flex justify-center items-start md:items-center from-0% to-100% bg-gradient-to-l from-white/0 to-red-500 animate-fade-in-up transform text-green-500 z-50">
              <span className="text-9xl animate-bounce mt-[10vh] md:mt-[0vh]" role="img" aria-label="Emoji caca">💩</span>
            </div>
        )}
        <style jsx global>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
            }
            30% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.9s ease-out forwards;
          }
        `}</style>
      </div>

  );
};

export default SwipeCard;
