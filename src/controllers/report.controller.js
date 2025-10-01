const ocrService = require('../services/ocr.service');

exports.processReport = async (req, res) => {
  try {
    let rawText = '';
    let step1_output;

    // --- STEP 1: OCR / Text Extraction ---
    if (req.file) { // If an image is uploaded
      console.log('Processing image input...');
      step1_output = await ocrService.extractTextFromImage(req.file.buffer);
      rawText = step1_output.extracted_text;
      
    } else if (req.body.text) { // If text is provided
      console.log('Processing text input...');
      rawText = req.body.text;
      step1_output = { tests_raw: rawText.split('\n'), confidence: 1.0, extracted_text: rawText };

    } else {
      return res.status(400).json({ error: 'No input provided. Use "text" field or "image" file.' });
    }

    res.status(200).json({
      message: 'Step 1 (OCR/Extraction) completed.',
      source: req.file ? 'image' : 'text',
      extractedData: step1_output
    });

  } catch (error) {
    console.error('Error in processReport controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};