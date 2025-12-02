/**
 * GSU Panther Chatbot - Backend Server
 * 
 * Express.js server that provides API endpoints for the GSU Panther Chatbot.
 * Features include:
 * - OpenAI ChatGPT integration
 * - Security middleware (Helmet, CORS, Rate limiting)
 * - Chat API endpoints
 * - Health monitoring
 * - Error handling
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import custom modules
const chatRoutes = require('./api_integration/chatRoutes');
const supabase = require('./api_integration/supaBase');
const { initializeOpenAI, textToSpeech } = require('./api_integration/openaiClient');
const { initializePinecone } = require('./api_integration/pineconeClient');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE SETUP ====================

// Security middleware - Helmet provides security headers
app.use(helmet());

// Rate limiting - Prevent API abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration - Allow frontend to communicate with backend
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true
}));

// Body parsing middleware - Handle JSON and URL-encoded data
// Note: multipart/form-data is handled by multer in the route, not here
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ==================== INITIALIZATION ====================

// Initialize OpenAI client
initializeOpenAI();

// Initialize Pinecone client
initializePinecone();

// ==================== ROUTES ====================

// Chat API routes
app.use('/api/chat', chatRoutes);

// Health check endpoint - Monitor server status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'GSU Chatbot Backend is running',
    timestamp: new Date().toISOString()
  });
});

// OpenAI connection test endpoint
app.get('/api/test-openai', async (req, res) => {
  try {
    const { sendToChatGPT } = require('./api_integration/openaiClient');

    const result = await sendToChatGPT('Hello! This is a connection test.', []);

    if (result.success) {
      res.json({
        status: 'success',
        message: 'OpenAI connection is working!',
        response: result.response,
        model: result.model,
        usage: result.usage
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'OpenAI connection failed',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to test OpenAI connection',
      error: error.message
    });
  }
});

// Text-to-Speech endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'alloy' } = req.body;

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text is required and must be a non-empty string'
      });
    }

    // Limit text length to prevent abuse (OpenAI TTS has a 4096 character limit)
    if (text.length > 4000) {
      return res.status(400).json({
        success: false,
        error: 'Text is too long. Maximum length is 4000 characters.'
      });
    }

    // Generate speech
    const result = await textToSpeech(text, voice);

    if (result.success) {
      // Set appropriate headers for audio response
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', result.audio.length);
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      
      // Send audio buffer
      res.send(result.audio);
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate speech'
      });
    }
  } catch (error) {
    console.error('❌ TTS endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});



// ==================== ERROR HANDLING ====================

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler - Catch all unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 GSU Chatbot Backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
});
