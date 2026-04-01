import { useState, useEffect } from "react";
import { MODELS } from "../constants";
import type { ModelHashes } from "../constants";
import useRecorder from "./useRecorder";

export type FormState = {
  prompt: string;
  tool: string;
  model: ModelHashes;
  files: File[];
};

export function useChatInput(setFeedbackMessage: (msg: string) => void) {
  const [form, setForm] = useState<FormState>({
    prompt: "",
    tool: "text",
    model: MODELS[0].modelHash,
    files: [],
  });
  const [sendIsAllowed, setSendIsAlowed] = useState(false);
  const recorder = useRecorder();

  useEffect(() => {
    if (recorder.audioBlob) {
      if (recorder.duration > 1000) {
        const formData = new FormData();
        formData.append("audio", recorder.audioBlob, "audio.webm");
        fetch(`/api/transcriptions`, {
          method: "POST",
          body: formData,
        })
          .then(async (res) => {
            const transcription = await res.json();
            if (transcription.text) {
              setForm((prev) => ({ ...prev, prompt: transcription.text }));
              setSendIsAlowed(true);
            }
          })
          .catch(() => {
            setFeedbackMessage(
              "Hubo un error al transcribir el audio, intentalo de nuevo",
            );
          });
      } else {
        setFeedbackMessage("Intenta grabar un mensaje de al menos 1 segundo");
      }
    }
  }, [recorder, setFeedbackMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, prompt: value }));
    setSendIsAlowed(value.trim().length > 0);
  };

  const handleFilesChange = (files: File[]) => {
    setForm((prev) => ({ ...prev, files }));
  };

  const handleToolChange = (value: string) => {
    setForm((prev) => ({ ...prev, tool: value }));
  };

  const setModel = (model: ModelHashes) => {
    setForm((prev) => ({ ...prev, model }));
  };

  const clearPrompt = () => {
    setForm((prev) => ({ ...prev, prompt: "" }));
    setSendIsAlowed(false);
  };

  return {
    form,
    recorder,
    sendIsAllowed,
    handleChange,
    handleToolChange,
    setModel,
    clearPrompt,
    handleFilesChange,
  };
}
