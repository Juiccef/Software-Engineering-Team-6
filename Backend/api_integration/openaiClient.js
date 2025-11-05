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
 * Send a message to ChatGPT and get response
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous conversation messages
 * @param {Object} options - Additional options for the chat
 * @returns {Promise<Object>} - OpenAI response
 */
async function sendToChatGPT(message, conversationHistory = [], options = {}) {
  try {
    const client = getOpenAIClient();
    
    if (!client) {
      throw new Error('OpenAI client not available');
    }

    // Prepare messages array with system prompt and conversation history
    const messages = [
      {
        role: 'system',
        content: `You are Pounce, the GSU Panther Chatbot, an AI-powered academic assistant for Georgia State University students. 

Your role:
- Help students with academic planning, course recommendations, and degree requirements
- Provide information about campus resources, events, and services
- Assist with schedule building and academic advising
- Be friendly, helpful, and knowledgeable about GSU
- Use GSU terminology and references when appropriate
- Keep responses concise but informative
- If you don't know something specific about GSU, acknowledge it and suggest where to find the information

Always maintain a helpful and professional tone while being approachable like a friendly campus advisor.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const completion = await client.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0,
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
  // DISABLED: Commenting out hardcoded responses to allow AI-powered responses
  // The quick responses were preventing the AI from providing contextual answers
  
  // const quickResponses = {
  //   'hello': 'Hello! I\'m Pounce, your GSU Panther Chatbot. How can I help you with your academic journey today?',
  //   'help': 'I can help you with:\n• Academic planning and course selection\n• Schedule building\n• Campus resources and services\n• Degree requirements\n• Campus events and activities\n\nWhat would you like to know?',
  //   'gsu': 'Georgia State University is a leading urban research university! I can help you navigate campus life, academic requirements, and student services.',
  //   'courses': 'I can help you find courses that match your interests and degree requirements. What program are you in or considering?',
  //   'schedule': 'I\'d be happy to help you build your class schedule! What semester are you planning for, and do you have any preferences for class times?'
  // };

  // const lowerQuery = query.toLowerCase();
  // for (const [key, response] of Object.entries(quickResponses)) {
  //   if (lowerQuery.includes(key)) {
  //     return {
  //       success: true,
  //       response: response,
  //       quick: true
  //     };
  //   }
  // }

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
  textToSpeech
};
