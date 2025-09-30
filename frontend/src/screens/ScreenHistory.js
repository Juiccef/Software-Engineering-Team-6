import React, { useState } from 'react';
import { GSU } from '../constants/colors';

function ScreenHistory({ onBack }) {
  // Sample chat history data
  const [chatHistory] = useState([
    {
      id: 1,
      title: "Help me plan my next semester courses",
      preview: "I need help selecting courses for Spring 2024. Can you recommend some classes that would work well with my Computer Science major?",
      timestamp: "2024-01-15 14:30",
      messageCount: 8,
      type: "chat"
    },
    {
      id: 2,
      title: "What campus resources are available?",
      preview: "I'm looking for tutoring services and academic support resources on campus.",
      timestamp: "2024-01-14 09:15",
      messageCount: 5,
      type: "voice"
    },
    {
      id: 3,
      title: "Degree audit questions",
      preview: "Can you help me understand my degree requirements and what courses I still need to take?",
      timestamp: "2024-01-13 16:45",
      messageCount: 12,
      type: "chat"
    },
    {
      id: 4,
      title: "Schedule building assistance",
      preview: "I need help creating a schedule that avoids conflicts and fits my preferences.",
      timestamp: "2024-01-12 11:20",
      messageCount: 6,
      type: "chat"
    },
    {
      id: 5,
      title: "Campus events and activities",
      preview: "What upcoming events and activities are happening on campus this month?",
      timestamp: "2024-01-11 13:10",
      messageCount: 4,
      type: "voice"
    },
    {
      id: 6,
      title: "Financial aid information",
      preview: "I have questions about my financial aid package and scholarship opportunities.",
      timestamp: "2024-01-10 15:30",
      messageCount: 7,
      type: "chat"
    }
  ]);

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
