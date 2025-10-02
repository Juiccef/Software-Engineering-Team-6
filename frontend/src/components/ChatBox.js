import React, { useState, useRef } from 'react';
import { GSU } from '../constants/colors';
import QuickActions from './QuickActions';

function ChatBox({ messages = [], onSendMessage, onQuickAction, className = "", style = {} }) {
  const [draft, setDraft] = useState("");
  const fileRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendMessage({ role: "user", text: draft.trim() });
    setDraft("");
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onSendMessage({ role: "user", image: url });
  };

  return (
    <div 
      className={`chat-box ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Chat Messages Area */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: 16,
          display: "flex", 
          flexDirection: "column", 
          gap: 12,
          minHeight: 200
        }}
      >
        {messages.length === 0 ? (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%",
            color: "var(--fg)",
            opacity: 0.6,
            textAlign: "center"
          }}>
            <div>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <p style={{ margin: 0 }}>Start a conversation with Pounce</p>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id} 
              style={{ 
                alignSelf: m.role === "user" ? "flex-end" : "flex-start", 
                maxWidth: "80%",
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <div
                style={{
                  background: m.role === "user" ? "var(--bubbleUser)" : "var(--bubbleBot)",
                  color: m.role === "user" ? "white" : "var(--fg)",
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  padding: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  wordWrap: "break-word",
                }}
              >
                {m.text && <p style={{ margin: 0 }}>{m.text}</p>}
                {m.image && (
                  <img 
                    src={m.image} 
                    alt="upload" 
                    style={{ 
                      display: "block", 
                      width: "100%", 
                      maxWidth: 300,
                      borderRadius: 12, 
                      border: "1px solid var(--line)", 
                      marginTop: m.text ? 8 : 0 
                    }} 
                  />
                )}
              </div>
              <div style={{ 
                fontSize: 11, 
                opacity: 0.6, 
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                marginTop: -2
              }}>
                {m.role === "user" ? "You" : "Pounce"}
              </div>
              {m.showQuickActions && onQuickAction && (
                <div style={{ alignSelf: "flex-start", marginTop: 8 }}>
                  <QuickActions onActionClick={onQuickAction} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat Input Area */}
      <div style={{ 
        borderTop: "1px solid var(--line)", 
        padding: 16,
        background: "var(--bg)"
      }}>
        {/* Quick Actions - Centered above textbox */}
        {onQuickAction && (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: 12 
          }}>
            <QuickActions onActionClick={onQuickAction} />
          </div>
        )}
        
        <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button 
            type="button" 
            onClick={() => fileRef.current?.click()}
            style={{ 
              background: "transparent", 
              color: "var(--fg)", 
              border: `1px solid var(--line)`, 
              padding: "10px 12px", 
              borderRadius: 12, 
              cursor: "pointer",
              fontSize: 16,
              minWidth: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Upload image"
          >
            📷
          </button>
          <input 
            ref={fileRef} 
            type="file" 
            accept="image/*" 
            hidden 
            onChange={onPick} 
          />
          <div style={{ flex: 1, position: "relative" }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your message…"
              style={{ 
                width: "100%",
                background: "var(--card)", 
                color: "var(--fg)", 
                border: `1px solid var(--line)`, 
                padding: "12px 16px", 
                borderRadius: 12,
                fontSize: 14,
                minHeight: 44,
                resize: "none"
              }}
            />
          </div>
          <button 
            type="submit" 
            disabled={!draft.trim()}
            style={{ 
              background: draft.trim() ? GSU.blue : "var(--line)", 
              color: "white", 
              border: 0, 
              padding: "12px 16px", 
              borderRadius: 12, 
              fontWeight: 600, 
              cursor: draft.trim() ? "pointer" : "not-allowed",
              fontSize: 14,
              minWidth: 60,
              height: 44,
              opacity: draft.trim() ? 1 : 0.6,
              transition: "all 0.2s ease"
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
