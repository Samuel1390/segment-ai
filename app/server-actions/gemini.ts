"use server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiMessage, GeminiResponse } from "../types";
import type { Models } from "../types";
import {
  ModelErrorType,
  ModelErrorObj,
} from "../components/errors/BackendErrors";
import { GenericMessage, HistoryData } from "./chatFormAction";
import { ModelHashes } from "../constants";
import handleFiles from "../utils/handleFiles";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export type GeminiReturnValues =
  | Promise<ModelErrorObj>
  | Promise<GeminiResponse>;

export async function gemini(
  formData: FormData,
  instruccions: string,
  model: ModelHashes,
  supportsReasoning: boolean,
  historyData: HistoryData[],
): Promise<GeminiReturnValues> {
  // Aqui obtenemos los datos del formulario
  const prompt = formData.get("prompt") as string;
  const tool = formData.get("tool") as string;
  const files = formData.getAll("files") as File[];
  const weHaveFiles = files.length > 0;
  const promptWithFiles = weHaveFiles ? await handleFiles(files, prompt) : null;
  const geminiModel = genai.getGenerativeModel({
    model: model,
    systemInstruction: instruccions, // Le pasamos las intruccuines al modelo

    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
    },
  });
  return await generateText(
    promptWithFiles || prompt,
    historyData,
    geminiModel,
  );
}

async function generateText(
  prompt: string,
  historyData: HistoryData[],
  model: GenerativeModel,
): Promise<GeminiResponse | ModelErrorObj> {
  try {
    const chat = model.startChat({
      history: formatHistory(historyData), // Formateamos el historial para que sea compatible con gemini, revisar la funcion formatHistory
    });
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    // la respuesta contiene datos interesantes que podemos usar mas tarde, como el uso de tokens
    return {
      usageMetadata: response.usageMetadata,
      output: response.text() || " ",
    };
  } catch (e: any) {
    console.error("Gemini API Error:", e);
    return { error: e.status || "500" };
  }
}

function formatHistory(historyData: HistoryData[]): GeminiMessage[] {
  // Aqui transformamos el historial para que sea compatible con gemini
  return historyData.flatMap(({ messages }) => {
    return messages.map((message) => {
      return {
        role: message.role, // "model" | "user"
        parts: [{ text: message.content || " " }],
      };
    });
  });
}

export default gemini;
