// src/components/Buttons/DonateButton.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { sendGTMEvent } from "@next/third-parties/google";

export default function DonateButton() {
  const { translations: t } = useLanguage();

  const handleClick = () => {
    sendGTMEvent({
      event: "user_interaction",
      event_name: "checkout_initiated",
      interaction_type: "donate_click",
    });
  };

  return (
    <div className="relative">
      <a
        href={t.donateLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={t.donateAriaLabel}
        title={t.donateTitle}
        className="flex items-center justify-center w-full h-full py-2 px-4 md:px-6 bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors duration-200 focus:outline-none focus:ring focus:ring-offset-2"
      >
        <span className="text-l font-semibold text-yellow-900">
          <span className="hidden md:inline">{t.donateText}</span> <span role="img" aria-label={t.coffeeEmojiLabel}>☕️</span>
        </span>
      </a>
    </div>
  );
}
