<<<<<<< HEAD
# Software-Engineering-Team-6
=======
# GSU Panther Chatbot 🐾

A comprehensive AI-powered academic assistant for Georgia State University students, featuring ChatGPT integration, file management, and voice interaction capabilities.

## 🎯 Project Overview

The GSU Panther Chatbot is a full-stack web application designed to help GSU students with:
- **Academic Planning** - Course recommendations and degree planning
- **Schedule Building** - Optimal class schedule creation
- **Document Management** - Upload and organize academic files
- **Voice Interaction** - Natural language conversations with Pounce
- **Campus Resources** - Access to university services and events

## 🏗️ Architecture

```
GsuChatbot/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/         # Main application screens
│   │   ├── hooks/           # Custom React hooks
│   │   └── constants/       # Application constants
│   └── public/              # Static assets
├── Backend/                  # Node.js/Express backend
│   ├── api_integration/     # API routes and OpenAI integration
│   ├── openai_api_keys/     # API key management and security
│   └── server.js            # Main server file
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```
Frontend will be available at: http://localhost:3000

### Backend Setup
```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Set up environment variables
cp openai_api_keys/env.example .env
# Edit .env and add your OpenAI API key

# Start backend server
npm start
```
Backend will be available at: http://localhost:5001

## 🔧 Configuration

### Environment Variables

#### Frontend (.env in frontend/)
```bash
REACT_APP_API_URL=http://localhost:5001
```

#### Backend (.env in Backend/)
```bash
# Required
OPENAI_API_KEY=sk-your_openai_api_key_here
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7
```

### Getting an OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your Backend/.env file

## 📱 Features

### 🏠 Home Screen
- Welcome banner with GSU branding
- Academic Planning and Schedule Building cards
- Recent chat history
- Quick navigation to all features

### 💬 Chat Interface
- Real-time conversation with Pounce
- Document upload integration
- Smart recommendations
- Voice chat capabilities

### 📁 File Management
- Organized file sections (Academic, Schedule, Documents, Resources)
- Upload functionality with drag-and-drop
- File categorization and management
- Download and view capabilities

### 🎤 Voice Interaction
- Natural language processing
- Speech-to-text and text-to-speech
- Voice command recognition
- Hands-free interaction

### 📊 History Tracking
- Chat conversation history
- Searchable past interactions
- Message categorization
- Export capabilities

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### Chat Endpoints
```
POST /api/chat/message          # Send message to ChatGPT
POST /api/chat/stream           # Stream response (SSE)
GET  /api/chat/status           # Check ChatGPT integration
POST /api/chat/quick-actions    # Handle quick actions
```

## 🛡️ Security Features

- **Rate Limiting** - Prevents API abuse (100 requests/15 minutes)
- **CORS Protection** - Secure cross-origin requests
- **Input Validation** - Validates all incoming data
- **Error Handling** - Secure error responses
- **Helmet.js** - Security headers
- **Environment Variables** - Secure API key storage

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - User preference support
- **Modern UI** - Clean, intuitive interface
- **Accessibility** - Screen reader friendly
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages

## 🧪 Testing

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Test chat endpoint
curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, Pounce!"}'
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the build/ folder to your hosting service
```

### Backend Deployment
```bash
cd Backend
# Set NODE_ENV=production in your environment
npm start
```

## 🤝 Team Development

### Code Standards
- **ESLint** - Code linting and formatting
- **JSDoc** - Comprehensive documentation
- **Consistent Naming** - camelCase for variables, PascalCase for components
- **Component Structure** - Props documentation and clear separation

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
```

### File Organization
- **Components** - Reusable UI elements in `/components`
- **Screens** - Main application views in `/screens`
- **Hooks** - Custom React hooks in `/hooks`
- **Constants** - Application constants in `/constants`
- **API Integration** - Backend routes in `/api_integration`

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start**
- Check Node.js version (v16+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Backend connection errors**
- Verify OpenAI API key in .env file
- Check port availability (5001)
- Ensure CORS settings match frontend URL

**Chat not responding**
- Verify OpenAI API key is valid and active
- Check rate limiting settings
- Monitor API usage in OpenAI dashboard

### Debug Mode
```bash
# Frontend debug
REACT_APP_DEBUG=true npm start

# Backend debug
NODE_ENV=development DEBUG=* npm start
```

## 📚 Documentation

- [Frontend README](frontend/README.md)
- [Backend README](Backend/README.md)
- [API Documentation](Backend/api_integration/)
- [Security Guidelines](Backend/openai_api_keys/security.md)

## 🚀 Future Enhancements

- [ ] User authentication and profiles
- [ ] Advanced file processing (PDF analysis)
- [ ] Calendar integration
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app development

## 👥 Team Members

**GSU Software Engineering Team 6**
- [Your team member names and roles]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Technical Issues**: Create an issue in the repository
- **OpenAI API**: [help.openai.com](https://help.openai.com/)
- **GSU IT Support**: [Your IT contact]

## 🙏 Acknowledgments

- Georgia State University for providing the academic context
- OpenAI for providing the ChatGPT API
- React and Node.js communities for excellent documentation
- All contributors and team members

---

**Made with ❤️ by GSU Software Engineering Team 6**

>>>>>>> frontend
