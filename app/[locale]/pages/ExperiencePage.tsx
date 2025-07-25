"use client";

import { JSX, useState } from "react";

import CertificatePage from "./CertificatePage";
import Image from "next/image";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const ExperiencePage: NextPage = () => {
  const t = useTranslations("experience");
  const [activeTab, setActiveTab] = useState<"experience" | "certificates">(
    "experience"
  );

  const details = t.raw("details") as {
    id: number;
    logo: string;
    company: string;
    position: string;
    duration: string;
    tasks: string[];
  }[];

  return (
    <section
      className="w-full py-10 bg-white text-black dark:bg-black dark:text-white"
      id="experience"
    >
      {/* Heading */}
      <div className="flex justify-center mb-8 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="dmSans text-4xl font-bold text-center"
        >
          {t("title")}
        </motion.h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-10 space-x-4">
        {["experience", "certificates"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 rounded-full border transition-all duration-300
              ${
                activeTab === tab
                  ? "bg-[#fbd9ad] text-[#b061df] dark:border-[#fbd9ad] border-black"
                  : "bg-transparent dark:border-[#fbd9ad] border-black dark:text-[#fbd9ad] text-black hover:bg-[#fbd9ad]/10"
              }`}
            style={{ fontFamily: "var(--primaryFont)" }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Experience Cards */}
      {activeTab === "experience" && (
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.map(
              (card, index): JSX.Element => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[rgba(142,70,186,0.1)] dark:bg-[rgba(142,70,186,0.2)] border border-gray-300 dark:border-gray-600 shadow-md rounded-2xl p-6 flex flex-col space-y-4"
                >
                  {/* Logo + Company Name */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 dark:border-[#fbd9ad] border-black">
                      <Image
                        src={card.logo}
                        alt={`${card.company} logo`}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <h2 className=" dmSans text-lg font-semibold dark:text-[#fbd9ad] text-black">
                      {card.company}
                    </h2>
                  </div>

                  {/* Position */}
                  <div>
                    <h3 className="text-md font-bold text-[#b061df]">
                      {card.position}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {card.duration}
                    </p>
                  </div>

                  {/* Tasks/Description */}
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {card.tasks.join(" ")}
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      )}

      {/* Certificates Section Placeholder */}
      {activeTab === "certificates" && (
        <div className="max-w-5xl mx-auto text-center mt-10 px-4 text-lg font-medium">
          {/* You can replace this with your <CertificateSection /> component */}
          <CertificatePage />
        </div>
      )}
    </section>
  );
};

export default ExperiencePage;
