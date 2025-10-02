const ocrService = require('../services/ocr.service');
const aiService = require('../services/ai.service'); 

exports.processReport = async (req, res) => {
  try {
    let rawText = '';

    // --- STEP 1: OCR / Text Extraction ---
    if (req.file) {
      console.log('Processing image input...');
      const ocrResult = await ocrService.extractTextFromImage(req.file.buffer);
      rawText = ocrResult.extracted_text;
    } else if (req.body.text) {
      console.log('Processing text input...');
      rawText = req.body.text;
    } else {
      return res.status(400).json({ error: 'No input provided.' });
    }

    if (!rawText || rawText.trim() === '') {
      return res.status(400).json({ error: 'Could not extract any text from the input.' });
    }

    // --- STEP 2: Normalize Tests JSON using AI ---
    const normalizedData = await aiService.normalizeTests(rawText);

    res.status(200).json({
      message: 'Step 2 (AI Normalization) completed.',
      normalizedData: normalizedData
    });

  } catch (error) {
    console.error('Error in processReport controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};