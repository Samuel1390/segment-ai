import { CompletationUsage } from "groq";
import { MODELS } from "./constants";

export type Models = (typeof MODELS)[keyof typeof MODELS];

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
  history: Message[];
  usageMetadata?: UsageMetadata;
};
export type GroqResponse = {
  output: string;
  history: GroqMessage[];
  completationUsage?: CompletationUsage;
};
