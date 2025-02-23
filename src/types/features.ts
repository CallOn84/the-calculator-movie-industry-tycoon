// src/types/features.ts

/**
 * Descreve um item dentro de "sets" em Features.json.
 */
export interface FeatureSetItem {
  "name-key": string;
  "icon-key": string;
  "sort-priority": number;
  category: "pre-production" | "post-production";
  exclusive: boolean;
  "tech-reqs": string[];
}

/**
 * Descreve um registro (recurso extra) disponível.
 */
export interface FeatureRecordItem {
  "name-key": string;
  "set-id": string;
  "tech-reqs": string[];
  complexity: number;
  "planning-reqs": Record<string, number>;
  "score-reqs": Record<string, number>;
  "rating-affinity": Record<string, number>;
  "theme-affinity": Record<string, number>;
  cost?: Record<string, number>;
}

/**
 * Estrutura principal dos dados contidos em Features.json.
 */
export interface FeaturesJSON {
  features: {
    "loc-prefix": string;
    "icon-prefix": string;
    "feature-pool-base": number;
    "score-req-offsets": number[];
    "complexity-req": {
      small: number;
      medium: number;
      large: number;
      blockbuster: number;
    };
    sets: Record<string, FeatureSetItem>;
    records: Record<string, FeatureRecordItem>;
  };
}
