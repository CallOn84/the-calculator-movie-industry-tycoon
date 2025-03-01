// src/app/paidcoffee/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Home from "../page";
import Modal from "@/components/Modal";
import { useLanguage } from "@/context/LanguageContext";
import { sendGTMEvent } from "@next/third-parties/google";

const PaidCoffeePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const { translations: t } = useLanguage();

  useEffect(() => {
    // Evento de conclusão de doação
    sendGTMEvent({
      event: "purchase_completed",
      event_name: "donation_completed",
      interaction_type: "donate_success",
    });
  }, []);

  return (
    <>
      <Home />
      {modalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          gifUrl="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2hseWx0a2w3eGd2amVoMmZpa3NrY2prbnQzdmRvazN3OWk2Ym03eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ceeFbVxiZzMBi/giphy.gif"
          title={t.paidCoffeeTitle}
          description={t.paidCoffeeDescription}
        />
      )}
    </>
  );
};

export default PaidCoffeePage;
