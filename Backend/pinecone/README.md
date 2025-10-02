# Pinecone Vector Database Files

This folder contains all Pinecone-related files for the GSU Panther Chatbot vector database integration.

## 📁 File Descriptions

### `data_chunks.py`
Contains GSU-specific knowledge chunks that are uploaded to Pinecone. Includes:
- Computer Science degree requirements and four-year plan
- General GSU information
- Campus resources and services
- Financial aid information

### `upload_chunks.py`
Python script to upload knowledge chunks to Pinecone vector database.
- Creates Pinecone index if it doesn't exist
- Generates embeddings using OpenAI
- Uploads vectors with metadata
- Tests the upload with sample queries

### `chat_query.py`
Python script for testing Pinecone queries and generating context-aware responses.
- Queries Pinecone for relevant context
- Generates enhanced responses using retrieved context
- Interactive testing interface

### `scrape_gsu.py`
Web scraping script for gathering GSU-specific information.
- Extracts data from GSU websites
- Processes and formats information
- Prepares data for vector database storage

## 🚀 Usage

### Upload Knowledge Base (Python)
```bash
cd Backend/pinecone
python upload_chunks.py
```

### Test Queries (Python)
```bash
cd Backend/pinecone
python chat_query.py
```

### Upload Knowledge Base (Node.js - Recommended)
```bash
cd Backend
npm run upload-pinecone
```

## 📋 Requirements

- Python 3.7+
- OpenAI API key
- Pinecone API key
- Required Python packages:
  - `openai`
  - `pinecone-client`

## 🔧 Configuration

Set environment variables:
```bash
export OPENAI_API_KEY="sk-your_key_here"
export PINECONE_API_KEY="pcsk_your_key_here"
```

## 📚 Related Files

- `Backend/api_integration/pineconeClient.js` - Node.js Pinecone integration
- `Backend/scripts/uploadToPinecone.js` - Node.js upload script
- `Backend/PINECONE_INTEGRATION_GUIDE.md` - Complete setup guide

## 🎯 Note

The Node.js implementation (`Backend/api_integration/pineconeClient.js` and `Backend/scripts/uploadToPinecone.js`) is the production version used by the chatbot. These Python files are provided for reference and alternative implementation.
