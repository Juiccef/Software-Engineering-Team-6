const express = require('express');
const { sendToChatGPT, getQuickResponse } = require('./openaiClient');

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

    // Send to ChatGPT
    const result = await sendToChatGPT(message, conversationHistory, options);

    if (result.success) {
      res.json({
        success: true,
        response: result.response,
        usage: result.usage,
        model: result.model,
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

    // For now, send regular response (streaming can be implemented later)
    const result = await sendToChatGPT(message, conversationHistory, options);
    
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
 * Check if ChatGPT integration is working
 */
router.get('/status', async (req, res) => {
  try {
    const { getOpenAIClient } = require('./openaiClient');
    const client = getOpenAIClient();
    
    if (!client) {
      return res.json({
        success: false,
        status: 'OpenAI client not initialized',
        message: 'Please check your API key configuration'
      });
    }

    // Test with a simple message
    const testResult = await sendToChatGPT('Hello, are you working?');
    
    res.json({
      success: testResult.success,
      status: testResult.success ? 'Connected' : 'Error',
      message: testResult.success ? 'ChatGPT integration is working' : testResult.error,
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

module.exports = router;

