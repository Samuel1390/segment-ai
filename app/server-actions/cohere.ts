"use server";
import Groq from "groq-sdk";
import type {
  ModelErrorType,
  ModelErrorObj,
} from "../components/errors/Errors";
import type { GroqMessage, GroqResponse } from "../types";
import handleFiles from "../utils/handleFiles";
import { GenericHistory } from "./chatFormAction";
import type { ModelHashes } from "../constants";
import { CohereClientV2 } from "cohere-ai";
import { HttpResponsePromise } from "cohere-ai/core";
import { V2ChatResponse } from "cohere-ai/api";
import type { CohereMessage, CohereResponse } from "../types";
const cohere = new CohereClientV2({ token: process.env.CO_API_KEY });

export async function cohereAi(
  formData: FormData,
  instruccions: string,
  model: ModelHashes,
  supportsReasoning: boolean,
): Promise<CohereResponse | ModelErrorObj> {
  // Obtenemos los datos del formulario
  const prompt = formData.get("prompt") as string;
  const tool = formData.get("tool") as string;
  const historyRaw = formData.get("history") as string;
  const history: GenericHistory[] = historyRaw ? JSON.parse(historyRaw) : [];
  const files: File[] = formData.getAll("files") as File[];

  const weHaveFiles = files.length > 0;

  try {
    const response: V2ChatResponse | ModelErrorObj = await getCohereContent(
      weHaveFiles ? await handleFiles(files, prompt) : prompt,
      history,
      instruccions,
      model,
      supportsReasoning,
    );
    if ("error" in response) {
      return response;
    }
    // Devolvemos la respuesta en el formato correcto
    const output =
      response.message.content?.[0]?.type === "text"
        ? response.message.content[0].text
        : " ";
    if (!output.trim()) {
      console.warn("Respuesta vacía de Cohere");
    }
    return {
      completationUsage: response.usage,
      output,
    };
  } catch (e: any) {
    console.log(e);
    if (e?.status) {
      return { error: (e?.status as ModelErrorType) || "500" };
    }
  }
  return { error: "500" };
}

export async function getCohereContent(
  prompt: string,
  history: GenericHistory[],
  instruccions: string,
  model: ModelHashes,
  supportsReasoning: boolean,
): Promise<HttpResponsePromise<V2ChatResponse> | ModelErrorObj> {
  try {
    const response: V2ChatResponse = await cohere.chat({
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
      temperature: 0.2,
      model,
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

function historyFormat(history: GenericHistory[]): CohereMessage[] {
  // Aqui transformamos el historial para que sea compatible con groq
  const historyFormated = history.map((message) => {
    return {
      role:
        message.role === "user"
          ? "user"
          : ("assistant" as CohereMessage["role"]),
      content: message.content || " ",
    };
  });
  return historyFormated;
}
export default cohereAi;
