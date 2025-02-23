// src/components/Buttons/BudgetRadio.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type BudgetOption = {
  value: string;
  label: string;
};

type BudgetRadioProps = {
  label?: string;
  selectedValue: string;
  onChange: (value: string) => void;
};

const getBudgetColorClass = (): string => {
  // Retorna uma cor fixa para todos os botões selecionados
  return "bg-blue-500 text-white border-blue-500";
};

const BudgetRadio: React.FC<BudgetRadioProps> = ({ label, selectedValue, onChange }) => {
  const { translations: t } = useLanguage();

  // Define as opções dinamicamente utilizando as chaves de tradução (em inglês)
  const budgetOptions: BudgetOption[] = [
    { value: "Small", label: (t as unknown as Record<string, string>)["BUDGET_SMALL"] || "Small" },
    { value: "Moderate", label: (t as unknown as Record<string, string>)["BUDGET_MODERATE"] || "Moderate" },
    { value: "Large", label: (t as unknown as Record<string, string>)["BUDGET_LARGE"] || "Large" },
    { value: "Blockbuster", label: (t as unknown as Record<string, string>)["BUDGET_BLOCKBUSTER"] || "Blockbuster" }
  ];

  return (
    <div className="budget-radio w-full">
      {label && <p className="text-sm font-medium mb-2">{label}:</p>}
      <div className="flex gap-2 w-full">
        {budgetOptions.map((option) => {
          const isSelected = selectedValue === option.value;
          const colorClasses = isSelected
            ? getBudgetColorClass()
            : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600";

          return (
            <button
              key={option.value}
              type="button"
              className={`flex-1 px-4 py-2 rounded font-bold border transition-all duration-200 focus:outline-none focus:ring focus:ring-offset-2 ${colorClasses}`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetRadio;
