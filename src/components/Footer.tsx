// src/components/Disclaimer.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const Disclaimer: React.FC = () => {
  const { translations: t } = useLanguage();

  return (
    <footer className="mt-16 py-2 px-4 text-center text-xs text-gray-500 dark:text-gray-400">
      <p>
        {t.messageFeatPlus}{' '}
        {t.disclaimerPrefix}{' '}
        <a
          href="https://store.steampowered.com/app/2315430/The_Executive__Movie_Industry_Tycoon/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.gameTitleAriaLabel}, ${t.newTab}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors"
        >
          {t.gameTitle}
        </a>{' '}
        {t.disclaimerPrefix}{' '}
        <Link
          href="/privacy-policy"
          aria-label={t.privacyPolicyLink}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors"
        >
          {t.privacyPolicyLink}
        </Link>
      </p>
    </footer>
  );
};

export default Disclaimer;
