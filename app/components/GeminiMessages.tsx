"use client";
import Output from "./output/Output";
import type { GeminiResponse } from "../types";
import type { GeminiErrorType } from "./errors/Errors";
import { useState, useEffect } from "react";
import GeminiError from "./errors/Errors";
import Logo from "./Logo";
import Image from "next/image";
import RenderUserMessage from "./RenderUserMessages";

interface GeminiMessagesProps {
  isPending: boolean;
  imageGeneration: boolean;
  response: GeminiResponse | { error: GeminiErrorType } | null;
  fallbackUserMessage: string;
}

const GeminiMessages = ({
  isPending,
  imageGeneration,
  response,
  fallbackUserMessage,
}: GeminiMessagesProps) => {
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [lastError, setLastError] = useState<GeminiErrorType | null>(null);
  useEffect(() => {
    if (response && "error" in response) {
      setLastError(response.error);
      setOpenErrorAlert(true);
    }
  }, [response]);
  return (
    <div
      className="text-left dark:text-neutral-200
      sm:text-md leading-relaxed self-start mx-auto text-wrap text-pretty word-break 
       w-full"
    >
      <div className="w-full sm:max-w-[680px] mb-7 space-y-4 pb-35">
        {lastError && (
          <GeminiError
            code={lastError}
            open={openErrorAlert}
            setOpen={setOpenErrorAlert}
          />
        )}
        {response &&
          "history" in response &&
          response.history.map((msg, index) => {
            if (msg.role === "model") {
              return (
                <div key={index} className={`p-3 rounded-lg w-full text-left`}>
                  <Output content={msg.parts[0].text} />
                  {imageGeneration && response.imageUrl && (
                    <Image
                      src={response.imageUrl}
                      alt="Imagen generada"
                      width={300}
                      height={100}
                    />
                  )}
                </div>
              );
            } else if (msg.role === "user") {
              return (
                <RenderUserMessage
                  key={index}
                  userMessage={msg.parts[0].text}
                />
              );
            } else {
              return null;
            }
          })}
        {isPending && (
          <>
            <RenderUserMessage userMessage={fallbackUserMessage} />
            <div className="flex gap-2 items-center">
              <Logo size={16} className="animate-spin" />
              <p className="text-sm dark:text-neutral-300 animate-pulse">
                Pensando...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default GeminiMessages;
