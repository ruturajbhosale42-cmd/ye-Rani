const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rani AI Base Endpoint
app.get('/', (req, res) => {
  res.json({
    agent: "Rani AI (रानी)",
    status: "Active 24/7",
    specifications: "9 Master Specifications Loaded"
  });
});

// AI Chat/Task Trigger Endpoint
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable missing" });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Rani (रानी), an autonomous AI agent. Respond in polite Hindi. Task: ${prompt}` }] }]
      })
    });

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mafi chahti hu, uttar process nahi ho paya.";
    
    res.json({ reply: replyText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Rani AI Server running on port ${PORT}`);
});
    
