const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rani AI Base Status Endpoint
app.get('/api/status', (req, res) => {
  res.json({
    agent: "Rani AI (रानी)",
    status: "Active 24/7",
    specifications: "9 Master Specifications Loaded"
  });
});

// AI Chat/Task Trigger Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const prompt = req.body.prompt || req.body.message || (typeof req.body === 'string' ? req.body : null);
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt nahi mil paaya." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY Missing in Environment Variables" });
    }

    // Gemini API Request using gemini-1.5-flash
    let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Rani (रानी), an intelligent female AI agent. Reply in polite Hindi. User Request: ${prompt}` }]
        }]
      })
    });

    let data = await response.json();

    // If model fails, fallback to gemini-1.5-pro
    if (data.error) {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `You are Rani (रानी), an intelligent female AI agent. Reply in polite Hindi. User Request: ${prompt}` }]
          }]
        })
      });
      data = await response.json();
    }

    if (data.error) {
      return res.json({ reply: `API Error: ${data.error.message}` });
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mafi chahti hu, uttar process nahi ho paya.";
    
    res.json({ reply: replyText });
  } catch (err) {
    res.status(500).json({ error: "Server Error: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Rani AI Server running on port ${PORT}`);
});
