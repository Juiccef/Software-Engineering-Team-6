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
const { initializeOpenAI } = require('./api_integration/openaiClient');
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
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware - Handle JSON and URL-encoded data
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
