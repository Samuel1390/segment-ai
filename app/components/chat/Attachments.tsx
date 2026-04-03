import React from "react";
import { cn } from "@/lib/utils";
import { FileIcon, X } from "lucide-react";

const Attachments = ({
  files,
  setForm,
  modelObj,
}: {
  files: File[];
  setForm: (form: any) => void;
  modelObj: any;
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2 w-full">
      {files.map((file, i) => (
        <div
          key={i}
          className={cn(
            `flex items-center gap-2 border`,
            ` rounded-md py-1 px-3 text-sm`,
            `${
              modelObj.supportsFiles
                ? "bg-green-400/30 border-green-400 text-green-700 dark:text-green-400"
                : "bg-red-400/30 text-red-700 dark:text-red-400 border-red-400"
            }`,
          )}
        >
          <FileIcon size={16} />
          <span className="truncate max-w-[120px]">{file.name}</span>
          <button
            type="button"
            className="text-neutral-500 hover:text-red-500 transition-colors"
            onClick={() =>
              setForm((prev: any) => ({
                ...prev,
                files: prev.files.filter(
                  (_: any, index: number) => index !== i,
                ),
              }))
            }
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Attachments;
