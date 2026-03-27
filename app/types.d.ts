export interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}
export type GeminiResponse = {
  output: string;
  imageUrl?: string;
  history: Message[];
};
