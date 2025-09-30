import React, { useState } from 'react';
import { GSU } from '../constants/colors';

function ScreenVoice({ onBackToChat }) {
  const [listening, setListening] = useState(false);
  
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ 
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        textAlign: "center" 
      }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/0/0c/Georgia_State_Panthers_logo.svg"
          alt="Panther head"
          style={{ width: 96, height: 96, margin: "0 auto" }}
        />
        <h2 style={{ marginBottom: 8 }}>Speak to Pounce</h2>
        <p style={{ marginTop: 0, opacity: 0.9 }}>
          Ask advising questions, say a course list, or describe your schedule constraints.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 6 }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.08)",
            border: `1px solid var(--line)`,
            fontSize: 12,
            gap: 6,
          }}>Speech → Text</span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.08)",
            border: `1px solid var(--line)`,
            fontSize: 12,
            gap: 6,
          }}>Auto-send to chat</span>
        </div>
        <div style={{ marginTop: 18 }}>
          <button
            onClick={() => setListening((v) => !v)}
            style={{
              width: 84,
              height: 84,
              borderRadius: 999,
              border: `2px solid ${GSU.blue}`,
              background: listening ? GSU.blue : "transparent",
              color: listening ? "white" : GSU.blue,
              fontSize: 28,
              cursor: "pointer",
            }}
            aria-pressed={listening}
            aria-label="Toggle microphone"
          >
            🎤
          </button>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
          {listening ? "Listening… Tap to stop." : "Tap the mic to start"}
        </div>
        <div style={{ marginTop: 18 }}>
          <button 
            onClick={onBackToChat} 
            style={{ 
              background: "transparent", 
              color: "var(--fg)", 
              border: `1px solid var(--line)`, 
              padding: "10px 14px", 
              borderRadius: 12, 
              cursor: "pointer" 
            }}
          >
            Back to chat
          </button>
        </div>
      </div>

      <div style={{ 
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
      }}>
        <strong>Tip:</strong> When you tap the Pounce banner on the Chat screen, you'll jump straight here. After recording, we'll insert the transcript into the chat input automatically (wire up your STT API here).
      </div>
    </div>
  );
}

export default ScreenVoice;
