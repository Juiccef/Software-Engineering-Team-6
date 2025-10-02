# GSU Chatbot - Pinecone Vector Database Integration

## 🎯 Overview

The GSU Panther Chatbot now includes **Pinecone vector database integration** for enhanced, context-aware responses. This allows the chatbot to provide more accurate and relevant information about Georgia State University by leveraging a knowledge base of GSU-specific content.

## 🚀 What's New

### Enhanced Features
- **Context-Aware Responses**: The chatbot now searches a vector database for relevant GSU information before generating responses
- **Semantic Search**: Uses OpenAI embeddings to find the most relevant context for user questions
- **Fallback Support**: If Pinecone is unavailable, the chatbot gracefully falls back to regular ChatGPT responses
- **Knowledge Base**: Pre-loaded with GSU-specific information about degree requirements, campus resources, and more

### New Files Added
- `Backend/api_integration/pineconeClient.js` - Pinecone integration module
- `Backend/scripts/uploadToPinecone.js` - Script to populate the knowledge base
- `data_chunks.py` - GSU knowledge chunks (Python version)
- `upload_chunks.py` - Python upload script (alternative)
- `chat_query.py` - Python query script (alternative)

## 📋 Prerequisites

### Required API Keys
1. **OpenAI API Key** - For generating embeddings and chat responses
2. **Pinecone API Key** - For vector database operations

### Getting API Keys

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

#### Pinecone API Key
1. Visit [Pinecone Console](https://app.pinecone.io/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `pcsk_`)

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
cd Backend
npm install
```

This will install the new Pinecone dependency (`@pinecone-database/pinecone`).

### Step 2: Configure Environment Variables

Copy the example environment file and add your API keys:

```bash
cp openai_api_keys/env.example .env
```

Edit the `.env` file and add your API keys:

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here

# Pinecone Vector Database Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=gsu-chatbot

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 3: Upload Knowledge Base to Pinecone

Run the upload script to populate your Pinecone index with GSU-specific knowledge:

```bash
npm run upload-pinecone
```

This script will:
- Create a Pinecone index named `gsu-chatbot` (if it doesn't exist)
- Generate embeddings for GSU knowledge chunks
- Upload the vectors to Pinecone
- Test the setup with a sample query

### Step 4: Start the Backend Server

```bash
npm start
```

The server will now initialize both OpenAI and Pinecone clients.

## 🧪 Testing the Integration

### Test Pinecone Status

Check if Pinecone integration is working:

```bash
curl http://localhost:5000/api/chat/status
```

Expected response:
```json
{
  "success": true,
  "status": "Connected",
  "message": "ChatGPT integration is working",
  "pinecone": {
    "available": true,
    "clientInitialized": true,
    "indexInitialized": true,
    "openaiInitialized": true
  },
  "timestamp": "2024-01-XX..."
}
```

### Test Context-Aware Responses

Send a test message to see context-aware responses:

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the requirements for Computer Science degree?"}'
```

Expected response includes:
- `hasContext: true` - Indicates Pinecone context was used
- `context: [...]` - Array of relevant knowledge chunks found
- More accurate, GSU-specific response

## 🔍 How It Works

### Context Retrieval Process

1. **User Query**: User sends a message to the chatbot
2. **Embedding Generation**: Query is converted to a vector using OpenAI embeddings
3. **Vector Search**: Pinecone searches for similar vectors in the knowledge base
4. **Context Assembly**: Relevant GSU information is retrieved and formatted
5. **Enhanced Response**: ChatGPT generates a response using the retrieved context
6. **Fallback**: If Pinecone fails, falls back to regular ChatGPT response

### Knowledge Base Content

The current knowledge base includes:
- Computer Science degree requirements and four-year plan
- General GSU information
- FAFSA deadline information
- Campus resources and services

## 🛠️ Customization

### Adding New Knowledge

To add new GSU-specific knowledge:

1. Edit `Backend/scripts/uploadToPinecone.js`
2. Add new chunks to the `gsuKnowledgeChunks` array
3. Run `npm run upload-pinecone` to update Pinecone

Example new chunk:
```javascript
{
  id: "new_topic_id",
  text: "Your GSU-specific information here...",
  metadata: {
    source: "https://gsu.edu/source",
    topic: "Topic category"
  }
}
```

### Adjusting Search Parameters

Modify search behavior in `pineconeClient.js`:

```javascript
// Change number of results returned
const contextChunks = await searchContext(query, topK = 5);

// Adjust embedding model
model: 'text-embedding-3-small' // or 'text-embedding-ada-002'
```

## 🚨 Troubleshooting

### Common Issues

**Pinecone not initializing**
- Check `PINECONE_API_KEY` in `.env` file
- Verify API key is valid and active
- Check Pinecone console for index status

**Upload script fails**
- Ensure both OpenAI and Pinecone API keys are set
- Check internet connection
- Verify Pinecone account has sufficient credits

**No context in responses**
- Run `npm run upload-pinecone` to populate the index
- Check Pinecone status via `/api/chat/status`
- Verify index name matches `PINECONE_INDEX_NAME`

**Fallback to regular responses**
- This is normal behavior when Pinecone is unavailable
- Check logs for specific error messages
- Verify API keys and network connectivity

### Debug Mode

Enable debug logging:

```bash
NODE_ENV=development DEBUG=* npm start
```

## 📊 Performance Considerations

### Cost Optimization
- **Embeddings**: Uses `text-embedding-3-small` (cheaper than `text-embedding-ada-002`)
- **Search Results**: Defaults to top 3 results (adjustable)
- **Fallback**: Graceful degradation when Pinecone is unavailable

### Response Time
- **With Context**: ~2-3 seconds (embedding + search + generation)
- **Without Context**: ~1-2 seconds (generation only)
- **Fallback**: ~1-2 seconds (regular ChatGPT)

## 🔄 Maintenance

### Regular Updates
- Update knowledge base with new GSU information
- Monitor Pinecone usage and costs
- Review and optimize search results

### Monitoring
- Check `/api/chat/status` endpoint regularly
- Monitor Pinecone console for usage metrics
- Review chat logs for context usage patterns

## 🎉 Benefits

### For Users
- More accurate GSU-specific information
- Better understanding of degree requirements
- Enhanced campus resource guidance

### For Developers
- Modular, maintainable code structure
- Graceful fallback mechanisms
- Easy to extend and customize

---

**🎯 Your GSU Panther Chatbot is now powered by advanced vector search technology!**

The integration provides context-aware responses while maintaining backward compatibility. Users will get more accurate, GSU-specific information while developers benefit from a robust, scalable architecture.
