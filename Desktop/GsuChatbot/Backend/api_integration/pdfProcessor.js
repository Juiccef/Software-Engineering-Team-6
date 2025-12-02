/**
 * PDF Processing Utility
 * 
 * Handles PDF text extraction using OpenAI Vision API
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

const { getOpenAIClient } = require('./openaiClient');
let pdf;
try {
  pdf = require('pdf-parse');
} catch (error) {
  console.warn('⚠️ pdf-parse not available:', error.message);
}

/**
 * Extract text from PDF using pdf-parse library
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromPDF(pdfBuffer, fileName) {
  try {
    if (!pdf) {
      throw new Error('pdf-parse library is not installed. Please run: npm install pdf-parse');
    }
    
    console.log('📄 Extracting text from PDF:', fileName);
    
    // Use pdf-parse to extract text from PDF
    const data = await pdf(pdfBuffer);
    const extractedText = data.text;
    
    console.log(`✅ Extracted ${extractedText.length} characters from PDF`);
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF. The PDF may be image-based or corrupted.');
    }
    
    return extractedText;
    
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
 * Analyze and structure transcript text using OpenAI
 * This uses OpenAI to intelligently parse and structure the transcript
 * @param {string} textContent - Raw text content from PDF
 * @returns {Promise<string>} - Processed and structured transcript text
 */
async function processTranscriptText(textContent) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    console.log('🤖 Analyzing transcript with OpenAI...');

    const prompt = `You are an expert at analyzing academic transcripts. Extract and structure ALL information from this transcript.

Extract the following information:
1. **Student Information**: Name, ID, major (if available)
2. **GPA Information**: Overall GPA, term GPAs (if available)
3. **All Completed Courses**: For each course, extract:
   - Course code (e.g., "CSC 1301", "MATH 1111")
   - Course name (full name)
   - Grade received (A, B, C, D, F, P, W, etc.)
   - Credits earned
   - Semester/Term taken (Fall 2023, Spring 2024, etc.)
   - Year taken

4. **In-Progress Courses**: Any courses currently in progress
5. **Transfer Credits**: If any courses are marked as transfer credits

IMPORTANT:
- Extract course codes EXACTLY as they appear (e.g., "CSC 1301" not "CSC1301" or "CS 1301")
- Include ALL courses, even if they have unusual formats
- If a course code appears multiple times, include all instances
- Preserve the exact format of course codes (spaces, capitalization)

Format your response as a structured analysis that clearly lists all completed courses with their codes, names, grades, credits, and semesters.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Use a more capable model for better extraction
      messages: [
        {
          role: 'system',
          content: 'You are an expert academic transcript analyst. Your job is to extract ALL course information accurately, preserving exact course codes and formatting. Be thorough and precise.'
        },
        {
          role: 'user',
          content: `${prompt}\n\nTranscript text:\n\n${textContent.substring(0, 15000)}` // Limit to avoid token limits
        }
      ],
      max_tokens: 3000,
      temperature: 0.1 // Low temperature for accuracy
    });

    const analyzedText = completion.choices[0].message.content;
    console.log('✅ Transcript analysis complete');
    
    return analyzedText;
    
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



