"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import CopyButton, { SimpleCopyButton } from "./CopyButton";
import "./output.css";
import { useEffect } from "react";
import type { HistoryData } from "@/app/server-actions/chatFormAction";
import {
  oneLight,
  oneDark,
  atomDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import useTheme from "@/app/hooks/useTheme";

// EL markdow generado por gpt aun es muy dificil de interpretar con librerias comunes
// por lo que aun es necesario trabajar en el renderizado de markdown
// para asegurarse de que cubrimos todos los casos esto para formulas matematicas fisicas y quimicas

/* Prompt para probar el renderizado de markdown:
Genera todo tipo de formulas matematicas fisicas y quimicas en markdown, incluyendo formulas de integrales, derivadas, ecuaciones diferenciales, matrices de algebra lineal, series complejas, formulas de fisica como la ley de gravitación universal, formulas de quimica como la ecuacion de estado de los gases ideales, etc. Asegurate de incluir una gran variedad de formulas para probar el renderizado de markdown, esto con la finalidad de asegurar que el renderizado sea correcto y estético en el frontend.
 */

type Props = {
  content: string;
  historyData: HistoryData;
};

const MarkdownRenderer = ({ content, historyData }: Props) => {
  const { theme } = useTheme();

  useEffect(() => {
    const marginSpan = document.createElement("span");
    marginSpan.style.marginBottom = "1rem";
    document.querySelectorAll(".katex").forEach((block) => {
      block.insertAdjacentElement("afterend", marginSpan);
    });
  }, [content]);

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
                <CopyButton
                  language={match[1]}
                  content={String(children).replace(/\n$/, "")}
                />
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
      <SimpleCopyButton
        hoverContent="Copiar markdown"
        copiedContent="Markdown copiado!"
        content={content}
      />
    </div>
  );
};

export default MarkdownRenderer;
