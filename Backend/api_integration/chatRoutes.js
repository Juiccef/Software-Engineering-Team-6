const express = require('express');
const { sendToChatGPT, getQuickResponse } = require('./openaiClient');
const { sendToChatGPTWithContext, isPineconeAvailable } = require('./pineconeClient');
const supabase = require('./supaBase');

const router = express.Router();

/**
 * POST /api/chat/message
 * Send a message to ChatGPT and get response
 */
router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory = [], options = {} } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Check for quick responses first
    const quickResponse = await getQuickResponse(message);
    if (quickResponse) {
      return res.json(quickResponse);
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
      res.json({
        success: true,
        response: result.response,
        usage: result.usage,
        model: result.model,
        hasContext: result.hasContext || false,
        context: result.context || null,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        response: result.response
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
      res.write(`data: {"type":"error","content":"${result.response}"}\n\n`);
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
    const { title, messages = [] } = req.body;

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

    // Create the chat session first
    const { data: sessionData, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({
        title: title
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
    const { title, messages } = req.body;

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    // Update session title if provided
    if (title) {
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .update({ title })
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

    res.json({
      success: true,
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

module.exports = router;

