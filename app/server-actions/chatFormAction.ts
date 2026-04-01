/*
 Esta es la funcion principal, se encarga de: administrar los modelos, hacerlos compatibles entre ellos guardando el historial,
 y devolver la respuesta al cliente, por ahora tenemos 3 modelos: gpt, llama y gemini, gpt y llama usan groq, gemini usa la api de google,
 ambas apis tienen formatos para el LLM, aunque son similares, no son iguales, por lo que se debe hacer una conversion de formatos,
 y para eso usamos el GenericHistory type, que es un tipo que representa el historial de mensajes en un formato comun,
*/
"use server";
import fs from "node:fs/promises";
import path from "node:path";
import groqAI from "./groq";
import type { ModelErrorObj } from "../components/errors/Errors";
import { MODELS } from "../constants";
import gemini from "./gemini";
import type { ModelHashes } from "../constants";
import cohereAi from "./cohere";
import { nanoid } from "nanoid";

export type GenericHistory = {
  // se encarga de hacer compatibles los historiales
  role: "user" | "model";
  content: string;
  reasoning?: string;
};

// Datos adicionales del historial para manejar en el frontend
// Estos datos no deben pasarse al modelo
export type HistoryData = {
  prompt: string;
  files?: File[];
  filesNames?: string[];
  messageId: string;
  model: ModelHashes;
  supportsReasoning: boolean;
};

export type GenericResponse = // hace compatibles las respuestas
  | ModelErrorObj
  | {
      output: string;
      history: GenericHistory[];
      historyData: HistoryData[];
    };

const ChatFormAction = async (
  state: unknown,
  formData: FormData,
): Promise<GenericResponse> => {
  // ESTE CODIGO ES UNA OBRA DE ARTE, EL QUE DIGA LO CONTRARIO VENGA Y ME LO DICE EN LA CARA
  const prompt = formData.get("prompt") as string;
  const files = formData.getAll("files") as File[];
  const filesNames = files.map((file) => file.name);
  const model = formData.get("model") as ModelHashes;
  const historyRaw = formData.get("history") as string;
  const history: GenericHistory[] = historyRaw ? JSON.parse(historyRaw) : [];
  const messageId = nanoid();

  const historyDataRaw = formData.get("historyData") as string;
  const historyData: HistoryData[] = historyDataRaw
    ? JSON.parse(historyDataRaw)
    : [];

  const instruccions = await fs.readFile(
    path.join(process.cwd(), "app/server-actions/ModelInstructions.md"),
    "utf-8",
  ); // obtenemos las instrucciones para que el modelo tenga contexto
  const modelObj = getModelObj(model);

  // Aqui manejamos dos casos, el caso de groq y el caso de gemini
  // Ambos modelos usan diferentes apis, por lo que se debe hacer una conversion de formatos para hacerlos compatibles
  if (modelObj.provider === "groq") {
    const supportsReasoning = modelObj.supportsReasoning;
    const response = await groqAI(
      formData,
      instruccions,
      model,
      supportsReasoning,
    );
    if ("error" in response) {
      return response; // { error: "500" | "401" | "404" | "429" | "408" | "503" | "504" } cada uno con su mensaje de error delarado en Errors.tsx
    }

    return {
      output: response.output, // Respuesta del modelo pero accedemos de una forma mas comoda
      history: [
        ...history,
        { role: "user", content: formData.get("prompt") as string },
        {
          role: "model",
          content: response.output,
          reasoning: response?.reasoning || undefined,
        }, // guardamos la respuesta en el historial
      ],
      historyData: [
        ...historyData,
        {
          prompt,
          files,
          filesNames,
          messageId,
          model,
          supportsReasoning,
        },
      ],
    };
  } else if (modelObj.provider === "gemini") {
    const supportsReasoning = modelObj.supportsReasoning;
    const response = await gemini(
      formData,
      instruccions,
      model,
      supportsReasoning,
    );
    if ("error" in response) {
      return response;
    }
    return {
      output: response.output, // Respuesta del modelo pero accedemos de una forma mas comoda
      history: [
        ...history,
        { role: "user", content: formData.get("prompt") as string },
        { role: "model", content: response.output }, // guardamos la respuesta en el historial
      ],
      historyData: [
        ...historyData,
        {
          prompt,
          files,
          filesNames,
          model,
          messageId,
          supportsReasoning,
        },
      ],
    };
  } else if (modelObj.provider === "cohere") {
    const supportsReasoning = modelObj.supportsReasoning;
    const response = await cohereAi(
      formData,
      instruccions,
      model,
      supportsReasoning,
    );
    if ("error" in response) {
      return response;
    }
    return {
      output: response.output, // Respuesta del modelo pero accedemos de una forma mas comoda
      history: [
        ...history,
        { role: "user", content: formData.get("prompt") as string },
        { role: "model", content: response.output }, // guardamos la respuesta en el historial
      ],
      historyData: [
        ...historyData,
        {
          prompt,
          files,
          model,
          filesNames,
          messageId,
          supportsReasoning,
        },
      ],
    };
  }
  throw new Error("Modelo no soportado"); // Revisa los modelos en el frontend para debuggear
};

function getModelObj(modelHash: ModelHashes) {
  // Recupera el provaider para asegurarnos de que el modelo esta correcto en el frontend
  const modelObj = MODELS.find((mdl) => mdl.modelHash === modelHash);
  if (!modelObj) {
    // Si ves este error revisa el frontend, no deberia pasar (eso espero)
    throw new Error("Modelo no soportado");
  }
  return modelObj;
}

export default ChatFormAction;
