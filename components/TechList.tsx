"use client";

import React, { useLayoutEffect, useRef } from "react";

import { Dot } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type TechItem = {
  tech_name: string;
  tech_color?: string;
};

type TechListProps = {
  title: string;
  items: TechItem[];
};

const TechList: React.FC<TechListProps> = ({ title, items }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          // pin: true,
          start: "top bottom",
          end: "bottom top",
          scrub: 4,
        },
      });

      tl.fromTo(
        ".tech-row",
        {
          x: (i: number) =>
            i % 2 === 0
              ? gsap.utils.random(600, 400)
              : gsap.utils.random(-600, -400),
        },
        {
          x: (i: number) =>
            i % 2 === 0
              ? gsap.utils.random(-600, -400)
              : gsap.utils.random(600, 400),
          ease: "power1.inOut",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className=" overflow-hidden mb-4">
      <div className="flex justify-center mb-10">
        <motion.h1
          id="about-heading"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="dmSans text-4xl font-bold text-center"
        >
          {title}
        </motion.h1>
      </div>

      {items.map(({ tech_color, tech_name }, index) => (
        <div
          key={index}
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700"
          aria-label={tech_name}
        >
          {Array.from({ length: 15 }, (_, i) => (
            <React.Fragment key={i}>
              <span
                className="text-6xl font-extrabold uppercase tracking-tighter"
                style={{
                  color: i === 7 && tech_color ? tech_color : "inherit",
                }}
              >
                {tech_name}
              </span>
              <span className="text-3xl">
                <Dot size={32} strokeWidth={3} />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </section>
  );
};

export default TechList;
