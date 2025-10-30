import React, { useState, useEffect } from 'react';
import { GSU } from '../constants/colors';
import chatHistoryService from '../services/chatHistoryService';

function ScreenHistory({ onBack, onLoadChat, messages, voiceConversation }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Filter chat history based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredHistory(chatHistory);
    } else {
      const filtered = chatHistory.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.messages && chat.messages.some(msg => 
          msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, chatHistory]);

  // Combine chat + voice conversation into unified list
  useEffect(() => {
    const combined = [...chatHistory];

    if (voiceConversation && voiceConversation.length > 0) {
      const userMessages = voiceConversation.filter(msg => msg.role === 'user');
      if (userMessages.length > 0) {
        combined.unshift({
          id: 'voice-' + Date.now(),
          title: userMessages[0]?.text?.substring(0, 50) + '...' || 'Voice Conversation',
          preview: userMessages[0]?.text || 'Voice conversation with Pounce',
          timestamp: new Date().toISOString(),
          message_count: voiceConversation.length,
          type: 'voice',
          messages: voiceConversation
        });
      }
    }

    setFilteredHistory(combined);
  }, [voiceConversation, chatHistory]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await chatHistoryService.getHistory();
      setChatHistory(history);
      setFilteredHistory(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setError('Failed to load chat history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleChatClick = (chat) => {
    if (chat.type === 'voice') {
      setSelectedConversation(chat);
    } else if (onLoadChat) {
      onLoadChat(chat);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await chatHistoryService.deleteSession(chatId);
        await loadChatHistory();
      } catch (error) {
        console.error('Failed to delete chat:', error);
        alert('Failed to delete chat. Please try again.');
      }
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const getTypeIcon = (type) => (type === 'voice' ? '🎤' : '💬');
  const getTypeColor = (type) => (type === 'voice' ? '#17cf6e' : GSU.blue);
  const formatTimestamp = (timestamp) => chatHistoryService.formatTimestamp(timestamp);

  // If a conversation is selected (voice)
  if (selectedConversation) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%",
        width: "100%",
        padding: "0 16px"
      }}>
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
              {selectedConversation.message_count} messages • {formatTimestamp(selectedConversation.timestamp)}
            </p>
          </div>
        </div>

        <div style={{ 
          flex: 1, 
          overflow: "auto",
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          {selectedConversation.messages.map((message, index) => (
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

  // Otherwise, render full history view
  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      gap: 24
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        paddingBottom: 16,
        borderBottom: "1px solid var(--line)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button 
            onClick={onBack}
            style={{ 
              background: "none", 
              border: "none", 
              fontSize: 24, 
              cursor: "pointer",
              color: "var(--fg)"
            }}
          >
            ←
          </button>
          <h1 style={{ 
            margin: 0, 
            fontSize: 28, 
            fontWeight: 600,
            color: "var(--fg)"
          }}>
            Chat History
          </h1>
        </div>
        <div style={{ 
          fontSize: 14, 
          color: "var(--muted)",
          background: "var(--card)",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--line)"
        }}>
          {chatHistory.length} {chatHistory.length === 1 ? 'chat' : 'chats'}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search chat history..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "12px 16px",
            paddingLeft: 40,
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            fontSize: 16,
            color: "var(--fg)",
            outline: "none",
            transition: "border-color 0.2s ease"
          }}
        />
        <div style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--muted)",
          fontSize: 16
        }}>
          🔍
        </div>
      </div>

      {/* States */}
      {loading && (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          padding: 40,
          color: "var(--muted)"
        }}>
          <div style={{ fontSize: 18 }}>Loading chat history...</div>
        </div>
      )}

      {error && (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          padding: 40,
          color: "#ff6b6b",
          flexDirection: "column",
          gap: 16
        }}>
          <div style={{ fontSize: 18 }}>⚠️ {error}</div>
          <button 
            onClick={loadChatHistory}
            style={{
              background: GSU.blue,
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: 8
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredHistory.length === 0 && (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          padding: 40,
          color: "var(--muted)",
          flexDirection: "column",
          gap: 16
        }}>
          <div style={{ fontSize: 48 }}>💬</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>
            {searchQuery ? 'No matching chats found' : 'No chat history yet'}
          </div>
          <div style={{ fontSize: 14, textAlign: "center" }}>
            {searchQuery ? 'Try a different search term' : 'Start a conversation to see it here'}
          </div>
        </div>
      )}

      {!loading && !error && filteredHistory.length > 0 && (
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 12,
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto"
        }}>
          {filteredHistory.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative"
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                marginBottom: 8
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ 
                    fontSize: 16,
                    color: getTypeColor(chat.type || 'chat')
                  }}>
                    {getTypeIcon(chat.type || 'chat')}
                  </div>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: 16, 
                    fontWeight: 500,
                    color: "var(--fg)"
                  }}>
                    {chat.title}
                  </h3>
                </div>
                <div style={{ 
                  fontSize: 12, 
                  color: "var(--muted)",
                  background: "var(--bg)",
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid var(--line)"
                }}>
                  {chat.message_count || 0} messages
                </div>
              </div>

              {chat.messages && chat.messages.length > 0 && (
                <div style={{ 
                  fontSize: 14, 
                  color: "var(--muted)",
                  marginBottom: 8,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {chat.messages[chat.messages.length - 1]?.text || 'No messages'}
                </div>
              )}

              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between"
              }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {formatTimestamp(chat.created_at)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    fontSize: 16,
                    padding: 4,
                    borderRadius: 4
                  }}
                  title="Delete chat"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScreenHistory;
