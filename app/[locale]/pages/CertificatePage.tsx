"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { useState } from "react";

const certificates = [
  {
    id: 1,
    title: "Packaged App Developer",
    issuer: "Accenture",
    image: "/assets/certificates/accenture.png",
  },
  {
    id: 2,
    title: "Dashboard Development",
    issuer: "IET DAVV Exam Department",
    image: "/assets/certificates/IET_DAVV_EXAM_DEPARATMENT.jpg",
  },
  {
    id: 3,
    title: "OOPS",
    issuer: "Code Studio",
    image: "/assets/certificates/oops.png",
  },
  {
    id: 4,
    title: "Data structure and algorithm",
    issuer: "GFG",
    image: "/assets/certificates/gfg.jpg",
  },
  {
    id: 5,
    title: "500+ Days of LeetCode",
    issuer: "LeetCode",
    image: "/assets/certificates/leetcode.png",
  },
  {
    id: 6,
    title: "SQL Badge",
    issuer: "LeetCode",
    image: "/assets/certificates/SQL.png",
  },
  {
    id: 7,
    title: "Graduation Ceremony Volunter",
    issuer: "IET DAVV",
    image: "/assets/certificates/graud.jpg",
  },
  {
    id: 8,
    title: "Participation in Invento",
    issuer: "Invento",
    image: "/assets/certificates/invento.png",
  },
];

const CertificatePage: NextPage = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const next = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % certificates.length);
    }
  };

  const prev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        (selectedIndex - 1 + certificates.length) % certificates.length
      );
    }
  };

  return (
    <section
      className="w-full py-10 bg-white text-black dark:bg-black dark:text-white"
      id="certificates"
    >
      <div className="max-w-5xl mx-auto flex justify-center items-center relative px-4">
        <div className="flex justify-center w-full max-w-md">
          {selectedIndex === null ? (
            <div className="text-center text-gray-500">
              Click a card to open
            </div>
          ) : (
            <Dialog
              open={selectedIndex !== null}
              onOpenChange={() => setSelectedIndex(null)}
            >
              <DialogContent className="max-w-3xl w-full">
                <DialogTitle className="sr-only">
                  Certificate Details
                </DialogTitle>

                <Image
                  src={certificates[selectedIndex].image}
                  alt={certificates[selectedIndex].title}
                  width={1000}
                  height={800}
                  className="object-contain w-full h-full rounded-md"
                />
                <p className="text-center mt-4 font-semibold text-[#b061df]">
                  {certificates[selectedIndex].title} –{" "}
                  {certificates[selectedIndex].issuer}
                </p>

                <div className="absolute top-2 right-2 text-black dark:text-white cursor-pointer">
                  <X onClick={() => setSelectedIndex(null)} />
                </div>

                <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                  <button
                    onClick={prev}
                    className="text-black dark:text-white px-4 py-2"
                  >
                    <ChevronLeft size={24} />
                  </button>
                </div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                  <button
                    onClick={next}
                    className="text-black dark:text-white px-4 py-2"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* <button
          onClick={next}
          className="absolute right-0 z-10 bg-gray-200 dark:bg-zinc-700 rounded-full p-2"
        >
          <ChevronRight />
        </button> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 px-4 max-w-6xl mx-auto">
        {certificates.map((cert, index) => (
          <div
            key={cert.id}
            onClick={() => setSelectedIndex(index)}
            className="cursor-pointer bg-[rgba(142,70,186,0.1)] dark:bg-[rgba(142,70,186,0.2)] border border-gray-300 dark:border-gray-600 shadow-md rounded-xl overflow-hidden hover:scale-[1.02] transition-all"
          >
            <div className="relative w-full h-52">
              <Image
                src={cert.image}
                alt={cert.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-xl"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#b061df]">
                {cert.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {cert.issuer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertificatePage;
