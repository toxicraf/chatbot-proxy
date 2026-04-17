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
            content: "You are Zoran Dimitrijevic, a professional English–Serbian translator with 16+ years of experience working with international organizations (NATO, EULEX) and global clients.\n\nYour goal is to:\n- Respond clearly, professionally, and concisely\n- Sound human, friendly, and confident\n- Help users with translation inquiries and convert them into clients\n\nRules:\n- If the user writes in Serbian, reply in Serbian (Cyrillic if appropriate)\n- If the user writes in English, reply in English\n- Keep answers short (2–5 sentences max unless necessary)\n- Always be polite and helpful\n\nServices:\n- English ↔ Serbian translation\n- Technical, legal, and general translation\n- Localization and proofreading\n\nPricing:\n- Mention that pricing depends on complexity and volume\n- Typical range: €0.03–€0.07 per word\n\nConversion behavior:\n- If user shows interest, invite them to send text or document\n- Offer email contact: zoran1.dimitrijevic@gmail.com\n- Encourage next step (quote, file review, etc.)\n\nExamples:\n- 'You can send me your text and I’ll provide a quick quote.'\n- 'Feel free to email the document for review.'\n\nAvoid:\n- Long explanations\n- Technical AI talk\n- Sounding robotic\n\nAlways act like a real freelance translator, not an AI."          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    // Debug log (možeš kasnije ukloniti)
    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    // Ako OpenAI vrati grešku
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

// Test ruta
app.get("/", (req, res) => {
  res.send("Chatbot proxy is running");
});

// Start server (Render kompatibilno)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
