# OpenAI API Keys Management

This folder contains configuration and documentation for managing OpenAI API keys securely.

## 🔐 Security Best Practices

### Environment Variables
- **NEVER** commit API keys to version control
- Use `.env` files for local development
- Use secure environment variable management in production

### API Key Storage
- Store keys in environment variables
- Use different keys for development, staging, and production
- Rotate keys regularly for security

## 📁 File Structure

```
openai_api_keys/
├── README.md                 # This file
├── .env.example             # Example environment file
├── config.js                # API key configuration
└── security.md              # Security guidelines
```

## 🚀 Quick Setup

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key to `.env`
3. Restart the server

## 🔑 Required Environment Variables

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📝 API Key Management

### Getting an OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

### Key Permissions
- Ensure your API key has access to the GPT models you want to use
- Monitor usage to avoid unexpected charges
- Set up usage alerts in your OpenAI dashboard

## 🛡️ Security Guidelines

- **Never share API keys** in chat, email, or public repositories
- **Use environment variables** instead of hardcoding keys
- **Implement rate limiting** to prevent abuse
- **Monitor API usage** regularly
- **Rotate keys** periodically

## 🚨 Troubleshooting

### Common Issues
- **"API key not found"**: Check your `.env` file
- **"Invalid API key"**: Verify the key is correct and active
- **"Rate limit exceeded"**: Implement proper rate limiting
- **"Model not available"**: Check your OpenAI account permissions

### Support
For API key issues, contact:
- OpenAI Support: [help.openai.com](https://help.openai.com/)
- GSU Team Lead: [Your team contact]

