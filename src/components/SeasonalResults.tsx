"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import SuperbowlIcon from "@/components/Icons/SuperbowlIcon";
import ValentineIcon from "@/components/Icons/ValentineIcon";
import EasterIcon from "@/components/Icons/EasterIcon";
import MemorialDayIcon from "@/components/Icons/MemorialDayIcon";
import EuroCupIcon from "@/components/Icons/EuroCupIcon";
import WorldCupIcon from "@/components/Icons/WorldCupIcon";
import SummerIcon from "@/components/Icons/SummerIcon";
import HalloweenIcon from "@/components/Icons/HalloweenIcon";
import AwardsIcon from "@/components/Icons/AwardsIcon";
import ThanksgivingIcon from "@/components/Icons/ThanksgivingIcon";
import EOYHolidaysIcon from "@/components/Icons/EOYHolidaysIcon";
import CalendarIcon from "@/components/Icons/CalendarIcon";

type SeasonalResultsProps = {
  seasonResults: { season: string; score: number; label: string }[];
};

const SeasonalResults: React.FC<SeasonalResultsProps> = ({ seasonResults }) => {
  const { translations: t } = useLanguage();

  // Função para traduzir o nome da temporada
  const getTranslatedSeason = (season: string): string => {
    return (t as Record<string, string>)[`SEASON_${season}`] || season;
  };

  // Função para obter o ícone da temporada
  const getSeasonIcon = (season: string) => {
    switch (season.toLowerCase()) {
      case "superbowl":
        return <SuperbowlIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "valentine":
        return <ValentineIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "easter":
        return <EasterIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "memorialday":
        return <MemorialDayIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "eurocup":
        return <EuroCupIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "worldcup":
        return <WorldCupIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "summer":
        return <SummerIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "halloween":
        return <HalloweenIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "awards":
        return <AwardsIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "thanksgiving":
        return <ThanksgivingIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      case "eoyholidays":
        return <EOYHolidaysIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
      default:
        return <CalendarIcon className="w-8 h-18 mb-1 text-gray-600 dark:text-gray-300" />;
    }
  };

  // Função para determinar a cor de fundo com base no label
  const getScoreBgColor = (label: string): string => {
    switch (label.toLowerCase()) {
      case t.bad.toLowerCase():
        return "bg-red-500";
      case t.medium.toLowerCase():
        return "bg-yellow-400";
      case t.good.toLowerCase():
        return "bg-blue-500";
      case t.great.toLowerCase():
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  // Função para determinar a cor do texto com base no label
  const getTextColor = (label: string): string => {
    if (label.toLowerCase() === t.medium.toLowerCase()) {
      return "text-gray-900"; // Médio
    }
    return "text-white"; // Ruim, Bom ou Ótimo
  };

  return (
    <div>
      <p className="my-2 text-sm text-gray-600 dark:text-gray-400">
        {t.bestDatesToLaunch}:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
        {seasonResults.map(({ season, score, label }, index) => (
          <div
            key={index}
            className="p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center bg-white dark:bg-gray-800">
            {getSeasonIcon(season)}
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {/* Texto traduzido */}
              {getTranslatedSeason(season)}
            </span>
            <span className={`text-l font-bold my-2 py-1 px-2 rounded ${getScoreBgColor(label)} ${getTextColor(label)}`}>
              {label}
            </span>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
              Score: {score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonalResults;