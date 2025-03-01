// src/components/Calculator/BaseScoreResult.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type BaseScoreResultProps = {
  result: number;
  genre1: string;
  genre2?: string;
  theme: string;
  rating: string;
};

const getScoreBgColor = (score: number): string => {
  if (score < 1.5) return "bg-red-200 text-red-900 dark:bg-red-300";
  if (score < 2.5) return "bg-yellow-200 text-yellow-900 dark:bg-yellow-300";
  if (score < 3.5) return "bg-blue-200 text-blue-900 dark:bg-blue-300";
  return "bg-green-200 text-green-900 dark:bg-green-300";
};

const BaseScoreResult: React.FC<BaseScoreResultProps> = ({
  result,
  genre1,
  genre2,
  theme,
  rating,
}) => {
  const { translations: t } = useLanguage();

  // Função auxiliar para obter traduções, convertendo t para Record<string, string>
  const getTranslatedTerm = (prefix: "GENRE" | "THEME", term: string): string => {
    const key = `${prefix}_${term}`;
    return (t as unknown as Record<string, string>)[key] || term;
  };

  const getAffinityLabel = (score: number): string => {
    if (score < 1.5) return t.bad;
    if (score < 2.5) return t.medium;
    if (score < 3.5) return t.good;
    return t.great;
  };

  const renderTranslatedMessage = (
    message: string,
    values: { [key: string]: string }
  ) => {
    const regex = /\[([^\]]+)\]/g;
    const parts = message.split(regex);
    return parts.map((part, index) =>
      values[part] ? <strong key={index}>{values[part]}</strong> : part
    );
  };

  const translatedRating =
    (t as unknown as Record<string, string>)[
    `RATING_${rating.replace("-", "_").toUpperCase()}`
    ] || rating;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
      <p className="text-l text-gray-800 dark:text-gray-200 mb-2">
        {renderTranslatedMessage(
          genre2 ? t.resultMessageTwoGenres : t.resultMessageOneGenre,
          {
            genre1: getTranslatedTerm("GENRE", genre1),
            genre2: genre2 ? getTranslatedTerm("GENRE", genre2) : "",
            theme: getTranslatedTerm("THEME", theme),
            rating: translatedRating,
          }
        )}
      </p>
      <span
        className={`text-xl px-2 py-1 rounded ${getScoreBgColor(
          result
        )}`}
      >
        <strong>{getAffinityLabel(result)}</strong>{" "}
        <span className="text-xs">(Score: {result.toFixed(2)})</span>
      </span>
    </div>
  );
};

export default BaseScoreResult;
