import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.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}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are Zoran, a professional English-Serbian translator. Answer briefly and professionally."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
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
