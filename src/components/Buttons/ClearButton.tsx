// src/components/Buttons/ClearButton.tsx
"use client";

import React from 'react';

interface ClearButtonProps {
  onClear: () => void;
  label: string;
  testId?: string;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onClear, label, testId }) => {
  return (
    <button
      onClick={onClear}
      className="w-full flex items-center justify-center gap-2 mb-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-200 focus:outline-none focus:ring focus:ring-offset-2"
      data-testid={testId}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className="bi bi-trash inline-block h-5 w-5"
        viewBox="0 0 16 16"
      >
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
      </svg>
      {label}
    </button>
  );
};

export default ClearButton;
