// src/components/Calculator/ProductionResult.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ExtraResource } from "@/types/extraResources";

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

type ProductionResultProps = {
  production: ProductionProps | null;
  postProduction: PostProductionProps | null;
  extraResources: {
    productionExtras: ExtraResource[];
    postProductionExtras: ExtraResource[];
  };
};

const ProductionResult: React.FC<ProductionResultProps> = ({ production, postProduction, extraResources }) => {
  const { translations: t } = useLanguage();

  if (!production || !postProduction) return null;

  const getTranslation = (key: string): string =>
    (t as unknown as Record<string, string>)[key] || key;

  const productionMapping: Record<string, string[]> = {
    writing: ["dialogues", "script"],
    costume: ["costumes-&-makeup", "props"],
    setdesign: ["location", "lights-&-decor"],
  };

  const postProductionMapping: Record<string, string[]> = {
    specialeffect: ["stunts", "visual-effect"],
    sound: ["film-score", "sound-recording"],
    editing: ["pacing", "storytelling"],
  };

  // 🎨 Define a cor do marcador com base no nível de afinidade
  const getAffinityColor = (affinity: number): string => {
    switch (affinity) {
      case 3:
        return "bg-green-500"; // 🟢 Afinidade 3
      case 2:
        return "bg-blue-500"; // 🔵 Afinidade 2
      case 1:
        return "bg-yellow-500"; // 🟡 Afinidade 1
      case 0:
      default:
        return "bg-red-500"; // 🔴 Afinidade 0
    }
  };

  const groupExtrasBySet = (extras: ExtraResource[]) => {
    return extras.reduce<Record<string, ExtraResource[]>>((acc, extra) => {
      if (!acc[extra.setId]) {
        acc[extra.setId] = [];
      }
      acc[extra.setId].push(extra);
      return acc;
    }, {});
  };

  const renderSliderCard = (
    label: string,
    value: number,
    testId: string,
    planningKey: string,
    isProduction: boolean
  ) => {
    const mapping = isProduction ? productionMapping[planningKey] : postProductionMapping[planningKey];

    if (!mapping) return null;

    const extras = isProduction
      ? extraResources.productionExtras.filter((item) => mapping.includes(item.setId))
      : extraResources.postProductionExtras.filter((item) => mapping.includes(item.setId));

    const groupedExtras = groupExtrasBySet(extras);
    const leftPos = ((value - 10) / 40) * 90;

    return (
      <fieldset
        key={testId}
        className="p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center bg-white dark:bg-gray-800"
        aria-labelledby={`label-${testId}`}
      >
        <legend id={`label-${testId}`} className="text-sm font-medium rounded-lg shadow-sm border text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 px-2">
          {label}
        </legend>

        {/* Slider de recomendação */}
        <div className="w-full mt-2 pb-4 relative">
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={value}
            readOnly
            className="readonly-slider"
            aria-valuenow={value}
            aria-valuemin={10}
            aria-valuemax={50}
            aria-labelledby={`label-${testId}`}
            style={{ pointerEvents: "none" }}
            data-testid={testId}
          />

          <div
            className="absolute text-xs text-gray-500 dark:text-gray-300 ml-2"
            style={{
              left: `${leftPos}%`,
              transform: "translateX(-50%)",
              top: "calc(100% - 16px)",
            }}
            aria-hidden="true"
          >
            {value}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 w-full mt-2"></div>

        {/* Recursos Extras associados */}
        {Object.keys(groupedExtras).length > 0 && (
          <div className="mt-2 w-full text-left" aria-live="polite">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">{t.extraResourcesTitle}:</p>
            <ul className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              {Object.entries(groupedExtras).map(([setId, items]) => (
                <li
                  key={setId}
                  className="border border-gray-300 dark:border-gray-700 p-1 rounded-md mt-2"
                  role="group"
                  aria-labelledby={`set-title-${setId}`}
                >
                  <p
                    id={`set-title-${setId}`}
                    className="px-2 py-1 text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {getTranslation(setId)}:
                  </p>
                  <ul className="pt-1 px-1">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-1 py-1"
                        role="listitem"
                        aria-label={`${getTranslation(item.nameKey)} - Afinidade ${item.affinityLevel}`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full ${getAffinityColor(item.affinityLevel)}`}
                          aria-hidden="true"
                        ></span>
                        {getTranslation(item.nameKey)}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </fieldset>
    );
  };

  return (
    <section className="production-result-container rounded-md bg-gray-100 dark:bg-gray-700">
      <h2 className="my-2 text-sm text-gray-600 dark:text-gray-400" id="production-results-heading">
        {t.productionPlanning}
      </h2>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">{t.productionLabel}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {renderSliderCard(t.writing, production.writing, "slider-writing", "writing", true)}
          {renderSliderCard(t.costume, production.costume, "slider-costume", "costume", true)}
          {renderSliderCard(t.setdesign, production.setdesign, "slider-setdesign", "setdesign", true)}
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">{t.postProductionLabel}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {renderSliderCard(t.specialeffect, postProduction.specialeffect, "slider-specialeffect", "specialeffect", false)}
          {renderSliderCard(t.sound, postProduction.sound, "slider-sound", "sound", false)}
          {renderSliderCard(t.editing, postProduction.editing, "slider-editing", "editing", false)}
        </div>
      </div>
    </section>
  );
};

export default ProductionResult;
