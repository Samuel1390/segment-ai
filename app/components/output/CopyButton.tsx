"use client";
import useCopyClipboard from "@/app/hooks/useCopyClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";

function CopyButton({
  language,
  content,
}: {
  language: string;
  content: string;
}) {
  const { copied, copy } = useCopyClipboard();
  return (
    <div
      className="flex w-full p-2 justify-between bg-[#fafafa] dark:bg-[#0a0a0a]
                border-b-2 border-neutral-200 dark:border-neutral-600
                "
    >
      <span className="text-sm font-medium p-1">{language}</span>
      <button
        className={`transition-colors rounded-md cursor-pointer p-1
                ${copied ? "bg-emerald-400/35 hover:bg-emerald-400/35" : "hover:bg-neutral-200 dark:hover:bg-neutral-800"}
                `}
        onClick={() => copy(content)}
      >
        {copied ? (
          <CheckIcon color="var(--color-emerald-500)" size={18} />
        ) : (
          <CopyIcon size={18} />
        )}
      </button>
    </div>
  );
}
export default CopyButton;
