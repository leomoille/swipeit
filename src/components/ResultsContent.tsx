"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getQuestionStats } from "@/lib/firebaseFunctions"; // Importe la fonction pour récupérer les stats depuis Firestore

type Choice = {
  id: string; // Ajoute l'ID pour récupérer les stats
  title: string;
};

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [liked, setLiked] = useState<Choice[]>([]);
  const [disliked, setDisliked] = useState<Choice[]>([]);
  const [likedStats, setLikedStats] = useState<QuestionStats[]>([]); // Stocke les stats de chaque question aimée
  const [dislikedStats, setDislikedStats] = useState<QuestionStats[]>([]); // Stocke les stats de chaque question non aimée

  type QuestionStats = {
    id: string;
    liked: number;
    disliked: number;
  };

  // Fonction pour récupérer les stats depuis Firestore
  const fetchQuestionStats = async (
    questions: Choice[],
    setStats: React.Dispatch<React.SetStateAction<QuestionStats[]>>
  ) => {
    const statsPromises = questions.map(async (question) => {
      const stats = await getQuestionStats(question.id); // Récupère les statistiques de la question
      return {
        id: question.id,
        liked: stats?.liked || 0, // Définit à 0 si `liked` n'existe pas
        disliked: stats?.disliked || 0, // Définit à 0 si `disliked` n'existe pas
      };
    });

    const statsData = await Promise.all(statsPromises);
    setStats(statsData);
  };

  useEffect(() => {
    const liked = searchParams.get("liked");
    const disliked = searchParams.get("disliked");

    if (liked && disliked) {
      const likedParsed = JSON.parse(liked);
      const dislikedParsed = JSON.parse(disliked);
      setLiked(likedParsed);
      setDisliked(dislikedParsed);

      // Récupère les stats des questions aimées et non aimées
      fetchQuestionStats(likedParsed, setLikedStats);
      fetchQuestionStats(dislikedParsed, setDislikedStats);
    }
  }, [searchParams]);

  const handleReplay = () => {
    router.push("/play"); // Redirige vers la page principale pour rejouer
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-700 flex flex-col items-center justify-center text-white px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Résultats</h1>

      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 text-gray-800 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-center mb-4">💖 Likes</h2>
          <ul className="space-y-4">
            {liked.length > 0 ? (
              liked.map((item, index) => (
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
            {disliked.length > 0 ? (
              disliked.map((item, index) => (
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

      {/* Bouton pour rejouer */}
      <button
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition transform hover:scale-105"
        onClick={handleReplay}
      >
        Rejouer 🔄
      </button>
    </div>
  );
}
