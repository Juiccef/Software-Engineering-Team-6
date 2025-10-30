/**
 * GSU Panther Chatbot - Main Application Component
 * 
 * This is the root component that manages:
 * - Global application state (theme, current screen, messages)
 * - Navigation between different screens
 * - Message handling and bot responses
 * - Quick action processing
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import Layout from './components/Layout';
import ScreenHome from './screens/ScreenHome';
import ScreenChat from './screens/ScreenChat';
import ScreenVoice from './screens/ScreenVoice';
import ScreenFiles from './screens/ScreenFiles';
import ScreenHistory from './screens/ScreenHistory';
import chatHistoryService from './services/chatHistoryService';

/**
 * Main App Component
 * 
 * Manages the overall application state and routing between screens.
 * Handles theme switching, message processing, and navigation.
 * 
 * @returns {JSX.Element} The main application component
 */
function App() {
  // Theme management hook
  const { mode, setMode, vars } = useTheme();
  
  // Application state
  const [screen, setScreen] = useState("home"); // Current active screen
  const [filesSection, setFilesSection] = useState("academic"); // Active section in files screen
  const [isTyping, setIsTyping] = useState(false); // Bot typing indicator
  const [currentSessionId, setCurrentSessionId] = useState(null); // Current chat session ID
  const [chatHistory, setChatHistory] = useState([]); // Chat history for history screen
  
  // Initial chat messages with welcome content
  const [messages, setMessages] = useState([
    { 
      id: "1", 
      role: "bot", 
      text: "Hi! I'm Pounce Assistant, your digital guide to advising, course planning, deadlines, and campus life at Georgia State University. How can I help you today?" 
    },
    { 
      id: "2", 
      role: "bot", 
      text: "Here's what I can help you with:\n\n🎓 **Academic Advising** - Get personalized course recommendations and degree planning assistance\n📅 **Schedule Planning** - Build optimal class schedules that fit your preferences and requirements\n🎤 **Voice Assistant** - Speak naturally with me using advanced speech recognition\n\nWhat would you like to explore first?",
      showQuickActions: true
    },
  ]);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Generate new session ID when entering chat screen
  useEffect(() => {
    if (screen === "chat" && !currentSessionId) {
      setCurrentSessionId(chatHistoryService.generateId());
    }
  }, [screen, currentSessionId]);

  // Reset messages when starting a new chat
  const startNewChat = () => {
    setCurrentSessionId(chatHistoryService.generateId());
    setMessages([
      { 
        id: "1", 
        role: "bot", 
        text: "Hi! I'm Pounce Assistant, your digital guide to advising, course planning, deadlines, and campus life at Georgia State University. How can I help you today?" 
      },
      { 
        id: "2", 
        role: "bot", 
        text: "Here's what I can help you with:\n\n🎓 **Academic Advising** - Get personalized course recommendations and degree planning assistance\n📅 **Schedule Planning** - Build optimal class schedules that fit your preferences and requirements\n🎤 **Voice Assistant** - Speak naturally with me using advanced speech recognition\n\nWhat would you like to explore first?",
        showQuickActions: true
      },
    ]);
    setScreen("chat");
  };

  /**
   * Load chat history from Supabase or localStorage
   */
  const loadChatHistory = async () => {
    try {
      const history = await chatHistoryService.getHistory();
      setChatHistory(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  /**
   * Save chat session to Supabase or localStorage
   */
  const saveChatSession = async (sessionData) => {
    try {
      const { id, title, messages, type } = sessionData;
      const result = await chatHistoryService.saveSession({
        id: id,
        title: title || chatHistoryService.generateTitle(messages),
        messages: messages,
        type: type || 'chat'
      });
      console.log('✅ Chat session saved:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to save chat session:', error);
      return null;
    }
  };

  /**
   * Load a specific chat session from history
   */
  const loadChatSession = async (chat) => {
    try {
      setCurrentSessionId(chat.id);
      setMessages(chat.messages || []);
      setScreen("chat");
    } catch (error) {
      console.error('Failed to load chat session:', error);
    }
  };

  /**
   * Handles sending messages to the chat
   * 
   * @param {Object} message - The message object containing role and text
   * @param {string} message.role - Either "user" or "bot"
   * @param {string} message.text - The message content
   */
  const handleSendMessage = async (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setIsTyping(true); // Show typing indicator
    
    try {
      // Call the backend API
      const response = await fetch('http://localhost:5002/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.text,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      let botResponse;
      if (data.success) {
        botResponse = {
          id: Math.random().toString(36).slice(2),
          role: "bot",
          text: data.response,
          hasContext: data.hasContext || false,
          context: data.context || null
        };
      } else {
        // Fallback to hardcoded response if API fails
        botResponse = {
          id: Math.random().toString(36).slice(2),
          role: "bot",
          text: data.response || "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
        };
      }

      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);

      // Save the chat session
      if (currentSessionId) {
        await saveChatSession({
          id: currentSessionId,
          messages: finalMessages,
          type: 'chat'
        });
      }
    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Show actual error message instead of hardcoded fallback
      const botResponse = {
        id: Math.random().toString(36).slice(2),
        role: "bot",
        text: `I apologize, but I'm experiencing technical difficulties. Error: ${error.message}. Please check that the backend server is running on port 5002.`
      };
      
      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);

      // Save the chat session
      if (currentSessionId) {
        await saveChatSession({
          id: currentSessionId,
          messages: finalMessages,
          type: 'chat'
        });
      }
    }
    
    setIsTyping(false); // Hide typing indicator
  };

  /**
   * Handles quick action button clicks
   * 
   * @param {string} actionId - The ID of the quick action clicked
   */
  const handleQuickAction = (actionId) => {
    const actionMessages = {
      transcript: "I'd like to upload my transcripts for analysis",
      audit: "Can you help me check my degree audit?",
      schedule: "I need help building my class schedule",
      resources: "What campus resources are available to me?",
      events: "Show me upcoming campus events",
      voice: "I want to use voice chat"
    };

    const message = actionMessages[actionId];
    if (message) {
      handleSendMessage({ role: "user", text: message });
    }
  };

  /**
   * Simple navigation helper to change screens
   * 
   * @param {string} screenName - The name of the screen to navigate to
   */
  const go = (screenName) => {
    setScreen(screenName);
  };

  /**
   * Navigate to files page with a specific section active
   * 
   * @param {string} section - The section to show in files screen
   */
  const goToFiles = (section) => {
    setFilesSection(section);
    setScreen("files");
  };

  return (
    <div style={{ 
      ...vars, 
      height: "100vh", 
      background: "var(--bg)", 
      color: "var(--fg)", 
      transition: "background 180ms ease, color 180ms ease" 
    }}>
      <Layout 
        messages={messages}
        onSendMessage={handleSendMessage}
        onQuickAction={handleQuickAction}
        showChatBox={screen === "chat"}
        mode={mode}
        isTyping={isTyping}
        onToggleTheme={() => setMode(mode === "dark" ? "light" : "dark")}
        onLogoClick={() => go('home')}
        onNewChat={startNewChat}
        onNavigate={(route) => {
          if (route === "files") {
            goToFiles("academic");
          } else {
            go(route);
          }
        }}
      >
        <div style={{ 
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "0 20px"
        }}>
          {screen === "home" && (
            <ScreenHome 
              onStart={() => go("chat")} 
              onGoChat={() => go("chat")}
              onGoToFiles={goToFiles}
              onGoToHistory={() => go("history")}
              onGoVoice={() => go("voice")}
            />
          )}
          {screen === "chat" && (
            <ScreenChat 
              onOpenVoice={() => go("voice")}
              onGoToFiles={goToFiles}
              onSendMessage={handleSendMessage}
            />
          )}
          {screen === "voice" && <ScreenVoice onBackToChat={() => go("chat")} />}
          {screen === "files" && (
            <ScreenFiles 
              section={filesSection}
              onBack={() => go("home")}
            />
          )}
          {screen === "history" && (
            <ScreenHistory 
              onBack={() => go("home")}
              onLoadChat={loadChatSession}
            />
          )}
        </div>
      </Layout>
    </div>
  );
}

export default App;
