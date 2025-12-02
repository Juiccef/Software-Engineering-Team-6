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
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'chat', 'voice'

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Note: Filtering is now handled in the combined effect above

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
          created_at: new Date().toISOString(),
          message_count: voiceConversation.length,
          type: 'voice',
          messages: voiceConversation
        });
      }
    }

    // Filter by tab - ensure proper separation
    let tabFiltered = combined;
    if (activeTab === 'chat') {
      // Chat tab: Only show items that are explicitly 'chat' type or have no type (default to chat)
      tabFiltered = combined.filter(item => {
        const itemType = item.type || 'chat';
        return itemType === 'chat';
      });
    } else if (activeTab === 'voice') {
      // Voice tab: Only show items that are explicitly 'voice' type
      tabFiltered = combined.filter(item => item.type === 'voice');
    }

    // Apply search filter
    if (!searchQuery.trim()) {
      setFilteredHistory(tabFiltered);
    } else {
      const filtered = tabFiltered.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.messages && chat.messages.some(msg => 
          msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      setFilteredHistory(filtered);
    }
  }, [voiceConversation, chatHistory, activeTab, searchQuery]);

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

  const handleDeleteChat = async (chatId, e) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        // Voice conversations are stored locally, so we just need to clear them
        if (chatId?.startsWith('voice-')) {
          // Voice conversations are handled by the parent component
          // We can't delete them from here, but we can show a message
          alert('Voice conversations are session-based and will be cleared when you refresh the page.');
          return;
        }
        
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

  // Only show mic emoji for voice chats, chat icon for everything else
  const getTypeIcon = (type) => {
    const itemType = type || 'chat';
    return itemType === 'voice' ? '🎤' : '💬';
  };
  const getTypeColor = (type) => {
    const itemType = type || 'chat';
    return itemType === 'voice' ? '#17cf6e' : GSU.blue;
  };
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
          {filteredHistory.length} {filteredHistory.length === 1 ? 'conversation' : 'conversations'}
          {activeTab !== 'all' && ` (${activeTab})`}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        borderBottom: "2px solid var(--line)",
        paddingBottom: 8
      }}>
        {['all', 'chat', 'voice'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? GSU.blue : "transparent",
              color: activeTab === tab ? "white" : "var(--fg)",
              border: `1px solid ${activeTab === tab ? GSU.blue : "var(--line)"}`,
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 400,
              transition: "all 0.2s ease",
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            {tab === 'all' && '📋'}
            {tab === 'chat' && '💬'}
            {tab === 'voice' && '🎤'}
            {tab === 'all' ? 'All' : tab === 'chat' ? 'Chat' : 'Voice'}
          </button>
        ))}
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
                    color: getTypeColor(chat.type)
                  }}>
                    {getTypeIcon(chat.type)}
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
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    fontSize: 16,
                    padding: 4,
                    borderRadius: 4
                  }}
                  title="Delete conversation"
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
