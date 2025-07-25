import cpp from "highlight.js/lib/languages/cpp";
import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import js from "highlight.js/lib/languages/javascript";
import jsonLang from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import ts from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml"; // html

export const lowlight = createLowlight();

lowlight.register("typescript", ts);
lowlight.register("javascript", js);
lowlight.register("cpp", cpp);
lowlight.register("python", python);
lowlight.register("html", xml);
lowlight.register("css", css);
lowlight.register("java", java);
lowlight.register("json", jsonLang);
lowlight.register("sql", sql);

export const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "plaintext", label: "Text" },
];
