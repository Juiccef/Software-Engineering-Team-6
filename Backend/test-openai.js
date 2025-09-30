#!/usr/bin/env node

/**
 * OpenAI Connection Test Script
 * 
 * This script tests if your OpenAI API key is working correctly.
 * Run this before starting your main server to verify the connection.
 */

require('dotenv').config();
const OpenAI = require('openai');

console.log('🔍 Testing OpenAI Connection...\n');

// Check if API key exists
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ OPENAI_API_KEY not found in environment variables');
  console.log('📝 Please add your OpenAI API key to the .env file');
  console.log('   Example: OPENAI_API_KEY=sk-your_actual_api_key_here');
  process.exit(1);
}

if (apiKey === 'sk-your_openai_api_key_here' || apiKey.includes('your_')) {
  console.error('❌ Please replace the placeholder API key with your actual OpenAI API key');
  console.log('📝 Get your API key from: https://platform.openai.com/api-keys');
  process.exit(1);
}

console.log('✅ API Key found in environment variables');
console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);

// Initialize OpenAI client
let openaiClient;
try {
  openaiClient = new OpenAI({
    apiKey: apiKey,
    timeout: 30000, // 30 seconds timeout
  });
  console.log('✅ OpenAI client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error.message);
  process.exit(1);
}

// Test the connection with a simple request
async function testConnection() {
  try {
    console.log('\n🚀 Testing API connection with a simple request...');
    
    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are Pounce, the GSU Panther Chatbot. Respond briefly and helpfully.'
        },
        {
          role: 'user',
          content: 'Hello! Can you help me test this connection?'
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    console.log('✅ OpenAI API connection successful!');
    console.log('🤖 Response:', completion.choices[0].message.content);
    console.log('📊 Usage:', completion.usage);
    console.log('🎯 Model:', completion.model);
    
    return true;
  } catch (error) {
    console.error('❌ OpenAI API connection failed:');
    
    if (error.status === 401) {
      console.error('   🔐 Authentication Error: Invalid API key');
      console.log('   💡 Check your API key at: https://platform.openai.com/api-keys');
    } else if (error.status === 429) {
      console.error('   ⏰ Rate Limit Error: Too many requests');
      console.log('   💡 Wait a moment and try again');
    } else if (error.status === 500) {
      console.error('   🔧 Server Error: OpenAI service is down');
      console.log('   💡 Try again later');
    } else {
      console.error('   🚨 Error:', error.message);
    }
    
    return false;
  }
}

// Run the test
testConnection()
  .then((success) => {
    if (success) {
      console.log('\n🎉 OpenAI connection test completed successfully!');
      console.log('✅ Your backend is ready to use OpenAI API');
      process.exit(0);
    } else {
      console.log('\n💥 OpenAI connection test failed');
      console.log('❌ Please fix the issues above before running your server');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Unexpected error during test:', error);
    process.exit(1);
  });
