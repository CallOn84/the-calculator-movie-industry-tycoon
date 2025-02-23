// src/components/Inputs/SelectInput.tsx
"use client";

import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { useLanguage } from '@/context/LanguageContext';

type SelectInputProps = {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  isOptional?: boolean;
};

const SelectInput = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  isOptional = false,
}: SelectInputProps) => {
  const { translations: t } = useLanguage();

  const handleValueChange = (value: string) => {
    const cleanedValue = value === "unselected" ? "" : value;
    onChange(cleanedValue);
    if (typeof window.gtag === "function") {
      window.gtag('event', 'form_field_change', {
        form_name: 'affinity_calculator',
        field_name: name,
        field_value: cleanedValue,
      });
    }
  };

  const getTranslatedOption = (option: string): string => {
    if (name === "theme") {
      const translationKey = `THEME_${option.replace(/-/g, '_')}`;
      return (t as unknown as Record<string, string>)[translationKey] || option;
    }
    const genreKey = `GENRE_${option}`;
    return (t as unknown as Record<string, string>)[genreKey] || option;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}:
      </label>
      <Select.Root value={value} onValueChange={handleValueChange}>
        <Select.Trigger
          className="w-full flex items-center justify-between px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-formBackgroundDark text-gray-900 dark:text-darkForeground border-gray-300 dark:border-formBorderDark transition-all duration-200 focus:outline-none focus:ring focus:ring-offset-2"
          aria-label={label}
        >
          <Select.Value placeholder={t.select} />
          <Select.Icon className="text-gray-500 dark:text-gray-400">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="z-50 bg-white dark:bg-formBackgroundDark rounded-md shadow-lg border border-gray-200 dark:border-formBorderDark">
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-formBackgroundDark text-gray-500 cursor-default">
              <ChevronDownIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-2">
              {isOptional && (
                <Select.Item
                  value="unselected"
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600"
                >
                  <Select.ItemText>{t.clearSelection}</Select.ItemText>
                </Select.Item>
              )}
              {options.map((option) => (
                <Select.Item
                  key={option}
                  value={option}
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600"
                >
                  <Select.ItemText>{getTranslatedOption(option)}</Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-formBackgroundDark text-gray-500 cursor-default">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      {isOptional && (
        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t.optinSelect}
        </span>
      )}
    </div>
  );
};

export default SelectInput;
