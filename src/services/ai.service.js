const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;



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

exports.generateSummary = async (normalizedTests) => {
  const abnormalTests = normalizedTests.filter(t => t.status && t.status.toLowerCase() !== 'normal');

  if (abnormalTests.length === 0) {
    return {
      summary: "All test results are within the normal range.",
      explanations: []
    };
  }

  console.log('Sending abnormal results to AI for summarization...');

  const prompt = `
    You are a helpful medical assistant who explains lab results in simple, non-alarming terms.
    Based on the following abnormal lab results, generate a patient-friendly summary and a list of brief, general explanations for each finding.

    Follow these rules strictly:
    1.  **DO NOT provide a diagnosis, medical advice, or treatment recommendations.** This is critical.
    2.  Keep the language simple and easy for a non-medical person to understand.
    3.  Your response must be ONLY a JSON object with two keys: "summary" (a single string) and "explanations" (an array of strings).

    Here are the abnormal results:
    ${JSON.stringify(abnormalTests)}
  `;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const jsonString = response.data.candidates[0].content.parts[0].text
      .replace(/```json/g, '').replace(/```/g, '').trim();
      
    console.log('AI summary generation successful.');
    return JSON.parse(jsonString);

  } catch (error) {
    console.error('Error calling Gemini API for summarization:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate summary with AI service.');
  }
};