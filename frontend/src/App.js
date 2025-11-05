import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import Layout from './components/Layout';
import ScreenHome from './screens/ScreenHome';
import ScreenChat from './screens/ScreenChat';
import ScreenVoice from './screens/ScreenVoice';
import ScreenFiles from './screens/ScreenFiles';
import ScreenHistory from './screens/ScreenHistory';
import chatHistoryService from './services/chatHistoryService';

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
function App() {
  const { mode, setMode, vars } = useTheme();

  // Application state
  const [screen, setScreen] = useState("home");
  const [filesSection, setFilesSection] = useState("academic");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  // Voice conversation history
  const [voiceConversation, setVoiceConversation] = useState(() => {
    const saved = localStorage.getItem('gsu-voice-conversation');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved voice conversation:', error);
      }
    }
    return [];
  });
  const lastSavedVoiceRef = useRef('');

  // Chat messages
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('gsu-chat-messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
    return [
      {
        id: "1",
        role: "bot",
        text:
          "Hi! I'm Pounce Assistant, your digital guide to advising, course planning, deadlines, and campus life at Georgia State University. How can I help you today?"
      },
      {
        id: "2",
        role: "bot",
        text:
          "Here's what I can help you with:\n\n🎓 **Academic Advising** - Get personalized course recommendations and degree planning assistance\n📅 **Schedule Planning** - Build optimal class schedules that fit your preferences and requirements\n🎤 **Voice Assistant** - Speak naturally with me using advanced speech recognition\n\nWhat would you like to explore first?",
        showQuickActions: true
      },
    ];
  });

  // Persist chat + voice
  useEffect(() => {
    localStorage.setItem('gsu-chat-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('gsu-voice-conversation', JSON.stringify(voiceConversation));
    
    // Save voice conversations to Supabase when they're updated (with debounce)
    if (voiceConversation && voiceConversation.length > 0) {
      const conversationKey = JSON.stringify(voiceConversation);
      // Only save if this is a new conversation (hasn't been saved yet)
      if (conversationKey !== lastSavedVoiceRef.current) {
        // Debounce to avoid saving on every keystroke/update
        const saveTimer = setTimeout(() => {
          saveVoiceConversationToSupabase(voiceConversation);
          lastSavedVoiceRef.current = conversationKey;
        }, 2000); // Wait 2 seconds after last update
        
        return () => clearTimeout(saveTimer);
      }
    }
  }, [voiceConversation]);

  // Save voice conversation to Supabase
  const saveVoiceConversationToSupabase = async (voiceMessages) => {
    try {
      // Only save if there are messages with at least one complete exchange (user + assistant)
      if (!voiceMessages || voiceMessages.length < 2) return;
      
      const hasUserMessage = voiceMessages.some(msg => msg.role === 'user');
      const hasAssistantMessage = voiceMessages.some(msg => msg.role === 'assistant');
      
      if (!hasUserMessage || !hasAssistantMessage) return;
      
      // Generate a title from the first user message
      const firstUserMessage = voiceMessages.find(msg => msg.role === 'user');
      if (!firstUserMessage) return;
      
      const title = firstUserMessage.text.length > 50 
        ? firstUserMessage.text.substring(0, 50) + '...' 
        : firstUserMessage.text;
      
      // Convert voice conversation format to chat message format for Supabase
      const messages = voiceMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'bot' : msg.role,
        text: msg.text
      }));
      
      // Save to Supabase with type 'voice'
      const result = await chatHistoryService.saveSession({
        id: `voice-${Date.now()}`,
        title: title,
        messages: messages,
        type: 'voice'
      });
      
      console.log('✅ Voice conversation saved to Supabase:', result);
    } catch (error) {
      console.error('❌ Failed to save voice conversation to Supabase:', error);
      // Silent fail - voice conversations still work with localStorage
    }
  };

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (screen === "chat" && !currentSessionId) {
      setCurrentSessionId(chatHistoryService.generateId());
    }
  }, [screen, currentSessionId]);

  const startNewChat = () => {
    setCurrentSessionId(chatHistoryService.generateId());
    setMessages([
      {
        id: "1",
        role: "bot",
        text:
          "Hi! I'm Pounce Assistant, your digital guide to advising, course planning, deadlines, and campus life at Georgia State University. How can I help you today?"
      },
      {
        id: "2",
        role: "bot",
        text:
          "Here's what I can help you with:\n\n🎓 **Academic Advising** - Get personalized course recommendations and degree planning assistance\n📅 **Schedule Planning** - Build optimal class schedules that fit your preferences and requirements\n🎤 **Voice Assistant** - Speak naturally with me using advanced speech recognition\n\nWhat would you like to explore first?",
        showQuickActions: true
      },
    ]);
    setScreen("chat");
  };

  const loadChatHistory = async () => {
    try {
      const history = await chatHistoryService.getHistory();
      setChatHistory(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatSession = async (sessionData) => {
    try {
      const { id, title, messages, type } = sessionData;
      const result = await chatHistoryService.saveSession({
        id,
        title: title || chatHistoryService.generateTitle(messages),
        messages,
        type: type || 'chat'
      });
      console.log('✅ Chat session saved:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to save chat session:', error);
      return null;
    }
  };

  const loadChatSession = async (chat) => {
    try {
      setCurrentSessionId(chat.id);
      setMessages(chat.messages || []);
      setScreen("chat");
    } catch (error) {
      console.error('Failed to load chat session:', error);
    }
  };

  const handleSendMessage = async (message) => {
    const updated = [...messages, message];
    setMessages(updated);
    setIsTyping(true);
    let fallbackResponse = '';

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.text,
          conversationHistory: messages.slice(-10)
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      let assistantText = data.response ||
        "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";

      const botResponse = {
        id: Math.random().toString(36).slice(2),
        role: "bot",
        text: assistantText,
        hasContext: data.hasContext || false,
        context: data.context || null
      };

      const finalMessages = [...updated, botResponse];
      setMessages(finalMessages);

      if (currentSessionId) {
        await saveChatSession({
          id: currentSessionId,
          messages: finalMessages,
          type: 'chat'
        });
      }

      setIsTyping(false);
      return assistantText;
    } catch (error) {
      console.error('Error calling chat API:', error);
      const botResponse = {
        id: Math.random().toString(36).slice(2),
        role: "bot",
        text: `I apologize, but I'm experiencing technical difficulties. Error: ${error.message}.`
      };
      const finalMessages = [...updated, botResponse];
      setMessages(finalMessages);
      if (currentSessionId) {
        await saveChatSession({
          id: currentSessionId,
          messages: finalMessages,
          type: 'chat'
        });
      }
    }

    setIsTyping(false);
    return fallbackResponse;
  };

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
    if (message) handleSendMessage({ role: "user", text: message });
  };

  const go = (screenName) => setScreen(screenName);

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
          if (route === "files") goToFiles("academic");
          else go(route);
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
          {screen === "voice" && (
            <ScreenVoice
              onBackToChat={() => go("chat")}
              onSendMessage={handleSendMessage}
              voiceConversation={voiceConversation}
              setVoiceConversation={setVoiceConversation}
            />
          )}
          {screen === "files" && (
            <ScreenFiles section={filesSection} onBack={() => go("home")} />
          )}
          {screen === "history" && (
            <ScreenHistory
              onBack={() => go("home")}
              onLoadChat={loadChatSession}
              messages={messages}
              voiceConversation={voiceConversation}
            />
          )}
        </div>
      </Layout>
    </div>
  );
}

export default App;

