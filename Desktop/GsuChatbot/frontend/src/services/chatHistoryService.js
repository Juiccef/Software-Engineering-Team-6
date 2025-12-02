/**
 * Chat History Service
 * Handles all chat session operations with Supabase backend
 */

class ChatHistoryService {
  constructor() {
    this.baseUrl = 'http://localhost:5001/api/chat';
  }

  // Generate a unique ID for sessions
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generate a title from the first user message
  generateTitle(messages) {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const text = firstUserMessage.text;
      return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
    return 'New Chat';
  }

  // Format timestamp for display
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Save a chat session
  async saveSession(sessionData) {
    try {
      const response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: sessionData.title || this.generateTitle(sessionData.messages),
          messages: sessionData.messages || [],
          type: sessionData.type || 'chat' // Include type to distinguish voice from chat
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Session saved to backend:', result.session);
        return result.session;
      } else {
        throw new Error(result.error || 'Failed to save session');
      }
    } catch (error) {
      console.error('❌ Failed to save session to backend:', error);
      // Fallback to localStorage
      const id = sessionData.id || this.generateId();
      const session = {
        id,
        title: sessionData.title || this.generateTitle(sessionData.messages),
        type: sessionData.type || 'chat',
        messages: sessionData.messages || [],
        message_count: sessionData.messages ? sessionData.messages.length : 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const history = await this.getHistory();
      history.unshift(session);
      localStorage.setItem('gsu_chat_history', JSON.stringify(history));
      
      console.log('✅ Session saved to localStorage:', id);
      return session;
    }
  }

  // Get all chat sessions
  async getHistory() {
    try {
      const response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ History loaded from backend:', result.sessions.length, 'sessions');
        return result.sessions;
      } else {
        throw new Error(result.error || 'Failed to load history');
      }
    } catch (error) {
      console.error('❌ Failed to load history from backend:', error);
      // Fallback to localStorage
      const history = localStorage.getItem('gsu_chat_history');
      const parsed = history ? JSON.parse(history) : [];
      console.log('✅ History loaded from localStorage:', parsed.length, 'sessions');
      return parsed;
    }
  }

  // Get a specific session by ID
  async getSession(sessionId) {
    try {
      const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Session loaded from backend:', result.session.id);
        return result.session;
      } else {
        throw new Error(result.error || 'Failed to load session');
      }
    } catch (error) {
      console.error('❌ Failed to get session from backend:', error);
      // Fallback to localStorage
      const history = await this.getHistory();
      return history.find(session => session.id === sessionId);
    }
  }

  // Update a session
  async updateSession(sessionId, updates) {
    try {
      const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Session updated in backend:', sessionId);
        return true;
      } else {
        throw new Error(result.error || 'Failed to update session');
      }
    } catch (error) {
      console.error('❌ Failed to update session in backend:', error);
      // Fallback to localStorage
      const history = await this.getHistory();
      const sessionIndex = history.findIndex(session => session.id === sessionId);
      
      if (sessionIndex > -1) {
        history[sessionIndex] = { ...history[sessionIndex], ...updates };
        localStorage.setItem('gsu_chat_history', JSON.stringify(history));
        console.log('✅ Session updated in localStorage:', sessionId);
        return true;
      }
      return false;
    }
  }

  // Delete a session
  async deleteSession(sessionId) {
    try {
      const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Session deleted from backend:', sessionId);
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete session');
      }
    } catch (error) {
      console.error('❌ Failed to delete session from backend:', error);
      // Fallback to localStorage
      const history = await this.getHistory();
      const filteredHistory = history.filter(session => session.id !== sessionId);
      localStorage.setItem('gsu_chat_history', JSON.stringify(filteredHistory));
      console.log('✅ Session deleted from localStorage:', sessionId);
      return true;
    }
  }
}

export default new ChatHistoryService();