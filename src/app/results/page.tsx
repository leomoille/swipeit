"use client";

import { Suspense } from "react";
import ResultsContent from "@/components/ResultsContent";

export default function Results() {
  return (
    <Suspense fallback={<div>Chargement des résultats...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
