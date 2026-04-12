"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { FileIcon, X } from "lucide-react";
import useFilePreview from "@/app/hooks/useFilePreview";
import { getIcon } from "omni-file";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Attachments = ({
  files,
  setForm,
  modelObj,
}: {
  files: File[];
  setForm: (form: any) => void;
  modelObj: any;
}) => {
  const {
    file: currentFileOnPreview,
    setFile,
    isLateralFilePreviewOpen,
    setIsLateralFilePreviewOpen,
    setFilesOnForm,
  } = useFilePreview();

  useEffect(() => {
    setFilesOnForm(files);
  }, [files]);

  const handleFileClick = (file: File) => {
    setFile(file);
    if (currentFileOnPreview === file && isLateralFilePreviewOpen) {
      setIsLateralFilePreviewOpen(false);
    } else {
      setIsLateralFilePreviewOpen(true);
    }
  };
  return (
    <div className="flex flex-wrap gap-2 mb-2 w-full">
      {files.map((file, i) => (
        <HoverCard key={`${file.name}-${i}`}>
          <HoverCardTrigger>
            <div
              onClick={() => handleFileClick(file)}
              className={cn(
                `flex items-center gap-2 font-semibold border hover:cursor-pointer`,
                ` rounded-md py-1 px-3 text-sm`,
                `${
                  modelObj.supportsFiles
                    ? "bg-green-900/60 border-green-400 text-green-400 dark:text-green-400"
                    : "bg-red-950/60 border-red-400 text-red-400 dark:text-red-400"
                }`,
              )}
            >
              <Image
                src={`/icons/${getIcon(file.name)}.svg`}
                alt={file.name}
                width={16}
                height={16}
              />
              <span className=" truncate max-w-[120px]">{file.name}</span>
              <button
                type="button"
                className="text-neutral-500 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setForm((prev: any) => {
                    const filesFiltered = prev.files.filter(
                      (_: any, index: number) => index !== i,
                    );
                    const fileToRemove = prev.files[i];
                    if (fileToRemove === currentFileOnPreview) {
                      setFile(null);
                    }
                    return {
                      ...prev,
                      files: filesFiltered,
                    };
                  });
                }}
              >
                <X size={16} />
              </button>
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <span>Ver contenido de {file.name}</span>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};

export default Attachments;
