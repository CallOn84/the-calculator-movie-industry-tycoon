// src/components/Inputs/AccessibleTextField.tsx
"use client";

import React from "react";

export interface AccessibleTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  multiline?: boolean;
}

const AccessibleTextField: React.FC<AccessibleTextFieldProps> = ({ multiline, className, ...props }) => {
  if (multiline) {
    return (
      <textarea
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        readOnly
        aria-readonly="true"
        className={`w-full pl-2 pr-12 py-1 pb-1 border rounded-lg shadow-sm bg-white dark:bg-formBackgroundDark text-gray-900 dark:text-darkForeground border-gray-300 dark:border-formBorderDark transition-all duration-600 focus:outline-none focus:ring focus:ring-offset-2 ${className || ""}`}
        style={{ backgroundImage: "none", resize: "vertical" }}
      />
    );
  }
  return (
    <input
      {...props}
      readOnly
      aria-readonly="true"
      className={`w-full px-3 py-1 pb-5 border rounded-lg shadow-sm bg-white dark:bg-formBackgroundDark text-gray-900 dark:text-darkForeground border-gray-300 dark:border-formBorderDark transition-all duration-600 focus:outline-none focus:ring focus:ring-offset-2 ${className || ""}`}
      style={{ appearance: "none", backgroundImage: "none" }}
    />
  );
};

export default AccessibleTextField;
