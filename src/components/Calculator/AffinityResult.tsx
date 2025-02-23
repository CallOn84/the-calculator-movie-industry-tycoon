// src/components/Calculator/AffinityResult.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import BaseScoreResult from "./BaseScoreResult";
import SeasonalResults from "./SeasonalResults";
import ProductionResult from "./ProductionResult";
import ExtraResources from "./ExtraResources";
import { ExtraResource } from "@/types/extraResources"; // ✅ Importação correta

export type SeasonResult = {
  season: string;
  score: number;
  label: string;
};

type ProductionProps = {
  writing: number;
  costume: number;
  setdesign: number;
};

type PostProductionProps = {
  specialeffect: number;
  sound: number;
  editing: number;
};

type ExtraResourcesType = {
  productionExtras: ExtraResource[];
  postProductionExtras: ExtraResource[];
};

type AffinityResultProps = {
  result: number | null;
  loading: boolean;
  genre1: string;
  genre2?: string;
  theme: string;
  rating: string;
  seasonResults: SeasonResult[];
  production: ProductionProps | null;
  postProduction: PostProductionProps | null;
  extraResources: ExtraResourcesType;
};

const AffinityResult: React.FC<AffinityResultProps> = ({
  result,
  loading,
  genre1,
  genre2,
  theme,
  rating,
  seasonResults,
  production,
  postProduction,
  extraResources,
}) => {
  const { translations: t } = useLanguage();

  if (loading) {
    return (
      <div className="result-container flex justify-center py-8" role="status">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (result === null) {
    return (
      <div className="result-container" aria-live="polite">
        <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
          {t.noResult}
        </p>
      </div>
    );
  }

  return (
    <div className="result-container space-y-4" aria-live="polite">
      <BaseScoreResult
        result={result}
        genre1={genre1}
        genre2={genre2}
        theme={theme}
        rating={rating}
      />

      {production && postProduction && (
        <ProductionResult
          production={production}
          postProduction={postProduction}
          extraResources={extraResources}
        />
      )}

      <SeasonalResults seasonResults={seasonResults} />
    </div>
  );
};

export default AffinityResult;
