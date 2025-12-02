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
 * Parse completed courses from transcript text
 * @param {string} transcriptText - Extracted transcript text
 * @returns {Promise<Array>} - Array of completed courses with codes, names, grades, credits
 */
async function parseCompletedCourses(transcriptText) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    const prompt = `Extract all completed courses from this transcript. For each course, provide:
- Course code (e.g., "CSC 1301")
- Course name
- Grade received
- Credits earned
- Semester/Term taken

Format the output as a JSON array of objects with keys: code, name, grade, credits, semester.
Only include courses that have been completed (have a grade).

Transcript text:
${transcriptText.substring(0, 4000)}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at parsing academic transcripts. Extract course information accurately and return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response.courses || [];

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
 * @returns {Promise<Object>} - Generated schedule with courses and sections
 */
async function generateSchedule(transcriptData, majorContext, workloadPreference) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    // Parse completed courses
    const completedCourses = await parseCompletedCourses(transcriptData.extracted_text || '');

    // Determine credit range
    const creditRanges = {
      light: { min: 12, max: 13 },
      medium: { min: 14, max: 15 },
      heavy: { min: 16, max: 18 }
    };
    const creditRange = creditRanges[workloadPreference] || creditRanges.medium;

    // Prepare context for schedule generation
    const majorRequirements = majorContext.requirements?.join('\n') || 'No specific requirements found.';
    const availableCourses = majorContext.availableCourses?.join('\n') || 'No course information available.';
    const prerequisites = JSON.stringify(majorContext.prerequisites || {});

    // Build completed courses list for prompt
    const completedCoursesList = completedCourses.length > 0 
      ? completedCourses.map(c => `${c.code}: ${c.name} (${c.grade}, ${c.credits} credits)`).join('\n')
      : 'None (student is new or transcript not provided)';
    
    const completedCourseCodes = completedCourses.map(c => c.code.toUpperCase().trim());
    
    const prompt = `Generate a course schedule for a ${workloadPreference} workload (${creditRange.min}-${creditRange.max} credits) for a ${transcriptData.major} major.

${completedCourses.length > 0 ? `IMPORTANT - Already Completed Courses (DO NOT RECOMMEND THESE):
${completedCoursesList}

CRITICAL: Do NOT include any of these courses in the schedule. The student has already taken them:
${completedCourseCodes.join(', ')}

` : 'The student has not provided a transcript, so assume they are starting fresh or early in their program.\n'}

Major Requirements:
${majorRequirements}

Available Courses:
${availableCourses}

Prerequisites:
${prerequisites}

Generate a schedule that:
1. ${completedCourses.length > 0 ? 'ONLY includes courses that are NOT in the completed courses list above' : 'Includes courses needed for the major'}
2. Respects prerequisites (don't suggest courses where prerequisites aren't met)
3. Fits within ${creditRange.min}-${creditRange.max} credits
4. Only includes course codes, names, and credits (no sections, times, professors, or locations)
5. ${completedCourses.length > 0 ? 'DO NOT duplicate any courses the student has already completed' : 'Start with foundational courses if this appears to be a new student'}

Format as JSON with this structure:
{
  "semester": "${getCurrentSemester()}",
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

IMPORTANT: 
- Use the semester "${getCurrentSemester()}" for the semester field
- Do NOT include sections, days, times, professors, or locations in the response
- Only include course code, name, and credits`;

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
    
    // Ensure semester is set to current semester if not provided or outdated
    if (!scheduleData.semester || scheduleData.semester.includes('2024') || scheduleData.semester.includes('2025')) {
      scheduleData.semester = getCurrentSemester();
    }
    
    // Filter out any courses that match completed courses (double-check)
    if (completedCourses.length > 0) {
      const completedCodes = completedCourses.map(c => c.code.toUpperCase().trim());
      scheduleData.courses = scheduleData.courses?.filter(course => {
        const courseCode = course.code?.toUpperCase().trim();
        return !completedCodes.includes(courseCode);
      }) || [];
      
      // Recalculate total credits after filtering
      scheduleData.totalCredits = scheduleData.courses?.reduce((sum, course) => sum + (course.credits || 0), 0) || 0;
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
  getCurrentSemester
};



