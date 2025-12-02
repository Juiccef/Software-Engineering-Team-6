/**
 * Layout Component - Main application layout wrapper
 * 
 * Provides the overall structure for the GSU Panther Chatbot including:
 * - Header bar with logo and navigation
 * - Sidebar navigation menu
 * - Main content area
 * - Fixed bottom chat input bar
 * - Upload modal functionality
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Array} props.messages - Chat messages array
 * @param {Function} props.onSendMessage - Function to handle sending messages
 * @param {Function} props.onQuickAction - Function to handle quick actions
 * @param {boolean} props.showChatBox - Whether to show the chat input bar
 * @param {string} props.mode - Current theme mode ('light' or 'dark')
 * @param {Function} props.onToggleTheme - Function to toggle theme
 * @param {Function} props.onLogoClick - Function to handle logo clicks
 * @param {Function} props.onNavigate - Function to handle navigation
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import HeaderBar from './HeaderBar';
import Sidebar from './Sidebar';
import { uploadFile, uploadTranscript, formatFileSize, getFileIcon, isFileTypeSupported } from '../services/fileService';
import ScheduleDisplay from './ScheduleDisplay';

function Layout({ 
  children, 
  messages = [], 
  onSendMessage, 
  onQuickAction, 
  showChatBox = true, 
  mode, 
  isTyping = false,
  onToggleTheme, 
  onLogoClick, 
  onNavigate,
  onNewChat,
  currentScreen = "home",
  onGoVoice,
  onGoToHistory,
  currentSessionId,
  chatSettings = {}
}) {
  // Component state
  const [sidebar, setSidebar] = useState(false); // Controls sidebar visibility
  const [showUploadModal, setShowUploadModal] = useState(false); // Controls upload modal visibility
  const [inputMessage, setInputMessage] = useState(""); // Current input message
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Track if user is manually scrolling
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true); // Whether to auto-scroll
  const [hasNewMessages, setHasNewMessages] = useState(false); // Track if there are new messages when user scrolled up
  const [isUploading, setIsUploading] = useState(false); // Track file upload status
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const chatAreaRef = useRef(null); // Reference to chat area for auto-scroll
  const fileRef = useRef(null); // Reference to file input
  const hasUserMessages = messages.some(msg => msg.role === "user"); // Check if user has sent messages

  // Check if user is near the bottom of the chat
  const isNearBottom = () => {
    if (!chatAreaRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = chatAreaRef.current;
    return scrollHeight - scrollTop - clientHeight < 50; // Within 50px of bottom (more sensitive)
  };

  // Handle scroll events to detect manual scrolling
  const handleScroll = () => {
    if (!chatAreaRef.current) return;
    
    const nearBottom = isNearBottom();
    setShouldAutoScroll(nearBottom);
    
    // If user scrolls to bottom, re-enable auto-scroll
    if (nearBottom) {
      setIsUserScrolling(false);
      setHasNewMessages(false);
    } else {
      setIsUserScrolling(true);
    }
  };

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setShouldAutoScroll(true);
      setIsUserScrolling(false);
      setHasNewMessages(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive (respect settings)
  useEffect(() => {
    if (chatAreaRef.current && chatSettings?.autoScroll !== false) {
      // Only auto-scroll if setting is enabled
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      
      // Reset scroll states to ensure we stay at bottom
      setShouldAutoScroll(true);
      setIsUserScrolling(false);
      setHasNewMessages(false);
    }
  }, [messages, isTyping, chatSettings?.autoScroll]); // Also scroll when typing indicator changes

  // Handle sending messages
  const handleSendMessage = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage({
        id: Math.random().toString(36).slice(2),
        role: "user",
        text: inputMessage.trim()
      });
      setInputMessage("");
      
      // Force scroll to bottom when user sends a message
      setTimeout(() => {
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
          setShouldAutoScroll(true);
          setIsUserScrolling(false);
          setHasNewMessages(false);
        }
      }, 50); // Reduced delay for faster response
      
      // Also scroll immediately
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input
    e.target.value = '';

    try {
      // Validate file type
      if (!isFileTypeSupported(file.type)) {
        if (onSendMessage) {
          onSendMessage({
            role: "system",
            text: `❌ File type not supported: ${file.type}. Please upload images, PDFs, or Office documents.`,
            isError: true
          });
        }
        return;
      }

      // Check file size (50MB max)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        if (onSendMessage) {
          onSendMessage({
            role: "system",
            text: `❌ File too large: ${formatFileSize(file.size)}. Maximum size is 50MB.`,
            isError: true
          });
        }
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      // Check if we're in pipeline mode and this is a PDF (likely a transcript)
      // Check last few messages for pipeline state (more reliable than just last message)
      const recentMessages = messages.slice(-5); // Check last 5 messages
      const isInPipeline = recentMessages.some(msg => msg.inPipeline === true);
      const isPDF = file.type === 'application/pdf';
      const isTranscriptUpload = isInPipeline && isPDF && currentSessionId;

      // Send upload start message
      if (onSendMessage) {
        onSendMessage({
          role: "system",
          text: `📤 Uploading ${file.name} (${formatFileSize(file.size)})...`,
          isUploading: true
        });
      }

      let result;
      if (isTranscriptUpload) {
        // Use transcript upload endpoint
        result = await uploadTranscript(file, currentSessionId, (progress) => {
          setUploadProgress(progress);
        });
      } else {
        // Use regular file upload
        result = await uploadFile(file, (progress) => {
          setUploadProgress(progress);
        });
      }

      // Check if this is a transcript upload response (even if success is false, check for pipeline indicators)
      const isTranscriptResponse = result.inPipeline || result.pipelineState || result.schedule || (isTranscriptUpload && result.response);
      
      if (result.success || isTranscriptResponse) {
        if (isTranscriptUpload || isTranscriptResponse) {
          // Handle transcript upload response
          if (onSendMessage) {
            onSendMessage({
              role: "user",
              text: `📕 Uploaded transcript: ${file.name}`,
              file: {
                name: file.name,
                type: file.type,
                size: file.size
              }
            });

            // Send bot response from transcript upload with schedule if available
            // Use result.response if available, otherwise result.message
            const botMessage = result.response || result.message || 'Processing your transcript...';
            
            setTimeout(() => {
              if (onSendMessage) {
                onSendMessage({
                  role: "bot",
                  text: botMessage,
                  schedule: result.schedule || null,
                  inPipeline: result.inPipeline !== false, // Default to true if in pipeline
                  pipelineState: result.pipelineState || null
                });
              }
            }, 1000);
          }
        } else {
          // Regular file upload
          if (onSendMessage) {
            onSendMessage({
              role: "user",
              text: `${getFileIcon(file.type)} Uploaded: ${file.name}`,
              file: {
                name: result.file.name,
                fileName: result.file.fileName,
                size: result.file.size,
                type: result.file.type,
                url: result.file.url,
                uploadedAt: result.file.uploadedAt
              }
            });

            // Send a follow-up bot message
            setTimeout(() => {
              if (onSendMessage) {
                onSendMessage({
                  role: "bot",
                  text: `Great! I've received your file "${file.name}". I can help you analyze or work with this file. What would you like me to do with it?`
                });
              }
            }, 1000);
          }
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      if (onSendMessage) {
        onSendMessage({
          role: "system",
          text: `❌ Upload failed: ${error.message}`,
          isError: true
        });
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div style={{ 
        display: "flex", 
        height: "100vh", 
        background: "var(--bg)",
        color: "var(--fg)"
      }}>
      {/* Sidebar */}
      <Sidebar 
        open={sidebar} 
        onClose={() => setSidebar(false)} 
        onGo={(route) => {
          setSidebar(false);
          if (onNavigate) {
            onNavigate(route);
          }
        }} 
      />

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <HeaderBar
          onHamburger={() => setSidebar(true)}
          onToggleTheme={onToggleTheme}
          mode={mode}
          onLogoClick={onLogoClick}
        />

        {/* Content Area */}
        <div style={{ 
          flex: showChatBox ? "none" : 1, 
          display: "flex", 
          flexDirection: "column",
          overflow: "hidden",
          marginTop: "64px", // Account for fixed header height
          height: showChatBox ? "calc(100vh - 64px)" : "auto" // Explicit height for chat mode
        }}>
          {/* Main Content - Only show when not in chat mode */}
          {!showChatBox && (
            <div style={{ 
              flex: 1, 
              overflow: "auto",
              padding: "16px 16px 0 16px"
            }}>
              {children}
            </div>
          )}

          {/* Full Chat Experience - Takes up all space when chat is active */}
          {showChatBox && (
            <div 
              ref={chatAreaRef}
              onScroll={handleScroll}
              style={{
                height: "calc(100vh - 64px - 80px)", // Full height minus header (64px) minus input bar (80px)
                background: "var(--bg)",
                overflow: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Home Content - Show when on home screen and no user messages */}
              {currentScreen === "home" && !hasUserMessages && (
                <div                     style={{
                      marginBottom: 24,
                      animation: chatSettings?.animations !== false ? "fadeIn 0.4s ease-in" : "none",
                      opacity: 1,
                      transition: chatSettings?.animations !== false ? "opacity 0.4s ease-out, transform 0.4s ease-out" : "none",
                      maxWidth: "800px",
                      margin: "0 auto",
                      padding: "0 16px"
                    }}>
                  {/* Quick Suggestions Section */}
                  <div style={{ marginTop: 0 }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      marginBottom: 20,
                      paddingBottom: 12,
                      borderBottom: "1px solid var(--line)"
                    }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: "1.1rem", 
                        fontWeight: 600, 
                        color: "var(--fg)",
                        letterSpacing: "0.2px"
                      }}>
                        Quick Suggestions
                      </h3>
                      {onGoToHistory && (
                        <span 
                          onClick={onGoToHistory}
                          style={{ 
                            color: "var(--fg)", 
                            opacity: 0.6, 
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            padding: "6px 12px",
                            borderRadius: 8,
                            transition: "all 0.2s ease",
                            fontWeight: 500
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.opacity = "1";
                            e.target.style.background = "var(--hover)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.opacity = "0.6";
                            e.target.style.background = "transparent";
                          }}
                        >
                          View History →
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {/* Schedule Planning - Triggers Pipeline */}
                      <div 
                        onClick={() => onSendMessage && onSendMessage({
                          id: Math.random().toString(36).slice(2),
                          role: "user",
                          text: "I need help building my class schedule for next semester"
                        })}
                        style={{ 
                          background: "var(--card)",
                          borderRadius: 16,
                          padding: "20px 20px",
                          border: "1px solid var(--line)",
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          cursor: "pointer",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--hover)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
                          e.currentTarget.style.borderColor = "#0039A640";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--card)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                          e.currentTarget.style.borderColor = "var(--line)";
                        }}
                      >
                        <div style={{ 
                          width: 48,
                          height: 48,
                          minWidth: 48,
                          background: "linear-gradient(135deg, #0039A615 0%, #0039A625 100%)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.4rem",
                          flexShrink: 0
                        }}>
                          📅
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ 
                            margin: "0 0 6px 0", 
                            fontSize: "1rem", 
                            color: "var(--fg)", 
                            fontWeight: 600,
                            lineHeight: 1.3
                          }}>
                            Plan Your Academic Schedule
                          </p>
                          <p style={{ 
                            margin: 0, 
                            fontSize: "0.875rem", 
                            opacity: 0.65,
                            lineHeight: 1.4
                          }}>
                            Get a personalized course schedule based on your major and transcript
                          </p>
                        </div>
                        <div style={{ 
                          width: 28,
                          height: 28,
                          minWidth: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          opacity: 0.5,
                          fontSize: "1.1rem",
                          flexShrink: 0,
                          transition: "opacity 0.2s ease"
                        }}>
                          →
                        </div>
                      </div>

                      {/* Get Campus Contacts */}
                      <div 
                        onClick={() => onSendMessage && onSendMessage({
                          id: Math.random().toString(36).slice(2),
                          role: "user",
                          text: "Get campus contacts"
                        })}
                        style={{ 
                          background: "var(--card)",
                          borderRadius: 16,
                          padding: "20px 20px",
                          border: "1px solid var(--line)",
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          cursor: "pointer",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--hover)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
                          e.currentTarget.style.borderColor = "#0039A640";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--card)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                          e.currentTarget.style.borderColor = "var(--line)";
                        }}
                      >
                        <div style={{ 
                          width: 48,
                          height: 48,
                          minWidth: 48,
                          background: "linear-gradient(135deg, #0039A615 0%, #0039A625 100%)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.4rem",
                          flexShrink: 0
                        }}>
                          📞
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ 
                            margin: "0 0 6px 0", 
                            fontSize: "1rem", 
                            color: "var(--fg)", 
                            fontWeight: 600,
                            lineHeight: 1.3
                          }}>
                            Get Campus Contacts
                          </p>
                          <p style={{ 
                            margin: 0, 
                            fontSize: "0.875rem", 
                            opacity: 0.65,
                            lineHeight: 1.4
                          }}>
                            Find contact information for departments, offices, and services
                          </p>
                        </div>
                        <div style={{ 
                          width: 28,
                          height: 28,
                          minWidth: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          opacity: 0.5,
                          fontSize: "1.1rem",
                          flexShrink: 0,
                          transition: "opacity 0.2s ease"
                        }}>
                          →
                        </div>
                      </div>

                      {/* Ask Pounce */}
                      <div 
                        onClick={() => onSendMessage && onSendMessage({
                          id: Math.random().toString(36).slice(2),
                          role: "user",
                          text: "What campus resources are available?"
                        })}
                        style={{ 
                          background: "var(--card)",
                          borderRadius: 16,
                          padding: "20px 20px",
                          border: "1px solid var(--line)",
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          cursor: "pointer",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--hover)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
                          e.currentTarget.style.borderColor = "#0039A640";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--card)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                          e.currentTarget.style.borderColor = "var(--line)";
                        }}
                      >
                        <div style={{ 
                          width: 48,
                          height: 48,
                          minWidth: 48,
                          background: "linear-gradient(135deg, #0039A615 0%, #0039A625 100%)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.4rem",
                          flexShrink: 0
                        }}>
                          🏛️
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ 
                            margin: "0 0 6px 0", 
                            fontSize: "1rem", 
                            color: "var(--fg)", 
                            fontWeight: 600,
                            lineHeight: 1.3
                          }}>
                            Explore Campus Resources
                          </p>
                          <p style={{ 
                            margin: 0, 
                            fontSize: "0.875rem", 
                            opacity: 0.65,
                            lineHeight: 1.4
                          }}>
                            Discover tutoring, career services, and student support
                          </p>
                        </div>
                        <div style={{ 
                          width: 28,
                          height: 28,
                          minWidth: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          opacity: 0.5,
                          fontSize: "1.1rem",
                          flexShrink: 0,
                          transition: "opacity 0.2s ease"
                        }}>
                          →
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voice Chat Button */}
                  {onGoVoice && (
                    <div style={{ 
                      marginTop: 48, 
                      display: "flex", 
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <button
                        onClick={onGoVoice}
                        style={{
                          background: "linear-gradient(135deg, #0039A6 0%, #0052CC 50%, #1e3f7f 100%)",
                          color: "white",
                          border: "none",
                          padding: "20px 48px",
                          borderRadius: 24,
                          cursor: "pointer",
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          boxShadow: "0 8px 32px rgba(0, 57, 166, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          letterSpacing: "0.5px",
                          position: "relative",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 57, 166, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)";
                          e.currentTarget.style.background = "linear-gradient(135deg, #0047B3 0%, #0059E6 50%, #2a4f8f 100%)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 57, 166, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)";
                          e.currentTarget.style.background = "linear-gradient(135deg, #0039A6 0%, #0052CC 50%, #1e3f7f 100%)";
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px) scale(0.98)";
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                        }}
                      >
                        <span style={{ 
                          fontSize: "1.8rem", 
                          lineHeight: 1,
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))"
                        }}>
                          🎤
                        </span>
                        <span style={{ 
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
                        }}>
                          Start Voice Chat
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Messages Area */}
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 0,
                paddingBottom: 20, // Extra padding at bottom of messages
                    opacity: hasUserMessages ? 1 : 0,
                    transition: chatSettings?.animations !== false ? "opacity 0.5s ease-in" : "none",
                    pointerEvents: hasUserMessages ? "auto" : "none"
                  }}>
                {messages.length > 0 ? (
                  messages.map((message, index) => {
                    // Find first user message index for animation timing
                    const firstUserIndex = messages.findIndex(m => m.role === "user");
                    // Only animate messages that appear after user starts chatting
                    const shouldAnimate = hasUserMessages && (firstUserIndex === -1 || index >= firstUserIndex);
                    return (
                    <div
                      key={message.id || index}
                      style={{
                        display: "flex",
                        justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                        alignItems: "flex-start",
                        gap: 8,
                        animation: (chatSettings?.animations !== false && shouldAnimate) ? "fadeInUp 0.4s ease-out" : "none",
                        animationDelay: (chatSettings?.animations !== false && shouldAnimate && firstUserIndex >= 0) ? `${(index - firstUserIndex) * 0.05}s` : "0s",
                        animationFillMode: "both"
                      }}
                    >
                      {message.role === "bot" && (
                        <div style={{
                          width: 32,
                          height: 32,
                          background: "#0039A6",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          color: "white",
                          flexShrink: 0
                        }}>
                          🐾
                        </div>
                      )}
                      
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "70%",
                        gap: 12
                      }}>
                        <div style={{
                          background: message.role === "user" ? "#0039A6" : "var(--hover)",
                          color: message.role === "user" ? "white" : "var(--fg)",
                          padding: "12px 16px",
                          borderRadius: 16,
                          fontSize: "0.9rem",
                          lineHeight: 1.4,
                          wordWrap: "break-word"
                        }}>
                          {message.text}
                        </div>
                        {/* Display schedule if available in message */}
                        {message.schedule && (
                          <ScheduleDisplay
                            schedule={message.schedule}
                            sessionId={currentSessionId}
                            onClose={() => {}}
                          />
                        )}
                      </div>
                      
                      {message.role === "user" && (
                        <div style={{
                          width: 32,
                          height: 32,
                          background: "var(--line)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          flexShrink: 0
                        }}>
                          👤
                        </div>
                      )}
                    </div>
                    );
                  })
                ) : (
                  <div style={{
                    textAlign: "center",
                    opacity: 0.7,
                    padding: "40px 20px",
                    fontSize: "0.9rem"
                  }}>
                    Start a conversation with Pounce! 🐾
                  </div>
                )}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 8
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      background: "#0039A6",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      color: "white",
                      flexShrink: 0
                    }}>
                      🐾
                    </div>
                    
                    <div style={{
                      background: "var(--hover)",
                      color: "var(--fg)",
                      padding: "12px 16px",
                      borderRadius: 16,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}>
                      <span>Pounce is typing</span>
                      <div style={{
                        display: "flex",
                        gap: 2
                      }}>
                        <div style={{
                          width: 4,
                          height: 4,
                          background: "var(--fg)",
                          borderRadius: "50%",
                          animation: "typing 1.4s infinite ease-in-out"
                        }} />
                        <div style={{
                          width: 4,
                          height: 4,
                          background: "var(--fg)",
                          borderRadius: "50%",
                          animation: "typing 1.4s infinite ease-in-out 0.2s"
                        }} />
                        <div style={{
                          width: 4,
                          height: 4,
                          background: "var(--fg)",
                          borderRadius: "50%",
                          animation: "typing 1.4s infinite ease-in-out 0.4s"
                        }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Scroll to Bottom Button */}
              {hasNewMessages && (
                <button
                  onClick={scrollToBottom}
                  style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    background: "#0039A6",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    transition: "all 0.2s ease",
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#1e3f7f";
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#0039A6";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  ↓
                </button>
              )}
            </div>
          )}

          {/* Bottom Input Bar */}
          {showChatBox && (
            <div style={{ 
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "var(--bg)",
              borderTop: "1px solid var(--line)",
              padding: "16px",
              zIndex: 3000 // Higher than sidebar (2000-2001)
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12,
                maxWidth: "100%"
              }}>
                <div style={{ 
                  flex: 1,
                  position: "relative"
                }}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a prompt here..."
                    style={{ 
                      width: "100%",
                      background: "var(--card)", 
                      color: "var(--fg)", 
                      border: "1px solid var(--line)", 
                      padding: "12px 16px 12px 16px", 
                      borderRadius: 12,
                      fontSize: 14,
                      minHeight: 44,
                      outline: "none"
                    }}
                  />
                  <div style={{ 
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    opacity: 0.6
                  }}>
                    🎤
                  </div>
                </div>
                
                {/* New Chat Button */}
                {onNewChat && (
                  <button 
                    onClick={onNewChat}
                    style={{ 
                      background: "var(--card)",
                      color: "var(--fg)", 
                      border: "1px solid var(--line)", 
                      padding: "12px", 
                      borderRadius: "50%", 
                      cursor: "pointer",
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "var(--hover)";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "var(--card)";
                      e.target.style.transform = "scale(1)";
                    }}
                    title="Start New Chat"
                  >
                    ➕
                  </button>
                )}
                
                {/* File Upload Button */}
                <button 
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                  style={{ 
                    background: isUploading ? "var(--line)" : "var(--card)",
                    color: isUploading ? "var(--muted)" : "var(--fg)", 
                    border: "1px solid var(--line)", 
                    padding: "12px", 
                    borderRadius: "50%", 
                    cursor: isUploading ? "not-allowed" : "pointer",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    transition: "all 0.2s ease",
                    opacity: isUploading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isUploading) {
                      e.target.style.background = "var(--hover)";
                      e.target.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = isUploading ? "var(--line)" : "var(--card)";
                    e.target.style.transform = "scale(1)";
                  }}
                  title={isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : "Upload file"}
                >
                  {isUploading ? '⏳' : '📤'}
                </button>

                {/* Hidden file input */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,application/pdf,text/plain,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  hidden
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "var(--card)",
            borderRadius: 20,
            padding: 0,
            width: "100%",
            maxWidth: 450,
            border: "3px solid var(--line)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            overflow: "hidden",
            position: "relative"
          }}>
            {/* Box Lid - Top Section */}
            <div style={{
              background: `linear-gradient(135deg, #0039A6 0%, #1e3f7f 100%)`,
              padding: "20px 24px",
              color: "white",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 40,
                height: 40,
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%"
              }} />
              <div style={{
                position: "absolute",
                bottom: -15,
                right: -15,
                width: 60,
                height: 60,
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%"
              }} />
              
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{
                  margin: "0 0 8px 0",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  📦 Upload Files
                </h2>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.9, 
                  fontSize: "0.95rem" 
                }}>
                  Drop your files into the box below
                </p>
              </div>
            </div>

            {/* Box Content - Main Area */}
            <div style={{ padding: "24px" }}>
              <div style={{
                border: "3px dashed var(--line)",
                borderRadius: 16,
                padding: "40px 20px",
                textAlign: "center",
                marginBottom: 24,
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "var(--bg)",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#0039A6";
                e.target.style.background = `#0039A608`;
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "var(--line)";
                e.target.style.background = "var(--bg)";
                e.target.style.transform = "scale(1)";
              }}
              >
                {/* Box Interior Decoration */}
                <div style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  width: 20,
                  height: 20,
                  border: "2px solid var(--line)",
                  borderRadius: 4,
                  opacity: 0.3
                }} />
                <div style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 20,
                  height: 20,
                  border: "2px solid var(--line)",
                  borderRadius: 4,
                  opacity: 0.3
                }} />
                <div style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  width: 20,
                  height: 20,
                  border: "2px solid var(--line)",
                  borderRadius: 4,
                  opacity: 0.3
                }} />
                <div style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  width: 20,
                  height: 20,
                  border: "2px solid var(--line)",
                  borderRadius: 4,
                  opacity: 0.3
                }} />

                <div style={{ fontSize: "3rem", marginBottom: 12 }}>📁</div>
                <p style={{ 
                  margin: "0 0 8px 0", 
                  color: "var(--fg)",
                  fontSize: "1.1rem",
                  fontWeight: 600
                }}>
                  Open the box and drop your files
                </p>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.7, 
                  fontSize: "0.95rem" 
                }}>
                  Click to browse or drag files here
                </p>
              </div>

              <div style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end"
              }}>
                <button
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    background: "transparent",
                    color: "var(--fg)",
                    border: "2px solid var(--line)",
                    padding: "12px 24px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  Close Box
                </button>
                <button
                  onClick={() => {
                    // Handle file upload logic here
                    setShowUploadModal(false);
                  }}
                  style={{
                    background: "#0039A6",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#1e3f7f";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#0039A6";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Upload Files
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default Layout;
