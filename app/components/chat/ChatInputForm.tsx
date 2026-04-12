import React, { RefObject } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import type { Models } from "../../constants";
import ModelsSelect from "./ModelsSelect";
import Microphone from "../Microphone";
import { ModelHashes } from "../../constants";
import type { HistoryData } from "../../server-actions/chatFormAction";
import LoadFilesButton from "./LoadFilesButton";
import isOnline from "@/app/hooks/useOnline";
import SendButton from "./SendButton";
import Attachments from "./Attachments";

type ChatInputFormProps = {
  formRef: RefObject<HTMLFormElement | null>;
  action: (payload: FormData) => void;
  handleSubmit: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  prompt: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  model: ModelHashes;
  setModel: (model: ModelHashes) => void;
  isPending: boolean;
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
  isFormAvailable: (extracontitions: boolean[]) => boolean;
  isOnline: boolean;
  isStreaming: boolean;
  sendStreamingMessage: (formData: FormData) => Promise<void>;
};

export default function ChatInputForm({
  formRef,
  action,
  handleSubmit,
  handleKeyDown,
  prompt,
  handleChange,
  model,
  setModel,
  isPending,
  setFeedbackMessage,
  recorder,
  handleFilesChange,
  feedbackMessage,
  files,
  historyData,
  setForm,
  formLoading,
  modelObj,
  setModelObj,
  isFormAvailable,
  isOnline,
  isStreaming,
  sendStreamingMessage,
}: ChatInputFormProps) {
  const handleAction = (formData: FormData) => {
    files.forEach((file) => formData.append("files", file));

    if (!isOnline) {
      setFeedbackMessage("Comprueba tu conexion a internet");
      return;
    }

    sendStreamingMessage(formData);
    handleFilesChange([]);
  };

  return (
    <form
      ref={formRef as any}
      onSubmit={handleSubmit}
      style={{
        left: "calc(50% - 9px)",
        transform: "translateX(-50%)",
      }}
      className={cn(
        "w-full shadow-[0_-10px_40px_#fff] dark:shadow-[0_-10px_40px_#000]",
        "max-w-[780px] rounded-lg",
        "bg-neutral-50 dark:bg-neutral-900 absolute",
        "z-50 bottom-0 px-4 lg:px-7",
      )}
      action={handleAction}
    >
      {/* CONTENEDOR SUPERIOR PARA LOS MENSAJES DE FEEDBACK Y ARCHIVOS ADJUNTOS */}
      <div className="absolute bottom-full">
        {/* ARCHIVOS ADJUNTOS */}
        <Attachments files={files} setForm={setForm} modelObj={modelObj} />
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
          <ModelsSelect model={model} setModel={setModel} modelObj={modelObj} />
          {/* BOTON ESTÉTICO PARA QUE EL USUARIO PUEDA SUBIR ARCHIVOS */}
          <LoadFilesButton
            files={files}
            modelObj={modelObj}
            setFeedbackMessage={setFeedbackMessage}
            handleFilesChange={handleFilesChange}
            model={model}
          />
        </div>
        <div className="flex items-center max-sm:gap-1 max-sm:scale-90 gap-2">
          <Microphone
            setFeedbackMessage={setFeedbackMessage}
            recorder={recorder}
          />
          {/* BOTON DE ENVIAR */}
          <SendButton
            formLoading={formLoading}
            isFormAvailable={isFormAvailable}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </form>
  );
}
