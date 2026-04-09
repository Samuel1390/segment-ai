"use server";
import Groq from "groq-sdk";
import type {
  ModelErrorType,
  ModelErrorObj,
} from "../components/errors/BackendErrors";
import type { GroqMessage, GroqResponse } from "../types";
import { GenericMessage, HistoryData } from "./chatFormAction";
import type { ModelHashes } from "../constants";
import handleFiles from "../utils/handleFiles";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function groqAI(
  formData: FormData,
  instruccions: string,
  model: ModelHashes,
  supportsReasoning: boolean,
  historyData: HistoryData[],
): Promise<GroqResponse | ModelErrorObj> {
  // Obtenemos los datos del formulario
  const prompt = formData.get("prompt") as string;
  const tool = formData.get("tool") as string;
  const files = formData.getAll("files") as File[];
  const weHaveFiles = files.length > 0;

  const response: Groq.Chat.Completions.ChatCompletion | ModelErrorObj =
    await getGroqContent(
      weHaveFiles ? await handleFiles(files, prompt) : prompt,
      historyData,
      instruccions,
      model,
      supportsReasoning,
    );
  if ("error" in response) {
    return response;
  }
  // Devolvemos la respuesta en el formato correcto
  return {
    completationUsage: response.usage,
    output: response.choices[0].message.content ?? " ",
    reasoning: response.choices[0].message.reasoning || " ",
  };
}

export async function getGroqContent(
  prompt: string,
  historyData: HistoryData[],
  instruccions: string,
  model: ModelHashes,
  supportsReasoning: boolean,
): Promise<GroqResponse | ModelErrorObj> {
  try {
    const response: Groq.Chat.Completions.ChatCompletion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: instruccions,
          },
          ...historyFormat(historyData), //Le damos el historial de la conversacion formateado
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        model,
        include_reasoning: supportsReasoning ? true : undefined,
      });
    return response;
  } catch (e: any) {
    console.log(e);
    if (e?.status) {
      return { error: (e?.status as ModelErrorType) || "500" };
    }
  }
  return { error: "500" };
}

function historyFormat(historyData: HistoryData[]): GroqMessage[] {
  // Aqui transformamos el historial para que sea compatible con groq
  const historyFormated = historyData.flatMap(({ messages }) => {
    return messages.map(({ role, content }) => {
      return {
        role: role === "user" ? "user" : ("assistant" as GroqMessage["role"]),
        content: content || " ",
      };
    });
  });
  return historyFormated;
}

export default groqAI;
