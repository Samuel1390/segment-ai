"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  Image,
  Settings2,
  Images,
  FolderCode,
  Search,
} from "lucide-react";
import usePreventSelectScroll from "../hooks/usePreventSelectScroll";
import GeminiMessages from "./GeminiMessages";
import gemini from "../server-actions/gemini";
import React, { useEffect } from "react";
import { useState, useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Logo from "./Logo";
import type { Message } from "../types";

const Chat = () => {
  const [form, setForm] = useState({
    text: "",
    tool: "text",
  });
  const [state, action, isPending] = useActionState(gemini, null);
  const [history, setHistory] = useState<Message[]>([]);
  const [sendIsAllowed, setSendIsAlowed] = useState(false);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  usePreventSelectScroll();
  useEffect(() => {
    if (state && "history" in state) {
      setHistory(state.history);
    }
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm({ ...form, text: value });
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
        setForm({ ...form, text: "" });
      } else {
        e.preventDefault();
      }
    }
  };
  const handleSubmit = () => {
    setUserMessages((prev) => [...prev, form.text]);
    setForm({ ...form, text: "" });
    window.scrollTo({
      behavior: "smooth",
      top: document.body.scrollHeight,
    });
  };

  return (
    <section className="h-full flex w-full justify-center items-center flex-col">
      {userMessages.length > 0 ? (
        <GeminiMessages
          response={state}
          isPending={isPending}
          imageGeneration={form.tool === "images"}
          fallbackUserMessage={userMessages[userMessages.length - 1]}
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
        onSubmit={handleSubmit}
        className="w-full max-w-[680px] shadow-md shadow-neutral-900/80 rounded-lg  left-1/2 -translate-x-1/2 
        bg-neutral-50 dark:bg-neutral-900 fixed z-50 bottom-0 px-4"
        action={action}
      >
        <Textarea
          value={form.text}
          onChange={handleChange}
          name={"text"}
          className="w-full text-sm sm:text-md"
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
            name="tool"
            onValueChange={handleToolChange}
            value={form.tool}
          >
            <SelectTrigger className="hover:cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200">
              <SelectValue
                placeholder={
                  <div className="flex items-center gap-2">
                    <Settings2 /> Herramientas
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent
              onMouseDown={(e) => e.preventDefault()}
              className="-top-10 popper"
            >
              <SelectGroup>
                <SelectItem className="hover:cursor-pointer" value="text">
                  <Settings2 />
                  Texto
                </SelectItem>
                <SelectItem className="hover:cursor-pointer" value="images">
                  <Images />
                  Imágenes
                </SelectItem>
                <SelectItem className="hover:cursor-pointer" value="canvas">
                  <FolderCode />
                  Canvas
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="deepResearch"
                >
                  <Search />
                  Investigación profunda
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <button
            className="disabled:opacity-50 p-2 dark:bg-white dark:text-black
            transition-colors
            bg-black text-white hover:bg-neutral-900 dark:hover:bg-neutral-200
             rounded-full disabled:cursor-not-allowed"
            disabled={isPending || !form.text.trim()}
            type="submit"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </section>
  );
};

export default Chat;
