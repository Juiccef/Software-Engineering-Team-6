/**
 * OpenAI API Configuration
 * This file manages API key configuration and validation
 */

const config = {
  // OpenAI API Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    timeout: 30000, // 30 seconds
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    encryptionKey: process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production',
  }
};

/**
 * Validate required configuration
 */
function validateConfig() {
  const errors = [];

  // Check OpenAI API Key
  if (!config.openai.apiKey) {
    errors.push('OPENAI_API_KEY is required');
  } else if (!config.openai.apiKey.startsWith('sk-')) {
    errors.push('OPENAI_API_KEY appears to be invalid (should start with "sk-")');
  }

  // Check port
  if (isNaN(config.server.port) || config.server.port < 1 || config.server.port > 65535) {
    errors.push('PORT must be a valid port number (1-65535)');
  }

  // Check temperature
  if (config.openai.temperature < 0 || config.openai.temperature > 2) {
    errors.push('OPENAI_TEMPERATURE must be between 0 and 2');
  }

  // Check max tokens
  if (config.openai.maxTokens < 1 || config.openai.maxTokens > 4000) {
    errors.push('OPENAI_MAX_TOKENS must be between 1 and 4000');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Get configuration for a specific environment
 */
function getConfigForEnvironment(env = 'development') {
  const baseConfig = { ...config };
  
  if (env === 'production') {
    // Production-specific overrides
    baseConfig.openai.model = 'gpt-3.5-turbo'; // Use stable model in production
    baseConfig.openai.temperature = 0.5; // More conservative responses
    baseConfig.rateLimit.maxRequests = 50; // Stricter rate limiting
  } else if (env === 'testing') {
    // Testing-specific overrides
    baseConfig.openai.model = 'gpt-3.5-turbo';
    baseConfig.openai.maxTokens = 100; // Shorter responses for testing
    baseConfig.rateLimit.maxRequests = 1000; // More lenient for testing
  }

  return baseConfig;
}

/**
 * Log configuration status (without exposing sensitive data)
 */
function logConfigStatus() {
  const validation = validateConfig();
  
  console.log('🔧 Configuration Status:');
  console.log(`   OpenAI API Key: ${config.openai.apiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Model: ${config.openai.model}`);
  console.log(`   Max Tokens: ${config.openai.maxTokens}`);
  console.log(`   Temperature: ${config.openai.temperature}`);
  console.log(`   Server Port: ${config.server.port}`);
  console.log(`   Environment: ${config.server.nodeEnv}`);
  console.log(`   Frontend URL: ${config.server.frontendUrl}`);
  
  if (!validation.isValid) {
    console.log('❌ Configuration Errors:');
    validation.errors.forEach(error => console.log(`   - ${error}`));
  } else {
    console.log('✅ Configuration is valid');
  }
}

module.exports = {
  config,
  validateConfig,
  getConfigForEnvironment,
  logConfigStatus
};

