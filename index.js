const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = "You are Rani (रानी), an intelligent female AI agent. Respond naturally and politely in Hindi speech format.";
    const result = await model.generateContent(`${systemInstruction}\nUser Request: ${prompt}`);
    const response = await result.response;
    const replyText = response.text() || "माफ़ी चाहती हूँ, उत्तर प्रोसेस नहीं हो पाया।";
    
    res.json({ reply: replyText });
  } catch (err) {
    res.status(500).json({ error: "API Error: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Rani AI Server running on port ${PORT}`);
});
  
