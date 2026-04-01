import React, { RefObject } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Settings2, X, FileText } from "lucide-react";
import Microphone from "../Microphone";
import { MODELS } from "../../constants";
import type { Models } from "../../types";
import { ModelHashes } from "../../constants";
import usePreventSelectScroll from "../../hooks/usePreventSelectScroll";
import { Button } from "@/components/ui/button";
import type { HistoryData } from "../../server-actions/chatFormAction";

type ChatInputFormProps = {
  formRef: RefObject<HTMLFormElement | null>;
  action: (payload: FormData) => void;
  handleSubmit: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  prompt: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  historyString: string;
  model: ModelHashes;
  setModel: (model: ModelHashes) => void;
  isPending: boolean;
  sendIsAllowed: boolean;
  recorder: any;
  feedbackMessage?: string;
  setFeedbackMessage: (message: string) => void;
  files: File[];
  handleFilesChange: (files: File[]) => void;
  historyData: HistoryData[];
};

export default function ChatInputForm({
  formRef,
  action,
  handleSubmit,
  handleKeyDown,
  prompt,
  handleChange,
  historyString,
  model,
  setModel,
  isPending,
  setFeedbackMessage,
  sendIsAllowed,
  recorder,
  handleFilesChange,
  feedbackMessage,
  files,
  historyData,
}: ChatInputFormProps) {
  usePreventSelectScroll();

  const handleAction = (formData: FormData) => {
    files.forEach((file) => formData.append("files", file));
    action(formData);
    handleFilesChange([]);
  };

  return (
    <form
      ref={formRef as any}
      onSubmit={handleSubmit}
      className={cn(
        "w-full shadow-[0_-10px_40px_#fff] dark:shadow-[0_-10px_40px_#000]",
        "max-w-[780px] rounded-lg",
        "left-1/2 -translate-x-1/2 bg-neutral-50 dark:bg-neutral-900 fixed",
        "z-50 bottom-0 px-4 lg:px-7",
      )}
      action={handleAction}
    >
      {feedbackMessage && (
        <p className="text-amber-600 dark:text-amber-400 text-sm absolute -top-6">
          {feedbackMessage}
        </p>
      )}
      {files.length > 0 && (
        <div className="absolute -top-13 flex flex-wrap gap-2 mb-2 w-full">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-800 rounded-md py-1 px-3 text-sm"
            >
              <FileText size={16} />
              <span className="truncate max-w-[120px]">{file.name}</span>
              <button
                type="button"
                className="text-neutral-500 hover:text-red-500 transition-colors"
                onClick={() =>
                  handleFilesChange(files.filter((_, index) => index !== i))
                }
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <Textarea
        value={prompt}
        onChange={handleChange}
        name={"prompt"}
        className="w-full text-sm sm:text-md md:text-[1rem] min-h-20 max-h-30 overflow-y-auto"
        onKeyDown={handleKeyDown}
        placeholder="Pregunta a Segment"
      />
      <input
        className="hidden"
        name="history"
        onChange={() => {}} /* Funcion vacia para que next.js no se queje */
        value={historyString}
      />
      <input
        hidden
        name="historyData"
        onChange={() => {}} /* Lo mismo aca */
        value={JSON.stringify(historyData)}
      />
      <div className="flex items-center justify-between py-7 px-1 w-full h-7">
        <div className="flex items-center gap-2">
          <Select
            name="model"
            onValueChange={(value) => setModel(value as ModelHashes)}
            value={model}
          >
            <SelectTrigger className="hover:cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200">
              <SelectValue
                placeholder={
                  <div className="flex items-center gap-2">
                    <Settings2 /> Modelo
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent
              onMouseDown={(e) => e.preventDefault()}
              className="-top-10 popper"
            >
              <SelectGroup>
                {MODELS.map((mdl) => {
                  return (
                    <SelectItem
                      key={`${mdl.modelHash}-${mdl.label}`}
                      value={mdl.modelHash}
                      className="hover:cursor-pointer"
                      description={mdl.description}
                    >
                      <div className="flex items-center gap-2">
                        {mdl?.icon &&
                          React.cloneElement(mdl.icon, {
                            key: `${mdl.modelHash}-icon`,
                          })}
                        {mdl.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <input
            type="file"
            id="file-input"
            className="hidden"
            multiple
            disabled={files.length >= 3}
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
          <Button
            className="p-0"
            variant={"outline"}
            disabled={files.length >= 3}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("file-input")?.click();
            }}
          >
            <span
              className={cn(
                "p-2 flex h-full w-full items-center justify-center",
                files.length >= 3
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer",
              )}
            >
              <Paperclip />
            </span>
          </Button>
        </div>
        <div className="flex items-center max-sm:gap-1 max-sm:scale-90 gap-2">
          <Microphone
            setFeedbackMessage={setFeedbackMessage}
            recorder={recorder}
          />
          <button
            className={cn(
              "disabled:opacity-50 p-2 dark:bg-white dark:text-black",
              "transition-colors",
              "bg-black text-white hover:bg-neutral-900 dark:hover:bg-neutral-200",
              "rounded-full disabled:cursor-not-allowed",
            )}
            disabled={isPending || !prompt.trim()}
            type="submit"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </form>
  );
}
