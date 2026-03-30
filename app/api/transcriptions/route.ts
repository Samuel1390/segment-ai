import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await audio.arrayBuffer());

    console.log("Audio enviado: ", audio);
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const transcription = await groq.audio.transcriptions.create({
      file: await Groq.toFile(buffer, audio.name),
      model: "whisper-large-v3",
      response_format: "json",
    });
    return NextResponse.json(transcription);
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
