"use client";

import { NextPage } from "next";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Skill {
  src: string;
  name: string;
}

const skills: Skill[] = [
  { src: "/assets/skills/react.svg", name: "React" },
  { src: "/assets/skills/express.svg", name: "Express.js" },
  { src: "/assets/skills/nodejs.svg", name: "Node.js" },
  { src: "/assets/skills/nextjs.svg", name: "Next.js" },
  { src: "/assets/skills/vite.svg", name: "Vite" },
  { src: "/assets/skills/ts.svg", name: "TypeScript" },
  { src: "/assets/skills/tailwind.svg", name: "Tailwind CSS" },
  { src: "/assets/skills/mongodb.svg", name: "MongoDB" },
  { src: "/assets/skills/mysql.svg", name: "MySQL" },
  { src: "/assets/skills/postgresql.svg", name: "PostgreSQL" },
  { src: "/assets/skills/js.svg", name: "JavaScript" },
  { src: "/assets/skills/c++.svg", name: "C++" },
  { src: "/assets/skills/java.svg", name: "Java" },
  { src: "/assets/skills/prisma-2.svg", name: "Prisma ORM" },
  { src: "/assets/skills/spring-boot.svg", name: "Spring Boot" },
  { src: "/assets/skills/scss.svg", name: "Scss" },
  { src: "/assets/skills/firebase.svg", name: "Firebase" },
  { src: "/assets/skills/jquery.svg", name: "JQuery" },
  { src: "/assets/skills/docker.svg", name: "Docker" },
  { src: "/assets/skills/github.svg", name: "Github" },
  { src: "/assets/skills/figma.svg", name: "Figma" },
];

const SkillsPage: NextPage = () => {
  const t = useTranslations("skills");
  return (
    <div
      id="skills"
      className="py-12 flex flex-col items-center justify-center bg-white dark:bg-black "
    >
      <div className="flex justify-center mb-14 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="dmSans text-4xl font-bold text-center"
        >
          {t("title")}
        </motion.h1>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-6xl px-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 rounded-xl hover:scale-110 transition-transform duration-300"
          >
            <img
              src={skill.src}
              alt={skill.name}
              className="h-10 md:h-14 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <p className="text-sm mt-2 text-center text-gray-700 dark:text-gray-200">
              {skill.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPage;
