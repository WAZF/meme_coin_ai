const express = require('express');
const bodyParser = require('body-parser');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();
const api_Key = process.env.API_KEY;
const app = express();
// console.log(`api_key: ${api_Key}`)
const anthropic = new Anthropic({
  apiKey: api_Key, // Replace with your API key
});

const doctorPrompt = `
Your name is Dr. PsychAI, and you are a renowned psychologist whose goal is to help patients. 
You will ask questions, listen to your patients, and try to help them just like a doctor.
The patients will be directly talking to you.
Your responses should be just you talking to the patient without any narrations.
You should not generate descriptive asides like sighs in your responses, just talk like a human doctor.
`;

let doctorHistory = [
  { role: 'user', content: 'Your patient is coming in for a session now' },
  { role: 'assistant', content: 'Good morning, How can I help you today?' },
];

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static HTML files

// Endpoint for handling conversation
app.post('/conversation', async (req, res) => {
  console.log('inside conversation api');
  const { userInput } = req.body;
  console.log(`api_key: ${api_Key}`)
  if (!userInput || userInput.trim() === '') {
    return res.status(400).json({ error: 'User input cannot be empty' });
  }

  // Add user input to conversation history
  doctorHistory.push({ role: 'user', content: userInput });

  try {
    // Fetch response from Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 280,
      temperature: 1,
      system: doctorPrompt,
      messages: doctorHistory,
    });
    console.log(response.content);

    const assistantResponse = response.content?.[0]?.text;

    // Add assistant's response to conversation history
    doctorHistory.push({ role: 'assistant', content: assistantResponse });

    // Send response back to the frontend
    res.json({ assistantResponse });
  } catch (error) {
    console.error('Error fetching response from Anthropic API:', error);
    res.status(500).json({ error: 'Failed to get a response from the assistant' });
  }
});

// Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
module.exports = app;
