// src/components/ThemeToggle.tsx
"use client";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { sendGTMEvent } from '@next/third-parties/google';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { translations: t } = useLanguage();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();
    sendGTMEvent({
      event: 'user_interaction',
      event_name: 'theme_change',
      theme: newTheme,
      interaction_type: 'toggle'
    });
  };

  return (
    <div 
      className="group relative focus-within:opacity-100"
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      <button
        onClick={handleToggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring focus:ring-offset-2"
        aria-label={t.themeToggle}
        aria-describedby="theme-tooltip"
        aria-live="polite"
      >
        {theme === "dark" ? (
          <SunIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        ) : (
          <MoonIcon className="h-5 w-5 text-indigo-800" aria-hidden="true" />
        )}
      </button>

      <div
        id="theme-tooltip"
        role="tooltip"
        className={`absolute top-full right-0 mt-2 z-10 transition-opacity duration-300 text-sm bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 whitespace-nowrap py-1 px-2 rounded-md shadow-lg w-max pointer-events-none ${
          tooltipVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {theme === "dark" ? t.lightModeTooltip : t.darkModeTooltip}
        <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-700 dark:bg-gray-200 transform rotate-45" />
      </div>
    </div>
  );
};

export default ThemeToggle;
