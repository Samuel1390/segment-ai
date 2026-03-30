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
  const cleanedContent = preprocessContent(content); // leer comentario en preprocessContent

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

const preprocessContent = (content: string) => {
  /*
  Toda esta funcion esta generada por gemini,
  es necesario una revision para asegurar que no haya ningun error.
  Por los momentos muestra bien el marcado en el 90% de las ocasiones.
  */
  if (!content) return "";

  // 1. Convertir delimitadores de bloque \[ \] a $$ $$
  // y delimitadores de línea \( \) a $ $
  let processed = content
    .replace(/\\\[/g, "\n$$\n")
    .replace(/\\\]/g, "\n$$\n")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");

  // El paso 2 (Naked LaTeX) fue eliminado porque al detectar un símbolo como '_'
  // o '\int', envolvía la línea completa en $. Esto convertía el texto normal
  // (ej. "La derivada es \int...") en un bloque matemático entero borrando los espacios
  // y usando fuente itálica para toda la oración.

  // 3. Limpieza de artefactos (como las comas extra que mencionaste en x+1)
  processed = processed.replace(/,x\+1,/g, "x+1");
  // 4. Convertir fórmulas químicas a LaTeX
  processed = processed.replace(
    /(?<![\w\\])([A-Z][a-z]?\d+([A-Z][a-z]?\d*)*|(?<=\s)->(?=\s))/g,
    (match) => {
      // Si es una flecha -> la convertimos a flecha de reacción de LaTeX
      if (match === "->") return "$\\ce{->}$";
      // Si parece una fórmula química, la envolvemos en \ce
      return `$\\ce{${match}}$`;
    },
  );

  return processed;
};

export default MarkdownRenderer;
