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

    const records = features.features.records;
    const sets = features.features.sets;

    const productionExtras: ExtraResource[] = [];
    const postProductionExtras: ExtraResource[] = [];

    for (const [id, extra] of Object.entries(records)) {
      const parent = sets[extra["set-id"]];
      if (!parent) continue;

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

      const affinityLevel = extra["theme-affinity"]?.[selectedTheme] ?? 0;

      // 🔹 Define quais afinidades podem ser exibidas para cada orçamento
      const canBeDisplayed =
        affinityLevel === 3 ||
        (affinityLevel === 2 && budgetKey !== "small") ||
        (affinityLevel === 1 && (budgetKey === "large" || budgetKey === "blockbuster")) ||
        (affinityLevel === 0 && budgetKey === "blockbuster");

      if (meetsPlanning && canBeDisplayed) {
        const extraResource: ExtraResource = {
          id,
          nameKey: extra["name-key"],
          setId: extra["set-id"],
          category: parent.category,
          cost: extra.cost || {},
          complexity: extra.complexity,
          planningReqs: extra["planning-reqs"],
          sortPriority: parent["sort-priority"],
          affinityLevel, // ✅ Agora armazenamos corretamente a afinidade
        };

        if (parent.category === "pre-production") {
          productionExtras.push(extraResource);
        } else if (parent.category === "post-production") {
          postProductionExtras.push(extraResource);
        }
      }
    }

    // Ordena os recursos extras por maior afinidade dentro do mesmo `set-id`
    productionExtras.sort((a, b) => b.affinityLevel - a.affinityLevel);
    postProductionExtras.sort((a, b) => b.affinityLevel - a.affinityLevel);

    setResult({ productionExtras, postProductionExtras });
  }, [production, postProduction, filmBudget, selectedTheme]);

  return result;
};
