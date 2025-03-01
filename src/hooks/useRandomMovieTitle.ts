// src/app/hooks/useRandomMovieTitle.ts
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import themeMappingData from "@/data/theme-id-tmdb.json";

const genreMapping: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  biography: 36, // mapeado para História
  comedy: 35,
  crime: 80,
  drama: 18,
  family: 10751,
  fantasy: 14,
  horror: 27,
  musical: 10402, // mapeado para Music
  mystery: 9648,
  romance: 10749,
  scifi: 878,
  thriller: 53,
};

const tmdbLanguageMapping: Record<string, string> = {
  en: "en-US",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  ja: "ja-JP",
  ko: "ko-KR",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  tr: "tr-TR",
};

export const useRandomMovieTitle = (
  genre1: string,
  locale: string,
  theme: string, // tema obrigatório
  genre2?: string
) => {
  const { translations: t } = useLanguage();
  const [movieTitle, setMovieTitle] = useState<string>("");
  const [movieId, setMovieId] = useState<number | null>(null);
  const [fetchedLocale, setFetchedLocale] = useState<string>(""); // idioma com o qual o filme foi obtido
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;
  const [desiredKeywordId, setDesiredKeywordId] = useState<number | null>(null);

  const randomizeTitle = async () => {
    if (!genre1) {
      setError(t.noGenreSelected);
      return;
    }
    if (!theme || theme.trim() === "") {
      setError(t.noThemeProvided);
      return;
    }

    // Monta os filtros de gênero
    const genreIds: number[] = [];
    const mapping1 = genreMapping[genre1.toLowerCase()];
    if (!mapping1) {
      setError(t.genre1NotMapped);
      return;
    }
    genreIds.push(mapping1);

    let mapping2: number | undefined;
    if (genre2) {
      mapping2 = genreMapping[genre2.toLowerCase()];
      if (mapping2) {
        genreIds.push(mapping2);
      }
    }

    setLoading(true);
    setError(null);

    try {
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const tmdbLocale = tmdbLanguageMapping[locale] || "en-US";
      const desiredLangPrefix = tmdbLocale.split("-")[0].toLowerCase();

      // Obtenção do ID da keyword a partir do arquivo de mapeamento
      const themeIds: Record<string, number> = themeMappingData["theme-tmdb"]["items-id"];
      const lowerTheme = theme.toLowerCase();
      if (!themeIds[lowerTheme]) {
        setError(t.themeNotFound);
        setLoading(false);
        return;
      }
      const keywordId = themeIds[lowerTheme];
      setDesiredKeywordId(keywordId);
      const withKeywordsParam = `&with_keywords=${keywordId}`;

      // Consulta Discover: obtém o total de páginas com os filtros (gêneros + tema)
      const initialRes = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}` +
        `&with_genres=${genreIds.join(",")}` +
        `&language=${tmdbLocale}${withKeywordsParam}`
      );
      const initialData = await initialRes.json();
      const totalPages = Math.min(initialData.total_pages || 1, 500);
      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      // Consulta Discover para obter filmes na página sorteada
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}` +
        `&with_genres=${genreIds.join(",")}` +
        `&page=${randomPage}` +
        `&language=${tmdbLocale}${withKeywordsParam}`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Filtra candidatos que possuam a propriedade "title"
        let candidates = data.results.filter((item: any) => item.title);

        // Se dois gêneros foram selecionados, filtra para manter somente filmes que contenham ambos
        if (mapping2) {
          candidates = candidates.filter(
            (item: any) =>
              item.genre_ids &&
              item.genre_ids.includes(mapping1) &&
              item.genre_ids.includes(mapping2)
          );
        }

        // Para cada candidato, confirma que o filme possui a keyword desejada
        const filteredCandidates = [];
        for (const candidate of candidates) {
          const kwRes = await fetch(
            `https://api.themoviedb.org/3/movie/${candidate.id}/keywords?api_key=${API_KEY}`
          );
          const kwData = await kwRes.json();
          const keywords = kwData.keywords || [];
          if (keywords.some((kw: any) => kw.id === keywordId)) {
            filteredCandidates.push(candidate);
          }
        }
        candidates = filteredCandidates;

        // Filtro extra: aceitar somente candidatos cujo título foi traduzido para o idioma desejado.
        candidates = candidates.filter((item: any) => {
          // Se o filme é originalmente do idioma desejado, aceita
          if (item.original_language.toLowerCase() === desiredLangPrefix) {
            return true;
          }
          // Caso contrário, aceita somente se o título foi traduzido (title diferente de original_title)
          return item.title !== item.original_title;
        });

        if (candidates.length > 0) {
          const randomIndex = Math.floor(Math.random() * candidates.length);
          const selectedMovie = candidates[randomIndex];
          setMovieId(selectedMovie.id);
          setMovieTitle(selectedMovie.title);
          setFetchedLocale(tmdbLocale);
          setRetryCount(0);
        } else {
          setError(t.noMovieFoundAllFilters);
        }
      } else {
        setError(t.noMovieFound);
      }
    } catch (err) {
      console.error(err);
      setError(t.errorFetchingMovie);
    }
    setLoading(false);
  };

  // Atualiza o título do filme quando o idioma é alterado,
  // garantindo que o filme seja exibido no idioma desejado.
  useEffect(() => {
    const updateTitleForLocale = async () => {
      if (movieId) {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const tmdbLocale = tmdbLanguageMapping[locale] || "en-US";
        const desiredLangPrefix = tmdbLocale.split("-")[0].toLowerCase();

        // Se o filme já foi obtido no idioma desejado, não precisa atualizar.
        if (fetchedLocale === tmdbLocale) return;

        try {
          setLoading(true);
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?include_adult=true&api_key=${API_KEY}&language=${tmdbLocale}`
          );
          const data = await res.json();
          if (data && data.title) {
            if (
              data.title === data.original_title &&
              data.original_language.toLowerCase() !== desiredLangPrefix
            ) {
              setError(t.noTranslatedTitleFound);
            } else {
              // Opcional: confirmar que o filme mantém a keyword desejada
              if (desiredKeywordId) {
                const kwRes = await fetch(
                  `https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${API_KEY}`
                );
                const kwData = await kwRes.json();
                const keywords = kwData.keywords || [];
                if (!keywords.some((kw: any) => kw.id === desiredKeywordId)) {
                  setError(t.noTranslatedTitleFound);
                  return;
                }
              }
              setMovieTitle(data.title);
              setFetchedLocale(tmdbLocale);
              setRetryCount(0);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    updateTitleForLocale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, movieId]);

  return { movieTitle, loading, error, randomizeTitle };
};
