// src/hooks/useCalculateExtraResources.ts
import { useEffect, useState } from "react";
import rawFeaturesData from "@/data/Features.json";
import type { FeaturesJSON } from "@/types/features";
import type { ExtraResource, ExtraResourcesResult } from "@/types/extraResources";

export const useCalculateExtraResources = (
  production: { writing: number; costume: number; setdesign: number } | null,
  postProduction: { specialeffect: number; sound: number; editing: number } | null,
  filmBudget: string,
  selectedTheme: string
): ExtraResourcesResult => {
  const [result, setResult] = useState<ExtraResourcesResult>({
    productionExtras: [],
    postProductionExtras: [],
  });

  useEffect(() => {
    if (!production || !postProduction || !filmBudget || !selectedTheme) {
      setResult({ productionExtras: [], postProductionExtras: [] });
      return;
    }

    //Mapeia os budgets para os valores internos usados no JSON
    const budgetMap: Record<string, "small" | "medium" | "large" | "blockbuster"> = {
      "Small": "small",
      "Moderate": "medium",
      "Large": "large",
      "Blockbuster": "blockbuster",
    };
    const budgetKey = budgetMap[filmBudget] || "small";

    const features = rawFeaturesData as unknown as FeaturesJSON;
    const complexityReqs = features.features["complexity-req"];
    const budgetComplexity = complexityReqs[budgetKey];

    //Definição do nível de afinidade permitido por budget
    const affinityFilter: Record<string, number[]> = {
      small: [3],             // Apenas afinidade 3
      medium: [2, 3],         // Afinidade 2 e 3
      large: [2, 3],          // Afinidade 2 e 3
      blockbuster: [1, 2, 3], // Afinidade 1, 2 e 3
    };

    //Número mínimo de recursos recomendados por budget
    const minResourcesRequired: Record<string, number> = {
      small: 1,
      medium: 5,
      large: 10,
      blockbuster: 15,
    };

    const records = features.features.records;
    const sets = features.features.sets;

    let productionExtras: ExtraResource[] = [];
    let postProductionExtras: ExtraResource[] = [];

    for (const [id, extra] of Object.entries(records)) {
      const parent = sets[extra["set-id"]];
      if (!parent) continue;

      //Obtém o nível de afinidade com o tema
      const affinityLevel = extra["theme-affinity"]?.[selectedTheme] ?? 0;

      //Aplica o filtro de afinidade de acordo com o budget
      if (!affinityFilter[budgetKey].includes(affinityLevel)) continue;

      let meetsPlanning = false;
      if (parent.category === "pre-production") {
        if (extra["planning-reqs"]?.["writing"] && production.writing >= extra["planning-reqs"]["writing"]) {
          meetsPlanning = true;
        }
        if (extra["planning-reqs"]?.["costume"] && production.costume >= extra["planning-reqs"]["costume"]) {
          meetsPlanning = true;
        }
        if (extra["planning-reqs"]?.["setdesign"] && production.setdesign >= extra["planning-reqs"]["setdesign"]) {
          meetsPlanning = true;
        }
      } else if (parent.category === "post-production") {
        if (extra["planning-reqs"]?.["specialeffect"] && postProduction.specialeffect >= extra["planning-reqs"]["specialeffect"]) {
          meetsPlanning = true;
        }
        if (extra["planning-reqs"]?.["sound"] && postProduction.sound >= extra["planning-reqs"]["sound"]) {
          meetsPlanning = true;
        }
        if (extra["planning-reqs"]?.["editing"] && postProduction.editing >= extra["planning-reqs"]["editing"]) {
          meetsPlanning = true;
        }
      }

      //Filtra pela complexidade do orçamento e requisitos de planejamento
      if (meetsPlanning && extra.complexity <= budgetComplexity) {
        const extraResource: ExtraResource = {
          id,
          nameKey: extra["name-key"],
          setId: extra["set-id"],
          category: parent.category,
          cost: extra.cost || {},
          complexity: extra.complexity,
          planningReqs: extra["planning-reqs"],
          sortPriority: parent["sort-priority"],
          affinityLevel,
        };

        if (parent.category === "pre-production") {
          productionExtras.push(extraResource);
        } else if (parent.category === "post-production") {
          postProductionExtras.push(extraResource);
        }
      }
    }

    //Ordena os recursos por afinidade e prioridade
    productionExtras.sort((a, b) => b.affinityLevel - a.affinityLevel || a.sortPriority - b.sortPriority);
    postProductionExtras.sort((a, b) => b.affinityLevel - a.affinityLevel || a.sortPriority - b.sortPriority);

    //Garante que pelo menos o número mínimo de recursos seja recomendado
    function ensureMinResources(resources: ExtraResource[], minCount: number) {
      while (resources.length < minCount) {
        // Encontra recursos adicionais elegíveis
        const additionalResources = Object.values(records)
          .filter(extra => {
            const affinity = extra["theme-affinity"]?.[selectedTheme] ?? 0;
            return !resources.find(r => r.nameKey === extra["name-key"]) &&
              affinity > 0 && extra.complexity <= budgetComplexity;
          })
          .map(extra => ({
            id: extra["name-key"],
            nameKey: extra["name-key"],
            setId: extra["set-id"],
            category: sets[extra["set-id"]].category,
            cost: extra.cost || {},
            complexity: extra.complexity,
            planningReqs: extra["planning-reqs"],
            sortPriority: sets[extra["set-id"]]["sort-priority"],
            affinityLevel: extra["theme-affinity"]?.[selectedTheme] ?? 0,
          }));

        // Adiciona recursos até atingir o mínimo exigido
        resources.push(...additionalResources.slice(0, minCount - resources.length));
      }
      return resources;
    }

    productionExtras = ensureMinResources(productionExtras, minResourcesRequired[budgetKey]);
    postProductionExtras = ensureMinResources(postProductionExtras, minResourcesRequired[budgetKey]);

    setResult({ productionExtras, postProductionExtras });
  }, [production, postProduction, filmBudget, selectedTheme]);

  return result;
};
