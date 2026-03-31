"use server";
import Groq from "groq-sdk";
import fs from "node:fs";
import path from "node:path";
import { APIPromise } from "openai";
import type { Models } from "../types";
import type {
  ModelErrorType,
  ModelErrorObj,
} from "../components/errors/Errors";
import type { GroqMessage, GroqResponse } from "../types";
import { GenericHistory } from "./chatFormAction";
import type { ModelHashes } from "../constants";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function groqAI(
  formData: FormData,
  instruccions: string,
  model: ModelHashes,
): Promise<GroqResponse | ModelErrorObj> {
  // Obtenemos los datos del formulario
  const prompt = formData.get("prompt") as string;
  const tool = formData.get("tool") as string;
  const historyRaw = formData.get("history") as string;
  const history: GenericHistory[] = historyRaw ? JSON.parse(historyRaw) : [];
  const response = await getGroqContent(prompt, history, instruccions, model);
  if ("error" in response) {
    return response;
  }
  // Devolvemos la respuesta en el formato correcto
  return {
    completationUsage: response.usage,
    output: response.choices[0].message.content ?? " ",
  };
}

export async function getGroqContent(
  prompt: string,
  history: GenericHistory[],
  instruccions: string,
  model: ModelHashes,
): Promise<APIPromise<Groq.Chat.Completions.ChatCompletion> | ModelErrorObj> {
  try {
    return await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: instruccions,
        },
        ...historyFormat(history), //Le damos el historial de la conversacion formateado
        {
          role: "user",
          content: prompt,
        },
      ],
      model,
      include_reasoning: true,
    });
  } catch (e: any) {
    console.log(e);
    if (e?.status) {
      return { error: (e?.status as ModelErrorType) || "500" };
    }
  }
  return { error: "500" };
}

function historyFormat(history: GenericHistory[]): GroqMessage[] {
  // Aqui transformamos el historial para que sea compatible con groq
  const historyFormated = history.map((message) => {
    return {
      role:
        message.role === "user" ? "user" : ("assistant" as GroqMessage["role"]),
      content: message.content || " ",
    };
  });
  return historyFormated;
}

export default groqAI;
