# GSU Panther Chatbot Backend

Backend API server for the GSU Panther Chatbot with OpenAI integration.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone and navigate to backend:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp openai_api_keys/env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the Backend directory:

```bash
# Required
OPENAI_API_KEY=sk-your_openai_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7
```

### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and add to your `.env` file

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Chat Endpoints

#### Send Message
```
POST /api/chat/message
```
**Body:**
```json
{
  "message": "Hello, can you help me with course planning?",
  "conversationHistory": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ],
  "options": {
    "model": "gpt-3.5-turbo",
    "maxTokens": 500,
    "temperature": 0.7
  }
}
```

#### Stream Response
```
POST /api/chat/stream
```
Server-sent events for real-time chat responses.

#### Check Status
```
GET /api/chat/status
```
Verify ChatGPT integration is working.

#### Quick Actions
```
POST /api/chat/quick-actions
```
**Body:**
```json
{
  "action": "transcript",
  "context": {}
}
```

## 🏗️ Project Structure

```
Backend/
├── api_integration/
│   ├── openaiClient.js      # OpenAI API client
│   └── chatRoutes.js        # Chat API routes
├── openai_api_keys/
│   ├── README.md            # API key documentation
│   ├── env.example          # Environment variables example
│   ├── config.js            # Configuration management
│   └── security.md          # Security guidelines
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Validates all incoming data
- **Error Handling**: Secure error responses
- **Helmet.js**: Security headers
- **Environment Variables**: Secure API key storage

## 🧪 Testing

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test chat endpoint
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, Pounce!"}'
```

### Status Check
```bash
curl http://localhost:5000/api/chat/status
```

## 🚨 Troubleshooting

### Common Issues

**"OpenAI client not initialized"**
- Check your `.env` file has `OPENAI_API_KEY`
- Verify the API key is valid and active

**"Rate limit exceeded"**
- Implement proper rate limiting
- Check your OpenAI account usage

**"CORS errors"**
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check CORS configuration in `server.js`

**"Port already in use"**
- Change `PORT` in `.env` file
- Kill existing processes on the port

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

## 📊 Monitoring

### Logs
- Server logs: Console output
- API calls: Timestamped in console
- Errors: Detailed error logging

### Health Monitoring
- Health check endpoint: `/api/health`
- Status check: `/api/chat/status`

## 🔄 Development

### Adding New Features
1. Create new route files in `api_integration/`
2. Add routes to `server.js`
3. Update this README
4. Test thoroughly

### Code Style
- Use ES6+ features
- Follow Node.js best practices
- Add proper error handling
- Include JSDoc comments

## 📞 Support

- **OpenAI Issues**: [help.openai.com](https://help.openai.com/)
- **GSU Team**: [Your team contact]
- **Documentation**: [OpenAI API Docs](https://platform.openai.com/docs)

## 📄 License

MIT License - See LICENSE file for details.

