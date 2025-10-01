const Tesseract = require('tesseract.js');

/**
 * Extracts text from an image buffer using Tesseract.js.
 * @param {Buffer} imageBuffer The image file buffer.
 * @returns {Promise<object>} A promise that resolves to an object 
 * containing the extracted text and confidence score.
 */
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