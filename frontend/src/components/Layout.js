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
  onNavigate 
}) {
  // Component state
  const [sidebar, setSidebar] = useState(false); // Controls sidebar visibility
  const [showUploadModal, setShowUploadModal] = useState(false); // Controls upload modal visibility
  const [inputMessage, setInputMessage] = useState(""); // Current input message
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Track if user is manually scrolling
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true); // Whether to auto-scroll
  const [hasNewMessages, setHasNewMessages] = useState(false); // Track if there are new messages when user scrolled up
  const chatAreaRef = useRef(null); // Reference to chat area for auto-scroll

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      // Always scroll to bottom when new messages arrive
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      
      // Reset scroll states to ensure we stay at bottom
      setShouldAutoScroll(true);
      setIsUserScrolling(false);
      setHasNewMessages(false);
    }
  }, [messages, isTyping]); // Also scroll when typing indicator changes

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
              {/* Recent History Section - Embedded in chat */}
              <div style={{
                background: "var(--card)",
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                border: "1px solid var(--line)"
              }}>
                <h3 style={{ 
                  margin: "0 0 16px 0", 
                  fontSize: "1.2rem", 
                  fontWeight: "bold", 
                  color: "var(--fg)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  📚 Recent History
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div 
                    onClick={() => {
                      if (onSendMessage) {
                        onSendMessage({
                          id: Math.random().toString(36).slice(2),
                          role: "user",
                          text: "Help me plan my next semester courses"
                        });
                      }
                    }}
                    style={{ 
                      background: "var(--hover)",
                      borderRadius: 12,
                      padding: 16,
                      border: "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "var(--line)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "var(--hover)";
                    }}
                  >
                    <div style={{ 
                      width: 40,
                      height: 40,
                      background: "#0039A620",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem"
                    }}>
                      💬
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "var(--fg)", fontWeight: 600 }}>
                        Help me plan my next semester courses
                      </p>
                      <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.7 }}>
                        Academic planning • 2 days ago
                      </p>
                    </div>
                    <div style={{ 
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      opacity: 0.6
                    }}>
                      ⋮
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => {
                      if (onSendMessage) {
                        onSendMessage({
                          id: Math.random().toString(36).slice(2),
                          role: "user",
                          text: "What campus resources are available?"
                        });
                      }
                    }}
                    style={{ 
                      background: "var(--hover)",
                      borderRadius: 12,
                      padding: 16,
                      border: "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "var(--line)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "var(--hover)";
                    }}
                  >
                    <div style={{ 
                      width: 40,
                      height: 40,
                      background: "#0039A620",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem"
                    }}>
                      🎤
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "var(--fg)", fontWeight: 600 }}>
                        What campus resources are available?
                      </p>
                      <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.7 }}>
                        Campus resources • 1 week ago
                      </p>
                    </div>
                    <div style={{ 
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      opacity: 0.6
                    }}>
                      ⋮
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 0,
                paddingBottom: 20 // Extra padding at bottom of messages
              }}>
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      style={{
                        display: "flex",
                        justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                        alignItems: "flex-start",
                        gap: 8
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
                        maxWidth: "70%",
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
                  ))
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
                
                {/* Upload Button */}
                <button 
                  onClick={() => setShowUploadModal(true)}
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
                >
                  📤
                </button>
                
                      <button 
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        style={{ 
                          background: inputMessage.trim() ? "#0039A6" : "var(--line)",
                          color: inputMessage.trim() ? "white" : "var(--fg)", 
                          border: 0, 
                          padding: "12px", 
                          borderRadius: "50%", 
                          cursor: inputMessage.trim() ? "pointer" : "not-allowed",
                          width: 44,
                          height: 44,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          transition: "all 0.2s ease"
                        }}
                      >
                        ✈️
                      </button>
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
