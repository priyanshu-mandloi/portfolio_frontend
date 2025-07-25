// lib/normalize-blog-html.ts

// Lightweight language heuristics (fallback when no language-* class found)
const langPatterns: Record<string, RegExp> = {
  javascript: /(?:function|const|let|var|=>|import|export|require)/i,
  typescript: /(?:interface|type|declare|enum|namespace|import.*from)/i,
  python: /(?:def |import |from |print|if __name__|class\s+\w+\s*:)/i,
  html: /<\/?[a-z][\s\S]*>/i,
  css: /{[\s\S]*}|@media|@import|@keyframes/i,
  java: /(?:public|private|protected|class|import java)/i,
  cpp: /#include|using namespace|std::|cout|cin/i,
  json: /^\s*[\[{]/,
  sql: /(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN)/i,
};

function detectLanguageFromCode(code: string): string {
  for (const [lang, re] of Object.entries(langPatterns)) {
    if (re.test(code)) return lang;
  }
  return "plaintext";
}

function normalizeLang(raw: string): string {
  const l = raw.toLowerCase();
  if (l === "xml" || l === "html+xml") return "html";
  if (l === "c++" || l === "cpp") return "cpp";
  if (l === "js") return "javascript";
  if (l === "ts") return "typescript";
  if (l === "text" || l === "plain" || l === "plaintext") return "plaintext";
  return l;
}

function stripTags(txt: string): string {
  return txt.replace(/<[^>]*>/g, "");
}

function escapeHtml(txt: string): string {
  return txt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function normalizeBlogHtml(html: string): string {
  if (!html) return "";

  // If this is legacy Quill HTML, leave it as-is; your existing preview CSS handles it.
  if (html.includes("ql-syntax")) return html;

  // 1) Convert Tiptap/lowlight <pre><code class="language-xyz">...</code></pre>
  // capture language & code body
  const withConvertedCode = html.replace(
    /<pre[^>]*>\s*<code[^>]*class="[^"]*language-([a-z0-9+#-]+)[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_match, lang: string, codeInner: string) => {
      const norm = normalizeLang(lang);
      const stripped = stripTags(codeInner);
      return `<pre class="code-block" data-language="${norm}">${escapeHtml(
        stripped
      )}</pre>`;
    }
  );

  // If at least one language-coded block matched above, we’re done.
  if (withConvertedCode !== html) return withConvertedCode;

  // 2) Fallback: convert bare <pre> blocks (no <code>) and try to detect language heuristically.
  const fallbackConverted = withConvertedCode.replace(
    /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
    (_match, inner: string) => {
      const stripped = stripTags(inner);
      const lang = detectLanguageFromCode(stripped);
      return `<pre class="code-block" data-language="${lang}">${escapeHtml(
        stripped
      )}</pre>`;
    }
  );

  return fallbackConverted;
}
