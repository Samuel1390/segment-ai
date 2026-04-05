"use client";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import usePreventSelectScroll from "../hooks/usePreventSelectScroll";
import ModelsMessagesManager from "./ModelsMessagesManager";
import Errors from "./errors/Errors";
import ChatGreeting from "./chat/ChatGreeting";
import ChatInputForm from "./chat/ChatInputForm";
import { useChatState } from "../hooks/useChatState";
import { useChatInput } from "../hooks/useChatInput";

const Chat = () => {
  usePreventSelectScroll();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    state,
    action,
    isPending,
    openErrorModal,
    setOpenErrorModal,
    history,
    feedbackMessage,
    setFeedbackMessage,
    lastUserMessage,
    setLastMessage,
    retry,
    historyData,
  } = useChatState();

  console.log(
    "datos del historyData en el componente MarkdownRenderer: ",
    historyData,
  );

  const {
    form,
    recorder,
    sendIsAllowed,
    handleChange,
    setModel,
    clearPrompt,
    handleFilesChange,
    setForm,
    formLoading,
    modelObj,
    setModelObj,
  } = useChatInput(setFeedbackMessage);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (sendIsAllowed && !isPending && !formLoading) {
        e.preventDefault();
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
        `flex w-full justify-center h-full items-center flex-col`,
        `overflow-y-hidden`,
      )}
    >
      {/* MODAL DE ERRORES | SE DISPARA CUANDO HAY UN ERROR EN EL SERVIDOR */}
      {state && "error" in state && (
        <Errors
          code={state.error}
          open={openErrorModal}
          setOpen={setOpenErrorModal}
        />
      )}

      {/* Si hay un mensaje del usuario, se muestra el manager de modelos */}
      {lastUserMessage.prompt ? (
        <ModelsMessagesManager
          history={history}
          isPending={isPending}
          lastUserMessage={lastUserMessage}
          hasError={!!(state && "error" in state)}
          onRetry={() => retry(formRef)}
          historyData={historyData}
        />
      ) : (
        /* Si no hay un mensaje del usuario, se muestra el saludo inicial dandole la bienvenida a nuestro usuario*/
        <ChatGreeting />
      )}

      {/* FORMULARIO DE ENTRADA */}
      <ChatInputForm
        historyData={historyData}
        formRef={formRef}
        action={action}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
        prompt={form.prompt}
        handleChange={handleChange}
        historyString={JSON.stringify(history)}
        model={form.model}
        files={form.files}
        handleFilesChange={handleFilesChange}
        setModel={setModel}
        isPending={isPending}
        sendIsAllowed={sendIsAllowed}
        recorder={recorder}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
        setForm={setForm}
        formLoading={formLoading}
        modelObj={modelObj}
        setModelObj={setModelObj}
      />
    </section>
  );
};

export default Chat;
