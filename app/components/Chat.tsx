"use client";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import MessagesManager from "./messages/MessagesManager";
import Errors from "./errors/BackendErrors";
import ChatGreeting from "./chat/ChatGreeting";
import ChatInputForm from "./chat/ChatInputForm";
import { useChatState } from "../hooks/useChatState";
import { useChatInput } from "../hooks/useChatInput";
import useIsOnline from "../hooks/useOnline";

const Chat = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const isOnline = useIsOnline();

  const {
    state,
    action,
    isPending,
    openErrorModal,
    setOpenErrorModal,
    errorCode,
    feedbackMessage,
    setFeedbackMessage,
    lastUserMessage,
    setLastMessage,
    retry,
    historyData,
    // Streaming
    isStreaming,
    streamingContent,
    streamingModel,
    sendStreamingMessage,
  } = useChatState();

  const {
    form,
    recorder,
    handleChange,
    setModel,
    clearPrompt,
    handleFilesChange,
    setForm,
    formLoading,
    modelObj,
    setModelObj,
  } = useChatInput(setFeedbackMessage);

  function isFormAvailable([...extraConditions]: boolean[]): boolean {
    // Esta funcion se encarga de validar si el formulario esta listo para ser enviado
    const isFilesAvailable =
      !(!modelObj.supportsFiles && form.files.length > 0) ||
      modelObj.supportsFiles;

    const weHavePrompt = form.prompt.trim().length > 0;

    const readyToSend = !(isPending || isStreaming || formLoading);

    const isFormValid =
      isFilesAvailable &&
      weHavePrompt &&
      extraConditions.every((v) => !!v) &&
      readyToSend;

    return isFormValid;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (isFormAvailable([])) {
        e.preventDefault();
        if (!isOnline) {
          setFeedbackMessage("Comprueba tu conexion a internet");
          return;
        }
        e.currentTarget.form?.requestSubmit();
        clearPrompt();
      } else {
        e.preventDefault();
      }
    }
  };

  const handleSubmit = () => {
    setLastMessage({
      prompt: form.prompt,
      files: form.files,
      filesNames: form.files.map((file) => file.name),
    });
    clearPrompt();
  };

  return (
    <section
      className={cn(
        `flex w-full justify-start h-full items-center flex-col`,
        ``,
      )}
    >
      {/* MODAL DE ERRORES | SE DISPARA CUANDO HAY UN ERROR EN EL SERVIDOR */}
      <Errors
        code={errorCode ?? (state && "error" in state ? state.error : null)}
        open={openErrorModal}
        setOpen={setOpenErrorModal}
        onRetry={() => retry(formRef)}
      />

      {/* Si hay un mensaje del usuario, se muestra el manager de modelos */}
      {lastUserMessage.prompt ? (
        <MessagesManager
          isPending={isPending}
          lastUserMessage={lastUserMessage}
          hasError={!!errorCode || !!(state && "error" in state)}
          onRetry={() => retry(formRef)}
          historyData={historyData}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          streamingModel={streamingModel}
        />
      ) : (
        /* Si no hay un mensaje del usuario, se muestra el saludo inicial dandole la bienvenida a nuestro usuario*/
        <ChatGreeting />
      )}

      {/* FORMULARIO DE ENTRADA */}
      <ChatInputForm
        isOnline={isOnline}
        historyData={historyData}
        formRef={formRef}
        action={action}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
        prompt={form.prompt}
        handleChange={handleChange}
        model={form.model}
        files={form.files}
        handleFilesChange={handleFilesChange}
        setModel={setModel}
        isPending={isPending}
        recorder={recorder}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        setForm={setForm}
        formLoading={formLoading}
        modelObj={modelObj}
        setModelObj={setModelObj}
        isFormAvailable={isFormAvailable}
        isStreaming={isStreaming}
        sendStreamingMessage={sendStreamingMessage}
      />
    </section>
  );
};

export default Chat;
