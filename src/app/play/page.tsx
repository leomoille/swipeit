"use client";

import { useState, useEffect } from "react";
import SwipeCard from "@/components/SwipeCard";
import { useRouter } from "next/navigation";
import {
  getRandomQuestions,
  updateQuestionStats,
} from "@/lib/firebaseFunctions"; // Importe la fonction Firebase
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsAltH,
  faHeart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

// Définir le type pour les questions
type Question = {
  id: string;
  title: string;
  liked: number;
  disliked: number;
};

export default function Play() {
  const [currentIndex, setCurrentIndex] = useState(9); // Commence à l'index 9 car on récupère 10 questions
  const [questions, setQuestions] = useState<Question[]>([]); // Spécifie que le tableau contient des objets de type Question
  const [liked, setLiked] = useState<Question[]>([]); // Même chose pour les likes
  const [disliked, setDisliked] = useState<Question[]>([]); // Même chose pour les dislikes
  const router = useRouter();

  // Récupérer 10 questions aléatoires depuis Firestore au premier rendu
  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions = await getRandomQuestions();

      setQuestions(fetchedQuestions); // Limite à 10 questions
    };

    fetchQuestions();
  }, []);

  const handleSwipe = async (direction: string, index: number) => {
    const question = questions[index];

    if (direction === "right") {
      setLiked([...liked, question]);
      // Met à jour le compteur de likes dans Firestore
      await updateQuestionStats(question.id, "like");
    } else if (direction === "left") {
      setDisliked([...disliked, question]);
      // Met à jour le compteur de dislikes dans Firestore
      await updateQuestionStats(question.id, "dislike");
    }

    setCurrentIndex((prevIndex) => prevIndex - 1); // Passe à la question suivante
  };

  const goToResults = () => {
    router.push(
      `/results?liked=${JSON.stringify(liked)}&disliked=${JSON.stringify(
        disliked
      )}`
    );
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 to-indigo-700">
      {currentIndex >= 0 && questions.length > 0 ? (
        questions.map(
          (question, index) =>
            index <= currentIndex && (
              <SwipeCard
                key={question.id}
                title={question.title}
                onSwipe={(dir) => handleSwipe(dir, index)}
              />
            )
        )
      ) : (
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            On regarde ce que ça donne 👀
          </h2>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base lg:text-lg"
            onClick={goToResults}
          >
            Voir les résultats 🎉
          </button>
        </div>
      )}

      {/* Icônes de rappel des gestes avec une flèche au centre */}
      <div className="fixed bottom-8 w-full flex justify-between items-center px-12 z-50">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faTimes} size="3x" className="text-red-500" />
          <span className="text-white mt-2">Non</span>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon
            icon={faArrowsAltH}
            size="3x"
            className="text-white"
          />
          <span className="text-white mt-2">Swipe</span>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon
            icon={faHeart}
            size="3x"
            className="text-green-500"
          />
          <span className="text-white mt-2">Oui</span>
        </div>
      </div>
    </div>
  );
}
