import "dotenv/config";
import express from "express";
import { run } from "@openai/agents";
import { afrigTrendAgent } from "./agent.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const sessions = new Map();

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

async function sendWhatsAppText(to, body) {
  const version = requiredEnv("GRAPH_API_VERSION");
  const phoneNumberId = requiredEnv("WHATSAPP_PHONE_NUMBER_ID");
  const token = requiredEnv("WHATSAPP_ACCESS_TOKEN");

  const url = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp API error ${response.status}: ${errorText}`);
  }
}

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  // Acknowledge Meta quickly.
  res.sendStatus(200);

  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== "text") return;

    const from = message.from;
    const text = message.text?.body?.trim();
    if (!from || !text) return;

    const previous = sessions.get(from) || [];
    const history = previous.slice(-12);

    const input = [
      ...history,
      { role: "user", content: text }
    ];

    const result = await run(afrigTrendAgent, input);
    const reply = result.finalOutput || "Je vais vérifier cette information pour vous.";

    sessions.set(from, [
      ...history,
      { role: "user", content: text },
      { role: "assistant", content: reply }
    ].slice(-20));

    await sendWhatsAppText(from, reply);
  } catch (error) {
    console.error(error);
  }
});

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    agent: "AFRIG TREND",
    webhook: "/webhook"
  });
});

app.listen(PORT, () => {
  console.log(`AFRIG TREND AI Agent running on port ${PORT}`);
});
