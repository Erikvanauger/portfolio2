import { useState } from "react";
import { en } from "../locales/en";
import { sv } from "../locales/sv";

type Language = "en" | "sv";

export function useTranslation() {
  const [language, setLanguage] = useState<Language>("en");

  const t = language === "en" ? en : sv;

  return { t, language, setLanguage };
}