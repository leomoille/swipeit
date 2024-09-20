import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";

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
    }, 300);
  };

  return (
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
        <div className="bg-white flex items-center justify-center w-60 h-80 sm:w-72 sm:h-96 md:w-80 md:h-100 lg:w-96 lg:h-120 border border-gray-300 rounded-lg shadow-lg p-5 m-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold">
            {title}
          </h2>
        </div>
      </TinderCard>

      {/* Afficher l'icône de swipe si showIcon est défini */}
      {showIcon === "right" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500 z-50">
          <FontAwesomeIcon icon={faHeart} size="3x" />
        </div>
      )}
      {showIcon === "left" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 z-50">
          <FontAwesomeIcon icon={faTimes} size="3x" />
        </div>
      )}
    </div>
  );
};

export default SwipeCard;
