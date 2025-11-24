import { translations, TranslationKey } from "./translations";
import useVenusStore from "../state/venusStore";

export const useTranslation = () => {
  const language = useVenusStore((s) => s.settings.language) || "en";

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key];
  };

  return { t, language };
};
