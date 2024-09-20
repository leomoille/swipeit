"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getQuestionStats } from "@/lib";
import { Choice, QuestionStats } from "@/types";
import Button from "./Button";

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [answers, setAnswers] = useState<{
    liked: Choice[];
    disliked: Choice[];
  }>({
    liked: [],
    disliked: [],
  });
  const [likedStats, setLikedStats] = useState<QuestionStats[]>([]); // Stocke les stats de chaque question aimée
  const [dislikedStats, setDislikedStats] = useState<QuestionStats[]>([]); // Stocke les stats de chaque question non aimée

  // Fonction pour récupérer les stats depuis Firestore
  const fetchQuestionStats = async (
    questions: Choice[],
    setStats: React.Dispatch<React.SetStateAction<QuestionStats[]>>
  ) => {
    const statsPromises = questions.map(
      async (question): Promise<QuestionStats> => {
        const stats = await getQuestionStats(question.id);
        return {
          id: question.id,
          liked: stats?.liked || 0,
          disliked: stats?.disliked || 0,
        };
      }
    );

    const statsData = await Promise.all(statsPromises);
    setStats(statsData);
  };

  useEffect(() => {
    const liked = searchParams.get("liked");
    const disliked = searchParams.get("disliked");

    if (liked && disliked) {
      const likedParsed = JSON.parse(liked);
      const dislikedParsed = JSON.parse(disliked);

      setAnswers({
        liked: likedParsed,
        disliked: dislikedParsed,
      });

      fetchQuestionStats(likedParsed, setLikedStats);
      fetchQuestionStats(dislikedParsed, setDislikedStats);
    }
  }, [searchParams]);

  const handleReplay = () => {
    router.push("/play"); // Redirige vers la page principale pour rejouer
  };

  const backToMenu = () => {
    router.push("/menu");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-700 flex flex-col items-center justify-center text-white px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Résultats</h1>

      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 text-gray-800 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-center mb-4">💖 Likes</h2>
          <ul className="space-y-4">
            {answers.liked.length > 0 ? (
              answers.liked.map((item, index) => (
                <li
                  key={index}
                  className="bg-green-50 text-green-900 rounded-lg px-4 py-3 flex flex-col justify-between items-start transition transform hover:scale-105"
                >
                  <span className="text-lg font-semibold">{item.title}</span>
                  <div className="flex space-x-4 mt-2">
                    {/* Affichage des likes avec icône */}
                    <div className="flex items-center space-x-1 bg-green-100 rounded-full px-3 py-1">
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="text-green-500"
                      />
                      <span className="text-sm font-medium">
                        {likedStats[index]?.liked || 0} Likes
                      </span>
                    </div>
                    {/* Affichage des dislikes avec icône */}
                    <div className="flex items-center space-x-1 bg-red-100 rounded-full px-3 py-1">
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500"
                      />
                      <span className="text-sm font-medium">
                        {likedStats[index]?.disliked || 0} Dislikes
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Tu n&apos;aimes rien ?!
              </p>
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-center mb-4">
            💔 Dislikes
          </h2>
          <ul className="space-y-4">
            {answers.disliked.length > 0 ? (
              answers.disliked.map((item, index) => (
                <li
                  key={index}
                  className="bg-red-50 text-red-900 rounded-lg px-4 py-3 flex flex-col justify-between items-start transition transform hover:scale-105"
                >
                  <span className="text-lg font-semibold">{item.title}</span>
                  <div className="flex space-x-4 mt-2">
                    {/* Affichage des likes avec icône */}
                    <div className="flex items-center space-x-1 bg-green-100 rounded-full px-3 py-1">
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="text-green-500"
                      />
                      <span className="text-sm font-medium">
                        {dislikedStats[index]?.liked || 0} Likes
                      </span>
                    </div>
                    {/* Affichage des dislikes avec icône */}
                    <div className="flex items-center space-x-1 bg-red-100 rounded-full px-3 py-1">
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500"
                      />
                      <span className="text-sm font-medium">
                        {dislikedStats[index]?.disliked || 0} Dislikes
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Wouah, tu aimes vraiment tout ?!
              </p>
            )}
          </ul>
        </div>
      </div>

      <p className="text-lg text-center sm:text-xl text-white mb-4 mt-8">
        Tu viens de répondre à <b>10 questions</b>.
        <br />
        <b>Il y en a une centaine</b>, on recommence ?
      </p>

      {/* Boutons pour rejouer et retour au menu */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button onClick={handleReplay} label="Rejouer 🔄" />
        <Button onClick={backToMenu} label="Retour au menu" />
      </div>
    </div>
  );
}
