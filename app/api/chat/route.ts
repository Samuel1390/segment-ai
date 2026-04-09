import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CohereClientV2 } from "cohere-ai";
import fs from "node:fs/promises";
import path from "node:path";
import type { ModelHashes } from "../../constants";
import type { HistoryData } from "../../server-actions/chatFormAction";
import type { GroqMessage, GeminiMessage, CohereMessage } from "../../types";
import handleFiles from "../../utils/handleFiles";
import getModelObj from "../../utils/getModelObj";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const cohere = new CohereClientV2({ token: process.env.CO_API_KEY });

function groqHistoryFormat(historyData: HistoryData[]): GroqMessage[] {
  return historyData.flatMap(({ messages }) =>
    messages.map(({ role, content }) => ({
      role: role === "user" ? "user" : ("assistant" as GroqMessage["role"]),
      content: content || " ",
    })),
  );
}

function geminiHistoryFormat(historyData: HistoryData[]): GeminiMessage[] {
  return historyData.flatMap(({ messages }) =>
    messages.map((message) => ({
      role: message.role, // "model" | "user"
      parts: [{ text: message.content || " " }],
    })),
  );
}

function cohereHistoryFormat(historyData: HistoryData[]): CohereMessage[] {
  return historyData.flatMap(({ messages }) =>
    messages.map((message) => ({
      role: message.role === "user" ? "user" : "assistant",
      content: message.content || " ",
    })),
  );
}

export async function POST(request: Request) {
  try {
    //throw new Error("Error para probar el manejo de errores");
    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;
    const model = formData.get("model") as ModelHashes;
    const historyDataRaw = formData.get("historyData") as string;
    const historyData: HistoryData[] = historyDataRaw
      ? JSON.parse(historyDataRaw)
      : [];
    const files = formData.getAll("files") as File[];
    const weHaveFiles = files.length > 0;

    const modelObj = getModelObj(model);
    const supportsReasoning = modelObj.supportsReasoning;

    const instruccions = await fs.readFile(
      path.join(process.cwd(), "app/server-actions/ModelInstructions.md"),
      "utf-8",
    );

    const finalPrompt = weHaveFiles ? await handleFiles(files, prompt) : prompt;

    // Crear el ReadableStream que escribirá eventos SSE
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          if (modelObj.provider === "groq") {
            const stream = await groq.chat.completions.create({
              messages: [
                { role: "system", content: instruccions },
                ...groqHistoryFormat(historyData),
                { role: "user", content: finalPrompt },
              ],
              temperature: 0.2,
              model,
              stream: true,
              include_reasoning: supportsReasoning ? true : undefined,
            });

            let reasoning = "";
            for await (const chunk of stream) {
              const delta = chunk.choices[0]?.delta;
              if (!delta) continue;

              if ((delta as any).reasoning) {
                reasoning += (delta as any).reasoning;
              }

              if (delta.content) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ content: delta.content })}\n\n`,
                  ),
                );
              }
            }
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ done: true, reasoning: reasoning || " " })}\n\n`,
              ),
            );
          } else if (modelObj.provider === "gemini") {
            const geminiModel = genai.getGenerativeModel({
              model: model,
              systemInstruction: instruccions,
              generationConfig: {
                temperature: 0.7,
                topP: 0.95,
              },
            });
            const chat = geminiModel.startChat({
              history: geminiHistoryFormat(historyData) as any,
            });

            const resultStream = await chat.sendMessageStream(finalPrompt);

            for await (const chunk of resultStream.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ content: text })}\n\n`,
                  ),
                );
              }
            }
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`),
            );
          } else if (modelObj.provider === "cohere") {
            const stream = await cohere.chatStream({
              messages: [
                { role: "system", content: instruccions },
                ...cohereHistoryFormat(historyData),
                { role: "user", content: finalPrompt },
              ],
              temperature: 0.2,
              model,
            });

            for await (const chatEvent of stream) {
              if (
                chatEvent.type === "content-delta" &&
                chatEvent.delta?.message?.content?.text
              ) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ content: chatEvent.delta.message.content.text })}\n\n`,
                  ),
                );
              }
            }
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`),
            );
          } else {
            throw new Error(`Proveedor no soportado: ${modelObj.provider}`);
          }

          controller.close();
        } catch (e: any) {
          console.error("Stream error:", e);
          const errorCode = e?.status || "500";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: String(errorCode) })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e: any) {
    console.error("Route handler error:", e);
    return Response.json(
      { error: e?.status ? String(e.status) : "500" },
      { status: 500 },
    );
  }
}
