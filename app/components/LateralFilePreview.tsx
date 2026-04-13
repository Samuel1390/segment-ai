"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CopyButton from "./messages/output/CopyButton";
import Image from "next/image";
import getFileInfo from "../utils/getFileInfo";
import {
  atomDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import useTheme from "../hooks/useTheme";
import { useState, useEffect } from "react";
import useFilePreview from "../hooks/useFilePreview";
import { X } from "lucide-react";
import type { FileInfo } from "../utils/getFileInfo";

const LateralFilePreview = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const { file, isLateralFilePreviewOpen, setIsLateralFilePreviewOpen } =
    useFilePreview();
  const { theme } = useTheme();

  useEffect(() => {
    if (file) {
      file.text().then((content) => setFileContent(content));
      getFileInfo(file.name).then((info) => {
        setFileInfo(info);
      });
    }
  }, [file]);

  return (
    <article
      hidden={!file || !isLateralFilePreviewOpen}
      className={`lateral-file-preview absolute inset-0 z-[60] bg-white dark:bg-black p-4 flex flex-col gap-2 
                  h-screen pt-16
                  md:sticky md:top-0 md:self-start md:z-auto md:w-full md:max-w-[400px] md:h-screen
                  md:pt-16 md:bg-transparent md:dark:bg-transparent md:p-0 md:pr-4`}
    >
      <div className="flex w-full justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md shrink-0 border border-gray-200 dark:border-gray-700">
        <span className="font-semibold text-sm flex items-center gap-2 truncate mr-2">
          {file?.name}
          {fileInfo?.icon && (
            <Image
              src={`/icons/${fileInfo?.icon}.svg`}
              alt={`Icono de ${fileInfo?.icon}`}
              width={20}
              height={20}
            />
          )}
        </span>
        <button
          onClick={() => setIsLateralFilePreviewOpen(false)}
          className="p-1 shrink-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          aria-label="Cerrar archivo"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 h-full dark:bg-black overflow-y-auto pb-4">
        {fileContent !== null ? (
          fileInfo?.isMarkdown ? (
            <div className="prose dark:prose-invert max-w-none text-sm p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {fileContent}
              </ReactMarkdown>
            </div>
          ) : fileInfo?.isCode ? (
            <SyntaxHighlighter
              style={theme === "dark" ? atomDark : oneLight}
              language={fileInfo?.language?.name?.toLowerCase() || "text"}
              PreTag="div"
              customStyle={{
                margin: 0,
                fontSize: "0.875rem",
                backgroundColor: theme === "dark" ? "#0a0a0a" : "#f9fafb",
                borderRadius: "0.5rem",
                height: "100%",
              }}
            >
              {fileContent.replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg text-sm whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200">
              {fileContent}
            </div>
          )
        ) : (
          file && (
            <p className="text-center w-fit text-sm text-gray-500 dark:text-gray-400">
              Cargando el archivo {file.name}...
            </p>
          )
        )}
      </div>
    </article>
  );
};

export default LateralFilePreview;
