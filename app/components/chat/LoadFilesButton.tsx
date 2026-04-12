import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Models } from "../../constants";
import getModelObj from "@/app/utils/getModelObj";
import { ModelHashes } from "../../constants";

function LoadFilesButton({
  files,
  modelObj,
  setFeedbackMessage,
  handleFilesChange,
  model,
}: {
  files: File[];
  modelObj: Models[number];
  setFeedbackMessage: (message: string) => void;
  handleFilesChange: (files: File[]) => void;
  model: ModelHashes;
}) {
  return (
    <>
      <input
        type="file"
        id="file-input"
        className="hidden"
        multiple
        disabled={files.length >= 3 || !getModelObj(model).supportsFiles}
        onChange={(e) => {
          if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const combinedFiles = [...files, ...newFiles];
            if (combinedFiles.length > 3) {
              setFeedbackMessage("Solo puedes subir hasta 3 archivos");
            }
            handleFilesChange(combinedFiles.slice(0, 3));
          }
          e.target.value = "";
        }}
      />
      <HoverCard>
        <HoverCardTrigger>
          <Button
            className="p-0"
            variant={"outline"}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("file-input")?.click();
            }}
          >
            <span
              className={cn(
                "p-2 flex h-full w-full items-center justify-center",
                files.length >= 3 || !modelObj.supportsFiles
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer",
              )}
              onClick={() => {
                if (!modelObj.supportsFiles) {
                  setFeedbackMessage(
                    "El modelo actual no soporta archivos, cambia de modelo para poder usar esta funcionalidad",
                  );
                } else if (files.length >= 3) {
                  setFeedbackMessage("Solo puedes subir hasta 3 archivos");
                }
              }}
            >
              <Paperclip />
            </span>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          Puedes subir hasta 3 archivos de texto con un tamaño máximo de 30mb
          cada uno.
        </HoverCardContent>
      </HoverCard>
    </>
  );
}
export default LoadFilesButton;
