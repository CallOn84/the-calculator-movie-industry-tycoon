// src/hooks/useCalculateProduction.ts

import { useEffect, useState } from "react";
import affinities from "@/data";

/**
 * Estrutura de dados para armazenar os valores de produção.
 */
type ProductionValues = {
  writing: number;
  costume: number;
  setdesign: number;
};

/**
 * Estrutura de dados para armazenar os valores de pós-produção.
 */
type PostProductionValues = {
  specialeffect: number;
  sound: number;
  editing: number;
};

/**
 * Tipo de retorno do hook useCalculateProduction.
 */
type UseCalculateProductionResult = {
  production: ProductionValues | null;
  postProduction: PostProductionValues | null;
};

/**
 * Hook que calcula os valores de produção e pós-produção com base nos gêneros selecionados.
 * Ele usa a matriz de planejamento contida nos dados de afinidades.
 *
 * @param genre1 - Primeiro gênero do filme.
 * @param genre2 - Segundo gênero opcional.
 * @returns Um objeto contendo os valores de produção e pós-produção calculados.
 */
export function useCalculateProduction(genre1: string, genre2?: string): UseCalculateProductionResult {
  // Estado para armazenar os valores calculados
  const [result, setResult] = useState<UseCalculateProductionResult>({
    production: null,
    postProduction: null,
  });

  useEffect(() => {
    // Se nenhum gênero principal for fornecido, limpa os valores calculados
    if (!genre1) {
      setResult({ production: null, postProduction: null });
      return;
    }

    // Obtém os dados de planejamento da produção
    const planning = affinities.productionPlanning;
    const header = planning.header;
    const items = planning.items;

    // Obtém os índices dos gêneros na matriz
    const indexG1 = header.indexOf(genre1);
    const indexG2 = genre2 ? header.indexOf(genre2) : -1;

    // Se ambos os gêneros não forem encontrados na matriz, não há cálculo a ser feito
    if (indexG1 < 0 && indexG2 < 0) {
      setResult({ production: null, postProduction: null });
      return;
    }

    /**
     * Função auxiliar para obter o valor de um recurso específico na matriz de planejamento.
     */
    function getValue(resource: string, index: number): number {
      if (index < 0) return 0;
      return items[resource]?.[index] || 0;
    }

    /**
     * Calcula a média entre os valores de dois gêneros, se aplicável.
     */
    function calcResource(resource: string): number {
      const val1 = getValue(resource, indexG1);
      const val2 = genre2 ? getValue(resource, indexG2) : 0;
      return genre2 ? (val1 + val2) / 2 : val1;
    }

    // Calcula os valores brutos para cada categoria de produção
    let writingVal = calcResource("writing");
    let costumeVal = calcResource("costume");
    let setdesignVal = calcResource("setdesign");

    let specialVal = calcResource("specialeffect");
    let soundVal = calcResource("sound");
    let editingVal = calcResource("editing");

    /**
     * Ajusta os valores de um grupo para garantir que a soma mínima seja 85 e a máxima 100.
     * Isso mantém os valores dentro de uma faixa adequada.
     */
    function scaleGroup(values: number[]): number[] {
      let sum = values.reduce((acc, cur) => acc + cur, 0);
      if (sum < 85) {
        const factor = 85 / sum;
        return values.map(v => v * factor);
      } else if (sum > 100) {
        const factor = 100 / sum;
        return values.map(v => v * factor);
      }
      return values;
    }

    // Ajusta os valores para que respeitem os limites estabelecidos
    [writingVal, costumeVal, setdesignVal] = scaleGroup([writingVal, costumeVal, setdesignVal]);
    [specialVal, soundVal, editingVal] = scaleGroup([specialVal, soundVal, editingVal]);

    /**
     * Arredonda os valores para múltiplos de 5 e garante que fiquem dentro dos limites de 10 a 100.
     */
    function roundClamp(value: number): number {
      const remainder = value % 5;
      let newVal = remainder >= 2.5 ? value - remainder + 5 : value - remainder;
      if (newVal < 10) newVal = 10;
      if (newVal > 100) newVal = 100;
      return Math.round(newVal);
    }

    // Aplica o arredondamento final nos valores calculados
    writingVal = roundClamp(writingVal);
    costumeVal = roundClamp(costumeVal);
    setdesignVal = roundClamp(setdesignVal);

    specialVal = roundClamp(specialVal);
    soundVal = roundClamp(soundVal);
    editingVal = roundClamp(editingVal);

    // Atualiza o estado com os valores calculados
    setResult({
      production: {
        writing: writingVal,
        costume: costumeVal,
        setdesign: setdesignVal,
      },
      postProduction: {
        specialeffect: specialVal,
        sound: soundVal,
        editing: editingVal,
      },
    });
  }, [genre1, genre2]);

  return result;
}
