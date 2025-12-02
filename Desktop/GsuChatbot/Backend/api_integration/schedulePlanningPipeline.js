/**
 * Schedule Planning Pipeline - Conversation State Management
 * 
 * Manages the conversational flow for schedule planning feature.
 * Handles state transitions, trigger detection, and natural language processing.
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

let supabase;
try {
  supabase = require('./supaBase');
} catch (error) {
  console.warn('⚠️ Could not load supabase, using in-memory only:', error.message);
  supabase = null;
}

// In-memory fallback for pipeline state (used when Supabase is unavailable)
const inMemoryState = new Map();

// Pipeline states
const STATES = {
  IDLE: 'idle',
  COLLECTING_MAJOR: 'collecting_major',
  COLLECTING_WORKLOAD: 'collecting_workload',
  COLLECTING_YEAR_LEVEL: 'collecting_year_level',
  COLLECTING_TRANSCRIPT: 'collecting_transcript',
  PROCESSING: 'processing',
  GENERATING_SCHEDULE: 'generating_schedule',
  OFFERING_EXPORT: 'offering_export',
  COMPLETED: 'completed'
};

// Exit keywords
const EXIT_KEYWORDS = ['exit', 'cancel', 'stop', 'nevermind', 'quit', 'abort', 'back'];

// Schedule planning trigger phrases
const TRIGGER_PHRASES = [
  'schedule', 'planning', 'plan my', 'build schedule', 'next semester',
  'course schedule', 'class schedule', 'semester planning', 'schedule building',
  'help with planning', 'create schedule', 'generate schedule'
];

// Workload preference keywords
const WORKLOAD_KEYWORDS = {
  light: ['light', 'easy', 'minimal', 'few', 'less', '12', '13'],
  medium: ['medium', 'moderate', 'normal', 'average', '14', '15'],
  heavy: ['heavy', 'full', 'maximum', 'many', 'lots', '16', '17', '18', 'max']
};

class SchedulePlanningPipeline {
  /**
   * Detect if a message triggers the schedule planning pipeline
   * @param {string} message - User message
   * @returns {boolean} - Whether the message triggers the pipeline
   */
  static detectTrigger(message) {
    if (!message || typeof message !== 'string') return false;
    
    const lowerMessage = message.toLowerCase();
    return TRIGGER_PHRASES.some(phrase => lowerMessage.includes(phrase));
  }

  /**
   * Check if user wants to exit the pipeline
   * @param {string} message - User message
   * @returns {boolean} - Whether user wants to exit
   */
  static canExit(message) {
    if (!message || typeof message !== 'string') return false;
    
    const lowerMessage = message.toLowerCase().trim();
    return EXIT_KEYWORDS.some(keyword => lowerMessage === keyword || lowerMessage.includes(keyword));
  }

  /**
   * Parse workload preference from natural language
   * @param {string} message - User message
   * @returns {string|null} - 'light', 'medium', 'heavy', or null
   */
  static parseWorkloadPreference(message) {
    if (!message || typeof message !== 'string') return null;
    
    const lowerMessage = message.toLowerCase();
    
    // Check for each workload type
    for (const [preference, keywords] of Object.entries(WORKLOAD_KEYWORDS)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return preference;
      }
    }
    
    return null;
  }

  /**
   * Parse year level from user message
   * @param {string} message - User message
   * @returns {string|null} - Year level: 'freshman', 'sophomore', 'junior', 'senior', or null
   */
  static parseYearLevel(message) {
    if (!message || typeof message !== 'string') return null;
    
    const lowerMessage = message.toLowerCase();
    
    // Check for year level keywords
    if (lowerMessage.includes('freshman') || lowerMessage.includes('first year') || lowerMessage.includes('1st year') || lowerMessage.includes('first-year')) {
      return 'freshman';
    } else if (lowerMessage.includes('sophomore') || lowerMessage.includes('second year') || lowerMessage.includes('2nd year') || lowerMessage.includes('second-year')) {
      return 'sophomore';
    } else if (lowerMessage.includes('junior') || lowerMessage.includes('third year') || lowerMessage.includes('3rd year') || lowerMessage.includes('third-year')) {
      return 'junior';
    } else if (lowerMessage.includes('senior') || lowerMessage.includes('fourth year') || lowerMessage.includes('4th year') || lowerMessage.includes('fourth-year')) {
      return 'senior';
    }
    
    return null;
  }

  /**
   * Get the next question based on current state
   * @param {string} state - Current pipeline state
   * @param {Object} context - Current context data
   * @returns {string} - Next question to ask
   */
  static getNextQuestion(state, context = {}) {
    switch (state) {
      case STATES.COLLECTING_MAJOR:
        return "Great! I'd be happy to help you plan your schedule. First, what's your major?";
      
      case STATES.COLLECTING_WORKLOAD:
        return "Perfect! Now, what kind of workload are you looking for? You can choose:\n\n• **Light** (12-13 credits) - Minimum for full-time students\n• **Medium** (14-15 credits) - Balanced course load\n• **Heavy** (16-18 credits) - Maximum course load\n\nWhich would you prefer?";
      
      case STATES.COLLECTING_YEAR_LEVEL:
        return "Great! What year are you in school? Are you a **Freshman**, **Sophomore**, **Junior**, or **Senior**?";
      
      case STATES.COLLECTING_TRANSCRIPT:
        return "Excellent! To create the best schedule for you, I can use your transcript to see what courses you've already completed. You can upload it using the file upload button, or type 'skip' if you don't have one available.";
      
      case STATES.PROCESSING:
        return "I'm processing your transcript and gathering information about your major requirements. This may take a moment...";
      
      case STATES.GENERATING_SCHEDULE:
        return "I'm generating your personalized schedule based on your transcript and major requirements...";
      
      case STATES.OFFERING_EXPORT:
        return "Your schedule is ready! Would you like to download it as a PDF or get a Notion template you can copy and paste?";
      
      default:
        return "How can I help you with your schedule planning?";
    }
  }

  /**
   * Get pipeline state from session
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<Object>} - Pipeline state object
   */
  static async getState(sessionId) {
    if (!sessionId) {
      console.log('⚠️ No sessionId for getState');
      return { state: STATES.IDLE, data: {} };
    }

    // Check in-memory fallback first
    if (inMemoryState.has(sessionId)) {
      const state = inMemoryState.get(sessionId);
      console.log('✅ Retrieved pipeline state from memory:', state);
      return state;
    }

    if (!supabase) {
      console.log('⚠️ No supabase client, using in-memory fallback');
      return { state: STATES.IDLE, data: {} };
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('pipeline_state')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.log('⚠️ Error fetching pipeline state from Supabase, using in-memory fallback:', error.message);
        // Return in-memory state if available, otherwise idle
        return inMemoryState.get(sessionId) || { state: STATES.IDLE, data: {} };
      }

      if (!data || !data.pipeline_state) {
        console.log('⚠️ No pipeline_state found in session:', sessionId);
        return { state: STATES.IDLE, data: {} };
      }

      // Cache in memory
      inMemoryState.set(sessionId, data.pipeline_state);
      console.log('✅ Retrieved pipeline state from Supabase:', data.pipeline_state);
      return data.pipeline_state;
    } catch (error) {
      console.error('❌ Error getting pipeline state, using in-memory fallback:', error.message);
      // Return in-memory state if available
      return inMemoryState.get(sessionId) || { state: STATES.IDLE, data: {} };
    }
  }

  /**
   * Update pipeline state in session
   * @param {string} sessionId - Chat session ID
   * @param {string} newState - New pipeline state
   * @param {Object} data - Additional data to store
   * @returns {Promise<boolean>} - Success status
   */
  static async updateState(sessionId, newState, data = {}) {
    if (!sessionId) {
      console.log('⚠️ No sessionId for updateState');
      return false;
    }

    const pipelineState = {
      state: newState,
      data: data,
      updatedAt: new Date().toISOString()
    };

    // Always update in-memory state first (fast and reliable)
    inMemoryState.set(sessionId, pipelineState);
    console.log('✅ Updated pipeline state in memory:', { sessionId, newState, data });

    // Try to persist to Supabase if available
    if (!supabase) {
      console.log('⚠️ No supabase client, state saved in memory only');
      return true;
    }

    try {
      // First, check if session exists
      const { data: existingSession, error: checkError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('id', sessionId)
        .single();

      if (checkError || !existingSession) {
        // Session doesn't exist, create it
        console.log('📝 Creating new session for pipeline state:', sessionId);
        const { error: insertError } = await supabase
          .from('chat_sessions')
          .insert({
            id: sessionId,
            title: 'Schedule Planning',
            session_type: 'chat',
            pipeline_state: pipelineState
          });

        if (insertError) {
          console.warn('⚠️ Error creating session in Supabase (using in-memory only):', insertError.message);
          // Still return true since we saved in memory
          return true;
        }
        console.log('✅ Created session with pipeline state in Supabase');
        return true;
      }

      // Session exists, update it
      const { error } = await supabase
        .from('chat_sessions')
        .update({ pipeline_state: pipelineState })
        .eq('id', sessionId);

      if (error) {
        console.warn('⚠️ Error updating pipeline state in Supabase (using in-memory only):', error.message);
        // Still return true since we saved in memory
        return true;
      }

      console.log('✅ Updated pipeline state in Supabase');
      return true;
    } catch (error) {
      console.warn('⚠️ Exception updating pipeline state in Supabase (using in-memory only):', error.message);
      // Still return true since we saved in memory
      return true;
    }
  }

  /**
   * Reset pipeline state (exit pipeline)
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<boolean>} - Success status
   */
  static async resetState(sessionId) {
    return this.updateState(sessionId, STATES.IDLE, {});
  }

  /**
   * Check if session is in pipeline mode
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<boolean>} - Whether session is in pipeline
   */
  static async isInPipeline(sessionId) {
    const stateObj = await this.getState(sessionId);
    const inPipeline = stateObj && stateObj.state && stateObj.state !== STATES.IDLE && stateObj.state !== STATES.COMPLETED;
    console.log('🔍 isInPipeline check:', { sessionId, stateObj, inPipeline });
    return inPipeline;
  }

  /**
   * Get transcript for a session
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<Object|null>} - Transcript data or null
   */
  static async getTranscript(sessionId) {
    if (!supabase || !sessionId) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Error getting transcript:', error);
      return null;
    }
  }
}

module.exports = SchedulePlanningPipeline;
module.exports.STATES = STATES;

