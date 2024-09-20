import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Question } from "@/_types";

// Fonction pour ajouter un champ aléatoire "random" aux questions existantes dans la sous-collection
export const addRandomFieldToQuestions = async () => {
  // Accéder à la sous-collection 'questions' à l'intérieur du document 'questions' de 'swipe-it'
  const questionsRef = collection(db, "swipe-it", "questions", "questions");

  // Récupérer tous les documents de cette sous-collection
  const querySnapshot = await getDocs(questionsRef);

  // Parcourir chaque document de la sous-collection pour ajouter un champ 'random'
  querySnapshot.forEach(async (docSnapshot) => {
    const randomValue = Math.random(); // Génère une valeur aléatoire entre 0 et 1
    const questionRef = doc(
      db,
      "swipe-it",
      "questions",
      "questions",
      docSnapshot.id
    ); // Référence au document spécifique

    // Mettre à jour le document avec le champ 'random'
    await updateDoc(questionRef, {
      random: randomValue,
    });
  });
};

export const getRandomQuestions = async (): Promise<Question[]> => {
  try {
    const randomValue = Math.random();

    // Accède à la sous-collection 'questions'
    const questionsRef = collection(db, "swipe-it", "questions", "questions");

    // Requête Firestore pour récupérer les documents avec 'random' supérieur ou égal
    const randomQuery = query(
      questionsRef,
      where("random", ">=", randomValue),
      orderBy("random"),
      limit(10)
    );

    const querySnapshot = await getDocs(randomQuery);

    // Si moins de 10 résultats sont trouvés, effectuer une deuxième requête
    let questions = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Question;
      return {
        id: doc.id,
        title: data.title || "Untitled", // Assurer que le champ 'title' existe
        liked: data.liked || 0, // Assurer que le champ 'liked' existe
        disliked: data.disliked || 0, // Assurer que le champ 'disliked' existe
      };
    });

    // Si moins de 10 questions, récupérer les manquantes avec une nouvelle requête
    if (questions.length < 10) {
      const additionalQuery = query(
        questionsRef,
        where("random", "<", randomValue),
        orderBy("random"),
        limit(10 - questions.length)
      );

      const additionalSnapshot = await getDocs(additionalQuery);
      const additionalQuestions = additionalSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "Untitled",
          liked: data.liked || 0,
          disliked: data.disliked || 0,
        };
      });

      questions = [...questions, ...additionalQuestions];
    }

    return questions;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Erreur lors de la récupération des questions aléatoires : ${error.message}`
      );
    } else {
      console.error(
        "Erreur inconnue lors de la récupération des questions aléatoires"
      );
    }
    return [];
  }
};

export const getQuestionStats = async (questionId: string) => {
  try {
    const docRef = doc(db, "swipe-it", "questions", "questions", questionId); // Accéder à la sous-collection
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); // Retourne les données du document (question)
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Erreur lors de la récupération des stats de la question : ${error.message}`
      );
    } else {
      console.error(
        "Erreur inconnue lors de la récupéraration des stats de la question"
      );
    }
    return null;
  }
};

export const updateQuestionStats = async (
  questionId: string,
  type: "like" | "dislike"
): Promise<void> => {
  try {
    const questionRef = doc(
      db,
      "swipe-it",
      "questions",
      "questions",
      questionId
    );

    if (type === "like") {
      await updateDoc(questionRef, { liked: increment(1) });
    } else if (type === "dislike") {
      await updateDoc(questionRef, { disliked: increment(1) });
    }

    console.log(
      `Statistiques mises à jour pour la question ${questionId} : ${type}`
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Erreur lors de la mise à jour des statistiques pour la question ${questionId} : ${error.message}`
      );
    } else {
      console.error(
        "Erreur inconnue lors de la mise à jour des statistiques de la question"
      );
    }
  }
};
