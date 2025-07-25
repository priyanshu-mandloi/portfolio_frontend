"use client";

import React from "react";
import Typewriter from "typewriter-effect";
import { useTranslations } from "next-intl";

function Typing() {
  const t = useTranslations("typewriter");
  return (
    <Typewriter
      options={{
        strings: [t("dev"), t("se"), t("fd"), t("be")],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Typing;
