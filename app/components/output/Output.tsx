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

type Props = {
  content: string;
};

const MarkdownRenderer = ({ content }: Props) => {
  const { theme } = useTheme();
  const processedContent = preprocessContent(content);
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
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
// este codigo fue generado por gemini, aun es necesario revisar que este correcto
const preprocessContent = (content: string) => {
  if (!content) return "";

  return (
    content
      // 1. Eliminar líneas que solo contienen "$" (los dólares huérfanos de GPT)
      .split("\n")
      .filter((line) => line.trim() !== "$")
      .join("\n")
      // 2. Normalizar delimitadores que los modelos ignoran
      .replace(/\\\[/g, "\n$$\n")
      .replace(/\\\]/g, "\n$$\n")
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$")
      // 3. Limpiar espacios extra dentro de bloques matemáticos
      .replace(/\$\$\s+/g, "$$")
      .replace(/\s+\$\$/g, "$$")
  );
};

export default MarkdownRenderer;
