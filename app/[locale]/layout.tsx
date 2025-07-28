import "../[locale]/globals.css";

import { DM_Sans, Fahkwang, Inter, Oleo_Script, Teko } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";

import { AuthContextProvider } from "@/context/AuthContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { icons } from "lucide-react";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const teko = Teko({ variable: "--font-teko", subsets: ["latin"] });
const oleo = Oleo_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-oleo",
});
const fahkwang = Fahkwang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fahkwang",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Priyanshu Mandloi Portfolio",
  description: "Priyanshu Mandloi Portfolio",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${teko.variable} ${oleo.variable} ${fahkwang.variable} ${dmSans.variable} antialiased bg-white text-black dark:bg-black dark:text-white scroll-smooth`}
      >
        <NextIntlClientProvider locale={locale}>
          <AuthContextProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              // disableTransitionOnChange
            >
              <SpeedInsights />
              {children}
              <Toaster position="top-right" />
            </ThemeProvider>
          </AuthContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
