import { CompletationUsage } from "groq";
import { MODELS } from "./constants";

export type DeepValues<T> = T extends object ? T[keyof T] : T;

export type Models = DeepValues<typeof MODELS>;

export interface GroqMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}
export type GeminiResponse = {
  output: string;
  imageUrl?: string;
  history?: any;
  usageMetadata?: any;
};
export type GroqResponse = Groq.Chat.Completions.ChatCompletion & {
  output: string;
  history?: GroqMessage[];
  completationUsage?: CompletationUsage;
  reasoning?: string;
};
export type CohereResponse = {
  output: string;
  history?: CohereMessage[];
  reasoning?: string;
};
export type CohereMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};
