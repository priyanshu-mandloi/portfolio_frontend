"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { FC } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./Localswitcher";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

type NavItem = {
  href: string;
  label: string;
};

const Navbar: FC = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t = useTranslations("navbar");

  const navItems: NavItem[] = [
    { href: "/", label: t("home") },
    { href: "#about", label: t("about") },
    { href: "#project", label: t("project") },
    { href: "/blogs", label: t("blogs") },
    { href: "#contact", label: t("contact") },
  ];

  useEffect(() => {
    setIsMounted(true);
    const toggleBackground = (): void => {
      const header = document.querySelector("header");
      if (!header) return;

      if (window.scrollY > 20) {
        header.classList.add("bg-white/10", "backdrop-blur-lg");
      } else {
        header.classList.remove("bg-white/10", "backdrop-blur-lg");
      }
    };
    window.addEventListener("scroll", toggleBackground);
    return () => window.removeEventListener("scroll", toggleBackground);
  }, []);

  const toggleMenu = (): void => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="w-full z-50 bg-transparent fixed top-0 left-0">
      <nav
        className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="relative h-16 w-28 flex-shrink-0">
          {isMounted && (
            <Image
              src={
                theme === "dark" ? "/assets/logo_light.png" : "/assets/logo.png"
              }
              alt="Website Logo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 112px"
              priority
            />
          )}
        </div>

        <ul className="hidden md:flex space-x-8 font-oleo text-xl">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link href={href as any} className="relative group inline-block">
                <span className="transition-colors duration-500 group-hover:text-purple-400">
                  {label}
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-purple-700 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 md:gap-6">
          <LocaleSwitcher />
          <ModeToggle />
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {isOpen && (
        <nav
          className="md:hidden absolute top-[72px] left-0 right-0 bg-white/10 backdrop-blur-lg dark:text-white text-black shadow-lg rounded-b-lg p-6"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-4 font-oleo text-lg">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <Link href={href as any} onClick={toggleMenu}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
