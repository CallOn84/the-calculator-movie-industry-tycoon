// src/components/Buttons/DonateButton.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { sendGTMEvent } from "@next/third-parties/google";

export default function DonateButton() {
  const { translations: t } = useLanguage();

  const handleClick = () => {
    // Dispara evento de checkout iniciado
    sendGTMEvent({
      event: "user_interaction",
      event_name: "checkout_initiated",
      interaction_type: "donate_click",
    });
  };

  return (
    <div className="mt-8 relative">
      <a
        href="https://www.paypal.com/donate/?hosted_button_id=VSA6WY3VHC43L"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={t.donateAriaLabel}
        title={t.donateTitle}
        className="flex items-center justify-center w-full h-full py-2 px-6 bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors duration-200 focus:outline-none focus:ring focus:ring-offset-2"
      >
        <span className="text-lg font-semibold text-yellow-900">
          {t.donateText} <span role="img" aria-label={t.coffeeEmojiLabel}>☕️</span>
        </span>
      </a>
    </div>
  );
}
