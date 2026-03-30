"use server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiMessage, GeminiResponse } from "../types";
import type { Models } from "../types";
import { ModelErrorType, ModelErrorObj } from "../components/errors/Errors";
import { GenericHistory } from "./chatFormAction";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export type GeminiReturnValues =
  | Promise<ModelErrorObj>
  | Promise<GeminiResponse>;

export async function gemini(
  formData: FormData,
  instruccions: string,
  model: Models,
): Promise<GeminiReturnValues> {
  const prompt = formData.get("prompt") as string;
  const tool = formData.get("tool") as string;
  const historyRaw = formData.get("history") as string;
  const history: GenericHistory[] = historyRaw ? JSON.parse(historyRaw) : [];
  const geminiModel = genai.getGenerativeModel({
    model: model,
    systemInstruction: instruccions,

    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
    },
  });
  return await generateText(prompt, history, geminiModel);
}

async function generateText(
  prompt: string,
  history: GenericHistory[],
  model: GenerativeModel,
): Promise<GeminiReturnValues> {
  try {
    const chat = model.startChat({
      history: formatHistory(history),
    });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;

    return {
      usageMetadata: response.usageMetadata,
      output: response.text(),
      history: [
        ...formatHistory(history).slice(0, -2),
        { role: "user", parts: [{ text: prompt }] },
        { role: "model", parts: [{ text: response.text() }] },
      ],
    };
  } catch (e: any) {
    console.error("Gemini API Error:", e);
    return { error: e.status || "500" };
  }
}

function formatHistory(history: GenericHistory[]): GeminiMessage[] {
  return history.map((message) => {
    return {
      role: message.role, // "model" | "user"
      parts: [{ text: message.content }],
    };
  });
}

export default gemini;
