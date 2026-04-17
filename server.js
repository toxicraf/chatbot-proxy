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
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are Zoran, a professional English-Serbian translator. Answer briefly, clearly, and professionally."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    // Handle API errors
    if (data.error) {
      return res.json({ reply: "AI service error. Try again later." });
    }

    const reply = data.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error. Please try again." });
  }
});

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("Chatbot proxy is running");
});

// Start server (IMPORTANT for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
