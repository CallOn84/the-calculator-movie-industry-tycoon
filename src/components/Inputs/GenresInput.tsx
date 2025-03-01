// src/components/Inputs/GenresInput.tsx
"use client";

import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { useLanguage } from '@/context/LanguageContext';

type GenresInputProps = {
  label: string;
  name: string;
  options: { genre: string; score: number; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  isOptional?: boolean;
};

const GenresInput = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  isOptional = false,
}: GenresInputProps) => {
  const { translations: t } = useLanguage();

  const getTranslatedGenre = (genre: string): string => {
    const key = `GENRE_${genre}`;
    return (t as unknown as Record<string, string>)[key] || genre;
  };

  const handleValueChange = (value: string) => {
    const cleanedValue = value === "unselected" ? "" : value;
    onChange(cleanedValue);
    if (typeof window.gtag === "function") {
      window.gtag('event', 'form_field_change', {
        form_name: 'affinity_calculator',
        field_name: name,
        field_value: cleanedValue
      });
    }
  };

  // 🎨 Define a cor do marcador com base na classificação da afinidade
  const getScoreBgColor = (label: string): string => {
    switch (label.toLowerCase()) {
      case (t as unknown as Record<string, string>).bad.toLowerCase():
        return "bg-red-500"; // Ruim 🔴
      case (t as unknown as Record<string, string>).medium.toLowerCase():
        return "bg-yellow-400"; // Neutro 🟡
      case (t as unknown as Record<string, string>).good.toLowerCase():
        return "bg-blue-500"; // Bom 🔵
      case (t as unknown as Record<string, string>).great.toLowerCase():
        return "bg-green-500"; // Excelente 🟢
      default:
        return "bg-gray-300"; // Sem afinidade ⚪
    }
  };

  const getTextColor = (label: string): string => {
    return label.toLowerCase() === (t as unknown as Record<string, string>).medium.toLowerCase()
      ? "text-gray-900"
      : "text-white";
  };

  return (
    <div className="space-y-2">
      {/* Rótulo da seleção de gênero */}
      <label
        id={`label-${name}`}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}:
      </label>

      {/* Componente de seleção acessível */}
      <Select.Root value={value} onValueChange={handleValueChange}>
        <Select.Trigger
          className="w-full flex items-center justify-between px-3 py-2 border rounded-lg shadow-sm bg-white dark:bg-formBackgroundDark text-gray-900 dark:text-darkForeground border-gray-300 dark:border-formBorderDark transition-all duration-200 focus:outline-none focus:ring focus:ring-offset-2"
          aria-labelledby={`label-${name}`}
          role="combobox"
          aria-expanded="false"
        >
          <Select.Value placeholder={t.select} />
          <Select.Icon className="text-gray-500 dark:text-gray-400">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="z-50 bg-white dark:bg-formBackgroundDark rounded-lg shadow-lg border border-gray-200 dark:border-formBorderDark"
            role="listbox"
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-formBackgroundDark">
              <ChevronDownIcon />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-2">
              {/* Opção para limpar a seleção (se aplicável) */}
              {isOptional && (
                <Select.Item
                  value="unselected"
                  className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  role="option"
                >
                  <Select.ItemText>{t.clearSelection}</Select.ItemText>
                </Select.Item>
              )}

              {/* Lista de opções com marcador de afinidade */}
              {options.map((option) => (
                <Select.Item
                  key={option.genre}
                  value={option.genre}
                  className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600"
                  role="option"
                  aria-labelledby={`option-${option.genre}`}
                >
                  <Select.ItemText>
                    <div className="flex items-center">
                      {/* Indicador visual de afinidade */}
                      {option.label && (
                        <span
                          className={`inline-block w-4 h-4 rounded-full mr-2 ${getScoreBgColor(
                            option.label
                          )}`}
                          aria-hidden="true"
                        ></span>
                      )}
                      <span id={`option-${option.genre}`}>{getTranslatedGenre(option.genre)}</span>
                    </div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-formBackgroundDark">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* Informação opcional abaixo do seletor */}
      {isOptional && (
        <span
          className="block text-xs text-gray-500 dark:text-gray-400 mt-1"
          role="note"
        >
          {t.optinSelect}
        </span>
      )}
    </div>
  );
};

export default GenresInput;
