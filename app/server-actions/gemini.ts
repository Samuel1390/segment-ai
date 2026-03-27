"use server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "../types";
import type { GeminiResponse } from "../types";
import type { GeminiErrorType } from "../components/errors/Errors";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export type GeminiReturnValues =
  | Promise<{ error: GeminiErrorType }>
  | Promise<GeminiResponse>;

export async function gemini(
  state: unknown,
  formData: FormData,
): Promise<GeminiReturnValues> {
  const prompt = formData.get("text") as string;
  const tool = formData.get("tool") as string;
  const historyRaw = formData.get("history") as string;
  const history = historyRaw ? JSON.parse(historyRaw) : [];
  const model = genai.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "Eres un asistente de IA llamado Segment, creado por Samuel Nelo, auque estas basado en gemini, tu nuevo nombre es 'Segment' ya que eres un modelo con unas instrucciones específicas.",
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
    },
  });
  /*if (tool === "images") {
    return await generateImage(prompt, history, model);
  }*/
  return await generateText(prompt, history, model);
}

/*async function generateImage(
  prompt: string,
  history: Message[],
  model: GenerativeModel,
): Promise<GeminiReturnValues> {
  try {
    const optimizedPrompt = await model.generateContent(
      `Genera un prompt detallado para generar una imagen de: ${prompt}`,
    );
    const interaction = await ai.interactions.create({
      model: "gemini-2.5-flash-image",
      input: optimizedPrompt.response.text(),
      response_modalities: ["image"],
    });
    for (const output of interaction.outputs!) {
      if (output.type === "image") {
        console.log(`Generated image with mime_type: ${output.mime_type}`);
        // Save the image
        fs.writeFileSync("image.png", Buffer.from(output.data!, "base64"));
      }
    }
    return {
      output: "Imagen generada",
      imageUrl: "https://pollinations.ai/p/",
      history: [
        ...history.slice(0, -2),
        { role: "user", parts: [{ text: prompt }] },
        { role: "model", parts: [{ text: "Imagen generada" }] },
      ],
    };
  } catch (e: any) {
    console.error("Gemini API Error:", e.status);
    return { error: e.status || "500" };
  }
}*/
async function generateText(
  prompt: string,
  history: Message[],
  model: GenerativeModel,
): Promise<GeminiReturnValues> {
  try {
    const chat = model.startChat({
      history: history,
    });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const thought = response.candidates?.[0].content.parts.find(
      (part) => "thought" in part,
    );
    console.log(thought);
    return {
      output: response.text(),
      history: [
        ...history.slice(0, -2),
        { role: "user", parts: [{ text: prompt }] },
        { role: "model", parts: [{ text: response.text() }] },
      ],
    };
  } catch (e: any) {
    console.error("Gemini API Error:", e.status);
    return { error: e.status || "500" };
  }
}
export default gemini;
