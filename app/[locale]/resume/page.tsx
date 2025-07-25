"use client";

import { ArrowRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JSX } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ResumePage = (): JSX.Element => {
  const resumeFileId = "12KPwFfBpezKjNDReTgBPnSjdtyLzEtcm";

  const resumeDownloadLink = `https://drive.google.com/uc?export=download&id=${resumeFileId}`;
  const resumeEmbedLink = `https://drive.google.com/file/d/${resumeFileId}/preview`;

  return (
    <section className="flex flex-col items-center justify-center w-full px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6 text-center"
      >
        Resume
      </motion.h1>

      <div className="w-full max-w-4xl aspect-[8.5/11] mb-6 shadow-lg border-2 border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden">
        <iframe
          title="Priyanshu Mandloi Resume"
          src={resumeEmbedLink}
          width="100%"
          height="100%"
          allow="autoplay"
        />
      </div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button asChild className="flex items-center gap-2 px-6 py-3 text-base">
          <a href={resumeDownloadLink} download>
            <Download size={18} />
            Download Resume
          </a>
        </Button>
      </motion.div>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="w-full mt-10 flex justify-center sm:justify-end xl:justify-end px-4"
      >
        <Button
          asChild
          className="group flex items-center gap-2 px-6 py-3 rounded-full border   dark:border-[#fbd9ad] border-black dark:text-[#fbd9ad] text-black bg-transparent text-base sm:text-lg font-medium hover:bg-[#fbd9ad]/10 transition-all duration-300"
          style={{ fontFamily: "var(--primaryFont)" }}
        >
          <Link href="/">
            Back to home
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default ResumePage;
