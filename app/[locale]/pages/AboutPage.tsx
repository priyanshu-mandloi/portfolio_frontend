"use client";

import { Download, Eye } from "lucide-react";

import { Button } from "../../../components/ui/button";
import Image from "next/image";
import type { NextPage } from "next";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const AboutPage: NextPage = () => {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="flex flex-col items-center lg:mt-4 xl:mt-4 w-full"
    >
      <div className="flex justify-center mb-4 mt-7">
        <motion.h1
          id="about-heading"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="dmSans text-4xl font-bold text-center"
        >
          {t("title")}
        </motion.h1>
      </div>

      <div className="flex flex-col xl:flex-row lg:flex-row items-center justify-between w-full max-w-6xl gap-8 mt-5">
        <div className="w-full xl:w-2/3 flex flex-col items-start justify-center">
          <article className="p-6 sm:p-8 md:p-10 w-full rounded-xl shadow-md transition-all">
            <p className="dmSans text-lg sm:text-1xl md:text-1xl lg:text-2xl font-medium leading-relaxed text-justify text-black dark:text-white tracking-wide">
              {t("t1")}{" "}
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {t("t2")}
              </span>{" "}
              {t("t3")}
            </p>

            <div className="mt-4 space-y-3 text-black dark:text-white text-base sm:text-lg md:text-xl">
              <p>⚡ {t("t4")}</p>
              <p>⚡ {t("t5")}</p>
              <p>⚡ {t("t6")}</p>
            </div>
          </article>

          <div className="flex flex-row items-center justify-around mt-6 w-full xl:gap-4 xl:w-1/2 lg:w-2/3 md:w-3/">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="flex items-center gap-2 px-6 py-3 text-sm sm:text-base"
              >
                <a href="/resume" aria-label="View Resume">
                  <Eye size={18} />
                  {t("viewResume")}
                </a>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="flex items-center gap-2 px-6 py-3 text-sm sm:text-base"
              >
                <a
                  href="https://drive.google.com/uc?export=download&id=1pEepRb9ZaNMR9I2PO8UXpBBWly0uukpZ"
                  download
                  aria-label="Download Resume"
                >
                  <Download size={18} />
                  {t("downloadResume")}
                </a>
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 3 }}
          whileHover={{ rotate: [0, 5, -5, 0], transition: { duration: 1.2 } }}
          className="w-64 h-64 relative rounded-2xl overflow-hidden shadow-xl -mt-2"
        >
          <Image
            src="/assets/pm1.JPG"
            alt="pm"
            fill
            className="object-cover brightness-100 dark:brightness-70"
            sizes="(max-width: 768px) 80vw, 33vw"
            priority
          />
        </motion.figure>
      </div>
    </section>
  );
};

export default AboutPage;
