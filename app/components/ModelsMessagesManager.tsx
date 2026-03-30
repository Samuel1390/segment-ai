"use client";
import RenderUserMessage from "./RenderUserMessages";
import type { GenericHistory } from "../server-actions/chatFormAction";
import Output from "./output/Output";
import Logo from "./Logo";
import { useEffect, useRef } from "react";

type ModelsMessagesManagerProps = {
  history: GenericHistory[];
  isPending: boolean;
  lastUserMessage: string;
  hasError?: boolean;
  onRetry?: () => void;
};

function ModelsMessagesManager({
  history,
  isPending,
  lastUserMessage,
  hasError,
  onRetry,
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
    <article className="mb-50 w-full overflow-y-hidden overflow-x-auto lg:px-0 px-2 pb-10">
      {history.map((message, index) => {
        if (message.role === "user") {
          const isLastRenderedUserMsg = index >= history.length - 2;
          return (
            <RenderUserMessage
              ref={isLastRenderedUserMsg && !isPending && !hasError ? (userMessageRef as any) : undefined}
              key={index}
              userMessage={message.content}
            />
          );
        } else if (message.role === "model") {
          return <Output key={index} content={message.content} />;
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
        <div className="flex gap-2 items-center mb-50">
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
