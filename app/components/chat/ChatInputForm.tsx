import React, { RefObject } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip } from "lucide-react";
import type { Models } from "../../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Settings2, X, FileIcon, Loader2 } from "lucide-react";
import Microphone from "../Microphone";
import { MODELS } from "../../constants";
import { ModelHashes } from "../../constants";
import usePreventSelectScroll from "../../hooks/usePreventSelectScroll";
import { Button } from "@/components/ui/button";
import type { HistoryData } from "../../server-actions/chatFormAction";
import getModelObj from "@/app/utils/getModelObj";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Attachments from "./Attachments";

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
  setForm: (form: any) => void;
  formLoading: boolean;
  modelObj: Models[number];
  setModelObj: (modelObj: Models[number]) => void;
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
  setForm,
  formLoading,
  modelObj,
  setModelObj,
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
      {/* CONTENEDOR SUPERIOR PARA LOS MENSAJES DE FEEDBACK Y ARCHIVOS ADJUNTOS */}
      <div className="absolute bottom-full">
        {/* ARCHIVOS ADJUNTOS */}
        {files.length > 0 && (
          <Attachments files={files} setForm={setForm} modelObj={modelObj} />
        )}
        {/* MENSAJE DE FEEDBACK QUE SE LE MOSTRARA AL USUARIO PARA GUIARLO*/}
        {feedbackMessage && (
          <p className="text-amber-600 h-fit dark:text-amber-400 text-sm">
            {feedbackMessage}
          </p>
        )}
      </div>
      {/* INPUT DE TEXTO */}
      <Textarea
        value={prompt}
        onChange={handleChange}
        name={"prompt"}
        className="w-full text-md md:text-[1rem] min-h-20 max-h-30 overflow-y-auto"
        onKeyDown={handleKeyDown}
        placeholder="Pregunta a Segment"
      />
      {/* INPUT OCULTO PARA ENVIAR EL HISTORIAL DE LA CONVERSACION */}
      <input
        className="hidden"
        name="history"
        onChange={() => {}}
        value={historyString}
      />
      {/* INPUT OCULTO PARA ENVIAR LOS DATOS DEL HISTORIAL DE LA CONVERSACION EN FORMATO JSON */}
      <input
        hidden
        name="historyData"
        onChange={() => {}}
        value={JSON.stringify(historyData)}
      />
      {/* CONTROLES DEL FORMULARIO */}
      <div className="flex items-center justify-between py-7 px-1 w-full h-7">
        <div className="flex items-center gap-2">
          {/* SELECTOR DE MODELOS */}
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
                {/* MAPEO DE MODELOS */}
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
          {/* INPUT PARA SUBIR ARCHIVOS DEL USUARIO*/}
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
          {/* BOTON ESTÉTICO PARA ABRIR EL INPUT DE ARCHIVOS */}
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
              Puedes subir hasta 3 archivos de texto con un tamaño máximo de
              30mb cada uno.
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="flex items-center max-sm:gap-1 max-sm:scale-90 gap-2">
          <Microphone
            setFeedbackMessage={setFeedbackMessage}
            recorder={recorder}
          />
          {/* BOTON DE ENVIAR */}
          <button
            className={cn(
              "disabled:opacity-50 p-2 dark:bg-white dark:text-black",
              "transition-colors",
              "bg-black text-white hover:bg-neutral-900 dark:hover:bg-neutral-200",
              "rounded-full disabled:cursor-not-allowed",
              "flex items-center justify-center",
            )}
            disabled={isPending || !prompt.trim() || formLoading}
            type="submit"
          >
            {formLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
