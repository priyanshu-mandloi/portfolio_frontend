"use client";

import "react-vertical-timeline-component/style.min.css";

import { GraduationCap, Star } from "lucide-react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * ‣ Fonts used across the app (already imported in _app.tsx / layout)
 *   – DM Sans (body / headings)
 *   – Teko (accent headings)
 *   – Inter / Fahkwang / Oleo Script (available)
 *
 * This component applies a **glass‑morphism** card style that adapts to
 * both light and dark themes via Tailwind utility classes.
 */

type EducationItem = {
  date: string;
  title: string;
  subtitle: string;
  description: string;
};

const instituteLinks: Record<string, string> = {
  Gurukul: "https://gurukulschool.org/",
  Sanskar: "https://www.sanskaarthikri.com/",
  IET: "https://www.ietdavv.edu.in/",
};

const getLogo = (subtitle: string): string | null => {
  if (subtitle.includes("Gurukul")) return "/assets/institute/gurukul-logo.png";
  if (subtitle.includes("Sanskar")) return "/assets/institute/sanskar.png";
  if (subtitle.includes("IET")) return "/assets/institute/iet.png";
  return null;
};

const getInstituteLink = (subtitle: string): string => {
  if (subtitle.includes("Gurukul")) return instituteLinks.Gurukul;
  if (subtitle.includes("Sanskar")) return instituteLinks.Sanskar;
  if (subtitle.includes("IET")) return instituteLinks.IET;
  return "#";
};

const EducationPage: NextPage = () => {
  const t = useTranslations("education");
  const educationDetails = t.raw("details") as EducationItem[];

  return (
    <section id="education" className="py-10 mt-10">
      {/* Section heading */}
      <div className="flex justify-center mt-2 mb-14">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="dmSans text-4xl sm:text-5xl font-bold text-center"
        >
          {t("title")}
        </motion.h1>
      </div>

      {/* Vertical timeline */}
      <VerticalTimeline lineColor="#4E1670">
        {educationDetails.map((item, index) => {
          const logo = getLogo(item.subtitle);
          const link = getInstituteLink(item.subtitle);

          return (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--education"
              // Transparent card so Tailwind classes can style background
              contentStyle={{ background: "transparent", boxShadow: "none" }}
              contentArrowStyle={{ borderRight: "7px solid #888" }}
              iconStyle={{ background: "rgb(78 22 112)", color: "#fbd9ad" }}
              icon={<GraduationCap size={24} />}
            >
              {/* Card container with glass effect */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative group backdrop-blur-md bg-white/40 dark:bg-white/10 border border-transparent dark:border-transparent rounded-2xl p-5 overflow-hidden"
              >
                <span className="absolute inset-0 rounded-2xl border-animation z-10 pointer-events-none" />

                <h3 className="dmSans text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 relative z-20">
                  {item.title}
                </h3>

                <div className="flex items-center gap-3 my-2 relative z-20">
                  {logo && (
                    <Link
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Image
                        src={logo}
                        alt={item.subtitle}
                        width={48}
                        height={48}
                        className="rounded-full border border-white/40 dark:border-white/20 hover:scale-110 transition-transform"
                      />
                    </Link>
                  )}
                  <h4 className="teko text-lg font-semibold tracking-wider text-gray-800 dark:text-gray-200">
                    {item.subtitle}
                  </h4>
                </div>

                <p className="dmSans text-sm leading-relaxed text-gray-700 dark:text-gray-300 relative z-20">
                  {item.description}
                </p>

                <span className="dmSans block mt-4 text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 relative z-20">
                  {item.date}
                </span>
              </motion.div>
            </VerticalTimelineElement>
          );
        })}

        {/* terminal star element */}
        <VerticalTimelineElement
          iconStyle={{ background: "#fbd9ad", color: "rgb(78 22 112)" }}
          icon={<Star size={24} />}
        />
      </VerticalTimeline>
    </section>
  );
};

export default EducationPage;
