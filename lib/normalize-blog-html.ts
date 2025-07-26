// lib/normalize-blog-html.ts - Simple approach

const langPatterns: Record<string, RegExp> = {
  javascript: /(?:function|const|let|var|=>|import|export|require)/i,
  typescript: /(?:interface|type|declare|enum|namespace|import.*from)/i,
  python: /(?:def |import |from |print|if __name__|class\s+\w+\s*:)/i,
  html: /<\/?[a-z][\s\S]*>/i,
  css: /{[\s\S]*}|@media|@import|@keyframes/i,
  java: /(?:public|private|protected|class|import java)/i,
  cpp: /#include|using namespace|std::|cout|cin|vector|int\s+main/i,
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

export function normalizeBlogHtml(html: string): string {
  if (!html) return "";

  // If this is legacy Quill HTML, leave it as-is
  if (html.includes("ql-syntax")) return html;

  // Simple approach: Just transform the structure, don't mess with content
  let processed = html;

  // 1) Handle <pre><code class="language-xyz">content</code></pre>
  processed = processed.replace(
    /<pre[^>]*>\s*<code[^>]*class="[^"]*language-([a-z0-9+#-]+)[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_match, lang: string, codeContent: string) => {
      const norm = normalizeLang(lang);
      // Don't modify the content at all - just change the wrapper
      return `<div class="code-block" data-language="${norm}"><pre><code>${codeContent}</code></pre></div>`;
    }
  );

  // 2) Handle bare <pre> blocks
  if (processed === html) {
    processed = processed.replace(
      /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
      (_match, content: string) => {
        // Try to detect language from the raw content
        const textContent = content.replace(/<[^>]*>/g, "");
        const lang = detectLanguageFromCode(textContent);
        return `<div class="code-block" data-language="${lang}"><pre><code>${content}</code></pre></div>`;
      }
    );
  }

  return processed;
}
