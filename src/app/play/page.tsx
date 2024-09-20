"use client";

import { useState, useEffect } from "react";
import SwipeCard from "@/components/SwipeCard";
import { useRouter } from "next/navigation";
import { analytics, getRandomQuestions, updateQuestionStats } from "@/lib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsAltH
} from "@fortawesome/free-solid-svg-icons";
import { Question } from "@/types";
import Button from "@/components/Button";
import { logEvent } from "firebase/analytics";

export default function Play() {
  const [currentIndex, setCurrentIndex] = useState(9); // Commence à l'index 9 car on récupère 10 questions
  const [questions, setQuestions] = useState<Question[]>([]); // Spécifie que le tableau contient des objets de type Question
  const [answers, setAnswers] = useState<{
    liked: Question[];
    disliked: Question[];
  }>({
    liked: [],
    disliked: [],
  });
  const router = useRouter();

  // Récupérer 10 questions aléatoires depuis Firestore au premier rendu
  useEffect(() => {
    if (analytics && process.env.NODE_ENV === "production") {
      logEvent(analytics, "page_view", {
        page_title: "Play",
        page_path: "/play",
      });
    }
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getRandomQuestions();
        setQuestions(fetchedQuestions);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            `Erreur lors de la récupération des questions : ${error.message}`
          );
        } else {
          console.error(
            "Erreur inconnue lors de la récupération des questions"
          );
        }
      }
    };

    fetchQuestions();
  }, []);

  const handleSwipe = (direction: string, index: number) => {
    const question = questions[index];

    setAnswers((prev) => ({
      ...prev,
      liked: direction === "right" ? [...prev.liked, question] : prev.liked,
      disliked:
        direction === "left" ? [...prev.disliked, question] : prev.disliked,
    }));

    updateQuestionStats(
      question.id,
      direction === "right" ? "like" : "dislike"
    );

    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const goToResults = () => {
    router.push(
      `/results?liked=${JSON.stringify(
        answers.liked
      )}&disliked=${JSON.stringify(answers.disliked)}`
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-8">
            On regarde ce que ça donne 👀
          </h2>
          <Button onClick={goToResults} label="Voir les résultats 🎉" />
        </div>
      )}

      {/* Icônes de rappel des gestes avec une flèche au centre */}
      <div className="fixed bottom-8 w-full flex justify-between items-center px-12 z-50">
        <div className="flex flex-col items-center">
          <span className="text-4xl xl:text-7xl" role="img" aria-label="Emoji caca">💩</span>
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
          <span className="text-4xl xl:text-7xl" role="img" aria-label="Emoji confetti">🎉</span>
          <span className="text-white mt-2">Oui</span>
        </div>
      </div>
    </div>
  );
}
