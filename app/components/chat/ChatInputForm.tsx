import React, { RefObject } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Settings2 } from "lucide-react";
import Microphone from "../Microphone";
import { MODELS } from "../../constants";
import type { Models } from "../../types";
import { ModelHashes } from "../../constants";
import usePreventSelectScroll from "../../hooks/usePreventSelectScroll";

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
  feedbackMessage,
}: ChatInputFormProps) {
  usePreventSelectScroll();
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
      action={action}
    >
      {feedbackMessage && (
        <p className="text-amber-600 dark:text-amber-400 text-sm absolute -top-6">
          {feedbackMessage}
        </p>
      )}
      <Textarea
        value={prompt}
        onChange={handleChange}
        name={"prompt"}
        className="w-full text-sm sm:text-md md:text-[1rem] min-h-20"
        onKeyDown={handleKeyDown}
        placeholder="Pregunta a Segment"
      />
      <input
        className="hidden"
        name="history"
        onChange={() => {}} /* Funcion vacia para que next.js no se queje */
        value={historyString}
      />
      <div className="flex items-center justify-between py-7 px-1 w-full h-7">
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
                    key={mdl.modelHash}
                    value={mdl.modelHash}
                    className="hover:cursor-pointer"
                    description={mdl.description}
                  >
                    {mdl.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
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
