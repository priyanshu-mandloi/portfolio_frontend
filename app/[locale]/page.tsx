"use client";

import { CircleUser, Github, Instagram, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";

import AboutPage from "@/app/[locale]/pages/AboutPage";
import { Button } from "@/components/ui/button";
import ContactPage from "@/app/[locale]/pages/ContactPage";
import EducationPage from "@/app/[locale]/pages/EducationPage";
import ExperiencePage from "@/app/[locale]/pages/ExperiencePage";
import Footer from "@/components/Footer";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import type { NextPage } from "next";
import ProjectPage from "@/app/[locale]/pages/ProjectPage";
import { Shapes } from "@/components/Shapes";
import SkillsPage from "@/app/[locale]/pages/SkillsPage";
import TechList from "@/components/TechList";
import Typing from "@/components/Typing";
import gsap from "gsap";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const Home: NextPage = () => {
  const t = useTranslations("home");
  const { theme, resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  useEffect(() => {
    setCurrentTheme(
      theme === "system" ? resolvedTheme ?? "light" : theme ?? "light"
    );
  }, [theme, resolvedTheme]);

  const iconColor: string = currentTheme === "dark" ? "#e5e7eb" : "#000";
  useEffect(() => {
    gsap.to(":root", {
      "--asideColor": "#0ae448",
      "--iconBorderColor": "#ff4d4d",
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <main className="w-full">
      <aside
        aria-label="Social Media Links"
        className="aside-animated fixed right-4 top-1/2 -translate-y-1/2 bg-transparent backdrop-blur-sm rounded-xl px-2 z-10 flex flex-col items-center justify-around min-h-[160px] min-w-[60px] w-fit max-w-[90vw] sm:max-w-[70px]"
      >
        <Link
          href="https://github.com/priyanshu-mandloi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="icon-animated p-3 my-2 rounded-full hover:scale-110 hover:border-neutral-200 transition-all">
            <Github color={iconColor} aria-label="GitHub" />
          </div>
        </Link>

        <Link
          href="https://www.linkedin.com/in/priyanshu-mandloi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="icon-animated p-3 my-2 rounded-full hover:scale-110 hover:border-neutral-200 transition-all">
            <Linkedin color={iconColor} aria-label="LinkedIn" />
          </div>
        </Link>

        <Link
          href="https://www.instagram.com/priyanshu_mandloi_pm/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="icon-animated p-3 my-2 rounded-full hover:scale-110 hover:border-neutral-200 transition-all">
            <Instagram color={iconColor} aria-label="Instagram" />
          </div>
        </Link>
      </aside>

      <div className=" w-full min-h-screen bg-cover bg-center flex flex-col">
        <Navbar />
        <section
          className="flex flex-col md:flex-row w-full justify-around items-center px-4 sm:px-6 md:px-10 lg:px-16 gap-10 xl:mt-10 md:mt-40 lg:mt-40 mt-30 mb-20"
          aria-label="Hero Section"
        >
          <article className="flex flex-col justify-center items-center md:items-start space-y-6 text-center md:text-left max-w-xl">
            <div className="fahkwang font-bold text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-5xl leading-tight">
              <h1>
                {t("greeting")}{" "}
                <span className="wave" role="img" aria-label="waving hand">
                  👋🏻
                </span>
              </h1>
              <h1>{t("introduction")}</h1>
              <Typing />
            </div>
            <div className="text-[22px] sm:text-[24px] md:text-[28px] lg:text-[30px] xl:text-[20px] leading-snug font-dmSans">
              <p>{t("description")}</p>
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="flex items-center gap-3 px-8 py-4 text-sm sm:text-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              >
                <Link href="#contact" aria-label="Hire Me">
                  {t("hireMe")} <CircleUser absoluteStrokeWidth size={36} />
                </Link>
              </Button>
            </motion.div>
          </article>

          <div
            className="flex justify-center items-center max-w-[400px] w-full z-0 fill"
            role="img"
            aria-label="3D Model Placeholder"
          >
            <Shapes />
          </div>
        </section>

        <TechList
          title={t("used_title")}
          items={[
            { tech_name: "Next", tech_color: "#FF0000" },
            { tech_name: "TypeScript", tech_color: "#3178C6" },
            { tech_name: "Node", tech_color: "#3C873A" },
          ]}
        />
        {/* <section
          className="w-full mx-auto space-y-20 "
          aria-label="Content Sections "
        > */}
        <AboutPage />
        <EducationPage />
        <ExperiencePage />
        <ProjectPage />
        <SkillsPage />
        <ContactPage />
        {/* </section> */}

        <footer>
          <Footer />
        </footer>
      </div>
    </main>
  );
};

export default Home;
