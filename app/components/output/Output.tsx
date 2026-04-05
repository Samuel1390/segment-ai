"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import CopyButton, { SimpleCopyButton } from "./CopyButton";
import getModelObj from "@/app/utils/getModelObj";
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
  console.log(
    "datos del historyData en el componente MarkdownRenderer: ",
    historyData,
  );
  const { model: modelHash } = historyData;
  const modelObj = getModelObj(modelHash);
  // Aplicamos la limpieza antes de pasarla al componente
  const preprocessedContent = preprocessContent(content);

  return (
    <div
      className={`model-output max-md:px-4 ${theme === "dark" ? "dark" : ""}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code(props) {
            const { children, className, node, ref, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");

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
              <code
                className="rounded bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 text-pink-500 font-mono text-sm"
                {...rest}
              >
                {children}
              </code>
            );
          },
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
        {preprocessedContent}
      </ReactMarkdown>
      {/* Footer de la respuesta del modelo | contiene informacion adicional */}
      <div className="mt-4 flex justify-between items-center gap-2 border-t-2 pt-3 dark:border-neutral-700 border-neutral-300">
        <div className="text-md text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
          Modelo: {modelObj?.icon && modelObj.icon} {modelObj.label}
        </div>
        <SimpleCopyButton
          hoverContent="Copiar markdown"
          copiedContent="Markdown copiado!"
          content={content}
        />
      </div>
    </div>
  );
};

// Importante: Esta funcion es generada con ia, es necesario probarla con una gran variedad de formulas para asegurarse de que el renderizado sea correcto y estético en el frontend, ademas de ir ajustandola segun se vayan encontrando casos que no rendericen correctamente, esto con la finalidad de asegurar que el renderizado de markdown sea lo mas robusto posible.
const preprocessContent = (content: string) => {
  if (!content) return "";

  return (
    content
      // 1. Normalizar bloques de visualización: \[ ... \] -> $$ ... $$
      // Usamos saltos de línea para asegurar que remark-math lo detecte como bloque
      .replace(/\\\[/g, "\n$$\n")
      .replace(/\\\]/g, "\n$$\n")

      // 2. Normalizar fórmulas en línea: \( ... \) -> $ ... $
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$")

      // 3. Limpiar espacios innecesarios que rompen KaTeX
      // Algunos modelos envían "$ x + y $", pero remark-math prefiere "$x + y$"
      .replace(/\$\s+/g, "$")
      .replace(/\s+\$/g, "$")

      // 4. Protección contra triples dólares accidentales ($$$)
      .replace(/\${3,}/g, "$$")
  );
};

export default MarkdownRenderer;
