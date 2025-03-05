// src/types/extraResources.ts
export interface ExtraResource {
  id: string;
  nameKey: string;
  setId: string; // Relacionamento com o conjunto de recursos extras
  category: string; // "pre-production" ou "post-production"
  cost: Record<string, number>; // Custos do recurso
  complexity: number; // Complexidade do recurso
  planningReqs: Record<string, number>; // Requisitos mínimos para planejamento
  sortPriority: number; // Ordem de exibição dos recursos
  affinityLevel: number; // Adicionado para armazenar a afinidade do recurso com o tema
}

export interface ExtraResourcesResult {
  productionExtras: ExtraResource[];
  postProductionExtras: ExtraResource[];
}
