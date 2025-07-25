"use client";

import { motion } from "framer-motion";

interface Platform {
  id: number;
  name: string;
  url: string;
  logo: string;
  size?: string;
}

const platforms: Platform[] = [
  {
    id: 1,
    name: "GeeksforGeeks",
    url: "https://auth.geeksforgeeks.org/user/priyanshumanrdwh/",
    logo: "/assets/rankings/gfg.png",
  },
  {
    id: 2,
    name: "LeetCode",
    url: "https://leetcode.com/priyanshumandloigurukul/",
    logo: "/assets/rankings/leetcode.png",
  },
  {
    id: 3,
    name: "Coding Ninjas",
    url: "https://www.codingninjas.com/studio/profile/633a0a3c-84b5-4477-885c-f72ac92746af",
    logo: "/assets/rankings/codingninja.png",
    size: "w-20 h-20",
  },
  {
    id: 4,
    name: "CodeChef",
    url: "https://www.codechef.com/users/aloft_lemurs",
    logo: "/assets/rankings/codechef.png",
    size: "w-20 h-20",
  },
  {
    id: 5,
    name: "Codeforces",
    url: "https://codeforces.com/profile/priyanshumandloi999",
    logo: "/assets/rankings/codeforces.png",
    size: "w-20 h-20",
  },
  {
    id: 6,
    name: "HackerRank",
    url: "https://www.hackerrank.com/profile/priyanshumandlo4",
    logo: "/assets/rankings/hackerrank.png",
  },
  {
    id: 7,
    name: "HackerEarth",
    url: "https://www.hackerearth.com/challenges/",
    logo: "/assets/rankings/hackerearth.png",
  },
];

export default function CodingProfilePage() {
  return (
    <section className="w-full py-10 bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {platforms.map(({ id, name, url, logo, size }) => (
            <motion.a
              key={id}
              href={url}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              className="group relative flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:shadow-lg transition-all overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-10"
              >
                {name}
              </motion.div>

              <div
                className={`bg-center bg-contain bg-no-repeat ${
                  size || "w-16 h-16"
                }`}
                style={{ backgroundImage: `url(${logo})` }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
