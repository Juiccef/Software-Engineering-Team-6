import React from 'react';
import { GSU } from '../constants/colors';

function ScreenChat({ onOpenVoice, onSendMessage }) {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: 20,
      height: "100%",
      width: "100%",
      padding: "0 16px"
    }}>
      {/* Premium Plan Banner */}
      <div style={{ 
        background: `linear-gradient(135deg, ${GSU.blue} 0%, #1e3f7f 100%)`,
        borderRadius: 16,
        padding: 24,
        color: "white",
        position: "relative",
        overflow: "hidden",
        marginBottom: 8
      }}>
        <div style={{ 
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%"
        }} />
        <div style={{ 
          position: "absolute",
          bottom: -30,
          right: -30,
          width: 100,
          height: 100,
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%"
        }} />
        
        <div style={{ 
          position: "relative", 
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}>
          <div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "1.8rem", fontWeight: "bold" }}>Chat Assistant</h2>
            <p style={{ margin: "0 0 20px 0", opacity: 0.9, fontSize: "1rem", lineHeight: 1.4 }}>
              Have a convo with Pounce
            </p>
            <button
              onClick={onOpenVoice}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "12px 24px",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 600,
                backdropFilter: "blur(10px)"
              }}
            >
              Start Chat
            </button>
          </div>
          
          {/* FBX Model Container - Invisible placeholder */}
          <div style={{
            width: 120,
            height: 120,
            background: "transparent",
            borderRadius: 12,
            position: "relative",
            opacity: 0.1,
            border: "1px dashed rgba(255,255,255,0.3)"
          }}>
            {/* Placeholder text for FBX model */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.8rem",
              textAlign: "center",
              pointerEvents: "none"
            }}>
              FBX Model
            </div>
          </div>
        </div>
        
        {/* Robot Character */}
        <div style={{ 
          position: "absolute",
          top: 20,
          right: 20,
          width: 60,
          height: 60,
          background: "rgba(255,255,255,0.2)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          zIndex: 1
        }}>
          🤖
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: 16 
      }}>
        {/* Document Upload Card */}
        <div 
          style={{ 
            background: "var(--card)",
            borderRadius: 16,
            padding: 20,
            border: "1px solid var(--line)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          <div style={{ 
            width: 48,
            height: 48,
            background: `${GSU.blue}20`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            fontSize: "1.5rem"
          }}>
            📋
          </div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "bold", color: "var(--fg)" }}>
            Document Upload
          </h3>
          <p style={{ margin: "0 0 16px 0", opacity: 0.7, fontSize: "0.9rem", lineHeight: 1.4 }}>
            Upload transcripts, schedules, or any documents for analysis and insights
          </p>
          <div style={{ 
            width: 32,
            height: 32,
            background: "var(--line)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            cursor: "pointer"
          }}>
            →
          </div>
        </div>

        {/* Smart Recommendations Card */}
        <div 
          style={{ 
            background: "var(--card)",
            borderRadius: 16,
            padding: 20,
            border: "1px solid var(--line)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          <div style={{ 
            width: 48,
            height: 48,
            background: `${GSU.blue}20`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            fontSize: "1.5rem"
          }}>
            🎯
          </div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "bold", color: "var(--fg)" }}>
            Smart Recommendations
          </h3>
          <p style={{ margin: "0 0 16px 0", opacity: 0.7, fontSize: "0.9rem", lineHeight: 1.4 }}>
            Receive intelligent suggestions for courses, schedules, and academic resources
          </p>
          <div style={{ 
            width: 32,
            height: 32,
            background: "var(--line)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            cursor: "pointer"
          }}>
            →
          </div>
        </div>
      </div>

      {/* quick select Section */}
      <div style={{ marginTop: 8 }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: 16
        }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "var(--fg)" }}>
            Quick Select
          </h3>
          <span style={{ 
            color: "var(--fg)", 
            opacity: 0.7, 
            fontSize: "0.9rem",
            cursor: "pointer"
          }}>
            See all
          </span>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div 
            onClick={() => onSendMessage && onSendMessage({
              role: "user",
              text: "Help me plan my next semester courses"
            })}
            style={{ 
              background: "var(--card)",
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
              e.target.style.background = "var(--hover)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--card)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <div style={{ 
              width: 40,
              height: 40,
              background: `${GSU.blue}20`,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem"
            }}>
              📚
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--fg)" }}>
                Help me plan my next semester courses
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
              →
            </div>
          </div>
          
          <div 
            onClick={() => onSendMessage && onSendMessage({
              role: "user",
              text: "What campus resources are available?"
            })}
            style={{ 
              background: "var(--card)",
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
              e.target.style.background = "var(--hover)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--card)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <div style={{ 
              width: 40,
              height: 40,
              background: `${GSU.blue}20`,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem"
            }}>
              🏛️
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--fg)" }}>
                What campus resources are available?
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
              →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScreenChat;