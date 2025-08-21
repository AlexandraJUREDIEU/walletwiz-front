import { useTranslation } from "react-i18next";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{t("settings.language")}</span>
      <Select
        value={i18n.language.startsWith("fr") ? "fr" : "en"}
        onValueChange={(lng) => {
          i18n.changeLanguage(lng);
          // persistance locale (doublon avec i18next detector, mais explicite)
          localStorage.setItem("walletwiz-lang", lng);
          // optionnel: changer lang sur <html>
          document.documentElement.lang = lng;
        }}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">{t("settings.french")}</SelectItem>
          <SelectItem value="en">{t("settings.english")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}