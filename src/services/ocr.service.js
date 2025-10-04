const Tesseract = require('tesseract.js');

exports.extractTextFromImage = async (imageBuffer) => {
  console.log('Starting OCR process...');
  try {
    const result = await Tesseract.recognize(
      imageBuffer,
      'eng', // Language is English
      { logger: m => console.log(m) }
    );
    console.log('OCR process completed successfully.');
    
    return {
      extracted_text: result.data.text,
      confidence: result.data.confidence
    };
  } catch (error) {
    console.error('Error during OCR processing:', error);
    throw new Error('Failed to process image with OCR.');
  }
};