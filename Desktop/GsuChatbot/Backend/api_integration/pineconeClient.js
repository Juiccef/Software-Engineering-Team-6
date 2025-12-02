/**
 * Pinecone Vector Database Integration
 * 
 * This module handles vector database operations for the GSU Chatbot,
 * including embedding generation, vector storage, and semantic search.
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');

let pineconeClient = null;
let pineconeIndex = null;
let openaiClient = null;

// Query cache with TTL (Time To Live)
const queryCache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds cache duration
const MAX_CACHE_SIZE = 100; // Maximum number of cached queries

/**
 * Generate cache key from query and topK
 * @param {string} query - User query
 * @param {number} topK - Number of results
 * @returns {string} - Cache key
 */
function getCacheKey(query, topK) {
  // Normalize query (lowercase, trim) for better cache hits
  const normalizedQuery = query.toLowerCase().trim();
  return `${normalizedQuery}:${topK}`;
}

/**
 * Get cached query result if available and not expired
 * @param {string} query - User query
 * @param {number} topK - Number of results
 * @returns {Array|null} - Cached results or null if not found/expired
 */
function getCachedResult(query, topK) {
  const cacheKey = getCacheKey(query, topK);
  const cached = queryCache.get(cacheKey);
  
  if (!cached) {
    return null;
  }
  
  // Check if cache entry is expired
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    queryCache.delete(cacheKey);
    return null;
  }
  
  console.log(`💾 Cache hit for query: "${query.substring(0, 50)}..."`);
  return cached.results;
}

/**
 * Store query result in cache
 * @param {string} query - User query
 * @param {number} topK - Number of results
 * @param {Array} results - Query results
 */
function setCachedResult(query, topK, results) {
  // Clean up old cache entries if we're at max size
  if (queryCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entries (simple FIFO - remove first entry)
    const firstKey = queryCache.keys().next().value;
    if (firstKey) {
      queryCache.delete(firstKey);
    }
  }
  
  const cacheKey = getCacheKey(query, topK);
  queryCache.set(cacheKey, {
    results: results,
    timestamp: Date.now()
  });
  
  console.log(`💾 Cached query result: "${query.substring(0, 50)}..." (${queryCache.size}/${MAX_CACHE_SIZE} entries)`);
}

/**
 * Initialize Pinecone client and index
 */
function initializePinecone() {
  try {
    const apiKey = process.env.PINECONE_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ PINECONE_API_KEY not found in environment variables');
      console.log('📝 Pinecone integration will be disabled');
      return null;
    }

    pineconeClient = new Pinecone({
      apiKey: apiKey,
    });

    const indexName = process.env.PINECONE_INDEX_NAME || 'gsu-chatbot';
    pineconeIndex = pineconeClient.index(indexName);

    console.log('✅ Pinecone client initialized successfully');
    return pineconeClient;
  } catch (error) {
    console.error('❌ Failed to initialize Pinecone client:', error.message);
    return null;
  }
}

/**
 * Initialize OpenAI client for embeddings
 */
function initializeOpenAIForEmbeddings() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not found for embeddings');
      return null;
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
    });

    console.log('✅ OpenAI client initialized for embeddings');
    return openaiClient;
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI client for embeddings:', error.message);
    return null;
  }
}

/**
 * Get embedding for text using OpenAI
 * @param {string} text - Text to embed
 * @returns {Promise<Array>} - Embedding vector
 */
async function getEmbedding(text) {
  try {
    if (!openaiClient) {
      openaiClient = initializeOpenAIForEmbeddings();
    }

    if (!openaiClient) {
      throw new Error('OpenAI client not available for embeddings');
    }

    const response = await openaiClient.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('❌ Error generating embedding:', error);
    
    // Check for quota errors
    if (error.code === 'insufficient_quota' || error.status === 429) {
      const quotaError = new Error('OpenAI API quota exceeded. Please check your billing and usage limits at https://platform.openai.com/usage');
      quotaError.code = 'insufficient_quota';
      quotaError.status = 429;
      throw quotaError;
    }
    
    throw error;
  }
}

/**
 * Search for relevant context using Pinecone
 * @param {string} query - User query
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array>} - Relevant context chunks
 */
async function searchContext(query, topK = 3) {
  try {
    // Check cache first
    const cachedResults = getCachedResult(query, topK);
    if (cachedResults !== null) {
      return cachedResults;
    }
    
    if (!pineconeIndex) {
      initializePinecone();
    }

    if (!pineconeIndex) {
      console.warn('⚠️ Pinecone not available, returning empty context');
      return [];
    }

    // Generate embedding for the query
    const queryEmbedding = await getEmbedding(query);

    // Search Pinecone index
    const searchResponse = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: topK,
      includeMetadata: true,
    });

    // Extract relevant context
    const contextChunks = searchResponse.matches.map(match => ({
      id: match.id,
      score: match.score,
      text: match.metadata?.text || '',
      source: match.metadata?.source || '',
      topic: match.metadata?.topic || ''
    }));

    // Cache the results
    setCachedResult(query, topK, contextChunks);

    return contextChunks;
  } catch (error) {
    console.error('❌ Error searching Pinecone:', error);
    
    // If quota error, re-throw it so it can be handled properly
    if (error.code === 'insufficient_quota' || error.status === 429) {
      throw error;
    }
    
    return [];
  }
}

/**
 * Generate context-aware response using retrieved context
 * @param {string} query - User query
 * @param {Array} contextChunks - Retrieved context chunks
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Context-aware response
 */
async function generateContextualResponse(query, contextChunks, options = {}) {
  try {
    if (!openaiClient) {
      openaiClient = initializeOpenAIForEmbeddings();
    }

    if (!openaiClient) {
      throw new Error('OpenAI client not available');
    }

    // Prepare context from retrieved chunks
    const contextText = contextChunks
      .map(chunk => chunk.text)
      .join('\n\n');

    // Get settings from options
    const settings = options.settings || {};
    const { getSystemPrompt } = require('./openaiClient');
    
    // Get base system prompt with personality/style settings
    const basePrompt = getSystemPrompt(settings);
    
    // Normalize conversation history format
    const conversationHistory = (options.conversationHistory || []).map(msg => {
      const role = msg.role === 'bot' ? 'assistant' : (msg.role === 'user' ? 'user' : 'assistant');
      const content = msg.content || msg.text || '';
      return { role, content };
    }).filter(msg => msg.content && msg.content.trim().length > 0);
    
    // Create enhanced system prompt with context
    const systemPrompt = `${basePrompt}

IMPORTANT: Use the following GSU-specific information to provide accurate, context-aware responses:

${contextText}

When answering questions:
- Use the provided context to give accurate, specific information about GSU
- If the context contains relevant information, prioritize it over general knowledge
- If the context doesn't contain the answer, acknowledge this and provide the best general answer you can
- Pay attention to the conversation history - remember what the user has mentioned earlier (buildings, topics, courses, etc.)
- If the user refers to something mentioned earlier (like "that building" or "those classes"), use the conversation history to understand what they're referring to`;

    const completion = await openaiClient.chat.completions.create({
      model: settings.model || options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...conversationHistory, // Include conversation history for context
        {
          role: 'user',
          content: query
        }
      ],
      max_tokens: settings.maxTokens || options.maxTokens || 500,
      temperature: settings.temperature !== undefined ? settings.temperature : (options.temperature || 0.7),
      top_p: settings.topP !== undefined ? settings.topP : (options.topP || 1),
      frequency_penalty: settings.frequencyPenalty !== undefined ? settings.frequencyPenalty : (options.frequencyPenalty || 0),
      presence_penalty: settings.presencePenalty !== undefined ? settings.presencePenalty : (options.presencePenalty || 0),
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('❌ Error generating contextual response:', error);
    
    // Check for quota errors
    if (error.code === 'insufficient_quota' || error.status === 429) {
      const quotaError = new Error('OpenAI API quota exceeded. Please check your billing and usage limits at https://platform.openai.com/usage');
      quotaError.code = 'insufficient_quota';
      quotaError.status = 429;
      throw quotaError;
    }
    
    throw error;
  }
}

/**
 * Enhanced chat function with Pinecone context
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous conversation messages
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Enhanced response with context
 */
async function sendToChatGPTWithContext(message, conversationHistory = [], options = {}) {
  try {
    // Search for relevant context
    const contextChunks = await searchContext(message, options.topK || 3);
    
    // Generate context-aware response (pass settings and conversation history through)
    const contextualResponse = await generateContextualResponse(message, contextChunks, {
      ...options,
      conversationHistory: conversationHistory // Pass conversation history for context
    });

    return {
      success: true,
      response: contextualResponse,
      context: contextChunks,
      hasContext: contextChunks.length > 0,
      model: options.model || 'gpt-3.5-turbo',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error in context-aware chat:', error);
    
    // Handle quota errors specifically
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return {
        success: false,
        error: 'OpenAI API quota exceeded',
        errorType: 'quota_exceeded',
        response: 'I apologize, but the OpenAI API quota has been exceeded. Please check your billing and usage limits at https://platform.openai.com/usage. You may need to add credits to your account or upgrade your plan.',
        hasContext: false
      };
    }
    
    // Fallback to regular response if context fails
    return {
      success: false,
      error: error.message,
      response: 'I apologize, but I\'m having trouble accessing my knowledge base right now. Please try again in a moment.',
      hasContext: false
    };
  }
}

/**
 * Get major-specific context from Pinecone
 * @param {string} major - Major name
 * @param {number} topK - Number of results to return
 * @returns {Promise<Object>} - Major context with requirements, courses, and prerequisites
 */
async function getMajorContext(major, topK = 10) {
  try {
    if (!major || typeof major !== 'string') {
      return {
        major: null,
        requirements: [],
        availableCourses: [],
        prerequisites: {},
        degreeAudit: null
      };
    }

    // Search for major-specific information
    const queries = [
      `${major} major requirements`,
      `${major} degree requirements`,
      `${major} courses available`,
      `${major} prerequisites`,
      `${major} degree audit`
    ];

    const allContextChunks = [];
    
    for (const query of queries) {
      const chunks = await searchContext(query, Math.ceil(topK / queries.length));
      allContextChunks.push(...chunks);
    }

    // Remove duplicates and sort by relevance
    const uniqueChunks = Array.from(
      new Map(allContextChunks.map(chunk => [chunk.id, chunk])).values()
    ).sort((a, b) => b.score - a.score).slice(0, topK);

    // Parse context to extract structured information
    const requirements = [];
    const availableCourses = [];
    const prerequisites = {};
    let degreeAudit = null;

    for (const chunk of uniqueChunks) {
      const text = chunk.text.toLowerCase();
      
      // Extract requirements
      if (text.includes('requirement') || text.includes('credit')) {
        requirements.push(chunk.text);
      }
      
      // Extract course information
      if (text.includes('course') || text.match(/\b[a-z]{2,4}\s*\d{4}\b/i)) {
        availableCourses.push(chunk.text);
      }
      
      // Extract prerequisites
      if (text.includes('prerequisite') || text.includes('prereq')) {
        const courseMatch = chunk.text.match(/([A-Z]{2,4}\s*\d{4})/g);
        if (courseMatch) {
          courseMatch.forEach(course => {
            if (!prerequisites[course]) {
              prerequisites[course] = [];
            }
            prerequisites[course].push(chunk.text);
          });
        }
      }
      
      // Extract degree audit information
      if (text.includes('degree audit') || text.includes('evaluation')) {
        degreeAudit = chunk.text;
      }
    }

    return {
      major: major,
      requirements: requirements,
      availableCourses: availableCourses,
      prerequisites: prerequisites,
      degreeAudit: degreeAudit,
      rawContext: uniqueChunks
    };
  } catch (error) {
    console.error('❌ Error getting major context:', error);
    return {
      major: major,
      requirements: [],
      availableCourses: [],
      prerequisites: {},
      degreeAudit: null,
      error: error.message
    };
  }
}

/**
 * Check if Pinecone integration is available
 * @returns {boolean} - Whether Pinecone is available
 */
function isPineconeAvailable() {
  return pineconeClient !== null && pineconeIndex !== null;
}

/**
 * Get Pinecone status information
 * @returns {Object} - Status information
 */
function getPineconeStatus() {
  return {
    available: isPineconeAvailable(),
    clientInitialized: pineconeClient !== null,
    indexInitialized: pineconeIndex !== null,
    openaiInitialized: openaiClient !== null
  };
}

module.exports = {
  initializePinecone,
  initializeOpenAIForEmbeddings,
  getEmbedding,
  searchContext,
  generateContextualResponse,
  sendToChatGPTWithContext,
  getMajorContext,
  isPineconeAvailable,
  getPineconeStatus
};
