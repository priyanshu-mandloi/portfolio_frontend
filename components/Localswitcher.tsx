import { Globe } from "lucide-react";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <LocaleSwitcherSelect defaultValue={locale} label="Select a locale" />
    </div>
  );
}
