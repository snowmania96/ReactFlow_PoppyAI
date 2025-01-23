// npm install assemblyai

import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: "875548ba217e4ba2800c3f19826bef9a",
});

const audioUrl = "https://assembly.ai/sports_injuries.mp3";

const config = {
  audio_url: audioUrl,
};

const run = async () => {
  const transcript = await client.transcripts.transcribe(config);
  console.log(transcript.text);
};

run();
