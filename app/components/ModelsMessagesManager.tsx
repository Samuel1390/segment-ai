"use client";
import RenderUserMessage from "./RenderUserMessages";
import { ModelErrorObj } from "./errors/Errors";
import Output from "./output/Output";
import Logo from "./Logo";
import React, { useEffect, useRef } from "react";
import ReasoningBlock from "./ReasoningBlock";
import { LastUserMessage } from "../hooks/useChatState";
import type { HistoryData } from "../server-actions/chatFormAction";

export type GenericHistory = {
  // se encarga de hacer compatibles los historiales
  role: "user" | "model";
  content: string;
  reasoning?: string;
};

export type GenericResponse = // hace compatibles las respuestas
  | ModelErrorObj
  | {
      output: string;
      history: GenericHistory[];
    };

type ModelsMessagesManagerProps = {
  history: GenericHistory[];
  isPending: boolean;
  lastUserMessage: LastUserMessage;
  hasError?: boolean;
  onRetry?: () => void;
  historyData: HistoryData[];
};

function ModelsMessagesManager({
  history,
  isPending,
  lastUserMessage,
  hasError,
  onRetry,
  historyData,
}: ModelsMessagesManagerProps) {
  const userMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Timeout para asegurar que el DOM se haya repintado
    const timeout = setTimeout(() => {
      if (userMessageRef.current) {
        userMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [lastUserMessage, history.length, isPending, hasError]);

  return (
    <article className="mb-28 w-full overflow-y-hidden overflow-x-auto lg:px-0 px-2 pb-10">
      {history.map((message, index) => {
        if (message.role === "user") {
          const isLastRenderedUserMsg = index >= history.length - 2;
          return (
            <RenderUserMessage
              ref={
                isLastRenderedUserMsg && !isPending && !hasError
                  ? (userMessageRef as any)
                  : undefined
              }
              key={`user-message-${index}`}
              userMessage={{
                ...historyData[index * 2],
                prompt: message.content,
              }}
            />
          );
        } else if (message.role === "model") {
          return (
            <React.Fragment key={`model-message-${index}`}>
              {/* Mensaje de razonamiento, funciona pero por ahora no lo mostraremos */}
              {message?.reasoning &&
                /*<ReasoningBlock
                  key={`${index}-reasoning`}
                  reasoning={message.reasoning}
                />*/
                null}
              <Output
                historyData={historyData[index * 2 + 1]}
                content={message.content}
              />
            </React.Fragment>
          );
        }
      })}
      {(isPending || hasError) && (
        <RenderUserMessage
          ref={userMessageRef as any}
          userMessage={lastUserMessage}
          failed={hasError && !isPending}
          retry={onRetry}
        />
      )}
      {isPending && (
        <div className="flex gap-2 items-center">
          <Logo size={16} className="animate-spin" />
          <p className="text-sm dark:text-neutral-300 animate-pulse">
            Pensando...
          </p>
        </div>
      )}
    </article>
  );
}

export default ModelsMessagesManager;
