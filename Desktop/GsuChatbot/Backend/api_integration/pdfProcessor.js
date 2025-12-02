/**
 * PDF Processing Utility
 * 
 * Handles PDF text extraction using OpenAI Vision API
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

const { getOpenAIClient } = require('./openaiClient');

/**
 * Extract text from PDF using OpenAI Vision API
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromPDF(pdfBuffer, fileName) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    // Convert PDF buffer to base64
    const base64PDF = pdfBuffer.toString('base64');

    // Use OpenAI Vision API to extract text
    // Note: OpenAI Vision API works with images, so we'll need to convert PDF pages to images
    // For now, we'll use a simpler approach with text extraction prompt
    
    // Alternative: Use OpenAI to analyze the PDF if it's an image-based PDF
    // For text-based PDFs, we might need a different approach
    
    // For MVP, we'll use a prompt that asks OpenAI to extract transcript information
    // This works best if we send the PDF as an image (first page or all pages)
    
    // Since OpenAI Vision API requires images, we'll need to:
    // 1. Convert PDF pages to images (requires pdf-poppler or similar)
    // 2. Send each page to OpenAI Vision API
    // 3. Combine the extracted text
    
    // For now, let's create a function that uses OpenAI to process the PDF
    // We'll need to install a PDF to image converter or use a different approach
    
    // Temporary solution: Return a placeholder that indicates we need PDF-to-image conversion
    // In production, you would:
    // 1. Convert PDF to images using pdf-poppler or pdf2pic
    // 2. Send each image to OpenAI Vision API
    // 3. Combine results
    
    throw new Error('PDF text extraction requires PDF-to-image conversion. Please install pdf-poppler or use an alternative method.');
    
  } catch (error) {
    console.error('❌ Error extracting text from PDF:', error);
    throw error;
  }
}

/**
 * Extract text from PDF using OpenAI Vision API (with image conversion)
 * This is a placeholder - requires pdf-poppler or similar library
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromPDFWithVision(pdfBuffer, fileName) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    // TODO: Convert PDF pages to images
    // This requires pdf-poppler or pdf2pic library
    // For now, we'll return an error suggesting the implementation
    
    // Example implementation would be:
    // 1. Convert PDF to images (one per page)
    // 2. For each image, convert to base64
    // 3. Send to OpenAI Vision API with prompt: "Extract all text from this academic transcript"
    // 4. Combine all page results
    
    const prompt = `Extract all text from this academic transcript. Include course codes, course names, grades, credits, and semester information. Format the output as structured text.`;

    // Placeholder - actual implementation would process images here
    throw new Error('PDF-to-image conversion not implemented. Please install pdf-poppler or use alternative PDF parsing library.');
    
  } catch (error) {
    console.error('❌ Error extracting text from PDF with Vision API:', error);
    throw error;
  }
}

/**
 * Simple text extraction using OpenAI (fallback method)
 * This uses OpenAI to analyze the PDF if it's already in text format
 * @param {string} textContent - Text content from PDF (if already extracted)
 * @returns {Promise<string>} - Processed and structured text
 */
async function processTranscriptText(textContent) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    const prompt = `Extract and structure the following academic transcript information:
- Course codes and names
- Grades received
- Credits earned
- Semesters/terms
- Overall GPA if available

Format the output as a structured list. Here's the transcript text:

${textContent}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at parsing academic transcripts. Extract all relevant course and grade information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    });

    return completion.choices[0].message.content;
    
  } catch (error) {
    console.error('❌ Error processing transcript text:', error);
    throw error;
  }
}

module.exports = {
  extractTextFromPDF,
  extractTextFromPDFWithVision,
  processTranscriptText
};



