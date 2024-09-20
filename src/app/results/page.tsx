"use client";

import { Suspense, useEffect } from "react";
import ResultsContent from "@/components/ResultsContent";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export default function Results() {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view", {
        page_title: "Results",
        page_path: "/results",
      });
    }
  }, []);
  return (
    <Suspense fallback={<div>Chargement des résultats...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
