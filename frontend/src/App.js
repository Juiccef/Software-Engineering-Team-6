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

import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import Layout from './components/Layout';
import ScreenHome from './screens/ScreenHome';
import ScreenChat from './screens/ScreenChat';
import ScreenVoice from './screens/ScreenVoice';
import ScreenFiles from './screens/ScreenFiles';
import ScreenHistory from './screens/ScreenHistory';

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

  /**
   * Handles sending messages to the chat
   * 
   * @param {Object} message - The message object containing role and text
   * @param {string} message.role - Either "user" or "bot"
   * @param {string} message.text - The message content
   */
  const handleSendMessage = (message) => {
    setMessages(prev => [...prev, message]);
    setIsTyping(true); // Show typing indicator
    
    // Simulate bot response based on message content
    setTimeout(() => {
      const userText = message.text?.toLowerCase() || '';
      let response = "";
      
      if (userText.includes('plan') && userText.includes('semester')) {
        response = "Perfect! I'm excellent at semester planning. I can help you build optimal class schedules that fit your preferences, avoid conflicts, and meet your degree requirements. What type of schedule are you looking for - morning classes, afternoon, or flexible timing?";
      } else if (userText.includes('campus') && userText.includes('resource')) {
        response = "I can connect you with various campus resources! I can help you find tutoring services, academic support, career counseling, financial aid information, and campus events. What specific type of support are you looking for?";
      } else if (userText.includes('transcript') || userText.includes('upload')) {
        response = "Great! I can help you analyze your transcripts. You can upload your academic documents using the 📷 button in the chat. Once uploaded, I'll help you understand your progress and suggest next steps for your degree.";
      } else if (userText.includes('degree') || userText.includes('audit')) {
        response = "I can help you with degree planning and audits! I can analyze your current progress, identify remaining requirements, and suggest courses to complete your degree efficiently. Would you like me to help you plan your next semester?";
      } else if (userText.includes('schedule') || userText.includes('planning')) {
        response = "Perfect! I'm excellent at schedule planning. I can help you build optimal class schedules that fit your preferences, avoid conflicts, and meet your degree requirements. What type of schedule are you looking for - morning classes, afternoon, or flexible timing?";
      } else if (userText.includes('voice') || userText.includes('speak')) {
        response = "I'd love to chat with you using voice! Click the voice button above or use the 🎤 Start Voice Chat button to begin a voice conversation. I can understand natural speech and respond conversationally.";
      } else if (userText.includes('event') || userText.includes('campus')) {
        response = "I can help you discover campus events and activities! I can show you upcoming academic events, social activities, career fairs, and student organization meetings. Are you looking for academic, social, or career-related events?";
      } else {
        response = "Thanks for your message! I'm here to help with all aspects of your GSU experience. You can ask me about:\n\n• Academic planning and course selection\n• Schedule building and optimization\n• Degree requirements and audits\n• Campus resources and support\n• Events and activities\n• Voice conversations\n\nWhat would you like to explore?";
      }
      
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).slice(2),
        role: "bot",
        text: response
      }]);
      setIsTyping(false); // Hide typing indicator
    }, 1000);
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
            />
          )}
        </div>
      </Layout>
    </div>
  );
}

export default App;
