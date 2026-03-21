import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function gemini(formData: FormData) {
  const text = formData.get("text");
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: text as string,
  });
  console.log(response.text);
}

export default gemini;
