// src/components/LanguageSelector.tsx
"use client";

import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { useLanguage } from '@/context/LanguageContext';
import { sendGTMEvent } from '@next/third-parties/google';

const LanguageSelector = () => {
  const { locale, setLocale } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLocale(value);
    sendGTMEvent({
      event: 'user_interaction',
      event_name: 'language_change',
      selected_language: value,
      interaction_type: 'dropdown',
      language_label: languages.find(lang => lang.code === value)?.label
    });
  };

  const languages = [
    { code: "pt", label: "Português" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "es", label: "Español" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
    { code: "zh-CN", label: "中文（简体）" },
    { code: "zh-TW", label: "中文（繁體）" },
    { code: "tr", label: "Türkçe" }
  ];

  return (
    <Select.Root value={locale} onValueChange={handleLanguageChange}>
      <Select.Trigger
        className="inline-flex items-center justify-between px-3 py-2 text-sm bg-white dark:bg-formBackgroundDark rounded-lg border border-gray-300 dark:border-formBorderDark hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring focus:ring-offset-2"
        aria-label="Seletor de idiomas"
      >
        <Select.Value>
          {languages.find(lang => lang.code === locale)?.label}
        </Select.Value>
        <Select.Icon className="ml-2">
          <ChevronDownIcon className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="overflow-hidden bg-white dark:bg-formBackgroundDark rounded-lg shadow-lg border border-gray-200 dark:border-formBorderDark"
          position="popper"
          sideOffset={5}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-formBackgroundDark">
            <ChevronDownIcon className="h-4 w-4" />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2">
            {languages.map((lang) => (
              <Select.Item
                key={lang.code}
                value={lang.code}
                className="flex items-center px-3 py-2 relative pr-8 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600"
              >
                <Select.ItemText>{lang.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-1">
                  <CheckIcon className="h-4 w-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-formBackgroundDark">
            <ChevronDownIcon className="h-4 w-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default LanguageSelector;
