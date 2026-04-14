import dotenv from "dotenv";
dotenv.config();
import { OpenRouter } from "@openrouter/sdk";
import axios from "axios";

const KEY = process.env.OPENROUTER_API_KEY;

// Test OpenRouter SDK
async function testSDK() {
  const openrouter = new OpenRouter({ apiKey: KEY });
  try {
    const completion = await openrouter.chat.send({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: "Say 'SDK working'" }],
    });
    console.log("SDK Success:", completion.choices[0].message.content);
  } catch (err) {
    console.error("SDK Failed:", err.message);
    if (err.response) console.error("Data:", err.response.data);
  }
}

// Test direct API call via Axios
async function testAxios() {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: "Say 'Axios working'" }]
      },
      {
        headers: {
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Axios Success:", response.data.choices[0].message.content);
  } catch (err) {
    console.error("Axios Failed:", err.message);
    if (err.response) console.error("Data:", err.response.data);
  }
}

async function run() {
  if (!KEY) {
    console.error("ERROR: OPENROUTER_API_KEY is missing in .env");
    return;
  }
  await testSDK();
  await testAxios();
}

run();
