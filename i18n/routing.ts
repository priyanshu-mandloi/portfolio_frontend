import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "de"],

  // Used when no locale matches
  defaultLocale: "en",
  pathnames: {
    // "/home": {
    //   en: "/home",
    //   de: "/startseite",
    // },
    // "/about": {
    //   en: "/about",
    //   de: "/ueber-uns",
    // },
    // "/contact": {
    //   en: "/contact",
    //   de: "/kontakt",
    // },
    "/projects": {
      en: "/projects",
      de: "/projekte",
    },
    "/blogs": {
      en: "/blogs",
      de: "/blogs",
    },
    "/admin": {
      en: "/admin",
      de: "/admin",
    },
    "/profile": {
      en: "/profile",
      de: "/profile",
    },
  },
});
export type Locale = (typeof routing.locales)[number];
