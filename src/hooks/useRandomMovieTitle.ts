import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import themeMappingData from "@/data/theme-id-tmdb.json";

// Mapeamento de gêneros para IDs do TMDB
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

// Mapeamento de idiomas do app para idiomas do TMDB
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

// (Opcional) cache simples em memória, para não repetir chamadas
// para os mesmos parâmetros (genre1, genre2, theme, locale).
// Em produção, você pode usar localStorage ou algo mais robusto.
const discoverCache = new Map<string, any>();

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

  const randomizeTitle = async () => {
    // Validações iniciais
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

      // Obtém ID da keyword a partir do mapeamento local
      const themeIds: Record<string, number> = themeMappingData["theme-tmdb"]["items-id"];
      const lowerTheme = theme.toLowerCase();
      if (!themeIds[lowerTheme]) {
        setError(t.themeNotFound);
        setLoading(false);
        return;
      }
      const keywordId = themeIds[lowerTheme];

      // Monta URL base do discover
      const baseDiscoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}` +
        `&with_genres=${genreIds.join(",")}` +
        `&language=${tmdbLocale}` +
        `&with_keywords=${keywordId}`;

      // Checa cache
      const cacheKey = `${genreIds.join(",")}-${tmdbLocale}-${keywordId}`;
      let totalPages = 0;

      if (discoverCache.has(cacheKey)) {
        // Se já temos no cache, basta reutilizar
        totalPages = discoverCache.get(cacheKey).totalPages;
      } else {
        // Faz a primeira requisição para descobrir o total de páginas
        const initialRes = await fetch(baseDiscoverUrl);
        const initialData = await initialRes.json();

        // total_pages do TMDB costuma ir até 500
        totalPages = Math.min(initialData.total_pages || 1, 500);

        // Armazena no cache
        discoverCache.set(cacheKey, { totalPages });
      }

      // Seleciona uma página aleatória
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const discoverUrlWithPage = `${baseDiscoverUrl}&page=${randomPage}`;

      // Busca os resultados da página aleatória
      const res = await fetch(discoverUrlWithPage);
      const data = await res.json();

      // Verifica se há resultados
      if (data.results && data.results.length > 0) {
        // Filtra para garantir que cada item tenha título
        let candidates = data.results.filter((item: any) => item.title);

        // Se dois gêneros foram selecionados, filtra localmente (TMDB já filtra, mas por segurança).
        if (mapping2) {
          candidates = candidates.filter(
            (item: any) =>
              item.genre_ids &&
              item.genre_ids.includes(mapping1) &&
              item.genre_ids.includes(mapping2)
          );
        }

        // (Removido) Não precisamos mais checar as keywords uma a uma,
        // pois usamos o parâmetro &with_keywords=ID.

        // Filtro extra: aceitar somente candidatos que tenham tradução no idioma desejado
        candidates = candidates.filter((item: any) => {
          // Se o filme é originalmente do idioma desejado, ok
          if (item.original_language.toLowerCase() === desiredLangPrefix) {
            return true;
          }
          // Senão, só aceita se o title != original_title (ou seja, traduzido)
          return item.title !== item.original_title;
        });

        if (candidates.length > 0) {
          // Escolhe um candidato aleatório
          const randomIndex = Math.floor(Math.random() * candidates.length);
          const selectedMovie = candidates[randomIndex];

          setMovieId(selectedMovie.id);
          setMovieTitle(selectedMovie.title);
          setFetchedLocale(tmdbLocale);
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

  // Quando o idioma muda, tenta atualizar o título do mesmo filme
  // (se já houver um movieId).
  useEffect(() => {
    const updateTitleForLocale = async () => {
      if (movieId) {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const tmdbLocale = tmdbLanguageMapping[locale] || "en-US";
        const desiredLangPrefix = tmdbLocale.split("-")[0].toLowerCase();

        // Se o filme já está no idioma desejado, não refaz requisição
        if (fetchedLocale === tmdbLocale) return;

        try {
          setLoading(true);
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?include_adult=true&api_key=${API_KEY}&language=${tmdbLocale}`
          );
          const data = await res.json();
          if (data && data.title) {
            // Se não houver título traduzido, avisa erro
            if (
              data.title === data.original_title &&
              data.original_language.toLowerCase() !== desiredLangPrefix
            ) {
              setError(t.noTranslatedTitleFound);
            } else {
              setMovieTitle(data.title);
              setFetchedLocale(tmdbLocale);
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
