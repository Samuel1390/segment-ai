"use client";

import React, { useEffect } from "react";
import { Mic, Square } from "lucide-react";
import useRecorder from "../hooks/useRecorder";
import { cn } from "@/lib/utils";

const Microphone = ({
  recorder,
  setFeedbackMessage,
}: {
  recorder: ReturnType<typeof useRecorder>;
  setFeedbackMessage: (message: string) => void;
}) => {
  const { isRecording, startRecording, stopRecording, error } = recorder;

  useEffect(() => {
    if (error) {
      setFeedbackMessage(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className={cn(
              "flex items-center justify-center p-2 bg-black",
              "text-white dark:bg-white dark:text-black rounded-full",
              "transition-colors hover:opacity-80 shadow-md",
            )}
            title="Iniciar grabación"
          >
            <Mic size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className={cn(
              "flex items-center justify-center p-2.5 bg-red-500",
              "text-white rounded-full transition-all hover:bg-red-600 shadow-md animate-pulse",
            )}
            title="Detener grabación"
          >
            <Square size={16} className="fill-current" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Microphone;
