/**
 * Schedule Generation Service
 * 
 * Generates personalized course schedules based on transcript, major requirements, and workload preferences.
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

const { getOpenAIClient } = require('./openaiClient');
const { getMajorContext } = require('./pineconeClient');

/**
 * Get the current or next semester based on the current date
 * @returns {string} - Semester string like "Fall 2026" or "Spring 2026"
 */
function getCurrentSemester() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Academic year typically runs:
  // Fall: August-December (months 8-12)
  // Spring: January-May (months 1-5)
  // Summer: June-July (months 6-7)
  
  if (currentMonth >= 8 || currentMonth <= 1) {
    // August-December or January: Current/Next Fall
    // If we're in Jan, it's still the previous academic year's spring, so next is Fall of same year
    // If we're in Aug-Dec, next semester is Spring of next year, but we're in Fall of current year
    if (currentMonth >= 8) {
      // We're in Fall semester
      return `Fall ${currentYear}`;
    } else {
      // We're in January, so next major semester is Fall of this year
      return `Fall ${currentYear}`;
    }
  } else if (currentMonth >= 2 && currentMonth <= 5) {
    // February-May: Spring semester
    return `Spring ${currentYear}`;
  } else {
    // June-July: Summer, so next is Fall
    return `Fall ${currentYear}`;
  }
}

/**
 * Get the next upcoming semester for schedule planning
 * @returns {string} - Next semester string like "Spring 2026" or "Fall 2026"
 */
function getNextSemester() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Academic year typically runs:
  // Fall: August-December (months 8-12)
  // Spring: January-May (months 1-5)
  // Summer: June-July (months 6-7)
  
  if (currentMonth >= 8 && currentMonth <= 12) {
    // August-December: Currently in Fall, next is Spring of next year
    return `Spring ${currentYear + 1}`;
  } else if (currentMonth >= 1 && currentMonth <= 5) {
    // January-May: Currently in Spring, next is Fall of same year
    return `Fall ${currentYear}`;
  } else {
    // June-July: Summer, next is Fall of same year
    return `Fall ${currentYear}`;
  }
}

/**
 * Parse completed courses from transcript text using OpenAI
 * This function uses OpenAI to intelligently extract all completed courses
 * @param {string} transcriptText - Extracted and analyzed transcript text
 * @returns {Promise<Array>} - Array of completed courses with codes, names, grades, credits
 */
async function parseCompletedCourses(transcriptText) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    console.log('🔍 Parsing completed courses from transcript...');

    const prompt = `Extract ALL completed courses from this academic transcript. 

For each completed course, extract:
- **Course code** (EXACT format, e.g., "CSC 1301", "MATH 1111", "ENGL 1101")
- **Course name** (full name)
- **Grade received** (A, B, C, D, F, P, S, W, etc.)
- **Credits earned** (number)
- **Semester/Term** (e.g., "Fall 2023", "Spring 2024")
- **Year** (if available separately)

CRITICAL REQUIREMENTS:
1. Extract course codes EXACTLY as they appear (preserve spacing, capitalization)
2. Include ALL courses that have been completed (have a grade)
3. Do NOT include courses that are in-progress, withdrawn (W), or incomplete
4. If a course appears multiple times (retaken), include all instances
5. Normalize course codes to standard format: "SUBJ XXXX" (e.g., "CSC 1301" not "CSC1301")

Return a JSON object with this structure:
{
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
  "gpa": 3.5,
  "totalCredits": 45
}

Transcript text:
${transcriptText.substring(0, 8000)}`; // Reduced to 8k for faster processing

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and accurate model
      messages: [
        {
          role: 'system',
          content: 'You are an expert academic transcript parser. Extract ALL completed courses with EXACT course codes. Be thorough and accurate. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000, // Reduced for faster response
      temperature: 0.1, // Low temperature for accuracy
      response_format: { type: 'json_object' }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    const courses = response.courses || [];
    
    // Normalize course codes to ensure consistent format
    const normalizedCourses = courses.map(course => {
      // Normalize course code format: ensure space between subject and number
      let normalizedCode = course.code || '';
      // Pattern: 2-4 letters followed by optional space and 4 digits
      const codeMatch = normalizedCode.match(/^([A-Z]{2,4})\s*(\d{4})$/i);
      if (codeMatch) {
        normalizedCode = `${codeMatch[1].toUpperCase()} ${codeMatch[2]}`;
      }
      
      return {
        ...course,
        code: normalizedCode,
        codeUpper: normalizedCode.toUpperCase().trim() // For easy comparison
      };
    });
    
    console.log(`✅ Parsed ${normalizedCourses.length} completed courses from transcript`);
    
    return normalizedCourses;

  } catch (error) {
    console.error('❌ Error parsing completed courses:', error);
    // Fallback: try to extract course codes using regex
    const courseCodeRegex = /\b([A-Z]{2,4})\s*(\d{4})\b/g;
    const matches = [];
    let match;
    
    while ((match = courseCodeRegex.exec(transcriptText)) !== null) {
      matches.push({
        code: `${match[1]} ${match[2]}`,
        name: 'Unknown',
        grade: 'Unknown',
        credits: 3,
        semester: 'Unknown'
      });
    }
    
    return matches;
  }
}

/**
 * Generate schedule based on transcript, major context, and workload preference
 * @param {Object} transcriptData - Transcript data with extracted text
 * @param {Object} majorContext - Major context from Pinecone
 * @param {string} workloadPreference - 'light', 'medium', or 'heavy'
 * @param {Array} requestedCourses - Optional array of courses user specifically requested
 * @returns {Promise<Object>} - Generated schedule with courses and sections
 */
async function generateSchedule(transcriptData, majorContext, workloadPreference, requestedCourses = [], yearLevel = null) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    // DEFENSIVE: Ensure majorContext is always a valid object, never null
    if (!majorContext || typeof majorContext !== 'object') {
      console.warn('⚠️ majorContext is null or invalid, using default empty object');
      majorContext = {
        major: transcriptData.major || null,
        requirements: [],
        availableCourses: [],
        prerequisites: {},
        degreeAudit: null
      };
    }
    
    // Ensure availableCourses is always an array
    if (!Array.isArray(majorContext.availableCourses)) {
      console.warn('⚠️ majorContext.availableCourses is not an array, defaulting to empty array');
      majorContext.availableCourses = [];
    }
    
    // Ensure requirements is always an array
    if (!Array.isArray(majorContext.requirements)) {
      majorContext.requirements = [];
    }
    
    // Ensure prerequisites is always an object
    if (!majorContext.prerequisites || typeof majorContext.prerequisites !== 'object') {
      majorContext.prerequisites = {};
    }
    
    console.log('📊 majorContext state:', {
      hasMajor: !!majorContext.major,
      requirementsCount: majorContext.requirements.length,
      availableCoursesCount: majorContext.availableCourses.length,
      prerequisitesCount: Object.keys(majorContext.prerequisites).length,
      yearLevel: yearLevel
    });

    // Parse completed courses - use structured data if available for faster processing
    let completedCourses = [];
    
    if (transcriptData.structuredData && transcriptData.structuredData.courses && Array.isArray(transcriptData.structuredData.courses)) {
      // Use pre-extracted structured data (much faster!)
      console.log('✅ Using structured transcript data for course parsing');
      completedCourses = transcriptData.structuredData.courses.map(course => ({
        ...course,
        codeUpper: (course.code || '').toUpperCase().trim()
      }));
      console.log(`📋 Loaded ${completedCourses.length} courses from structured data`);
    } else {
      // Fallback to parsing from text
      console.log('⚠️ No structured data available, parsing from text...');
      completedCourses = await parseCompletedCourses(transcriptData.extracted_text || '');
    }

    // Get all course codes in multiple formats for better matching (do this first)
    const completedCourseCodes = completedCourses.map(c => {
      const code = c.codeUpper || c.code.toUpperCase().trim();
      // Also create variations for matching (e.g., "CSC 1301" -> ["CSC 1301", "CSC1301"])
      const variations = [code];
      const noSpace = code.replace(/\s+/g, '');
      if (noSpace !== code) variations.push(noSpace);
      return variations;
    }).flat();
    
    console.log(`📋 Completed courses (${completedCourses.length}):`, completedCourseCodes.slice(0, 10));

    // Determine credit range
    const creditRanges = {
      light: { min: 12, max: 13 },
      medium: { min: 14, max: 15 },
      heavy: { min: 16, max: 18 }
    };
    const creditRange = creditRanges[workloadPreference] || creditRanges.medium;

    // Prepare context for schedule generation
    // Filter out completed courses from available courses context
    let availableCourses = majorContext.availableCourses.length > 0
      ? majorContext.availableCourses.join('\n')
      : null;
    
    // FALLBACK: If no major context courses available, use year-level based recommendations
    if (!availableCourses || availableCourses === 'No course information available.') {
      console.log('📚 No major context courses available, using year-level fallback recommendations');
      
      // Comprehensive year-level based course recommendations with electives
      const fallbackCourses = {
        freshman: [
          // Core CS Intro Courses
          'CSC 1301: Principles of Computer Science I (3 credits) - Prerequisites: None',
          'CSC 1302: Principles of Computer Science II (3 credits) - Prerequisites: CSC 1301',
          // Math Foundation
          'MATH 1111: College Algebra (3 credits) - Prerequisites: None',
          'MATH 1113: Precalculus (3 credits) - Prerequisites: MATH 1111',
          'MATH 2211: Calculus I (4 credits) - Prerequisites: MATH 1113',
          // English Composition
          'ENGL 1101: English Composition I (3 credits) - Prerequisites: None',
          'ENGL 1102: English Composition II (3 credits) - Prerequisites: ENGL 1101',
          // Social Sciences (Electives)
          'HIST 2110: Survey of United States History (3 credits) - Prerequisites: None',
          'POLS 1101: American Government (3 credits) - Prerequisites: None',
          'PSYC 1101: Introduction to Psychology (3 credits) - Prerequisites: None',
          'SOCI 1101: Introduction to Sociology (3 credits) - Prerequisites: None',
          // Natural Sciences (Electives)
          'BIOL 1103: Principles of Biology I (3 credits) - Prerequisites: None',
          'CHEM 1211: Principles of Chemistry I (3 credits) - Prerequisites: MATH 1111',
          'PHYS 1111: Introductory Physics I (3 credits) - Prerequisites: MATH 1111',
          // Arts & Humanities (Electives)
          'ARTH 1100: Art Appreciation (3 credits) - Prerequisites: None',
          'MUSI 1100: Music Appreciation (3 credits) - Prerequisites: None',
          'PHIL 1010: Introduction to Philosophy (3 credits) - Prerequisites: None'
        ],
        sophomore: [
          // Core CS Courses (after prerequisites)
          'CSC 2720: Data Structures (3 credits) - Prerequisites: CSC 1302, MATH 2211',
          'CSC 2302: Computer Organization and Programming (3 credits) - Prerequisites: CSC 1302',
          'CSC 2510: Theoretical Foundations of Computer Science (3 credits) - Prerequisites: CSC 1302, MATH 2211',
          // Advanced Math
          'MATH 2212: Calculus II (4 credits) - Prerequisites: MATH 2211',
          'MATH 2215: Linear Algebra (3 credits) - Prerequisites: MATH 2211',
          'MATH 2420: Discrete Mathematics (3 credits) - Prerequisites: MATH 2211',
          // Physics
          'PHYS 2211: Principles of Physics I (4 credits) - Prerequisites: MATH 2211',
          'PHYS 2212: Principles of Physics II (4 credits) - Prerequisites: PHYS 2211, MATH 2212',
          // Business Electives
          'ACCT 2101: Principles of Accounting I (3 credits) - Prerequisites: None',
          'ECON 2105: Principles of Macroeconomics (3 credits) - Prerequisites: None',
          'MKTG 3010: Principles of Marketing (3 credits) - Prerequisites: None',
          // Communication Electives
          'COMM 1000: Human Communication (3 credits) - Prerequisites: None',
          'JOUR 1000: Introduction to Mass Communication (3 credits) - Prerequisites: None',
          // Foreign Language Electives
          'SPAN 1001: Elementary Spanish I (3 credits) - Prerequisites: None',
          'FREN 1001: Elementary French I (3 credits) - Prerequisites: None'
        ],
        junior: [
          // Upper-Division CS Core
          'CSC 3210: Computer Organization and Architecture (4 credits) - Prerequisites: CSC 2302',
          'CSC 3320: System-Level Programming (3 credits) - Prerequisites: CSC 2720',
          'CSC 4350: Software Engineering (3 credits) - Prerequisites: CSC 2720',
          'CSC 4330: Programming Language Concepts (3 credits) - Prerequisites: CSC 2720, MATH 2420',
          'CSC 4220: Database Systems (3 credits) - Prerequisites: CSC 2720',
          'CSC 4520: Operating Systems (3 credits) - Prerequisites: CSC 3210, CSC 3320',
          'CSC 4610: Computer Networks (3 credits) - Prerequisites: CSC 2720',
          'CSC 4730: Artificial Intelligence (3 credits) - Prerequisites: CSC 2720, MATH 2420',
          // CS Electives
          'CSC 4210: Computer Graphics (3 credits) - Prerequisites: CSC 2720, MATH 2215',
          'CSC 4310: Compiler Construction (3 credits) - Prerequisites: CSC 4330',
          'CSC 4410: Computer Security (3 credits) - Prerequisites: CSC 3210',
          'CSC 4510: Distributed Systems (3 credits) - Prerequisites: CSC 4520',
          // Business/Management Electives
          'MGMT 3101: Principles of Management (3 credits) - Prerequisites: None',
          'MIS 3010: Management Information Systems (3 credits) - Prerequisites: None',
          'ENTR 3101: Entrepreneurship (3 credits) - Prerequisites: None',
          // Statistics/Data Science
          'STAT 2000: Elementary Statistics (3 credits) - Prerequisites: MATH 1111',
          'MATH 3030: Applied Statistics (3 credits) - Prerequisites: MATH 2212'
        ],
        senior: [
          // Capstone & Advanced CS
          'CSC 4990: Senior Project (3 credits) - Prerequisites: Senior standing, CSC 4350',
          'CSC 4995: Senior Seminar (1 credit) - Prerequisites: Senior standing',
          'CSC 4996: Senior Project II (3 credits) - Prerequisites: CSC 4990',
          // Advanced CS Courses
          'CSC 3210: Computer Organization and Architecture (4 credits) - Prerequisites: CSC 2302',
          'CSC 4350: Software Engineering (3 credits) - Prerequisites: CSC 2720',
          'CSC 4520: Operating Systems (3 credits) - Prerequisites: CSC 3210, CSC 3320',
          'CSC 4610: Computer Networks (3 credits) - Prerequisites: CSC 2720',
          'CSC 4730: Artificial Intelligence (3 credits) - Prerequisites: CSC 2720, MATH 2420',
          'CSC 4800: Special Topics in Computer Science (3 credits) - Prerequisites: Varies',
          // Advanced CS Electives
          'CSC 4210: Computer Graphics (3 credits) - Prerequisites: CSC 2720, MATH 2215',
          'CSC 4310: Compiler Construction (3 credits) - Prerequisites: CSC 4330',
          'CSC 4410: Computer Security (3 credits) - Prerequisites: CSC 3210',
          'CSC 4510: Distributed Systems (3 credits) - Prerequisites: CSC 4520',
          'CSC 4710: Machine Learning (3 credits) - Prerequisites: CSC 4730, STAT 2000',
          'CSC 4820: Advanced Algorithms (3 credits) - Prerequisites: CSC 2510, MATH 2420',
          // Interdisciplinary Electives
          'MIS 4010: Advanced Management Information Systems (3 credits) - Prerequisites: MIS 3010',
          'MATH 3030: Applied Statistics (3 credits) - Prerequisites: MATH 2212',
          'PHIL 3010: Ethics in Technology (3 credits) - Prerequisites: None',
          'COMM 3010: Technical Writing (3 credits) - Prerequisites: ENGL 1102'
        ]
      };
      
      if (yearLevel && fallbackCourses[yearLevel]) {
        availableCourses = fallbackCourses[yearLevel].join('\n');
        console.log(`✅ Using ${yearLevel} fallback courses (${fallbackCourses[yearLevel].length} courses)`);
      } else {
        // Generic fallback if no year level
        availableCourses = [
          'CSC 1301: Principles of Computer Science I',
          'CSC 1302: Principles of Computer Science II',
          'CSC 2720: Data Structures',
          'CSC 3210: Computer Organization and Architecture',
          'CSC 4350: Software Engineering'
        ].join('\n');
        console.log('✅ Using generic fallback courses');
      }
    }
    
    if (completedCourses.length > 0 && availableCourses) {
      // Remove completed courses from available courses text
      const completedCodesForFiltering = completedCourseCodes;
      const availableCoursesLines = availableCourses.split('\n');
      const filteredCourses = availableCoursesLines.filter(line => {
        // Check if line contains any completed course code
        const lineUpper = line.toUpperCase();
        return !completedCodesForFiltering.some(code => lineUpper.includes(code));
      });
      availableCourses = filteredCourses.join('\n') || 'No additional courses available (all major courses completed).';
      
      console.log(`🔍 Filtered available courses context (removed ${availableCoursesLines.length - filteredCourses.length} completed courses)`);
    }
    
    const majorRequirements = majorContext.requirements.length > 0
      ? majorContext.requirements.join('\n')
      : 'No specific requirements found.';
    const prerequisites = JSON.stringify(majorContext.prerequisites || {});
    
    // Build year level context for course recommendations
    let yearLevelContext = '';
    if (yearLevel) {
      const yearLevelDescriptions = {
        freshman: 'first-year student (typically taking introductory courses like CSC 1301, MATH 1111, ENGL 1101)',
        sophomore: 'second-year student (typically taking lower-division major courses like CSC 2720, MATH 2212)',
        junior: 'third-year student (typically taking upper-division major courses like CSC 3210, CSC 4350)',
        senior: 'fourth-year student (typically taking advanced/capstone courses like CSC 4990, senior electives)'
      };
      yearLevelContext = `- Year Level: ${yearLevel} (${yearLevelDescriptions[yearLevel] || yearLevel})\n`;
    }
    
    // Build completed courses list for prompt
    const completedCoursesList = completedCourses.length > 0 
      ? completedCourses.map(c => `${c.code}: ${c.name} (${c.grade}, ${c.credits} credits, ${c.semester || 'N/A'})`).join('\n')
      : 'None (student is new or transcript not provided)';
    
    // Build requested courses section if user specified courses
    let requestedCoursesSection = '';
    if (requestedCourses && requestedCourses.length > 0) {
      const requestedList = requestedCourses.map(c => {
        if (c.code) return `${c.code}: ${c.name || 'Unknown'}`;
        return c.name || c;
      }).join('\n');
      requestedCoursesSection = `\n\n**IMPORTANT - USER REQUESTED COURSES:**
The user specifically mentioned wanting to take these courses. Please prioritize including as many of these as possible in the schedule:
${requestedList}

If these courses are available and fit the credit requirements, include them in the schedule.`;
    }

    // Build enhanced year-level guidance
    let yearLevelGuidance = '';
    if (yearLevel) {
      const guidance = {
        freshman: `CRITICAL: This is a FRESHMAN student. Recommend:
- Introductory major courses (1000-2000 level) that have NO prerequisites or only basic prerequisites
- General Education courses (English, Math, History, Science, Arts)
- Foundation courses like CSC 1301, MATH 1111, ENGL 1101
- Mix of major courses (2-3) and general education/electives (2-3 courses)
- Include electives from other departments (Psychology, Sociology, Art, Music, Philosophy) to fulfill general education requirements`,
        sophomore: `CRITICAL: This is a SOPHOMORE student. Recommend:
- Lower-division major courses (2000-3000 level) that build on freshman prerequisites
- Courses like CSC 2720 (requires CSC 1302), MATH 2212 (requires MATH 2211), PHYS 2211
- Continue with general education requirements
- Include business, communication, or foreign language electives
- Mix of major courses (3-4) and electives/general education (1-2 courses)`,
        junior: `CRITICAL: This is a JUNIOR student. Recommend:
- Upper-division major courses (3000-4000 level) that require sophomore prerequisites
- Advanced courses like CSC 3210, CSC 4350, CSC 4520, CSC 4730
- CS electives and specialized topics
- Include interdisciplinary electives (Business, Statistics, Management)
- Focus on major courses (4-5) with 1-2 electives from other departments`,
        senior: `CRITICAL: This is a SENIOR student. Recommend:
- Capstone courses (CSC 4990, CSC 4995, CSC 4996)
- Advanced/specialized CS courses (4000+ level)
- CS electives in areas of interest
- Any remaining major requirements
- Advanced electives from other departments (Ethics, Technical Writing, Advanced MIS)
- Focus on completing major requirements and capstone projects`
      };
      yearLevelGuidance = guidance[yearLevel] || '';
    }

    const prompt = `Generate a course schedule for a ${workloadPreference} workload (${creditRange.min}-${creditRange.max} credits) for a ${transcriptData.major || 'Computer Science'} major.${requestedCoursesSection}

Student Information:
${yearLevelContext}${yearLevelGuidance ? `\n${yearLevelGuidance}\n` : ''}${completedCourses.length > 0 ? `\nIMPORTANT - Already Completed Courses (DO NOT RECOMMEND THESE):
${completedCoursesList}

CRITICAL: Do NOT include any of these courses in the schedule. The student has already taken them:
${completedCourseCodes.join(', ')}

` : yearLevel ? '\nThe student has not provided a transcript. Based on their year level, recommend appropriate courses that match their academic progression.\n' : '\nThe student has not provided a transcript, so recommend foundational courses appropriate for their level.\n'}

Major Requirements:
${majorRequirements}

Available Courses:
${availableCourses}

Prerequisites:
${prerequisites}

Generate a schedule that:
1. ${yearLevel ? `CRITICAL: The student is a ${yearLevel}. ${completedCourses.length > 0 ? 'Even though they have completed some courses, ' : ''}Recommend courses appropriate for their year level and academic progression. ${yearLevelGuidance}` : completedCourses.length > 0 ? `CRITICAL: ONLY includes courses that are NOT in the completed courses list. The student has ALREADY TAKEN these courses: ${completedCourseCodes.slice(0, 20).join(', ')}${completedCourseCodes.length > 20 ? ' (and more)' : ''}. DO NOT recommend any of these courses.` : 'Includes courses needed for the major and general education requirements'}
2. ${yearLevel === 'freshman' ? 'Focus on courses with NO prerequisites or basic prerequisites. Mix major courses with general education.' : yearLevel === 'sophomore' ? 'Focus on courses that build on freshman prerequisites. Include both major courses and electives.' : yearLevel === 'junior' ? 'Focus on upper-division major courses. Include CS electives and interdisciplinary courses.' : yearLevel === 'senior' ? 'Include capstone courses and advanced electives. Complete remaining major requirements.' : 'Respects prerequisites (don\'t suggest courses where prerequisites aren\'t met)'}
3. ${yearLevel ? 'Include a mix of major courses AND electives from other departments (Business, Arts, Humanities, Social Sciences, Natural Sciences) to provide a well-rounded education.' : 'Include a balanced mix of major courses and general education/electives'}
4. Fits within ${creditRange.min}-${creditRange.max} credits
5. Only includes course codes, names, and credits (no sections, times, professors, or locations)
6. ${completedCourses.length > 0 ? `DO NOT duplicate any courses the student has already completed. Check course codes carefully.` : 'Start with foundational courses appropriate for the student\'s level'}

Format as JSON with this structure:
{
      "semester": "${getNextSemester()}",
  "totalCredits": <number>,
  "courses": [
    {
      "code": "CSC 1301",
      "name": "Introduction to Computer Science",
      "credits": 3,
      "prerequisites": ["MATH 1111"],
      "prerequisitesMet": true
    }
  ]
}

CRITICAL CREDIT ACCURACY REQUIREMENTS:
- Extract credits EXACTLY as shown in the available courses list
- Common credit values: 1 credit (seminars), 3 credits (most courses), 4 credits (lab courses, calculus, physics)
- Examples: CSC 3210 is 4 credits, MATH 2211 is 4 credits, PHYS 2211 is 4 credits, CSC 4995 is 1 credit
- Do NOT assume all courses are 3 credits - check the course description for the exact credit value
- The totalCredits must equal the sum of all course credits in the schedule

IMPORTANT: 
- Use the semester "${getNextSemester()}" for the semester field
- Do NOT include sections, days, times, professors, or locations in the response
- Only include course code, name, and credits
- Ensure credits are accurate and match the course descriptions provided`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert academic advisor. Generate optimal course schedules that meet degree requirements and student preferences. CRITICAL RULES: 1) NEVER recommend courses the student has already completed - always check the completed courses list and exclude those courses. 2) Only use real, verified data from the provided context. 3) Never invent or make up professor names, locations, times, or building names. 4) If information is not available, use "TBA" (To Be Announced). Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const scheduleData = JSON.parse(completion.choices[0].message.content);
    
    // Ensure semester is set to next semester if not provided or outdated
    if (!scheduleData.semester || scheduleData.semester.includes('2024') || scheduleData.semester.includes('2025')) {
      scheduleData.semester = getNextSemester();
    }
    
    // Filter out any courses that match completed courses (double-check with multiple matching strategies)
    if (completedCourses.length > 0) {
      const completedCodesSet = new Set(completedCourseCodes);
      
      scheduleData.courses = scheduleData.courses?.filter(course => {
        if (!course.code) return false;
        
        const courseCode = course.code.toUpperCase().trim();
        const courseCodeNoSpace = courseCode.replace(/\s+/g, '');
        
        // Check multiple variations
        const isCompleted = completedCodesSet.has(courseCode) || 
                           completedCodesSet.has(courseCodeNoSpace) ||
                           completedCourses.some(completed => {
                             const completedCode = completed.codeUpper || completed.code.toUpperCase().trim();
                             const completedCodeNoSpace = completedCode.replace(/\s+/g, '');
                             return courseCode === completedCode || 
                                    courseCodeNoSpace === completedCodeNoSpace ||
                                    courseCode.includes(completedCode) ||
                                    completedCode.includes(courseCode);
                           });
        
        if (isCompleted) {
          console.log(`⚠️ Filtered out duplicate course: ${course.code} (already completed)`);
        }
        
        return !isCompleted;
      }) || [];
      
      // Recalculate total credits after filtering
      scheduleData.totalCredits = scheduleData.courses?.reduce((sum, course) => sum + (course.credits || 0), 0) || 0;
      
      console.log(`✅ Filtered schedule: ${scheduleData.courses.length} courses remaining (removed duplicates)`);
    }
    
    // Validate and enhance schedule
    scheduleData.generatedAt = new Date().toISOString();
    scheduleData.workloadPreference = workloadPreference;
    scheduleData.major = transcriptData.major;
    scheduleData.completedCourses = completedCourses;

    return {
      success: true,
      schedule: scheduleData
    };

  } catch (error) {
    console.error('❌ Error generating schedule:', error);
    return {
      success: false,
      error: error.message,
      schedule: null
    };
  }
}

/**
 * Validate schedule against requirements
 * @param {Object} schedule - Generated schedule
 * @param {Object} majorContext - Major context
 * @param {Array} completedCourses - Completed courses
 * @returns {Object} - Validation results
 */
function validateSchedule(schedule, majorContext, completedCourses) {
  const issues = [];
  const warnings = [];

  // Check credit range
  if (schedule.totalCredits < 12) {
    issues.push('Schedule has less than 12 credits (minimum for full-time)');
  }
  if (schedule.totalCredits > 18) {
    issues.push('Schedule exceeds 18 credits (maximum allowed)');
  }

  // Check prerequisites
  schedule.courses?.forEach(course => {
    if (course.prerequisites && course.prerequisites.length > 0) {
      const prerequisitesMet = course.prerequisites.every(prereq => {
        return completedCourses.some(completed => 
          completed.code.toLowerCase().includes(prereq.toLowerCase())
        );
      });
      
      if (!prerequisitesMet && !course.prerequisitesMet) {
        issues.push(`Course ${course.code} has unmet prerequisites: ${course.prerequisites.join(', ')}`);
      }
    }
  });

  // Time conflict checking removed since we no longer track times

  return {
    valid: issues.length === 0,
    issues,
    warnings
  };
}

module.exports = {
  parseCompletedCourses,
  generateSchedule,
  validateSchedule,
  getCurrentSemester,
  getNextSemester
};



