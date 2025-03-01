//src/components/Inputs/AccessibleTextField.tsx
"use client";

import React from "react";

export interface AccessibleTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const AccessibleTextField: React.FC<AccessibleTextFieldProps> = (props) => {
  return (
    <input
      {...props}
      readOnly
      aria-readonly="true"
      className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-formBackgroundDark text-gray-900 dark:text-darkForeground border-gray-300 dark:border-formBorderDark transition-all duration-200 focus:outline-none focus:ring focus:ring-offset-2 ${props.className || ""}`}
      style={{ appearance: "none", backgroundImage: "none" }}
    />
  );
};

export default AccessibleTextField;
