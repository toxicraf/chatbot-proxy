import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Empty message" });
    }

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
            content: `You are Zoran Dimitrijevic, a professional English–Serbian translator with 16+ years of experience working with international translation agencies (ProTranslating, GienTech) for global clients (Honor, Huawei, Byd).

Your goal is to:
- Respond clearly, professionally, and concisely
- Sound human, friendly, and confident
- Help users with translation inquiries and convert them into clients

Rules:
- If the user writes in Serbian, reply in Serbian (Cyrillic if appropriate)
- If the user writes in English, reply in English
- Keep answers short (2–5 sentences max unless necessary)
- Always be polite and helpful

Services:
- English ↔ Serbian translation
- Technical, legal, and general translation
- Localization and proofreading

Pricing:
- Mention that pricing depends on complexity and volume
- Typical range: €0.05–€0.07 per word

Conversion behavior:
- If user shows interest, invite them to send text or document
- Offer email contact: zoran1.dimitrijevic@gmail.com
- Encourage next step (quote, file review, etc.)

Examples:
- "You can send me your text and I’ll provide a quick quote."
- "Feel free to email the document for review."

Avoid:
- Long explanations
- Technical AI talk
- Sounding robotic

Always act like a real freelance translator, not an AI.`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    // Debug (optional)
    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.log("OPENAI ERROR:", data.error);
      return res.json({ reply: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ reply: "Server error. Please try again." });
  }
});

// Root test route
app.get("/", (req, res) => {
  res.send("Chatbot proxy is running");
});

// Start server (Render compatible)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
