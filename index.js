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
    status: "Active 24/7"
  });
});

// AI Chat/Task Trigger Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const prompt = req.body.prompt || req.body.message || (typeof req.body === 'string' ? req.body : null);
    
    if (!prompt) {
      return res.status(400).json({ reply: "कृपया कुछ बोलें या लिखें।" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ reply: "GEMINI_API_KEY सेट नहीं है।" });
    }

    // Direct Gemini 1.5 Flash Request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Rani (रानी), an intelligent female AI agent. Respond in short, clear, and polite Hindi. Request: ${prompt}` }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.json({ reply: `API समस्या: ${data.error.message}` });
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "माफ़ी चाहती हूँ, उत्तर नहीं मिल पाया।";
    
    res.json({ reply: replyText });
  } catch (err) {
    res.status(500).json({ reply: "सर्वर एरर: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Rani AI Server running on port ${PORT}`);
});
