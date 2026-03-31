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
  } = useChatState();

  const { form, recorder, sendIsAllowed, handleChange, setModel, clearPrompt } =
    useChatInput(setFeedbackMessage);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (sendIsAllowed && !isPending) {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
        clearPrompt();
      } else {
        e.preventDefault();
      }
    }
  };

  const handleSubmit = () => {
    setLastMessage(form.prompt);
    clearPrompt();
  };

  return (
    <section
      className={cn(
        "h-full flex w-full justify-center items-center flex-col",
        "overflow-y-hidden",
      )}
    >
      {state && "error" in state && (
        <Errors
          code={state.error}
          open={openErrorModal}
          setOpen={setOpenErrorModal}
        />
      )}

      {lastUserMessage ? (
        <ModelsMessagesManager
          history={history}
          isPending={isPending}
          lastUserMessage={lastUserMessage}
          hasError={!!(state && "error" in state)}
          onRetry={() => retry(formRef)}
        />
      ) : (
        <ChatGreeting />
      )}

      <ChatInputForm
        formRef={formRef}
        action={action}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
        prompt={form.prompt}
        handleChange={handleChange}
        historyString={JSON.stringify(history)}
        model={form.model}
        setModel={setModel}
        isPending={isPending}
        sendIsAllowed={sendIsAllowed}
        recorder={recorder}
        feedbackMessage={feedbackMessage}
        setFeedbackMessage={setFeedbackMessage}
      />
    </section>
  );
};

export default Chat;
