// src/components/Inputs/AgeRatingRadio.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type AgeRatingOption = {
  value: string;
  label: string;
};

type AgeRatingRadioProps = {
  label?: string;
  options: AgeRatingOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};

const getColorClass = (value: string): string => {
  switch (value.toLowerCase()) {
    case "pg":
      return "bg-green-500 text-white";
    case "pg-13":
      return "bg-yellow-500 text-white";
    case "r":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

const AgeRatingRadio: React.FC<AgeRatingRadioProps> = ({
  label,
  options,
  selectedValue,
  onChange,
}) => {
  const { translations: t } = useLanguage();

  return (
    <div className="age-rating-radio w-full">
      {label && <p className="text-sm font-medium mb-2">{label}:</p>}
      <div className="flex gap-2 w-full">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`flex-1 px-4 py-2 rounded-lg font-medium border transition-all duration-200 focus:outline-none focus:ring focus:ring-offset-2 ${selectedValue === option.value
              ? `${getColorClass(option.value)} border-${option.value.toLowerCase()}-500`
              : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgeRatingRadio;
