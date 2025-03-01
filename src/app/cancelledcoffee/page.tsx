// src/app/cancelledcoffee/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Home from "../page";
import Modal from "@/components/Modal";
import { useLanguage } from "@/context/LanguageContext";
import { sendGTMEvent } from "@next/third-parties/google";

const CancelledCoffeePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const { translations: t } = useLanguage();

  useEffect(() => {
    // Evento de abandono da doação
    sendGTMEvent({
      event: "purchase_abandoned",
      event_name: "donation_cancelled",
      interaction_type: "donate_cancel",
    });
  }, []);

  return (
    <>
      <Home />
      {modalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          gifUrl="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXcwbzIyMXR5NG82Y3JmcGpneWxvMjgxcTR4am80OWEwNjQyOWc4YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41K1sbDhVxvc5o4M/giphy.gif"
          title={t.cancelledCoffeeTitle}
          description={t.cancelledCoffeeDescription}
        />
      )}
    </>
  );
};

export default CancelledCoffeePage;
