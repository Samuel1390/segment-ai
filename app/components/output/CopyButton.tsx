"use client";
import useCopyClipboard from "@/app/hooks/useCopyClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function CopyButton({
  language,
  content,
  hoverContent,
  copiedContent,
}: {
  language: string;
  content: string;
  hoverContent?: string;
  copiedContent?: string;
}) {
  return (
    <div
      className="flex w-full p-2 justify-between bg-[#fafafa] dark:bg-[#0a0a0a]
                border-b-2 border-neutral-200 dark:border-neutral-600
                "
    >
      <span className="text-sm font-medium p-1">{language}</span>
      <SimpleCopyButton
        hoverContent={hoverContent}
        copiedContent={copiedContent}
        content={content}
      />
    </div>
  );
}

export const SimpleCopyButton = ({
  content,
  hoverContent = "Copiar al portapapeles",
  copiedContent = "¡Copiado!",
}: {
  content: string;
  hoverContent?: string;
  copiedContent?: string;
}) => {
  const { copied, copy } = useCopyClipboard();

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger>
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
      </HoverCardTrigger>
      <HoverCardContent className="w-fit" side="top">
        <p className="text-sm">{copied ? copiedContent : hoverContent}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CopyButton;
