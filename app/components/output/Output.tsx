"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import CopyButton from "./CopyButton";
import "./output.css";

import {
  oneLight,
  oneDark,
  atomDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import useTheme from "@/app/hooks/useTheme";

const MarkdownRenderer = ({ content }: { content: string }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`model-output max-md:px-4 ${theme === "dark" ? "dark" : ""}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Cambiamos la lógica del componente 'code'
          code(props) {
            const { children, className, node, ref, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");

            // Si tiene lenguaje definido, es un bloque de código
            return match ? (
              <div className="my-4 overflow-hidden rounded-lg ">
                <CopyButton content={String(children).replace(/\n$/, "")} />
                <SyntaxHighlighter
                  {...rest}
                  style={theme === "dark" ? atomDark : oneLight}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    fontSize: "0.875rem",
                    backgroundColor: theme === "dark" ? "#0a0a0a" : "#f9fafb",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              // Código en línea (inline code)
              <code
                className="rounded bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 text-pink-500 font-mono text-sm"
                {...rest}
              >
                {children}
              </code>
            );
          },
          // Enlaces mejorados
          a: ({ ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 underline transition-colors"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
// este codigo fue generado por gemini, aun es necesario revisar que este correcto
const preprocessContent = (content: string) => {
  if (!content) return "";

  // 1. Convertir delimitadores de bloque \[ \] a $$ $$
  // y delimitadores de línea \( \) a $ $
  let processed = content
    .replace(/\\\[/g, "\n$$\n")
    .replace(/\\\]/g, "\n$$\n")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");

  // 2. Detectar "Naked LaTeX": Busca líneas que tengan comandos matemáticos
  // pero que no tengan dólares.
  const lines = processed.split("\n");
  processed = lines
    .map((line) => {
      // Si la línea tiene comandos típicos pero no tiene $
      const hasMathCommand =
        /\\int|\\frac|\\sum|\\sqrt|\\alpha|\\beta|\\gamma|\\infty|\\theta|\\pi|\\cdot|\\times|\\partial/.test(
          line,
        );
      const hasSubscript = /_{?\d+}?|\^{?\d+}?/.test(line); // Detecta I_{2} o x^{2}
      const alreadyHasDollars = line.includes("$");

      if ((hasMathCommand || hasSubscript) && !alreadyHasDollars) {
        // Envolvemos la línea entera o el fragmento detectado
        return `$${line.trim()}$`;
      }
      return line;
    })
    .join("\n");

  // 3. Limpieza de artefactos (como las comas extra que mencionaste en x+1)
  processed = processed.replace(/,x\+1,/g, "x+1");

  return processed;
};

export default MarkdownRenderer;
