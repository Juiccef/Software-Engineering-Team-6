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

    // Create enhanced system prompt with context
    const systemPrompt = `You are Pounce, the GSU Panther Chatbot, an AI-powered academic assistant for Georgia State University students.

Your role:
- Help students with academic planning, course recommendations, and degree requirements
- Provide information about campus resources, events, and services
- Assist with schedule building and academic advising
- Be friendly, helpful, and knowledgeable about GSU
- Use GSU terminology and references when appropriate
- Keep responses concise but informative
- If you don't know something specific about GSU, acknowledge it and suggest where to find the information

IMPORTANT: Use the following GSU-specific information to provide accurate, context-aware responses:

${contextText}

Always maintain a helpful and professional tone while being approachable like a friendly campus advisor.`;

    const completion = await openaiClient.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: query
        }
      ],
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
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
    
    // Generate context-aware response
    const contextualResponse = await generateContextualResponse(message, contextChunks, options);

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
  isPineconeAvailable,
  getPineconeStatus
};
