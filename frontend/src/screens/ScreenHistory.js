import React, { useState, useEffect } from 'react';
import { GSU } from '../constants/colors';
import chatHistoryService from '../services/chatHistoryService';

function ScreenHistory({ onBack, onLoadChat }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  /**
   * Load chat history from Supabase or localStorage
   */
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

  /**
   * Handle search input changes
   */
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Handle clicking on a chat to load it
   */
  const handleChatClick = (chat) => {
    if (onLoadChat) {
      onLoadChat(chat);
    }
  };

  /**
   * Handle deleting a chat
   */
  const handleDeleteChat = async (chatId) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await chatHistoryService.deleteSession(chatId);
        await loadChatHistory(); // Reload the history
      } catch (error) {
        console.error('Failed to delete chat:', error);
        alert('Failed to delete chat. Please try again.');
      }
    }
  };

  /**
   * Get icon for chat type
   */
  const getTypeIcon = (type) => {
    return type === 'voice' ? '🎤' : '💬';
  };

  /**
   * Get color for chat type
   */
  const getTypeColor = (type) => {
    return type === 'voice' ? '#17cf6e' : GSU.blue;
  };

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp) => {
    return chatHistoryService.formatTimestamp(timestamp);
  };

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
          onFocus={(e) => {
            e.target.style.borderColor = GSU.blue;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--line)";
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

      {/* Loading State */}
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

      {/* Error State */}
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
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
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

      {/* Chat History List */}
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
              onMouseEnter={(e) => {
                e.target.style.background = "var(--hover)";
                e.target.style.borderColor = GSU.blue;
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 57, 166, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--card)";
                e.target.style.borderColor = "var(--line)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {/* Chat Header */}
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

              {/* Chat Preview */}
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

              {/* Chat Footer */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between"
              }}>
                <div style={{ 
                  fontSize: 12, 
                  color: "var(--muted)"
                }}>
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
                    borderRadius: 4,
                    transition: "color 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ff6b6b";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "var(--muted)";
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