import React, { useState } from 'react';
import { GSU } from '../constants/colors';

function ScreenHistory({ onBack, messages, voiceConversation }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // Combine regular chat messages and voice conversations into unified history
  const getCombinedHistory = () => {
    const history = [];
    
    // Add regular chat conversations (group by conversation/session)
    if (messages && messages.length > 0) {
      // For now, treat all messages as one conversation
      // In a real app, you'd group by conversation sessions
      const chatMessages = messages.filter(msg => msg.role === 'user');
      if (chatMessages.length > 0) {
        history.push({
          id: 'chat-' + Date.now(),
          title: chatMessages[0]?.text?.substring(0, 50) + '...' || 'Chat Conversation',
          preview: chatMessages[0]?.text || 'Regular chat conversation',
          timestamp: new Date().toISOString(),
          messageCount: messages.length,
          type: 'chat',
          data: messages
        });
      }
    }
    
    // Add voice conversations
    if (voiceConversation && voiceConversation.length > 0) {
      // Group voice messages by conversation (you could improve this logic)
      const userMessages = voiceConversation.filter(msg => msg.role === 'user');
      if (userMessages.length > 0) {
        history.push({
          id: 'voice-' + Date.now(),
          title: userMessages[0]?.text?.substring(0, 50) + '...' || 'Voice Conversation',
          preview: userMessages[0]?.text || 'Voice conversation with Pounce',
          timestamp: new Date().toISOString(),
          messageCount: voiceConversation.length,
          type: 'voice',
          data: voiceConversation
        });
      }
    }
    
    // Sort by timestamp (newest first)
    return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const [chatHistory] = useState(getCombinedHistory());

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // If a conversation is selected, show the detailed view
  if (selectedConversation) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%",
        width: "100%",
        padding: "0 16px"
      }}>
        {/* Header for conversation detail */}
        <div style={{ 
          padding: "20px 0 16px 0",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <button
            onClick={handleBackToList}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "var(--fg)",
              padding: "4px"
            }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ 
              margin: "0 0 4px 0", 
              fontSize: "1.4rem", 
              fontWeight: "bold", 
              color: "var(--fg)",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              {selectedConversation.type === 'voice' ? '🎤' : '💬'} 
              {selectedConversation.title}
            </h1>
            <p style={{ 
              margin: 0, 
              opacity: 0.7, 
              fontSize: "0.85rem" 
            }}>
              {selectedConversation.messageCount} messages • {formatTimestamp(selectedConversation.timestamp)}
            </p>
          </div>
        </div>

        {/* Conversation transcript */}
        <div style={{ 
          flex: 1, 
          overflow: "auto",
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          {selectedConversation.data.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                gap: 12,
                alignItems: "flex-start"
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: message.role === 'user' ? '#4682b4' : '#f0f0f0',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                flexShrink: 0
              }}>
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div style={{
                background: message.role === 'user' 
                  ? 'rgba(70, 130, 180, 0.1)' 
                  : 'var(--card)',
                border: `1px solid ${message.role === 'user' 
                  ? 'rgba(70, 130, 180, 0.2)' 
                  : 'var(--line)'}`,
                borderRadius: 12,
                padding: 12,
                maxWidth: '75%',
                wordWrap: 'break-word'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.7,
                  marginBottom: 4,
                  fontWeight: 'bold'
                }}>
                  {message.role === 'user' ? 'You' : 'Pounce'}
                  {message.timestamp && ` • ${message.timestamp}`}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.4,
                  color: 'var(--fg)'
                }}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getTypeIcon = (type) => {
    return type === 'voice' ? '🎤' : '💬';
  };

  const getTypeColor = (type) => {
    return type === 'voice' ? '#17cf6e' : GSU.blue;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%",
      width: "100%",
      padding: "0 16px"
    }}>
      {/* Header */}
      <div style={{ 
        padding: "20px 0 16px 0",
        borderBottom: "1px solid var(--line)"
      }}>
        <h1 style={{ 
          margin: "0 0 8px 0", 
          fontSize: "1.8rem", 
          fontWeight: "bold", 
          color: "var(--fg)" 
        }}>
          Chat History
        </h1>
        <p style={{ 
          margin: 0, 
          opacity: 0.7, 
          fontSize: "0.95rem" 
        }}>
          View and manage your previous conversations
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ 
        marginTop: 20,
        marginBottom: 16
      }}>
        <input
          type="text"
          placeholder="Search chat history..."
          style={{
            width: "100%",
            background: "var(--card)",
            color: "var(--fg)",
            border: "1px solid var(--line)",
            padding: "12px 16px",
            borderRadius: 12,
            fontSize: 14,
            outline: "none"
          }}
        />
      </div>

      {/* Chat History List */}
      <div style={{ 
        flex: 1, 
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleConversationClick(chat)}
            style={{ 
              background: "var(--card)",
              borderRadius: 12,
              padding: 16,
              border: "1px solid var(--line)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--hover)";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--card)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <div style={{ 
              display: "flex", 
              alignItems: "flex-start", 
              gap: 12 
            }}>
              <div style={{ 
                width: 40,
                height: 40,
                background: `${getTypeColor(chat.type)}20`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                flexShrink: 0
              }}>
                {getTypeIcon(chat.type)}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start",
                  marginBottom: 4
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: "0.95rem", 
                    fontWeight: 600,
                    color: "var(--fg)",
                    lineHeight: 1.3
                  }}>
                    {chat.title}
                  </h3>
                  <div style={{ 
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexShrink: 0,
                    marginLeft: 8
                  }}>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      opacity: 0.6,
                      background: "var(--line)",
                      padding: "2px 6px",
                      borderRadius: 8
                    }}>
                      {chat.messageCount} msgs
                    </span>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      opacity: 0.6 
                    }}>
                      {formatTimestamp(chat.timestamp)}
                    </span>
                  </div>
                </div>
                
                <p style={{ 
                  margin: 0, 
                  fontSize: "0.85rem", 
                  opacity: 0.7, 
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                }}>
                  {chat.preview}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {chatHistory.length === 0 && (
        <div style={{ 
          flex: 1,
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "var(--fg)",
          opacity: 0.6,
          textAlign: "center"
        }}>
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <p style={{ margin: 0 }}>No chat history yet</p>
            <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem" }}>
              Start a conversation to see it here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScreenHistory;
