const express = require('express');
const multer = require('multer');
const { sendToChatGPT, getQuickResponse } = require('./openaiClient');
const { sendToChatGPTWithContext, isPineconeAvailable, getMajorContext } = require('./pineconeClient');
const supabase = require('./supaBase');
const { uploadFile, getFileUrl, listFiles, deleteFile } = require('./supaBase');
const SchedulePlanningPipeline = require('./schedulePlanningPipeline');
const { processTranscriptText, extractStructuredTranscriptData } = require('./pdfProcessor');
const { generateSchedule, validateSchedule } = require('./scheduleGenerator');
const { generateSchedulePDF, generateNotionTemplate, generateCSV } = require('./scheduleExporter');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  }
});

/**
 * POST /api/chat/message
 * Send a message to ChatGPT and get response
 * Enhanced with schedule planning pipeline detection
 */
router.post('/message', async (req, res) => {
      try {
        const { message, conversationHistory = [], options = {}, sessionId, settings = {} } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Check for schedule planning pipeline
    let pipelineState = null;
    let isInPipeline = false;
    
    if (sessionId) {
      isInPipeline = await SchedulePlanningPipeline.isInPipeline(sessionId);
      if (isInPipeline) {
        pipelineState = await SchedulePlanningPipeline.getState(sessionId);
        console.log('🔍 Pipeline detected:', { isInPipeline, pipelineState, sessionId });
      }
    }

    // Check if user wants to exit pipeline
    if (isInPipeline && SchedulePlanningPipeline.canExit(message)) {
      await SchedulePlanningPipeline.resetState(sessionId);
      return res.json({
        success: true,
        response: "No problem! I've exited the schedule planning mode. How else can I help you?",
        pipelineExited: true,
        timestamp: new Date().toISOString()
      });
    }

    // Check for pipeline trigger
    const isTrigger = SchedulePlanningPipeline.detectTrigger(message);
    if (isTrigger && !isInPipeline && sessionId) {
      // Extract course preferences from conversation history before starting pipeline
      let requestedCourses = [];
      try {
        // Look for course mentions in recent conversation history
        const recentHistory = conversationHistory.slice(-10); // Last 10 messages
        const historyText = recentHistory.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content || m.text || ''}`).join('\n');
        
        if (historyText && historyText.length > 50) {
          // Use OpenAI to extract course codes/names mentioned in conversation
          const courseExtractionPrompt = `From this conversation, extract any specific courses or classes that the user mentioned wanting to take or add to their schedule. 
          
Look for:
- Course codes (e.g., "CSC 4821", "CSC 4820", "CSC 4841")
- Course names (e.g., "Game Design", "Interactive Computer Graphics", "Computer Animation")
- Subject areas mentioned (e.g., "game design classes", "CMII classes")

Return a JSON object with this structure:
{
  "courses": [
    {"code": "CSC 4821", "name": "Fundamentals of Game Design"},
    {"code": "CSC 4820", "name": "Interactive Computer Graphics"}
  ],
  "subjects": ["game design", "CMII"]
}

If no specific courses are mentioned, return {"courses": [], "subjects": []}.

Conversation:
${historyText}

Current message: ${message}`;

          const client = getOpenAIClient();
          if (client) {
            const completion = await client.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert at extracting course information from conversations. Return only valid JSON.'
                },
                {
                  role: 'user',
                  content: courseExtractionPrompt
                }
              ],
              max_tokens: 500,
              temperature: 0.1,
              response_format: { type: 'json_object' }
            });

            const extracted = JSON.parse(completion.choices[0].message.content);
            requestedCourses = extracted.courses || [];
            
            if (requestedCourses.length > 0) {
              console.log(`📚 Extracted ${requestedCourses.length} requested courses from conversation:`, requestedCourses);
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Error extracting course preferences:', error.message);
        // Continue anyway - not critical
      }
      
      // Start pipeline with requested courses
      await SchedulePlanningPipeline.updateState(sessionId, SchedulePlanningPipeline.STATES.COLLECTING_MAJOR, {
        requestedCourses: requestedCourses
      });
      const nextQuestion = SchedulePlanningPipeline.getNextQuestion(SchedulePlanningPipeline.STATES.COLLECTING_MAJOR);
      return res.json({
        success: true,
        response: nextQuestion,
        inPipeline: true,
        pipelineState: SchedulePlanningPipeline.STATES.COLLECTING_MAJOR,
        timestamp: new Date().toISOString()
      });
    }

    // Handle pipeline states - MUST return early to prevent regular chat flow
    if (isInPipeline && pipelineState && sessionId) {
      const currentState = pipelineState.state || pipelineState;
      const pipelineData = (pipelineState.data || {});
      
      console.log('🔄 Processing pipeline state:', { currentState, pipelineData, message, isInPipeline });

      // Process based on current state
      switch (currentState) {
        case SchedulePlanningPipeline.STATES.COLLECTING_MAJOR:
          // Extract major from message using OpenAI for better extraction
          let major = message.trim();
          
          // Try to extract major more intelligently
          // Remove common phrases like "i am a", "i'm a", "my major is", etc.
          const majorPatterns = [
            /(?:i am|i'm|my major is|i study|studying|majoring in)\s+(.+)/i,
            /(?:computer science|cs|information technology|it|business|engineering|biology|chemistry|physics|mathematics|math|psychology|english|history|political science|economics|accounting|finance|marketing|management)/i
          ];
          
          // Try to extract using patterns
          for (const pattern of majorPatterns) {
            const match = message.match(pattern);
            if (match) {
              major = match[1] ? match[1].trim() : match[0].trim();
              // Clean up common endings
              major = major.replace(/\s+major\s*$/i, '').trim();
              break;
            }
          }
          
          // If no pattern match, try to find common major names
          if (major.toLowerCase().includes('computer science') || major.toLowerCase().includes('cs')) {
            major = 'Computer Science';
          } else if (major.toLowerCase().includes('information technology') || major.toLowerCase().includes('it')) {
            major = 'Information Technology';
          }
          
          console.log('✅ Extracted major:', major);
          
          // Update state with extracted major, preserving requested courses
          await SchedulePlanningPipeline.updateState(sessionId, SchedulePlanningPipeline.STATES.COLLECTING_WORKLOAD, { 
            major,
            requestedCourses: pipelineData.requestedCourses || []
          });
          
          // Get major context from Pinecone
          let majorContext = null;
          if (isPineconeAvailable()) {
            majorContext = await getMajorContext(major, 10);
          }
          
          // Create a more natural response that acknowledges the major and asks about workload
          const workloadQuestion = `Perfect! I see you're a ${major} major. Now, what kind of workload are you looking for? You can choose:

• **Light** (12-13 credits) - Minimum for full-time students
• **Medium** (14-15 credits) - Balanced course load
• **Heavy** (16-18 credits) - Maximum course load

Which would you prefer?`;
          
          console.log('📤 Returning workload question');
          return res.json({
            success: true,
            response: workloadQuestion,
            inPipeline: true,
            pipelineState: SchedulePlanningPipeline.STATES.COLLECTING_WORKLOAD,
            majorContext: majorContext,
            timestamp: new Date().toISOString()
          });

        case SchedulePlanningPipeline.STATES.COLLECTING_WORKLOAD:
          // Parse workload preference
          const workloadPreference = SchedulePlanningPipeline.parseWorkloadPreference(message) || 'medium';
          const creditRanges = {
            light: '12-13',
            medium: '14-15',
            heavy: '16-18'
          };
          
          await SchedulePlanningPipeline.updateState(sessionId, SchedulePlanningPipeline.STATES.COLLECTING_YEAR_LEVEL, {
            ...pipelineData,
            workloadPreference,
            creditRange: creditRanges[workloadPreference]
          });
          
          const yearLevelQuestion = SchedulePlanningPipeline.getNextQuestion(SchedulePlanningPipeline.STATES.COLLECTING_YEAR_LEVEL);
          return res.json({
            success: true,
            response: yearLevelQuestion,
            inPipeline: true,
            pipelineState: SchedulePlanningPipeline.STATES.COLLECTING_YEAR_LEVEL,
            timestamp: new Date().toISOString()
          });

        case SchedulePlanningPipeline.STATES.COLLECTING_YEAR_LEVEL:
          // Parse year level
          const yearLevel = SchedulePlanningPipeline.parseYearLevel(message);
          if (!yearLevel) {
            // If we can't parse year level, ask again
            return res.json({
              success: true,
              response: "I didn't catch that. Could you please tell me what year you are? Are you a **Freshman**, **Sophomore**, **Junior**, or **Senior**?",
              inPipeline: true,
              pipelineState: SchedulePlanningPipeline.STATES.COLLECTING_YEAR_LEVEL,
              timestamp: new Date().toISOString()
            });
          }
          
          await SchedulePlanningPipeline.updateState(sessionId, SchedulePlanningPipeline.STATES.COLLECTING_TRANSCRIPT, {
            ...pipelineData,
            yearLevel
          });
          
          const transcriptQuestion = SchedulePlanningPipeline.getNextQuestion(SchedulePlanningPipeline.STATES.COLLECTING_TRANSCRIPT);
          return res.json({
            success: true,
            response: transcriptQuestion,
            inPipeline: true,
            pipelineState: SchedulePlanningPipeline.STATES.COLLECTING_TRANSCRIPT,
            timestamp: new Date().toISOString()
          });

            case SchedulePlanningPipeline.STATES.COLLECTING_TRANSCRIPT:
              // Check if user wants to skip transcript
              const skipKeywords = ['skip', 'no transcript', "don't have", "don't", 'no', 'continue without', 'generate without'];
              const wantsToSkip = skipKeywords.some(keyword => message.toLowerCase().includes(keyword));
              
              if (wantsToSkip) {
                // Skip transcript and generate schedule without it
                console.log('📝 User wants to skip transcript, generating schedule without it');
                
                // Get major context
                let majorContext = null;
                if (isPineconeAvailable() && pipelineData.major) {
                  majorContext = await getMajorContext(pipelineData.major, 10);
                }
                
                // Generate schedule without transcript
                const scheduleInput = {
                  major: pipelineData.major,
                  extracted_text: '', // Empty - no transcript
                  workload_preference: pipelineData.workloadPreference
                };
                
                const scheduleResult = await generateSchedule(
                  scheduleInput,
                  majorContext,
                  pipelineData.workloadPreference || 'medium',
                  pipelineData.requestedCourses || [],
                  pipelineData.yearLevel || null
                );
                
                if (scheduleResult.success) {
                  // Validate schedule
                  const validation = validateSchedule(
                    scheduleResult.schedule,
                    majorContext,
                    [] // No completed courses
                  );
                  
                  // Update pipeline state to offering export
                  await SchedulePlanningPipeline.updateState(sessionId, SchedulePlanningPipeline.STATES.OFFERING_EXPORT, {
                    ...pipelineData,
                    schedule: scheduleResult.schedule,
                    validation: validation,
                    transcriptSkipped: true
                  });
                  
                  const scheduleMessage = `Perfect! I've generated a schedule for ${scheduleResult.schedule.semester || 'next semester'} based on your major and workload preference.

**Your Schedule Summary:**
• Total Credits: ${scheduleResult.schedule.totalCredits || 0}
• Number of Courses: ${scheduleResult.schedule.courses?.length || 0}
• Workload: ${pipelineData.workloadPreference || 'medium'}

${validation.issues.length > 0 ? `\n⚠️ **Issues Found:**\n${validation.issues.map(i => `• ${i}`).join('\n')}\n` : ''}
${validation.warnings.length > 0 ? `\n💡 **Notes:**\n${validation.warnings.map(w => `• ${w}`).join('\n')}\n` : ''}

You can:
• Ask me questions about your schedule
• Request modifications
• Download your schedule as a **PDF** or **Notion template**

What would you like to do?`;
                  
                  return res.json({
                    success: true,
                    response: scheduleMessage,
                    schedule: scheduleResult.schedule,
                    validation: validation,
                    inPipeline: true,
                    pipelineState: SchedulePlanningPipeline.STATES.OFFERING_EXPORT,
                    timestamp: new Date().toISOString()
                  });
                } else {
                  return res.json({
                    success: true,
                    response: "I encountered an issue generating your schedule. Please try again or upload your transcript for more accurate recommendations.",
                    inPipeline: true,
                    pipelineState: currentState,
                    timestamp: new Date().toISOString()
                  });
                }
              }
              
              // User should upload transcript via file upload endpoint
              // This state is handled by the upload-transcript endpoint
              return res.json({
                success: true,
                response: "Please use the file upload button to upload your transcript, or type 'skip' if you don't have one. Once uploaded, I'll process it and generate your schedule.",
                inPipeline: true,
                pipelineState: currentState,
                timestamp: new Date().toISOString()
              });

        case SchedulePlanningPipeline.STATES.OFFERING_EXPORT:
          // User can ask questions about the schedule, request modifications, or ask for export
          const schedule = pipelineData.schedule;
          
          // Check if user wants to export
          const exportKeywords = ['download', 'pdf', 'notion', 'export', 'save', 'get file'];
          const wantsExport = exportKeywords.some(keyword => message.toLowerCase().includes(keyword));
          
          if (wantsExport) {
            // Determine export format
            let format = 'pdf';
            if (message.toLowerCase().includes('notion')) {
              format = 'notion';
            } else if (message.toLowerCase().includes('csv')) {
              format = 'csv';
            }
            
            // Return export information (frontend will handle download)
            return res.json({
              success: true,
              response: `I'll prepare your schedule in ${format.toUpperCase()} format. You can download it using the export buttons below.`,
              inPipeline: true,
              pipelineState: currentState,
              schedule: schedule,
              exportFormat: format,
              timestamp: new Date().toISOString()
            });
          }
          
          // Check if user wants to modify schedule
          const modifyKeywords = ['change', 'modify', 'update', 'different', 'switch', 'replace', 'remove', 'add'];
          const wantsModify = modifyKeywords.some(keyword => message.toLowerCase().includes(keyword));
          
          if (wantsModify && schedule) {
            // Use OpenAI to understand modification request and regenerate schedule
            // For now, return a message asking for clarification
            return res.json({
              success: true,
              response: "I can help you modify your schedule! What would you like to change? For example:\n- Replace a course\n- Change workload preference\n- Adjust times\n- Add or remove courses\n\nJust let me know what you'd like to modify!",
              inPipeline: true,
              pipelineState: currentState,
              schedule: schedule,
              timestamp: new Date().toISOString()
            });
          }
          
          // General questions about the schedule - use regular chat but include schedule context
          // This will fall through to regular chat flow with schedule context
          break;

        case SchedulePlanningPipeline.STATES.PROCESSING:
        case SchedulePlanningPipeline.STATES.GENERATING_SCHEDULE:
          // Schedule is being generated, inform user
          return res.json({
            success: true,
            response: "I'm still processing your transcript and generating your schedule. This may take a moment. Please wait...",
            inPipeline: true,
            pipelineState: currentState,
            timestamp: new Date().toISOString()
          });

        default:
          // Continue with normal chat flow but include pipeline context
          break;
      }
    }

    // Normalize conversation history format for OpenAI API
    // Convert from {role: "user", text: "..."} to {role: "user", content: "..."}
    // Also convert "bot" to "assistant" for OpenAI compatibility
    const normalizedHistory = conversationHistory.map(msg => {
      // Handle different message formats
      const role = msg.role === 'bot' ? 'assistant' : (msg.role === 'user' ? 'user' : 'assistant');
      const content = msg.content || msg.text || '';
      
      return {
        role: role,
        content: content
      };
    }).filter(msg => msg.content && msg.content.trim().length > 0); // Remove empty messages

    // Include transcript context if available
    let transcriptContext = null;
    if (sessionId) {
      const transcript = await SchedulePlanningPipeline.getTranscript(sessionId);
      if (transcript && transcript.extracted_text) {
        transcriptContext = transcript.extracted_text;
      }
    }

    // Enhance conversation history with transcript and schedule context if available
    let enhancedHistory = normalizedHistory;
    
    // Add transcript context
    if (transcriptContext) {
      enhancedHistory = [
        ...enhancedHistory,
        {
          role: 'system',
          content: `The user has uploaded a transcript. Here is the extracted transcript information: ${transcriptContext.substring(0, 2000)}`
        }
      ];
    }
    
    // Add schedule context if in OFFERING_EXPORT state
    if (isInPipeline && pipelineState && pipelineState.state === SchedulePlanningPipeline.STATES.OFFERING_EXPORT) {
      const schedule = pipelineState.data?.schedule;
      if (schedule) {
        const scheduleContext = `The user has a generated schedule for ${schedule.semester || 'next semester'}:
- Total Credits: ${schedule.totalCredits || 0}
- Courses: ${schedule.courses?.map(c => `${c.code}: ${c.name}`).join(', ') || 'None'}
- Workload: ${pipelineState.data?.workloadPreference || 'medium'}

The user can ask questions about the schedule, request modifications, or ask to download it as PDF or Notion template.`;
        
        enhancedHistory = [
          ...enhancedHistory,
          {
            role: 'system',
            content: scheduleContext
          }
        ];
      }
    }

    // Check for quick responses first (but skip if in pipeline or if disabled in settings)
    if (!isInPipeline && settings.quickResponses === true) {
      const quickResponse = await getQuickResponse(message);
      if (quickResponse) {
        return res.json(quickResponse);
      }
    }

        // Check if user wants to use Pinecone (from settings)
        const usePinecone = settings.usePinecone !== false && isPineconeAvailable();
        
        // Try context-aware response with Pinecone if available and enabled
        let result;
        if (usePinecone) {
          result = await sendToChatGPTWithContext(message, enhancedHistory, { ...options, settings });
        } else {
          // Fallback to regular ChatGPT response
          result = await sendToChatGPT(message, enhancedHistory, { ...options, settings });
        }

    if (result.success) {
      res.json({
        success: true,
        response: result.response,
        usage: result.usage,
        model: result.model,
        hasContext: result.hasContext || false,
        context: result.context || null,
        inPipeline: isInPipeline,
        pipelineState: pipelineState?.state || null,
        timestamp: new Date().toISOString()
      });
    } else {
      // Handle quota errors with appropriate status code
      const statusCode = (result.errorType === 'quota_exceeded' || result.error === 'OpenAI API quota exceeded') ? 429 : 500;

      res.status(statusCode).json({
        success: false,
        error: result.error,
        errorType: result.errorType || 'general_error',
        response: result.response,
        message: result.errorType === 'quota_exceeded'
          ? 'The OpenAI API quota has been exceeded. Please check your billing at https://platform.openai.com/usage'
          : undefined
      });
    }

  } catch (error) {
    console.error('❌ Chat route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      response: 'I apologize, but I encountered an error. Please try again.'
    });
  }
});

/**
 * POST /api/chat/stream
 * Stream response from ChatGPT (for real-time chat)
 */
router.post('/stream', async (req, res) => {
  try {
    const { message, conversationHistory = [], options = {} } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send initial connection message
    res.write('data: {"type":"connected","message":"Connected to Pounce"}\n\n');

    // Check for quick responses first
    const quickResponse = await getQuickResponse(message);
    if (quickResponse) {
      res.write(`data: {"type":"response","content":"${quickResponse.response}"}\n\n`);
      res.write('data: {"type":"done"}\n\n');
      res.end();
      return;
    }

    // Try context-aware response with Pinecone if available
    let result;
    if (isPineconeAvailable()) {
      result = await sendToChatGPTWithContext(message, conversationHistory, options);
    } else {
      // Fallback to regular ChatGPT response
      result = await sendToChatGPT(message, conversationHistory, options);
    }

    if (result.success) {
      res.write(`data: {"type":"response","content":"${result.response}"}\n\n`);
    } else {
      // Include error type for quota errors
      const errorData = result.errorType === 'quota_exceeded'
        ? `{"type":"error","content":"${result.response}","errorType":"quota_exceeded","message":"The OpenAI API quota has been exceeded. Please check your billing at https://platform.openai.com/usage"}`
        : `{"type":"error","content":"${result.response}"}`;
      res.write(`data: ${errorData}\n\n`);
    }

    res.write('data: {"type":"done"}\n\n');
    res.end();

  } catch (error) {
    console.error('❌ Stream route error:', error);
    res.write(`data: {"type":"error","content":"I apologize, but I encountered an error. Please try again."}\n\n`);
    res.write('data: {"type":"done"}\n\n');
    res.end();
  }
});

/**
 * GET /api/chat/status
 * Check if ChatGPT and Pinecone integration are working
 */
router.get('/status', async (req, res) => {
  try {
    const { getOpenAIClient } = require('./openaiClient');
    const { getPineconeStatus } = require('./pineconeClient');

    const client = getOpenAIClient();
    const pineconeStatus = getPineconeStatus();

    if (!client) {
      return res.json({
        success: false,
        status: 'OpenAI client not initialized',
        message: 'Please check your API key configuration',
        pinecone: pineconeStatus
      });
    }

    // Test with a simple message
    const testResult = await sendToChatGPT('Hello, are you working?');

    res.json({
      success: testResult.success,
      status: testResult.success ? 'Connected' : 'Error',
      message: testResult.success ? 'ChatGPT integration is working' : testResult.error,
      pinecone: pineconeStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Status check error:', error);
    res.status(500).json({
      success: false,
      status: 'Error',
      message: 'Failed to check ChatGPT status',
      error: error.message
    });
  }
});

/**
 * POST /api/chat/quick-actions
 * Handle quick action requests
 */
router.post('/quick-actions', async (req, res) => {
  try {
    const { action, context = {} } = req.body;

    const quickActionResponses = {
      'transcript': 'I can help you analyze your transcripts! You can upload your academic documents, and I\'ll help you understand your progress and suggest next steps for your degree.',
      'audit': 'I can help you with degree planning and audits! I can analyze your current progress, identify remaining requirements, and suggest courses to complete your degree efficiently.',
      'schedule': 'Perfect! I\'m excellent at schedule planning. I can help you build optimal class schedules that fit your preferences, avoid conflicts, and meet your degree requirements.',
      'resources': 'I can connect you with various campus resources! I can help you find tutoring services, academic support, career counseling, financial aid information, and campus events.',
      'events': 'I can help you discover campus events and activities! I can show you upcoming academic events, social activities, career fairs, and student organization meetings.',
      'voice': 'I\'d love to chat with you using voice! Click the voice button above or use the 🎤 Start Voice Chat button to begin a voice conversation.'
    };

    const response = quickActionResponses[action] || 'I\'m here to help with all aspects of your GSU experience. What would you like to explore?';

    res.json({
      success: true,
      response: response,
      action: action,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Quick actions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      response: 'I apologize, but I encountered an error. Please try again.'
    });
  }
});

/**
 * POST /api/chat/sessions
 * Save a chat session to Supabase
 */
router.post('/sessions', async (req, res) => {
  try {
    const { title, messages = [], type = 'chat' } = req.body;

    if (!title || !messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Title and messages array are required'
      });
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    // Create the chat session first with session_type
    const { data: sessionData, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({
        title: title,
        session_type: type || 'chat' // 'chat' or 'voice'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Supabase session insert error:', sessionError);
      return res.status(500).json({
        success: false,
        error: 'Failed to save chat session',
        details: sessionError.message
      });
    }

    // Insert messages if any
    if (messages.length > 0) {
      const messageInserts = messages.map(msg => ({
        session_id: sessionData.id,
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        message: msg.text
      }));

      const { error: messagesError } = await supabase
        .from('chat_messages')
        .insert(messageInserts);

      if (messagesError) {
        console.error('❌ Supabase messages insert error:', messagesError);
        // Continue anyway, session was created
      }
    }

    res.json({
      success: true,
      session: sessionData,
      message: 'Chat session saved successfully'
    });

  } catch (error) {
    console.error('❌ Save session error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/chat/sessions
 * Get all chat sessions from Supabase
 */
router.get('/sessions', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        *,
        chat_messages (
          id,
          role,
          message,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase select error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to load chat sessions',
        details: error.message
      });
    }

    // Transform the data to match frontend expectations
    const transformedSessions = data.map(session => ({
      id: session.id,
      title: session.title,
      created_at: session.created_at,
      updated_at: session.created_at, // Use created_at as updated_at for now
      type: session.session_type || 'chat', // Include session type (voice or chat)
      message_count: session.chat_messages ? session.chat_messages.length : 0,
      messages: session.chat_messages ? session.chat_messages.map(msg => ({
        id: msg.id,
        role: msg.role === 'assistant' ? 'bot' : msg.role,
        text: msg.message,
        timestamp: msg.created_at
      })) : []
    }));

    res.json({
      success: true,
      sessions: transformedSessions || [],
      count: transformedSessions ? transformedSessions.length : 0
    });

  } catch (error) {
    console.error('❌ Load sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/chat/sessions/:id
 * Get a specific chat session by ID
 */
router.get('/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        *,
        chat_messages (
          id,
          role,
          message,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Supabase select error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to load chat session',
        details: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    }

    // Transform the data to match frontend expectations
    const transformedSession = {
      id: data.id,
      title: data.title,
      created_at: data.created_at,
      updated_at: data.created_at,
      message_count: data.chat_messages ? data.chat_messages.length : 0,
      messages: data.chat_messages ? data.chat_messages.map(msg => ({
        id: msg.id,
        role: msg.role === 'assistant' ? 'bot' : msg.role,
        text: msg.message,
        timestamp: msg.created_at
      })) : []
    };

    res.json({
      success: true,
      session: transformedSession
    });

  } catch (error) {
    console.error('❌ Load session error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * PUT /api/chat/sessions/:id
 * Update a chat session
 */
router.put('/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, messages, type } = req.body;

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    // Check if session exists
    const { data: existingSession, error: checkError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', id)
      .single();

    // If session doesn't exist, create it
    if (checkError || !existingSession) {
      console.log('📝 Session not found, creating new session with ID:', id);
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          id: id, // Use provided ID
          title: title || 'New Chat',
          session_type: type || 'chat'
        })
        .select()
        .single();

      if (sessionError) {
        console.error('❌ Supabase session insert error:', sessionError);
        return res.status(500).json({
          success: false,
          error: 'Failed to create chat session',
          details: sessionError.message
        });
      }

      // Insert messages if any
      if (messages && messages.length > 0) {
        const messageInserts = messages.map(msg => ({
          session_id: sessionData.id,
          role: msg.role === 'bot' ? 'assistant' : msg.role,
          message: msg.text
        }));

        const { error: messagesError } = await supabase
          .from('chat_messages')
          .insert(messageInserts);

        if (messagesError) {
          console.error('❌ Supabase messages insert error:', messagesError);
        }
      }

      return res.json({
        success: true,
        session: sessionData,
        message: 'Chat session created successfully'
      });
    }

    // Update existing session
    const updateData = {};
    if (title) updateData.title = title;
    if (type) updateData.session_type = type;

    if (Object.keys(updateData).length > 0) {
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .update(updateData)
        .eq('id', id);

      if (sessionError) {
        console.error('❌ Supabase session update error:', sessionError);
        return res.status(500).json({
          success: false,
          error: 'Failed to update chat session',
          details: sessionError.message
        });
      }
    }

    // Update messages if provided
    if (messages && Array.isArray(messages)) {
      // First, delete existing messages
      const { error: deleteError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', id);

      if (deleteError) {
        console.error('❌ Supabase messages delete error:', deleteError);
        return res.status(500).json({
          success: false,
          error: 'Failed to update messages',
          details: deleteError.message
        });
      }

      // Then insert new messages
      if (messages.length > 0) {
        const messageInserts = messages.map(msg => ({
          session_id: id,
          role: msg.role === 'bot' ? 'assistant' : msg.role,
          message: msg.text
        }));

        const { error: messagesError } = await supabase
          .from('chat_messages')
          .insert(messageInserts);

        if (messagesError) {
          console.error('❌ Supabase messages insert error:', messagesError);
          return res.status(500).json({
            success: false,
            error: 'Failed to update messages',
            details: messagesError.message
          });
        }
      }
    }

    // Get updated session with messages
    const { data: updatedSession, error: fetchError } = await supabase
      .from('chat_sessions')
      .select(`
        *,
        chat_messages (
          id,
          role,
          message,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching updated session:', fetchError);
    }

    // Transform the data to match frontend expectations
    const transformedSession = updatedSession ? {
      id: updatedSession.id,
      title: updatedSession.title,
      created_at: updatedSession.created_at,
      updated_at: updatedSession.updated_at || updatedSession.created_at,
      type: updatedSession.session_type || 'chat',
      message_count: updatedSession.chat_messages ? updatedSession.chat_messages.length : 0,
      messages: updatedSession.chat_messages ? updatedSession.chat_messages.map(msg => ({
        id: msg.id,
        role: msg.role === 'assistant' ? 'bot' : msg.role,
        text: msg.message,
        timestamp: msg.created_at
      })) : []
    } : null;

    res.json({
      success: true,
      session: transformedSession,
      message: 'Chat session updated successfully'
    });

  } catch (error) {
    console.error('❌ Update session error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * DELETE /api/chat/sessions/:id
 * Delete a chat session
 */
router.delete('/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Supabase delete error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete chat session',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete session error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * POST /api/chat/upload
 * Upload a file to Supabase User_Files bucket
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const originalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;

    // Upload file to User_Files bucket
    const uploadResult = await uploadFile(
      'User_Files',
      fileName,
      req.file.buffer,
      req.file.mimetype
    );

    // Get a signed URL for the uploaded file (valid for 1 hour)
    const fileUrl = await getFileUrl('User_Files', fileName, 3600);

    res.json({
      success: true,
      file: {
        id: uploadResult.id,
        name: originalName,
        fileName: fileName,
        size: req.file.size,
        type: req.file.mimetype,
        url: fileUrl,
        uploadedAt: new Date().toISOString()
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('❌ File upload error:', error);

    // Handle specific Supabase errors
    if (error.message?.includes('Duplicate')) {
      return res.status(409).json({
        success: false,
        error: 'File with this name already exists',
        details: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'File upload failed',
      details: error.message
    });
  }
});

/**
 * POST /api/chat/upload-transcript
 * Upload and process a transcript for schedule planning
 */
router.post('/upload-transcript', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    // Check if session is in pipeline
    const isInPipeline = await SchedulePlanningPipeline.isInPipeline(sessionId);
    if (!isInPipeline) {
      return res.status(400).json({
        success: false,
        error: 'Session is not in schedule planning pipeline'
      });
    }

    const pipelineState = await SchedulePlanningPipeline.getState(sessionId);
    const pipelineData = pipelineState.data || {};

    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const originalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `transcripts/${timestamp}_${originalName}`;

    // OPTIMIZATION: Run PDF extraction and file upload in parallel
    let uploadResult;
    let fileUrl;
    let rawText = '';
    
    // Start both operations in parallel
    const [uploadPromise, extractPromise] = await Promise.allSettled([
      // Upload file to Supabase
      (async () => {
        try {
          const result = await uploadFile(
            'User_Files',
            fileName,
            req.file.buffer,
            req.file.mimetype
          );
          const url = await getFileUrl('User_Files', fileName, 86400); // 24 hours
          return { result, url };
        } catch (uploadError) {
          console.error('❌ Transcript upload error:', uploadError);
          if (uploadError.message && uploadError.message.includes('ENOTFOUND')) {
            throw new Error('Supabase connection failed: Unable to connect to Supabase. Please check your SUPABASE_URL in the .env file.');
          }
          throw uploadError;
        }
      })(),
      // Extract text from PDF (skip OpenAI analysis - we'll use raw text directly)
      (async () => {
        try {
          if (req.file.mimetype === 'application/pdf') {
            const { extractTextFromPDF } = require('./pdfProcessor');
            return await extractTextFromPDF(req.file.buffer, originalName);
          } else {
            return req.file.buffer.toString('utf-8');
          }
        } catch (error) {
          console.error('❌ Error extracting text from transcript:', error);
          // Fallback: try to use raw buffer as text
          try {
            const fallbackText = req.file.buffer.toString('utf-8');
            if (fallbackText && fallbackText.length > 100) {
              return fallbackText;
            }
            throw new Error('Could not extract meaningful text from transcript');
          } catch (fallbackError) {
            console.error('❌ Fallback extraction also failed:', fallbackError);
            throw new Error('Text extraction failed. Please ensure the PDF contains readable text.');
          }
        }
      })()
    ]);

    // Handle upload result
    if (uploadPromise.status === 'fulfilled') {
      uploadResult = uploadPromise.value.result;
      fileUrl = uploadPromise.value.url;
    } else {
      const error = uploadPromise.reason;
      if (error.message && error.message.includes('Supabase connection failed')) {
        return res.status(500).json({
          success: false,
          error: 'Supabase connection failed',
          details: error.message,
          suggestion: 'Verify your Supabase project URL and ensure it\'s correct in Backend/.env'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'File upload failed',
        details: error.message || 'Unknown error occurred during file upload'
      });
    }

    // Handle text extraction result
    if (extractPromise.status === 'fulfilled') {
      rawText = extractPromise.value;
      console.log(`✅ Successfully extracted transcript text (${rawText.length} chars)`);
    } else {
      return res.status(500).json({
        success: false,
        error: 'Text extraction failed',
        details: extractPromise.reason.message || 'Could not extract text from transcript'
      });
    }

    // Extract structured transcript data (JSON format) for faster processing
    console.log('📊 Extracting structured transcript data...');
    let structuredTranscriptData = null;
    try {
      structuredTranscriptData = await extractStructuredTranscriptData(rawText);
      console.log(`✅ Extracted structured data: ${structuredTranscriptData.courses?.length || 0} courses`);
    } catch (structError) {
      console.warn('⚠️ Error extracting structured data, will use raw text:', structError.message);
      // Continue with raw text if structured extraction fails
    }

    // Use raw text for backward compatibility
    const extractedText = rawText;

    // Store transcript in database (but continue even if this fails)
    let transcriptData = null;
    let transcriptError = null;
    
    if (supabase) {
      const { data, error } = await supabase
        .from('transcripts')
        .insert({
          session_id: sessionId,
          file_name: originalName,
          file_url: fileUrl,
          extracted_text: extractedText,
          structured_data: structuredTranscriptData ? JSON.stringify(structuredTranscriptData) : null, // Store structured JSON
          major: pipelineData.major || null,
          workload_preference: pipelineData.workloadPreference || null,
          credit_range: pipelineData.creditRange || null
        })
        .select()
        .single();

      transcriptData = data;
      transcriptError = error;
      
      if (transcriptError) {
        console.warn('⚠️ Error saving transcript to database (continuing anyway):', transcriptError.message);
        // Create a mock transcript data object to continue
        transcriptData = {
          id: `temp-${Date.now()}`,
          session_id: sessionId,
          file_name: originalName,
          file_url: fileUrl,
          extracted_text: extractedText,
          structured_data: structuredTranscriptData ? JSON.stringify(structuredTranscriptData) : null,
          major: pipelineData.major || null,
          workload_preference: pipelineData.workloadPreference || null,
          credit_range: pipelineData.creditRange || null
        };
      }
    } else {
      // Supabase not available, create mock data
      console.warn('⚠️ Supabase not available, using in-memory transcript data');
      transcriptData = {
        id: `temp-${Date.now()}`,
        session_id: sessionId,
        file_name: originalName,
        file_url: fileUrl || 'file-uploaded',
        extracted_text: extractedText,
        structured_data: structuredTranscriptData ? JSON.stringify(structuredTranscriptData) : null,
        major: pipelineData.major || null,
        workload_preference: pipelineData.workloadPreference || null,
        credit_range: pipelineData.creditRange || null
      };
    }

    // Store transcript data in pipeline state as backup (even if database save failed)
    const transcriptInfo = {
      id: transcriptData?.id || `temp-${Date.now()}`,
      fileName: originalName,
      fileUrl: fileUrl || 'uploaded',
      extractedText: extractedText,
      structuredData: structuredTranscriptData, // Store structured data for faster processing
      major: pipelineData.major,
      workloadPreference: pipelineData.workloadPreference,
      creditRange: pipelineData.creditRange
    };

    // Update pipeline state to processing (even if transcript save failed)
    await SchedulePlanningPipeline.updateState(sessionId, SchedulePlanningPipeline.STATES.PROCESSING, {
      ...pipelineData,
      transcriptId: transcriptInfo.id,
      transcriptText: extractedText, // Store text directly in pipeline state as backup
      transcriptStructuredData: structuredTranscriptData, // Store structured data
      transcriptFileName: originalName,
      transcriptFileUrl: fileUrl,
      requestedCourses: pipelineData.requestedCourses || [] // Preserve requested courses
    });

    // Automatically trigger schedule generation
    // OPTIMIZATION: Fetch major context in parallel with schedule generation prep
    let scheduleResult = null;
    try {
      console.log('🔄 Starting schedule generation...');
      
      // OPTIMIZATION: Start fetching major context while preparing schedule input
      const isPineconeAvail = isPineconeAvailable();
      const hasMajor = !!pipelineData.major;
      
      console.log('🔍 Schedule generation context check:', {
        pineconeAvailable: isPineconeAvail,
        hasMajor: hasMajor,
        major: pipelineData.major,
        yearLevel: pipelineData.yearLevel || 'not provided',
        workloadPreference: pipelineData.workloadPreference || 'medium'
      });
      
      const majorContextPromise = isPineconeAvail && hasMajor
        ? getMajorContext(pipelineData.major, 10)
        : Promise.resolve(null);

      // Prepare schedule input while major context is being fetched
      const scheduleInput = {
        ...transcriptInfo,
        extracted_text: extractedText || transcriptInfo.extractedText || '',
        major: pipelineData.major || transcriptInfo.major,
        workload_preference: pipelineData.workloadPreference || transcriptInfo.workloadPreference
      };
      
      console.log('⚙️ Generating schedule with:', {
        major: scheduleInput.major,
        workload: pipelineData.workloadPreference,
        hasText: !!scheduleInput.extracted_text,
        textLength: (scheduleInput.extracted_text || '').length
      });
      
      // Wait for major context (should be ready by now or very soon)
      let majorContext = await majorContextPromise;
      
      // DETAILED LOGGING: Track majorContext state
      if (majorContext) {
        console.log('📚 Major context fetched from Pinecone:', {
          hasMajor: !!majorContext.major,
          requirementsCount: Array.isArray(majorContext.requirements) ? majorContext.requirements.length : 0,
          availableCoursesCount: Array.isArray(majorContext.availableCourses) ? majorContext.availableCourses.length : 0,
          prerequisitesCount: majorContext.prerequisites && typeof majorContext.prerequisites === 'object' ? Object.keys(majorContext.prerequisites).length : 0,
          hasError: !!majorContext.error
        });
      } else {
        console.warn('⚠️ Major context is null - will use fallback course recommendations');
        console.log('📋 Fallback will use:', {
          yearLevel: pipelineData.yearLevel || 'generic',
          hasTranscript: !!scheduleInput.extracted_text
        });
      }
      
      try {
        scheduleResult = await generateSchedule(
          scheduleInput,
          majorContext,
          pipelineData.workloadPreference || 'medium',
          pipelineData.requestedCourses || [],
          pipelineData.yearLevel || null
        );
      } catch (scheduleError) {
        console.error('❌ Error in generateSchedule:', scheduleError);
        console.error('❌ Error stack:', scheduleError.stack);
        console.error('❌ majorContext at error time:', {
          isNull: majorContext === null,
          isUndefined: majorContext === undefined,
          type: typeof majorContext,
          value: majorContext
        });
        throw scheduleError; // Re-throw to be caught by outer try-catch
      }
      
      console.log('✅ Schedule generation result:', scheduleResult.success ? 'Success' : 'Failed');

      if (scheduleResult.success) {
        // Validate schedule
        const validation = validateSchedule(
          scheduleResult.schedule,
          majorContext,
          scheduleResult.schedule.completedCourses || []
        );

        // Update pipeline state to offering export
        await SchedulePlanningPipeline.updateState(sessionId, SchedulePlanningPipeline.STATES.OFFERING_EXPORT, {
          ...pipelineData,
          transcriptId: transcriptInfo.id,
          schedule: scheduleResult.schedule,
          validation: validation
        });

        // Create a comprehensive response message
        const scheduleMessage = `Great! I've processed your transcript and generated your schedule for ${scheduleResult.schedule.semester || 'next semester'}.

**Your Schedule Summary:**
• Total Credits: ${scheduleResult.schedule.totalCredits || 0}
• Number of Courses: ${scheduleResult.schedule.courses?.length || 0}
• Workload: ${pipelineData.workloadPreference || 'medium'}

${validation.issues.length > 0 ? `\n⚠️ **Issues Found:**\n${validation.issues.map(i => `• ${i}`).join('\n')}\n` : ''}
${validation.warnings.length > 0 ? `\n💡 **Notes:**\n${validation.warnings.map(w => `• ${w}`).join('\n')}\n` : ''}

You can:
• Ask me questions about your schedule
• Request modifications (change courses, times, workload, etc.)
• Download your schedule as a **PDF** or **Notion template**

What would you like to do?`;

        console.log('📤 Returning schedule response with pipeline state:', SchedulePlanningPipeline.STATES.OFFERING_EXPORT);
        
        res.json({
          success: true,
          response: scheduleMessage,
          transcript: {
            id: transcriptInfo.id,
            fileName: originalName,
            extractedText: extractedText.substring(0, 500) + '...', // Preview
            uploadedAt: new Date().toISOString()
          },
          schedule: scheduleResult.schedule,
          validation: validation,
          inPipeline: true,
          pipelineState: SchedulePlanningPipeline.STATES.OFFERING_EXPORT,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error(scheduleResult.error || 'Schedule generation failed');
      }
    } catch (scheduleError) {
      console.error('❌ Schedule generation error:', scheduleError);
      
      // Update pipeline state to indicate error but keep in pipeline
      await SchedulePlanningPipeline.updateState(sessionId, SchedulePlanningPipeline.STATES.COLLECTING_TRANSCRIPT, {
        ...pipelineData,
        transcriptId: transcriptInfo.id,
        transcriptText: extractedText,
        transcriptFileName: originalName,
        scheduleError: scheduleError.message
      });
      
      // Still return success for transcript upload, but note schedule generation failed
      // Keep pipeline active so user can retry
      res.json({
        success: true,
        response: `I've received your transcript "${originalName}", but I encountered an issue generating your schedule. The error was: ${scheduleError.message}. 

Would you like to try uploading your transcript again, or would you prefer to continue with schedule planning in a different way?`,
        transcript: {
          id: transcriptInfo.id,
          fileName: originalName,
          extractedText: extractedText.substring(0, 500) + '...',
          uploadedAt: new Date().toISOString()
        },
        inPipeline: true,
        pipelineState: SchedulePlanningPipeline.STATES.COLLECTING_TRANSCRIPT,
        scheduleError: scheduleError.message,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Transcript upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Transcript upload failed',
      details: error.message
    });
  }
});

/**
 * GET /api/chat/files
 * List files in the User_Files bucket
 */
router.get('/files', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    const files = await listFiles('User_Files');

    // Add signed URLs to each file
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        try {
          const url = await getFileUrl('User_Files', file.name, 3600);
          return {
            id: file.id,
            name: file.name,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'unknown',
            url: url,
            uploadedAt: file.created_at,
            lastModified: file.updated_at
          };
        } catch (error) {
          console.error('❌ Error getting URL for file:', file.name, error);
          return {
            id: file.id,
            name: file.name,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'unknown',
            url: null,
            uploadedAt: file.created_at,
            lastModified: file.updated_at,
            error: 'Could not generate URL'
          };
        }
      })
    );

    res.json({
      success: true,
      files: filesWithUrls,
      count: filesWithUrls.length
    });

  } catch (error) {
    console.error('❌ List files error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list files',
      details: error.message
    });
  }
});

/**
 * GET /api/chat/files/:fileName
 * Get a specific file URL
 */
router.get('/files/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    const fileUrl = await getFileUrl('User_Files', fileName, 3600);

    res.json({
      success: true,
      file: {
        name: fileName,
        url: fileUrl,
        expiresIn: 3600
      }
    });

  } catch (error) {
    console.error('❌ Get file URL error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get file URL',
      details: error.message
    });
  }
});

/**
 * DELETE /api/chat/files/:fileName
 * Delete a file from the User_Files bucket
 */
router.delete('/files/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    await deleteFile('User_Files', fileName);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file',
      details: error.message
    });
  }
});

/**
 * GET /api/chat/pipeline-state/:sessionId
 * Get current pipeline state for a session
 */
router.get('/pipeline-state/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    const state = await SchedulePlanningPipeline.getState(sessionId);
    const transcript = await SchedulePlanningPipeline.getTranscript(sessionId);

    res.json({
      success: true,
      pipelineState: state,
      transcript: transcript,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get pipeline state error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pipeline state',
      details: error.message
    });
  }
});

/**
 * POST /api/chat/pipeline-state/:sessionId
 * Update pipeline state for a session
 */
router.post('/pipeline-state/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { state, data } = req.body;

    if (!sessionId || !state) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and state are required'
      });
    }

    const success = await SchedulePlanningPipeline.updateState(sessionId, state, data || {});

    if (success) {
      res.json({
        success: true,
        message: 'Pipeline state updated',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update pipeline state'
      });
    }

  } catch (error) {
    console.error('❌ Update pipeline state error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update pipeline state',
      details: error.message
    });
  }
});

/**
 * POST /api/chat/generate-schedule
 * Generate schedule based on transcript and major context
 */
router.post('/generate-schedule', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    // Get pipeline state
    const pipelineState = await SchedulePlanningPipeline.getState(sessionId);
    if (pipelineState.state !== SchedulePlanningPipeline.STATES.PROCESSING) {
      return res.status(400).json({
        success: false,
        error: 'Session is not in processing state'
      });
    }

    const pipelineData = pipelineState.data || {};

    // Get transcript
    const transcript = await SchedulePlanningPipeline.getTranscript(sessionId);
    if (!transcript) {
      return res.status(400).json({
        success: false,
        error: 'No transcript found for this session'
      });
    }

    // Get major context
    let majorContext = null;
    if (isPineconeAvailable() && pipelineData.major) {
      console.log('📚 Fetching major context for generate-schedule endpoint...');
      majorContext = await getMajorContext(pipelineData.major, 10);
      console.log('📚 Major context fetched:', {
        hasMajor: !!majorContext?.major,
        availableCoursesCount: Array.isArray(majorContext?.availableCourses) ? majorContext.availableCourses.length : 0
      });
    } else {
      console.warn('⚠️ Pinecone not available or no major, majorContext will be null');
    }

    // Ensure transcript has structured data if available
    if (pipelineData.transcriptStructuredData) {
      transcript.structuredData = pipelineData.transcriptStructuredData;
      console.log('✅ Using structured transcript data from pipeline state');
    }

    // Generate schedule
    const result = await generateSchedule(transcript, majorContext, pipelineData.workloadPreference || 'medium', pipelineData.requestedCourses || [], pipelineData.yearLevel || null);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate schedule',
        details: result.error
      });
    }

    // Validate schedule
    const validation = validateSchedule(result.schedule, majorContext, result.schedule.completedCourses || []);

    // Update pipeline state
    await SchedulePlanningPipeline.updateState(sessionId, SchedulePlanningPipeline.STATES.OFFERING_EXPORT, {
      ...pipelineData,
      schedule: result.schedule,
      validation: validation
    });

    res.json({
      success: true,
      schedule: result.schedule,
      validation: validation,
      message: 'Schedule generated successfully!',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Generate schedule error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate schedule',
      details: error.message
    });
  }
});

/**
 * GET /api/chat/schedule-export/:sessionId
 * Export schedule as PDF or Notion template
 */
router.get('/schedule-export/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { format = 'pdf' } = req.query;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    // Get pipeline state
    const pipelineState = await SchedulePlanningPipeline.getState(sessionId);
    const pipelineData = pipelineState.data || {};

    if (!pipelineData.schedule) {
      return res.status(400).json({
        success: false,
        error: 'No schedule found for this session'
      });
    }

    const schedule = pipelineData.schedule;

    if (format === 'pdf') {
      try {
        const pdfBuffer = await generateSchedulePDF(schedule);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="schedule-${sessionId}.pdf"`);
        res.send(pdfBuffer);
      } catch (error) {
        if (error.message.includes('PDFKit')) {
          return res.status(500).json({
            success: false,
            error: 'PDF generation requires pdfkit library',
            message: 'Please install pdfkit: npm install pdfkit'
          });
        }
        throw error;
      }
    } else if (format === 'notion' || format === 'markdown') {
      const template = generateNotionTemplate(schedule);
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="schedule-${sessionId}.md"`);
      res.send(template);
    } else if (format === 'csv') {
      const csv = generateCSV(schedule);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="schedule-${sessionId}.csv"`);
      res.send(csv);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid format. Use: pdf, notion, markdown, or csv'
      });
    }

  } catch (error) {
    console.error('❌ Schedule export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export schedule',
      details: error.message
    });
  }
});

module.exports = router;

