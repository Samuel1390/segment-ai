import { useState, useEffect } from "react";
import { MODELS, isNotTextFile } from "../constants";
import type { ModelHashes, Models } from "../constants";
import useRecorder from "./useRecorder";
import getModelObj from "../utils/getModelObj";

export type FormState = {
  prompt: string;
  tool: string;
  model: ModelHashes;
  files: File[];
  filesNames: string[];
};

export function useChatInput(setFeedbackMessage: (msg: string) => void) {
  const [form, setForm] = useState<FormState>({
    prompt: "",
    tool: "text",
    model: MODELS[0].modelHash,
    files: [],
    filesNames: [],
  });
  const [sendIsAllowed, setSendIsAlowed] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const recorder = useRecorder();
  const [modelObj, setModelObj] = useState<Models[number]>(
    getModelObj(form.model),
  );

  useEffect(() => {
    const modelObj = getModelObj(form.model);
    setModelObj(modelObj);
    if (form.files.length > 0 && !modelObj.supportsFiles) {
      setFeedbackMessage(
        "El modelo actual no soporta archivos, cambia de modelo para poder usar esta funcionalidad",
      );
    }
  }, [form.model]);

  useEffect(() => {
    // Transcribe el audio si hay un blob y la duración es mayor a 1 segundo
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

  useEffect(() => {
    // Actualiza el nombre de los archivos
    setForm((prev: any) => ({
      ...prev,
      filesNames: prev.files.map((file: File) => file.name),
    }));
  }, [form.files]);

  const handleFilesChange = async (files: File[]) => {
    if (!modelObj.supportsFiles && files.length > 0) {
      setFeedbackMessage(
        "El modelo actual no soporta archivos, cambia de modelo para poder usar esta funcionalidad",
      );
      return;
    }

    const maxMegabytes = 30;
    setFormLoading(true);
    for (const file of files) {
      try {
        if (file.size / Math.pow(10, 6) >= maxMegabytes) {
          setFeedbackMessage(
            `El archivo es muy grande, solo se permiten archivos de texto de hasta ${maxMegabytes}mb`,
          );
          setFormLoading(false);
          return;
        }
        const data = await file.text();

        if (isNotTextFile.test(file.name)) {
          setFeedbackMessage(
            "El archivo no es un archivo de texto, solo se permiten archivos de texto",
          );
          setFormLoading(false);
          return;
        }

        if (data.trim().length > 10000) {
          setFeedbackMessage(
            "El archivo es muy grande, solo se permiten archivos de texto de hasta 10kb",
          );
          setFormLoading(false);
          return;
        }
        if (data.trim().length === 0) {
          setFeedbackMessage("El archivo está vacío");
          setFormLoading(false);
          return;
        }
        setForm((prev) => ({ ...prev, files: [...prev.files, file] }));
      } catch (err) {
        console.log(err);
        setFeedbackMessage(
          "Error al leer el archivo, solo se permiten archivos de texto",
        );
        setFormLoading(false);
        return;
      }
    }
    setFormLoading(false);
  };

  const handleToolChange = (value: string) => {
    setForm((prev) => ({ ...prev, tool: value }));
  };

  const setModel = (model: ModelHashes) => {
    setForm((prev) => ({ ...prev, model }));
  };

  const clearPrompt = () => {
    setForm((prev) => ({ ...prev, prompt: "", files: [], filesNames: [] }));
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
    setForm,
    formLoading,
    modelObj,
    setModelObj,
  };
}
