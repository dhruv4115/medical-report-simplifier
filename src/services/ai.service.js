const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// This is the new, correct line
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;



/**
 * Sends raw medical text to the Gemini API for normalization into JSON.
 * @param {string} rawText The raw text extracted from the medical report.
 * @returns {Promise<object>} A promise that resolves to the structured JSON from the AI.
 */
exports.normalizeTests = async (rawText) => {
  console.log('Sending text to AI for normalization...');

  const prompt = `
    You are an expert medical data extraction bot. Your task is to analyze the following medical report text and convert it into a structured JSON object.

    Follow these rules strictly:
    1.  Extract all medical tests mentioned.
    2.  For each test, identify the "name", "value" (as a number), "unit", and "status" (e.g., "Low", "High", or "Normal" if indicated).
    3.  If reference ranges are provided, include them in a "ref_range" object with "low" and "high" keys.
    4.  Your response MUST BE ONLY the JSON object, with no extra text, explanations, or markdown formatting.
    5.  Do NOT invent or hallucinate any tests or values not present in the text.

    The final JSON must follow this exact schema:
    {
      "tests": [
        {
          "name": "string",
          "value": number,
          "unit": "string",
          "status": "string",
          "ref_range": { "low": number, "high": number }
        }
      ],
      "normalization_confidence": number (a value between 0 and 1)
    }

    Here is the text to process:
    "${rawText}"
  `;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Extract the JSON string from the Gemini response
    const jsonString = response.data.candidates[0].content.parts[0].text
      .replace(/```json/g, '') // Remove markdown start
      .replace(/```/g, '')      // Remove markdown end
      .trim();
      
    console.log('AI normalization successful.');
    return JSON.parse(jsonString); // Convert the string to a JavaScript object

  } catch (error) {
    console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
    throw new Error('Failed to normalize data with AI service.');
  }
};