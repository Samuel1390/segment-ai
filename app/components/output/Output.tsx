"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Para soportar tablas y enlaces
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import useTheme from "@/app/hooks/useTheme";
import "./output.css";

const MarkdownRenderer = ({ content }: { content: string }) => {
  const { theme } = useTheme();
  return (
    <div className={`gemini-output ${theme === "dark" ? "dark" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Personaliza cómo se ve el código
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                className="rounded-lg text-sm sm:text-md"
                style={materialDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="rounded px-1" {...props}>
                {children}
              </code>
            );
          },
          // Personaliza los enlaces para que se abran en otra pestaña
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
export default MarkdownRenderer;
