// src/components/Buttons/RandomMovieButton.tsx
"use client";

import React, { useState, useEffect } from "react";
import AccessibleTextField from "@/components/Inputs/AccessibleTextField";
import { useLanguage } from "@/context/LanguageContext";
import { useRandomMovieTitle } from "@/hooks/useRandomMovieTitle";
import { sendGTMEvent } from "@next/third-parties/google";

interface RandomMovieButtonProps {
  genre: string;
  theme: string;
  genre2?: string;
}

const RandomMovieButton: React.FC<RandomMovieButtonProps> = ({ genre, theme, genre2 }) => {
  const { translations: t, locale } = useLanguage();
  const { movieTitle, loading, error, randomizeTitle } = useRandomMovieTitle(genre, locale, theme, genre2);
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState(false);
  const [shake, setShake] = useState(false);

  const handleCopy = async () => {
    if (!movieTitle) return;
    try {
      await navigator.clipboard.writeText(movieTitle);
      setCopied(true);
      sendGTMEvent({
        event: "title_copied",
        suggested_title: movieTitle,
        copied: true,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar o texto", err);
    }
  };

  // Dispara o evento de título sugerido sempre que um novo título for definido.
  useEffect(() => {
    if (movieTitle) {
      setFlash(true);
      sendGTMEvent({
        event: "title_suggestion_generated",
        suggested_title: movieTitle,
      });
      const timeout = setTimeout(() => setFlash(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [movieTitle]);

  // Ativa a animação de shake quando há erro.
  useEffect(() => {
    if (error) {
      setShake(true);
      const timeout = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <div className="relative flex-1">
          <AccessibleTextField
            value={movieTitle}
            placeholder={t.randomMoviePlaceholder}
            style={{ backgroundImage: "none" }}
            className={`${flash ? "animate-flash" : ""} ${shake ? "animate-shake" : ""}`}
          />
          {/* Botão de copiar com tooltip */}
          <div className="group absolute inset-y-0 right-0 flex items-center pr-2">
            <button
              onClick={handleCopy}
              disabled={!movieTitle}
              className="p-1 rounded transition-colors duration-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring focus:ring-offset-2"
              title={copied ? t.copied : t.copy}
            >
              <div className="relative w-5 h-5">
                {/* Ícone de clipboard */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`absolute inset-0 transition-opacity duration-300 ${copied ? "opacity-0" : "opacity-100"} h-5 w-5`}
                  fill="none"
                  viewBox="0 -0.5 25 25"
                  stroke="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.676 14.248C17.676 15.8651 16.3651 17.176 14.748 17.176H7.428C5.81091 17.176 4.5 15.8651 4.5 14.248V6.928C4.5 5.31091 5.81091 4 7.428 4H14.748C16.3651 4 17.676 5.31091 17.676 6.928V14.248Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.252 20H17.572C19.1891 20 20.5 18.689 20.5 17.072V9.75195"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Ícone de check */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`absolute inset-0 transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"} h-5 w-5 text-green-500`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
            {/* Tooltip customizado, similar ao GitHubLink */}
            <div className="absolute top-full right-0 mt-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 whitespace-nowrap py-1 px-2 rounded-md shadow-lg w-max pointer-events-none">
              {copied ? t.copied : t.copy}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-700 dark:bg-gray-200 transform rotate-45" />
            </div>
          </div>
        </div>
        <button
          onClick={randomizeTitle}
          disabled={loading}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-all duration-200 focus:outline-none focus:ring focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
        >
          {loading ? t.loading : t.suggestTitle}
        </button>
      </div>
      {error && (
        <span role="alert" className="block text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default RandomMovieButton;
