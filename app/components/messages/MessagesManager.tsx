"use client";
import RenderUserMessage from "./RenderUserMessages";
import Output from "./output/Output";
import Logo from "../Logo";
import React, { useEffect, useRef } from "react";
import ReasoningBlock from "./ReasoningBlock";
import { LastUserMessage } from "../../hooks/useChatState";
import type { HistoryData } from "../../server-actions/chatFormAction";
import type { ModelHashes } from "../../constants";
import { cn } from "@/lib/utils";

type MessagesManagerProps = {
  isPending: boolean;
  lastUserMessage: LastUserMessage;
  hasError?: boolean;
  onRetry?: () => void;
  historyData: HistoryData[];
  isStreaming?: boolean;
  streamingContent?: string;
  streamingModel?: ModelHashes | null;
};

function MessagesManager({
  isPending,
  lastUserMessage,
  hasError,
  onRetry,
  historyData,
  isStreaming = false,
  streamingContent = "",
  streamingModel = null,
}: MessagesManagerProps) {
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
  }, [lastUserMessage, historyData.length, isPending, hasError, isStreaming]);

  return (
    <article
      className={cn(
        "mb-28 w-full overflow-y-hidden overflow-x-auto lg:px-0 px-2 pb-10",
        streamingContent && "scroll-smooth",
      )}
    >
      {historyData.map((data) => {
        return data.messages.map((message, index) => {
          if (message.role === "user") {
            const isLastRenderedUserMsg = index >= historyData.length - 1;
            return (
              <RenderUserMessage
                ref={
                  // Verificamos que sea el último mensaje renderizado
                  // que este completo (no sea parte de un streaming) y que no haya errores
                  isLastRenderedUserMsg &&
                  !isPending &&
                  !hasError &&
                  !isStreaming
                    ? (userMessageRef as any)
                    : undefined
                }
                key={`user-message-${data.messageId}-${index}`}
                userMessage={{
                  prompt: message.content,
                  files: data.files, // puede ser undefined
                  filesNames: data.filesNames, // puede ser undefined
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
                historyData={historyData[(index - 1) / 2]}
                />*/
                  null}
                <Output historyData={data} content={message.content} />
              </React.Fragment>
            );
          } else {
            console.warn("Mensaje no reconocido", message);
            return null;
          }
        });
      })}
      {/* Mensaje del usuario mientras se espera respuesta (pending o streaming) */}
      {(isPending || isStreaming || hasError) && (
        <RenderUserMessage
          ref={userMessageRef as any}
          userMessage={lastUserMessage}
          failed={hasError && !isPending && !isStreaming}
          retry={onRetry}
        />
      )}
      {/* Contenido streaming: renderizar el texto parcial del modelo */}
      {(isPending || isStreaming) && (
        <div className="flex gap-2 items-center">
          <Logo size={16} className="animate-spin" />
          <p className="text-sm dark:text-neutral-300 animate-pulse">
            Pensando...
          </p>
        </div>
      )}
      {isStreaming && streamingContent && (
        <div className="streaming-output">
          <Output
            historyData={
              {
                prompt: lastUserMessage.prompt,
                messageId: "streaming",
                model: streamingModel || "llama-3.3-70b-versatile",
                supportsReasoning: false,
                messages: [],
              } as HistoryData
            }
            content={streamingContent}
          />
        </div>
      )}
      {/* Spinner cuando no hay contenido o no esta completo */}
    </article>
  );
}

export default MessagesManager;
