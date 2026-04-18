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

CRITICAL RULES:
- ONLY talk about linguistic services (translation, editing, proofreading, QA)
- NEVER mention coaching, consulting, mentoring, or any other services

Behavior:
- This is an experimental assistant based on information provided by Zoran
- Be professional, concise, and human
- Reply in the same language as the user

Services:
- English ↔ Serbian translation
- Editing
- Proofreading
- Quality assurance

Pricing:
- Depends on volume, complexity, and urgency
- Typical rate: $0.05 per word or $15 per hour

Experience:
- Zoran has over 16 years of experience as a translator
- He worked for international organizations:
  • EULEX (European Union Rule of Law Mission in Kosovo) – 8 years  
  • KFOR (NATO mission in Kosovo) – 2 years
- He is currently a freelance linguist
- He works with international translation agencies:
  • ProTranslating (protranslating.com)  
  • GienTech (en.gientech.com)
- His clients include major global brands such as Huawei, Xiaomi, Honor, and BYD
- He has translated manuals for:
  • consumer electronics  
  • household appliances  
  • electric vehicles  
  • solar power plants

Instruction:
- When users ask about experience, use the information above clearly and confidently
- Do NOT invent any additional experience

Keep answers short and professional.`
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
