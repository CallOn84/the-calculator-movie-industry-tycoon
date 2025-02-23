// src/components/Calculator/ExtraResources.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { ExtraResource } from "@/types/extraResources";

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

// Mapeamento dos set-ids dos recursos extras para cada planejamento
const productionMapping: Record<string, string[]> = {
  writing: ["script", "dialogues"],
  costume: ["costumes-&-makeup", "props"],
  setdesign: ["location", "lights-&-decor"],
};

const postProductionMapping: Record<string, string[]> = {
  specialeffect: ["stunts", "visual-effect"],
  sound: ["film-score", "sound-recording"],
  editing: ["pacing", "storytelling"],
};

// Agrupa os recursos extras com base no planejamento
const groupExtras = (planningKey: string, extras: ExtraResource[], mapping: Record<string, string[]>) => {
  const groups: Record<string, ExtraResource[]> = {};
  const allowedSetIds = mapping[planningKey] || [];
  extras.forEach((extra) => {
    if (allowedSetIds.includes(extra.setId)) {
      if (!groups[extra.setId]) {
        groups[extra.setId] = [];
      }
      groups[extra.setId].push(extra);
    }
  });
  return groups;
};

const ProductionResult: React.FC<ProductionResultProps> = ({
  production,
  postProduction,
  extraResources,
}) => {
  const { translations: t } = useLanguage();
  const tMap = t as unknown as Record<string, string>;

  if (!production || !postProduction) return null;

  /**
   * Renderiza um card para cada área de planejamento.
   * Além do slider, exibe uma área listando os recursos extras agrupados por set-id.
   */
  const renderSliderCard = (
    planningKey: string,
    label: string,
    value: number,
    testId: string,
    extras: ExtraResource[],
    mapping: Record<string, string[]>
  ) => {
    const leftPos = ((value - 10) / 40) * 90;
    const grouped = groupExtras(planningKey, extras, mapping);

    return (
      <fieldset
        key={testId}
        className="p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center bg-white dark:bg-gray-800"
        role="group"
        aria-labelledby={`label-${testId}`}
      >
        <legend id={`label-${testId}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            aria-valuenow={value}
            aria-valuemin={10}
            aria-valuemax={50}
            aria-labelledby={`label-${testId}`}
            className="readonly-slider"
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

        {/* Recursos Extras associados */}
        {Object.keys(grouped).length > 0 && (
          <div className="w-full mt-4 space-y-2" aria-live="polite">
            {Object.entries(grouped).map(([setId, items]) => (
              <div key={setId} className="border-t pt-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400" id={`set-title-${setId}`}>
                  {tMap[setId.toLowerCase()] || setId}
                </p>
                <ul className="list-disc pl-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="text-xs text-gray-700 dark:text-gray-300"
                      role="listitem"
                      aria-label={tMap[item.nameKey.toLowerCase()] || item.nameKey}
                    >
                      {tMap[item.nameKey.toLowerCase()] || item.nameKey}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </fieldset>
    );
  };

  return (
    <section className="production-result-container rounded-md bg-gray-100 dark:bg-gray-700 space-y-8">
      <h2 className="my-2 text-sm text-gray-600 dark:text-gray-400">{t.productionPlanning}</h2>

      {/* Seção de Produção */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">{t.productionLabel}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {renderSliderCard("writing", t.writing, production.writing, "slider-writing", extraResources.productionExtras, productionMapping)}
          {renderSliderCard("costume", t.costume, production.costume, "slider-costume", extraResources.productionExtras, productionMapping)}
          {renderSliderCard("setdesign", t.setdesign, production.setdesign, "slider-setdesign", extraResources.productionExtras, productionMapping)}
        </div>
      </div>

      {/* Seção de Pós-Produção */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">{t.postProductionLabel}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {renderSliderCard("specialeffect", t.specialeffect, postProduction.specialeffect, "slider-specialeffect", extraResources.postProductionExtras, postProductionMapping)}
          {renderSliderCard("sound", t.sound, postProduction.sound, "slider-sound", extraResources.postProductionExtras, postProductionMapping)}
          {renderSliderCard("editing", t.editing, postProduction.editing, "slider-editing", extraResources.postProductionExtras, postProductionMapping)}
        </div>
      </div>
    </section>
  );
};

export default ProductionResult;
