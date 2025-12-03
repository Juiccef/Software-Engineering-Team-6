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

/**
 * Extract and structure transcript data into JSON format
 * This is the main function that extracts all transcript information into a structured format
 * @param {string} textContent - Raw text content from PDF
 * @returns {Promise<Object>} - Structured transcript data in JSON format
 */
async function extractStructuredTranscriptData(textContent) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    console.log('📊 Extracting structured transcript data...');

    const prompt = `Extract ALL information from this academic transcript and return it as a structured JSON object.

Extract the following information:
1. **Student Information**: 
   - Name (if available)
   - Student ID (if available)
   - Major (if available)

2. **GPA Information**: 
   - Overall GPA (if available)
   - Term GPAs (if available)

3. **All Completed Courses**: For each course, extract:
   - Course code (EXACT format, e.g., "CSC 1301", "MATH 1111", "ENGL 1101")
   - Course name (full name)
   - Grade received (A, B, C, D, F, P, S, W, etc.)
   - Credits earned (number)
   - Semester/Term taken (Fall 2023, Spring 2024, etc.)
   - Year taken

4. **In-Progress Courses**: Any courses currently in progress (if any)

5. **Transfer Credits**: If any courses are marked as transfer credits

CRITICAL REQUIREMENTS:
- Extract course codes EXACTLY as they appear (preserve spacing, capitalization)
- Include ALL courses that have been completed (have a grade)
- Do NOT include courses that are in-progress, withdrawn (W), or incomplete
- If a course appears multiple times (retaken), include all instances
- Normalize course codes to standard format: "SUBJ XXXX" (e.g., "CSC 1301" not "CSC1301")

Return ONLY a valid JSON object with this exact structure:
{
  "student": {
    "name": "Student Name",
    "id": "Student ID",
    "major": "Major Name"
  },
  "gpa": {
    "overall": 3.5,
    "terms": []
  },
  "courses": [
    {
      "code": "CSC 1301",
      "name": "Principles of Computer Science I",
      "grade": "A",
      "credits": 3,
      "semester": "Fall 2023",
      "year": 2023
    }
  ],
  "inProgress": [],
  "transferCredits": [],
  "totalCredits": 45
}

Transcript text:
${textContent.substring(0, 10000)}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert academic transcript parser. Extract ALL information accurately into structured JSON. Return ONLY valid JSON, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const structuredData = JSON.parse(completion.choices[0].message.content);
    
    // Normalize course codes
    if (structuredData.courses && Array.isArray(structuredData.courses)) {
      structuredData.courses = structuredData.courses.map(course => {
        let normalizedCode = course.code || '';
        const codeMatch = normalizedCode.match(/^([A-Z]{2,4})\s*(\d{4})$/i);
        if (codeMatch) {
          normalizedCode = `${codeMatch[1].toUpperCase()} ${codeMatch[2]}`;
        }
        
        return {
          ...course,
          code: normalizedCode,
          codeUpper: normalizedCode.toUpperCase().trim()
        };
      });
    }
    
    console.log(`✅ Extracted structured transcript data: ${structuredData.courses?.length || 0} courses`);
    
    return structuredData;
    
  } catch (error) {
    console.error('❌ Error extracting structured transcript data:', error);
    // Return minimal structure on error
    return {
      student: {},
      gpa: {},
      courses: [],
      inProgress: [],
      transferCredits: [],
      totalCredits: 0,
      error: error.message
    };
  }
}

module.exports = {
  extractTextFromPDF,
  extractTextFromPDFWithVision,
  processTranscriptText,
  extractStructuredTranscriptData
};



