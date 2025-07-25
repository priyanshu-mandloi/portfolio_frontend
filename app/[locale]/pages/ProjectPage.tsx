"use client";

import { ArrowRight, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { JSX } from "react";
import Link from "next/link";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type Project = {
  id: number;
  name: string;
  description: string;
  technologies: string;
  image: string;
  link: string;
};

const ProjectPage: NextPage = () => {
  const t = useTranslations("project");
  const details = t.raw("details") as Project[];

  return (
    <section
      className="w-full py-10 bg-white text-black dark:bg-black dark:text-white"
      id="project"
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

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {details.slice(0, 3).map(
            (card, index): JSX.Element => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative w-full h-[420px] rounded-xl shadow-md border p-6 flex flex-col items-center justify-center overflow-hidden group
              bg-[rgba(142,70,186,0.15)] dark:bg-[rgba(142,70,186,0.35)] border-gray-300 dark:border-gray-600"
              >
                <h1 className="text-lg font-semibold dark:text-[#fbd9ad] text-black">
                  {card.name}
                </h1>

                <div className="flex items-center justify-between w-full h-full">
                  <div className="transition-opacity duration-700 delay-300 group-hover:opacity-0 relative w-full min-h-60 rounded-md overflow-hidden">
                    <Image
                      src={card.image}
                      alt={`${card.name} image`}
                      fill
                      className="object-fill rounded-md"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>

                <Link
                  href={card.link}
                  target="_blank"
                  className="absolute bottom-4 left-4 text-[#cb1ccb] text-xl hover:scale-110 transition-transform duration-300"
                >
                  <ExternalLink aria-label="External Link" />
                </Link>

                <p
                  className="absolute left-0 top-6 translate-x-[-110%] translate-y-[40%] group-hover:translate-x-[-2%] transition-transform duration-700 ease-in-out w-[95%] h-[200px]
                bg-[#fbd9ad] text-[#b061df] font-semibold rounded-r-2xl px-4 py-3 text-sm leading-tight flex items-center justify-center text-center"
                >
                  {card.description}
                </p>

                <div
                  className="absolute bottom-5 right-0 translate-x-full group-hover:translate-x-0 transition-transform duration-500 delay-300 
                bg-[#fbd9ad] text-[#b061df] text-xs font-semibold px-4 py-2 rounded-l-xl w-[140px] text-center"
                >
                  {card.technologies}
                </div>
              </motion.div>
            )
          )}
        </div>

        {/* View All Button */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="w-full mt-10 flex justify-center sm:justify-end xl:justify-end px-4"
        >
          <Button
            asChild
            className="group flex items-center gap-2 px-6 py-3 rounded-full border   dark:border-[#fbd9ad] border-black dark:text-[#fbd9ad] text-black bg-transparent text-base sm:text-lg font-medium hover:bg-[#fbd9ad]/10 transition-all duration-300"
            style={{ fontFamily: "var(--primaryFont)" }}
          >
            <Link href="/projects">
              View All
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectPage;
