"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Settings2, Search } from "lucide-react";
import usePreventSelectScroll from "../hooks/usePreventSelectScroll";
import getTranscription from "../server-actions/getTranscription";
import Microphone from "./Microphone";
import {
  GenericResponse,
  GenericHistory,
} from "../server-actions/chatFormAction";
import React, { useEffect, useRef, startTransition } from "react";
import { useState, useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Logo from "./Logo";
import ChatFormAction from "../server-actions/chatFormAction";
import ModelsMessagesManager from "./ModelsMessagesManager";
import { MODELS } from "../constants";
import type { Models } from "../types";
import useRecorder from "../hooks/useRecorder";
import Errors from "./errors/Errors";
import RenderUserMessage from "./RenderUserMessages";

type Form = {
  prompt: string;
  tool: string;
  model: Models;
};

const Chat = () => {
  const [form, setForm] = useState<Form>({
    prompt: "",
    tool: "text",
    model: MODELS.gpt,
  });
  const [state, action, isPending] = useActionState(ChatFormAction, null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [history, setHistory] = useState<GenericHistory[]>([]);
  const [sendIsAllowed, setSendIsAlowed] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [lastUserMessage, setLastUserMessage] = useState<string>("");
  const recorder = useRecorder();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (recorder.audioBlob) {
      if (recorder.duration > 1000) {
        const formData = new FormData();
        formData.append("audio", recorder.audioBlob, "audio.webm");
        fetch(`/api/transcriptions`, {
          method: "POST",
          body: formData,
        }).then(async (res) => {
          console.log(res);
          const transcription = await res.json();
          if (transcription.text) {
            setForm({ ...form, prompt: transcription.text });
          }
        });
      } else {
        setFeedbackMessage("Intenta grabar un mensaje de al menos 1 segundo");
      }
    }
  }, [recorder]);

  usePreventSelectScroll();
  useEffect(() => {
    if (state && "history" in state) {
      setHistory(state.history);
    }
    if (state && "error" in state) {
      setOpenErrorModal(true);
      setFeedbackMessage("Intenta cambiar de modelo, o espera un minuto");
    }
  }, [state]);

  useEffect(() => {
    setTimeout(() => {
      setFeedbackMessage("");
    }, 3000);
  }, [feedbackMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm({ ...form, prompt: value });
    if (value.trim()) {
      setSendIsAlowed(true);
    } else {
      setSendIsAlowed(false);
    }
  };
  const handleToolChange = (value: string) => {
    setForm({ ...form, tool: value });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (sendIsAllowed && !isPending) {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
        setForm({ ...form, prompt: "" });
      } else {
        e.preventDefault();
      }
    }
  };
  const handleSubmit = () => {
    setLastUserMessage(form.prompt);
    setForm({ ...form, prompt: "" });
  };
  const retry = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    formData.set("prompt", lastUserMessage);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <section
      className="h-full flex w-full justify-center items-center flex-col
     overflow-y-hidden"
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
          onRetry={retry}
        />
      ) : (
        <div
          className="flex flex-col self-center mt-5 text-center
        my-auto items-center justify-center"
        >
          <Logo size={60} />
          <p
            className="lg:text-lg
            md:text-md
           
          text-neutral-700 
          dark:text-neutral-300
          font-bold"
          >
            ¡Hola! ¿En qué puedo ayudarte hoy?
          </p>
        </div>
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full shadow-[0_-10px_40px_#fff] dark:shadow-[0_-10px_40px_#000]
        max-w-[780px] rounded-lg
        left-1/2 -translate-x-1/2 bg-neutral-50 dark:bg-neutral-900 fixed
        z-50 bottom-0 px-4 lg:px-7"
        action={action}
      >
        {feedbackMessage && (
          <p className="text-amber-600 dark:text-amber-400 text-sm absolute -top-6">
            {feedbackMessage}
          </p>
        )}
        <Textarea
          value={form.prompt}
          onChange={handleChange}
          name={"prompt"}
          className="w-full text-sm sm:text-md md:text-[1rem] min-h-20"
          onKeyDown={handleKeyDown}
          placeholder="Pregunta a Segment"
        />
        <input
          className="hidden"
          name="history"
          onChange={() => {}} /* Funcion vacia para que next.js no se queje */
          value={JSON.stringify(history)}
        />
        <div className="flex items-center justify-between py-7 px-1 w-full h-7">
          <Select
            name="model"
            onValueChange={(value) =>
              setForm({ ...form, model: value as Models })
            }
            value={form.model}
          >
            <SelectTrigger className="hover:cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200">
              <SelectValue
                placeholder={
                  <div className="flex items-center gap-2">
                    <Settings2 /> Modelo
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent
              onMouseDown={(e) => e.preventDefault()}
              className="-top-10 popper"
            >
              <SelectGroup>
                <SelectItem className="hover:cursor-pointer" value={MODELS.gpt}>
                  OpenAI GPT OSS 20B
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value={MODELS.llama}
                >
                  Llama 3.3 70B
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value={MODELS.gemini}
                >
                  Gemini 2.5 Flash
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex items-center max-sm:gap-1 max-sm:scale-90 gap-2">
            <Microphone recorder={recorder} />
            <button
              className="disabled:opacity-50 p-2 dark:bg-white dark:text-black
            transition-colors
            bg-black text-white hover:bg-neutral-900 dark:hover:bg-neutral-200
             rounded-full disabled:cursor-not-allowed"
              disabled={isPending || !form.prompt.trim()}
              type="submit"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Chat;
