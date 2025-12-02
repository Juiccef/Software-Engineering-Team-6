const OpenAI = require('openai');

let openaiClient = null;

/**
 * Initialize OpenAI client with API key from environment variables
 */
function initializeOpenAI() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      console.log('📝 Please add your OpenAI API key to the .env file');
      return null;
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
      timeout: 30000, // 30 seconds timeout
    });

    console.log('✅ OpenAI client initialized successfully');
    return openaiClient;
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI client:', error.message);
    return null;
  }
}

/**
 * Get the initialized OpenAI client
 */
function getOpenAIClient() {
  if (!openaiClient) {
    console.warn('⚠️ OpenAI client not initialized. Attempting to initialize...');
    return initializeOpenAI();
  }
  return openaiClient;
}

/**
 * Get dynamic system prompt based on settings
 * @param {Object} settings - User settings (personality, responseStyle)
 * @returns {string} - System prompt
 */
function getSystemPrompt(settings = {}) {
  const personality = settings.personality || 'friendly';
  const responseStyle = settings.responseStyle || 'balanced';
  
  const personalities = {
    formal: `Maintain a professional and formal tone. Use proper academic language and address students respectfully. Be precise and structured in your responses.`,
    friendly: `Be friendly, approachable, and warm. Use a conversational but respectful tone. Show enthusiasm when helping students.`,
    casual: `Use a casual, relaxed, and conversational tone. Be more informal while still being helpful and respectful.`
  };
  
  const styles = {
    concise: `Keep responses brief and to-the-point. Provide direct answers without unnecessary elaboration. Aim for 2-3 sentences when possible.`,
    balanced: `Provide balanced, informative responses. Include enough detail to be helpful but remain focused. Typically 3-5 sentences.`,
    detailed: `Provide comprehensive, detailed explanations. Include context, examples, and additional helpful information. Be thorough in your responses.`
  };
  
  const basePrompt = `You are Pounce, the GSU Panther Chatbot, an AI-powered academic assistant for Georgia State University students. 

Your role:
- Help students with academic planning, course recommendations, and degree requirements
- Provide information about campus resources, events, and services
- Assist with schedule building and academic advising
- Be knowledgeable about GSU
- Use GSU terminology and references when appropriate
- If you don't know something specific about GSU, acknowledge it and suggest where to find the information

${personalities[personality]}

${styles[responseStyle]}

Always maintain a helpful tone while being approachable like a friendly campus advisor.`;

  return basePrompt;
}

/**
 * Send a message to ChatGPT and get response
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous conversation messages
 * @param {Object} options - Additional options for the chat (including settings)
 * @returns {Promise<Object>} - OpenAI response
 */
async function sendToChatGPT(message, conversationHistory = [], options = {}) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    // Extract settings from options or use defaults
    const settings = options.settings || {};
    const systemPrompt = getSystemPrompt(settings);

    // Prepare messages array with system prompt and conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const completion = await client.chat.completions.create({
      model: settings.model || options.model || 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: settings.maxTokens || options.maxTokens || 500,
      temperature: settings.temperature !== undefined ? settings.temperature : (options.temperature || 0.7),
      top_p: settings.topP !== undefined ? settings.topP : (options.topP || 1),
      frequency_penalty: settings.frequencyPenalty !== undefined ? settings.frequencyPenalty : (options.frequencyPenalty || 0),
      presence_penalty: settings.presencePenalty !== undefined ? settings.presencePenalty : (options.presencePenalty || 0),
    });

    return {
      success: true,
      response: completion.choices[0].message.content,
      usage: completion.usage,
      model: completion.model
    };

  } catch (error) {
    console.error('❌ Error calling OpenAI API:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = 'I apologize, but I\'m having trouble connecting to my AI service right now.';
    let errorType = 'general_error';
    
    // Check for quota errors (can appear as code or in error object)
    if (error.code === 'insufficient_quota' || 
        error.status === 429 || 
        (error.error && error.error.code === 'insufficient_quota')) {
      errorMessage = 'I apologize, but the OpenAI API quota has been exceeded. Please check your billing and usage limits at https://platform.openai.com/usage. You may need to add credits to your account or upgrade your plan.';
      errorType = 'quota_exceeded';
    } else if (error.code === 'invalid_api_key' || error.message?.includes('Invalid API key')) {
      errorMessage = 'I apologize, but there\'s an issue with my API configuration. Please check the OpenAI API key settings.';
      errorType = 'invalid_api_key';
    }
    
    return {
      success: false,
      error: error.message,
      errorType: errorType,
      response: errorMessage
    };
  }
}

/**
 * Generate a quick response for common queries
 * @param {string} query - User query
 * @returns {Promise<Object>} - Quick response
 */
async function getQuickResponse(query) {
  // Quick responses for common queries (only used if enabled in settings)
  // These provide instant responses for simple queries without calling the AI
  
  const quickResponses = {
    'hello': 'Hello! I\'m Pounce, your GSU Panther Chatbot. How can I help you with your academic journey today?',
    'hi': 'Hi there! I\'m Pounce, your GSU Panther Chatbot. What can I help you with?',
    'help': 'I can help you with:\n• Academic planning and course selection\n• Schedule building\n• Campus resources and services\n• Degree requirements\n• Campus events and activities\n\nWhat would you like to know?',
    'gsu': 'Georgia State University is a leading urban research university! I can help you navigate campus life, academic requirements, and student services.',
    'courses': 'I can help you find courses that match your interests and degree requirements. What program are you in or considering?',
    'schedule': 'I\'d be happy to help you build your class schedule! What semester are you planning for, and do you have any preferences for class times?'
  };

  const lowerQuery = query.toLowerCase().trim();
  
  // Check for exact matches first
  if (quickResponses[lowerQuery]) {
    return {
      success: true,
      response: quickResponses[lowerQuery],
      quick: true
    };
  }
  
  // Check for partial matches (only for very simple queries to avoid false positives)
  if (lowerQuery.length < 20) {
    for (const [key, response] of Object.entries(quickResponses)) {
      if (lowerQuery === key || lowerQuery === `${key}!` || lowerQuery === `${key}?`) {
        return {
          success: true,
          response: response,
          quick: true
        };
      }
    }
  }

  return null;
}

/**
 * Convert text to speech using OpenAI TTS API
 * @param {string} text - Text to convert to speech
 * @param {string} voice - Voice model to use (alloy, echo, fable, onyx, nova, shimmer)
 * @returns {Promise<Buffer>} - Audio buffer in MP3 format
 */
async function textToSpeech(text, voice = 'alloy') {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    // Validate voice parameter
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(voice)) {
      throw new Error(`Invalid voice. Must be one of: ${validVoices.join(', ')}`);
    }

    // Call OpenAI TTS API
    const response = await client.audio.speech.create({
      model: 'tts-1', // or 'tts-1-hd' for higher quality
      voice: voice,
      input: text,
    });

    // Convert response to buffer
    const buffer = Buffer.from(await response.arrayBuffer());
    
    return {
      success: true,
      audio: buffer,
      format: 'mp3'
    };

  } catch (error) {
    console.error('❌ Error calling OpenAI TTS API:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  initializeOpenAI,
  getOpenAIClient,
  sendToChatGPT,
  getQuickResponse,
  textToSpeech,
  getSystemPrompt
};
