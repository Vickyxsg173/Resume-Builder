import dotenv from "dotenv";
dotenv.config();
import { OpenRouter } from "@openrouter/sdk";
const openrouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
async function test() {
  try {
    const stream = await openrouter.chat.send({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: "hello" }],
      stream: true,
    });
    for await (const chunk of stream) {
      console.log(chunk);
    }
  } catch (err) {
    console.error("FAILS WITH:", err.message);
  }
}
test();
