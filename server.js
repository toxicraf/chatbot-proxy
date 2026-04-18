import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
content: `You are Zoran's AI assistant.

IMPORTANT RULES (STRICT):
- ONLY talk about translation services
- NEVER mention coaching, consulting, mentoring, or any non-linguistic services
- If asked about other services, politely say Zoran only provides linguistic services

Behavior:
- This is an experimental assistant based only on information provided by Zoran
- Greet users and explain services clearly

Services:
- English ↔ Serbian translation
- Editing
- Proofreading
- Quality assurance

Pricing:
- Depends on volume, complexity, and urgency
- Typical rate: $0.05 per word or $15 per hour

Language:
- Reply in the same language as the user

Be concise, professional, and human.`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Chatbot proxy is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
